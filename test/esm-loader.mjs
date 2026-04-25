import { readFile } from 'node:fs/promises';
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import { fileURLToPath, pathToFileURL } from 'node:url';

const TS_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.cts']);
const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const FILE_CANDIDATES = ['.ts', '.tsx', '.mts', '.mjs', '.js', '.cjs', '.json'];
const INDEX_CANDIDATES = [
  'index.ts',
  'index.tsx',
  'index.mts',
  'index.mjs',
  'index.js',
  'index.cjs',
  'index.json',
];

function isPathLike(specifier) {
  return (
    specifier.startsWith('./') ||
    specifier.startsWith('../') ||
    specifier.startsWith('/') ||
    specifier.startsWith('file:') ||
    path.isAbsolute(specifier)
  );
}

function resolveAliasSpecifier(specifier) {
  if (specifier.startsWith('@/')) {
    return pathToFileURL(path.join(PROJECT_ROOT, 'src', specifier.slice(2))).href;
  }
  if (specifier === 'nailuscss' || specifier.startsWith('nailuscss/')) {
    const subpath = specifier === 'nailuscss' ? '' : specifier.slice(11); // remove 'nailuscss/'
    return pathToFileURL(path.join(PROJECT_ROOT, 'dist', subpath)).href;
  }
}

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

function injectCreateRequire(source) {
  if (!/\brequire\(/.test(source) || /\bcreateRequire\(/.test(source))
    return source;

  return [
    `import { createRequire as __createRequire } from 'node:module';`,
    `const require = __createRequire(import.meta.url);`,
    source,
  ].join('\n');
}

function injectSnapshotFile(source) {
  if (!source.includes('toMatchSnapshot(')) return source;
  return source.replace(/(?<=toMatchSnapshot\([^,)]+)\)/g, ', import.meta.url)');
}

function transpile(source, url) {
  const code = injectCreateRequire(injectSnapshotFile(source));
  return ts.transpileModule(code, {
    fileName: fileURLToPath(url),
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      allowImportingTsExtensions: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      resolveJsonModule: true,
      sourceMap: true,
      inlineSourceMap: true,
      inlineSources: true,
    },
  }).outputText;
}

async function resolveWithCandidates(specifier, parentURL) {
  const resolved = specifier.startsWith('file:')
    ? new URL(specifier)
    : path.isAbsolute(specifier)
      ? pathToFileURL(specifier)
      : new URL(specifier, parentURL);

  const filename = fileURLToPath(resolved);
  const extension = path.extname(filename);

  if (extension) {
    if (await exists(filename)) return pathToFileURL(filename);
  } else {
    for (const candidate of FILE_CANDIDATES) {
      const filepath = `${filename}${candidate}`;
      if (await exists(filepath)) return pathToFileURL(filepath);
    }
  }

  for (const candidate of INDEX_CANDIDATES) {
    const filepath = path.join(filename, candidate);
    if (await exists(filepath)) return pathToFileURL(filepath);
  }
}

export async function resolve(specifier, context, defaultResolve) {
  try {
    return await defaultResolve(specifier, context, defaultResolve);
  } catch (error) {
    const parentURL = context.parentURL ?? pathToFileURL(`${process.cwd()}${path.sep}`).href;
    const aliasedSpecifier = resolveAliasSpecifier(specifier);

    if (!aliasedSpecifier && !isPathLike(specifier)) throw error;

    const resolved = await resolveWithCandidates(aliasedSpecifier ?? specifier, parentURL);
    if (!resolved) throw error;

    return {
      shortCircuit: true,
      url: resolved.href,
    };
  }
}

export async function load(url, context, defaultLoad) {
  if (!url.startsWith('file:')) {
    return defaultLoad(url, context, defaultLoad);
  }

  if (!TS_EXTENSIONS.has(path.extname(fileURLToPath(url)))) {
    return defaultLoad(url, context, defaultLoad);
  }

  const source = await readFile(fileURLToPath(url), 'utf8');
  return {
    format: 'module',
    shortCircuit: true,
    source: transpile(source, url),
  };
}
