import arg from 'arg';
import { deepCopy, Console } from '../utils/tools';
import { resolve, dirname, join, extname } from 'path';
import { pathToFileURL } from 'url';
import { createRequire } from 'module';
import { Processor } from '../lib';
import { mkdirSync, readFileSync, writeFile, watch, existsSync } from 'fs';
import { HTMLParser, CSSParser } from '../utils/parser';
import { StyleSheet } from '../utils/style';
import {
  getVersion,
  globArray,
  generateTemplate,
  fuzzy,
} from './utils';
import type { Extractor, Config } from '../interfaces';
import type { FSWatcher } from 'fs';

// ─── ESM / CJS / TS Compatibility ────────────────────────────────────────────
//
// `require` n'existe pas dans un module ESM.
// `createRequire` recrée un require() fonctionnel à partir de l'URL du module courant,
// ce qui permet de charger des fichiers CJS (module.exports) depuis du code ESM.
//
const require = createRequire(import.meta.url);

/**
 * Charge un fichier de configuration de façon universelle.
 *
 * Formats supportés :
 *  - `.cjs`       → require() (CommonJS explicite)
 *  - `.mjs`       → import() dynamique (ESM explicite)
 *  - `.ts` / `.mts` / `.cts` → jiti (TypeScript, avec cache désactivé)
 *  - `.js`        → require() en premier (module.exports), fallback import() si ERR_REQUIRE_ESM
 *
 * Le cache est toujours invalidé avant le chargement, ce qui permet le rechargement
 * à chaud en mode --dev sans avoir à relancer le processus.
 */
async function loadConfig(configPath: string): Promise<unknown> {
  const absPath = resolve(configPath);
  const ext = extname(absPath).toLowerCase();

  // ── TypeScript : on délègue à jiti qui gère ts/mts/cts + tsconfig ──────────
  if (ext === '.ts' || ext === '.mts' || ext === '.cts') {
    try {
      // jiti est en devDependency — import dynamique pour ne pas crasher si absent
      const { createJiti } = await import('jiti');
      // cache: false garantit le rechargement à chaud en mode --dev
      const jiti = createJiti(import.meta.url, { cache: false });
      const mod = await jiti.import(absPath) as Record<string, unknown>;
      return mod?.default ?? mod;
    } catch (err: unknown) {
      // Si jiti n'est pas installé, on donne un message d'erreur clair
      if ((err as NodeJS.ErrnoException)?.code === 'ERR_MODULE_NOT_FOUND') {
        throw new Error(
          `Impossible de charger la config TypeScript "${absPath}".\n` +
          `Installez jiti comme dépendance de dev : pnpm add -D jiti`
        );
      }
      throw err;
    }
  }

  // ── ESM explicite (.mjs) : import() dynamique avec cache-busting ───────────
  if (ext === '.mjs') {
    // Le timestamp en querystring force Node à recharger le module (cache-busting)
    const url = `${pathToFileURL(absPath).href}?t=${Date.now()}`;
    const mod = await import(url) as Record<string, unknown>;
    return mod?.default ?? mod;
  }

  // ── CJS explicite (.cjs) : require() avec invalidation du cache ────────────
  if (ext === '.cjs') {
    try {
      // Invalide l'entrée dans le cache require avant de recharger
      delete require.cache[require.resolve(absPath)];
    } catch { /* le module n'était pas encore chargé, on ignore */ }
    return require(absPath);
  }

  // ── .js : CJS d'abord (cas le plus courant pour les configs), puis ESM ─────
  try {
    try {
      delete require.cache[require.resolve(absPath)];
    } catch { /* pas encore en cache */ }
    return require(absPath);
  } catch (err: unknown) {
    // Node lève ERR_REQUIRE_ESM si le fichier .js est un module ESM
    if ((err as NodeJS.ErrnoException)?.code === 'ERR_REQUIRE_ESM') {
      const url = `${pathToFileURL(absPath).href}?t=${Date.now()}`;
      const mod = await import(url) as Record<string, unknown>;
      return mod?.default ?? mod;
    }
    throw err;
  }
}

// ─── Documentation CLI ───────────────────────────────────────────────────────

const doc = `Generate css from text files that containing nailus classes.
By default, it will use interpretation mode to generate a single css file.

Usage:
  nailuscss [filenames]
  nailuscss [filenames] -c -m -d
  nailuscss [filenames] -c -s -m -d
  nailuscss [filenames] [-c | -i] [-a] [-b | -s] [-m] [-d] [-p <prefix:string>] [-o <path:string>] [--args arguments]

Options:
  -h, --help            Print this help message and exit.
  -v, --version         Print nailuscss current version and exit.

  -i, --interpret       Interpretation mode, generate class selectors. This is the default behavior.
  -c, --compile         Compilation mode, combine the class name in each row into a single class.
  -a, --attributify     Attributify mode, generate attribute selectors. Attributify mode can be mixed with the other two modes.
  -t, --preflight       Add preflights, default is false.

  -b, --combine         Combine all css into one single file. This is the default behavior.
  -s, --separate        Generate a separate css file for each input file.

  -d, --dev             Enable hot reload and watch mode.
  -m, --minify          Generate minimized css file.
  -z, --fuzzy           Enable fuzzy match, only works in interpration mode.
  -p, --prefix PREFIX   Set the css class name prefix, only valid in compilation mode. The default prefix is 'nailus-'.
  -o, --output PATH     Set output css file path.
  -f, --config PATH     Set config file path. Supports .js (CJS/ESM), .cjs, .mjs, and .ts (requires jiti).

  --style               Parse and transform nailus style block.
  --init PATH           Start a new project on the path.
`;

// ─── Parsing des arguments ───────────────────────────────────────────────────

const args = arg({
  // Types
  '--help': Boolean,
  '--version': Boolean,
  '--compile': Boolean,
  '--interpret': Boolean,
  '--attributify': Boolean,
  '--preflight': Boolean,
  '--combine': Boolean,
  '--separate': Boolean,
  '--dev': Boolean,
  '--minify': Boolean,
  '--fuzzy': Boolean,
  '--style': Boolean,
  '--init': String,
  '--prefix': String,
  '--output': String,
  '--config': String,

  // Aliases
  '-h': '--help',
  '-v': '--version',
  '-i': '--interpret',
  '-c': '--compile',
  '-a': '--attributify',
  '-t': '--preflight',
  '-b': '--combine',
  '-s': '--separate',
  '-d': '--dev',
  '-m': '--minify',
  '-p': '--prefix',
  '-o': '--output',
  '-f': '--config',
  '-z': '--fuzzy',
});

// ─── Point d'entrée principal (async pour supporter await loadConfig) ─────────

async function main() {

  if (args['--help'] || (args._.length === 0 && Object.keys(args).length === 1)) {
    Console.log(doc);
    process.exit();
  }

  if (args['--version']) {
    Console.log(getVersion());
    process.exit();
  }

  if (args['--init']) {
    const template = generateTemplate(args['--init'], args['--output']);
    args._.push(template.html);
    args['--preflight'] = true;
    args['--output'] = template.css;
  }

  const configFile = args['--config'] ? resolve(args['--config']) : undefined;
  let preflights: { [key: string]: StyleSheet } = {};
  let styleSheets: { [key: string]: StyleSheet } = {};
  const fileWatchers = new Map<string, FSWatcher>();
  const dirWatchers = new Map<string, FSWatcher>();
  let configWatcher: FSWatcher | undefined;

  // Chargement initial de la config (CJS, ESM ou TS selon l'extension)
  const rawConfig = configFile ? await loadConfig(configFile) as Config : undefined;
  let processor = new Processor(rawConfig);
  let safelist = processor.config('safelist');

  if (configFile) Console.log('Config file:', configFile);

  // ─── Modes de traitement ───────────────────────────────────────────────────

  function compile(files: string[]) {
    const prefix = args['--prefix'] ?? 'nailus-';
    files.forEach((file) => {
      let indexStart = 0;
      const outputStyle: StyleSheet[] = [];
      const outputHTML: string[] = [];
      const html = readFileSync(file).toString();
      const parser = new HTMLParser(html);

      parser.parseClasses().forEach((p) => {
        outputHTML.push(html.substring(indexStart, p.start));
        const utility = processor.compile(p.result, prefix, true, args['--dev']);
        outputStyle.push(utility.styleSheet);
        outputHTML.push([utility.className, ...utility.ignored].join(' '));
        indexStart = p.end;
      });
      outputHTML.push(html.substring(indexStart));

      const added = outputStyle.reduce(
        (prev: StyleSheet, curr: StyleSheet) => prev.extend(curr),
        new StyleSheet()
      );
      styleSheets[file] = args['--dev']
        ? (styleSheets[file] ? styleSheets[file].extend(added) : added)
        : added;

      const outputFile = file.replace(/(?=\.\w+$)/, '.nailus');
      writeFile(outputFile, outputHTML.join(''), () => null);
      Console.log(`${file} -> ${outputFile}`);

      if (args['--preflight']) {
        if (args['--dev']) {
          const preflight = processor.preflight(html, true, true, true, true);
          preflights[file] = preflights[file]
            ? preflights[file].extend(preflight)
            : preflight;
        } else {
          preflights[file] = processor.preflight(html);
        }
      }
    });
  }

  async function collectExtractorClasses(file: string, content: string): Promise<string[]> {
    const classes: string[] = [];
    const extractors = processor.config('extract.extractors') as Extractor[] | undefined;

    if (!extractors) return classes;

    for (const { extractor, extensions } of extractors) {
      if (!extensions.includes(extname(file).slice(1))) continue;

      const result = await extractor(content, file);
      if (result.classes) classes.push(...result.classes);
    }

    return classes;
  }

  async function interpret(files: string[]) {
    for (const file of files) {
      const content = readFileSync(file).toString();
      let classes: string[] = [];

      if (args['--fuzzy']) {
        classes = fuzzy(content);
      } else {
        const parser = new HTMLParser(content);
        classes = parser.parseClasses().map((i) => i.result);
      }

      classes = [...classes, ...await collectExtractorClasses(file, content)];

      if (args['--dev']) {
        const utility = processor.interpret(classes.join(' '), true);
        styleSheets[file] = styleSheets[file]
          ? styleSheets[file].extend(utility.styleSheet)
          : utility.styleSheet;
        if (args['--preflight']) {
          const preflight = processor.preflight(content, true, true, true, true);
          preflights[file] = preflights[file]
            ? preflights[file].extend(preflight)
            : preflight;
        }
      } else {
        const utility = processor.interpret(classes.join(' '));
        styleSheets[file] = utility.styleSheet;
        if (args['--preflight']) preflights[file] = processor.preflight(content);
      }
    }
  }

  function attributify(files: string[]) {
    files.forEach((file) => {
      const parser = new HTMLParser(readFileSync(file).toString());
      const attrs: { [key: string]: string | string[] } = parser
        .parseAttrs()
        .reduceRight((a: { [key: string]: string | string[] }, b) => {
          if (b.key === 'class' || b.key === 'className') return a;
          if (b.key in a) {
            a[b.key] = Array.isArray(a[b.key])
              ? Array.isArray(b.value)
                ? [...(a[b.key] as string[]), ...b.value]
                : [...(a[b.key] as string[]), b.value]
              : [a[b.key] as string, ...(Array.isArray(b.value) ? b.value : [b.value])];
            return a;
          }
          return Object.assign(a, { [b.key]: b.value });
        }, {});

      if (args['--dev']) {
        const utility = processor.attributify(attrs, true);
        styleSheets[file] = styleSheets[file]
          ? styleSheets[file].extend(utility.styleSheet)
          : utility.styleSheet;
      } else {
        const utility = processor.attributify(attrs);
        styleSheets[file] = utility.styleSheet;
      }
    });
  }

  function styleBlock(files: string[]) {
    files.forEach((file) => {
      const content = readFileSync(file).toString();
      const block = content.match(/(?<=<style[\r\n]*\s*lang\s?=\s?['"]nailus["']>)[\s\S]*(?=<\/style>)/);
      if (block && block.index !== undefined) {
        const css = content.slice(block.index, block.index + block[0].length);
        const parser = new CSSParser(css, processor);
        styleSheets[file] = styleSheets[file]
          ? styleSheets[file].extend(parser.parse())
          : parser.parse();
      }
    });
  }

  async function build(files: string[], update = false) {
    if (args['--compile']) {
      compile(files);
    } else {
      await interpret(files);
    }
    if (args['--attributify']) attributify(files);
    if (args['--style']) styleBlock(files);

    if (args['--separate']) {
      for (const [file, sheet] of Object.entries(styleSheets)) {
        const outfile = file.replace(/\.\w+$/, '.nailus.css');
        writeFile(
          outfile,
          (args['--preflight']
            ? deepCopy(sheet).extend(preflights[file], false)
            : sheet
          ).build(args['--minify']),
          () => null
        );
        Console.log(`${file} -> ${outfile}`);
      }
    } else {
      let outputStyle = Object.values(styleSheets)
        .reduce(
          (prev: StyleSheet, curr: StyleSheet) => prev.extend(curr),
          new StyleSheet()
        )
        .sort()
        .combine();

      if (args['--preflight']) {
        outputStyle = Object.values(preflights)
          .reduce(
            (prev: StyleSheet, curr: StyleSheet) => prev.extend(curr),
            new StyleSheet()
          )
          .sort()
          .combine()
          .extend(outputStyle);
      }

      const filePath = args['--output'] ?? 'nailus.css';
      const dir = dirname(filePath);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFile(filePath, outputStyle.build(args['--minify']), () => null);

      if (!update) {
        Console.log('Matched files:', files);
        Console.log('Output file:', resolve(filePath));
      }
    }
  }

  function buildSafeList(safelist: unknown) {
    if (safelist) {
      let classes: string[] = [];
      if (typeof safelist === 'string') {
        classes = safelist.split(/\s/).filter((i) => i);
      }
      if (Array.isArray(safelist)) {
        for (const item of safelist) {
          if (typeof item === 'string') {
            classes.push(item);
          } else if (Array.isArray(item)) {
            classes = classes.concat(item);
          }
        }
      }
      styleSheets['safelist'] = processor.interpret(classes.join(' ')).styleSheet;
    }
  }

  function closeFileWatcher(file: string) {
    const watcher = fileWatchers.get(file);
    if (!watcher) return;
    watcher.close();
    fileWatchers.delete(file);
  }

  function closeConfigWatcher() {
    configWatcher?.close();
    configWatcher = undefined;
  }

  // ─── Watch mode ───────────────────────────────────────────────────────────

  function watchBuild(file: string) {
    closeFileWatcher(file);

    const watcher = watch(file, async (event, path) => {
      const pathValue = path == null ? undefined : String(path);
      const changedPath = pathValue ? join(dirname(file), pathValue) : undefined;

      if (event === 'rename') {
        const newFiles = globArray(patterns);
        const renamed = matchFiles.filter((i) => !newFiles.includes(i))[0];

        if (changedPath && existsSync(changedPath)) {
          Console.log('File', `'${renamed}'`, 'has been renamed to', `'${changedPath}'`);
          matchFiles = newFiles;
          Console.log('Matched files:', matchFiles);
        } else {
          Console.log('File', `'${file}'`, 'has been deleted');
          closeFileWatcher(file);
          matchFiles = newFiles;
          delete styleSheets[file];
          delete preflights[file];

          if (matchFiles.length > 0) {
            Console.log('Matched files:', matchFiles);
            Console.time('Building');
          }
          await build([], true);
          if (matchFiles.length > 0) {
            Console.timeEnd('Building');
          } else {
            Console.error('No files were matched!');
            process.exit();
          }
        }
      }

      if (event === 'change') {
        Console.log('File', `'${pathValue ?? file}'`, 'has been changed');
        Console.time('Building');
        await build([file], true);
        Console.timeEnd('Building');
      }
    });

    fileWatchers.set(file, watcher);
  }

  /**
   * Surveille le fichier de config et recharge le processor à chaque modification.
   * Utilise loadConfig() pour supporter CJS, ESM et TypeScript.
   */
  function watchConfig(file?: string) {
    if (!file) return;
    closeConfigWatcher();
    let stamp = 0;

    configWatcher = watch(file, async (event, path) => {
      // Debounce : évite le double déclenchement fréquent sur certains éditeurs
      if (event === 'change' && (stamp === 0 || +new Date() - stamp > 500)) {
        stamp = +new Date();
        Console.log('Config', `'${path}'`, 'has been changed');
        Console.time('Building');

        try {
          // Rechargement universel (CJS, ESM, TS) avec invalidation du cache
          const newConfig = await loadConfig(file) as Config;
          processor = new Processor(newConfig);
          safelist = processor.config('safelist');
          styleSheets = {};
          preflights = {};
          buildSafeList(safelist);
          await build(matchFiles, true);
        } catch (err) {
          Console.error('Failed to reload config:', err);
        }

        Console.timeEnd('Building');
      }
    });
  }

  function watchDirectory(dir: string) {
    if (dirWatchers.has(dir)) return;

    const watcher = watch(dir, async (event, path) => {
      const pathValue = path == null ? undefined : String(path);
      if (event === 'rename' && pathValue && existsSync(join(dir, pathValue))) {
        const newFiles = globArray(patterns);
        if (newFiles.length > matchFiles.length) {
          const newFile = newFiles.filter((i) => !matchFiles.includes(i))[0];
          Console.log('New file', `'${newFile}'`, 'added');
          matchFiles.push(newFile);
          Console.log('Matched files:', matchFiles);
          Console.time('Building');
          await build([newFile], true);
          watchBuild(newFile);
          watchDirectory(dirname(newFile));
          Console.timeEnd('Building');
        }
      }
    });

    dirWatchers.set(dir, watcher);
  }

  // ─── Exécution ────────────────────────────────────────────────────────────

  const patterns = args._
    .concat(processor.config('extract.include', []) as string[])
    .concat((processor.config('extract.exclude', []) as string[]).map((i) => '!' + i));

  let matchFiles = globArray(patterns);

  if (matchFiles.length === 0) {
    Console.error('No files were matched!');
    process.exit();
  }

  buildSafeList(safelist);
  await build(matchFiles);

  if (args['--dev']) {
    watchConfig(configFile);

    for (const file of matchFiles) {
      watchBuild(file);
    }

    for (const dir of Array.from(new Set(matchFiles.map((f) => dirname(f))))) {
      watchDirectory(dir);
    }
  }
}

// Lance le CLI et propage les erreurs fatales proprement
main().catch((err) => {
  Console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
