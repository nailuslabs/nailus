/**
 * Rollup Configuration File - ESM First
 * 
 * Cette configuration génère une bibliothèque multi-formats avec ESM comme format par défaut.
 * Convention moderne : .js = ESM, .cjs = CommonJS
 * 
 * Fonctionnalités principales :
 * - ESM par défaut (type: "module")
 * - Génération de bundles ESM (.js) et CommonJS (.cjs)
 * - Génération automatique des fichiers de définition TypeScript (.d.ts)
 * - Support complet des sous-modules avec ESM et CJS
 */

import fs from 'fs';
import path from 'path';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import ts from 'typescript';
import pkg from './package.json' with { type: 'json' };

// ============================================================================
// CONSTANTES ET CONFIGURATION GLOBALE
// ============================================================================

const output_dir = './dist';
const prod = process.env.NODE_ENV === 'production';

/**
 * Configuration TypeScript optimisée pour ESM
 */
const ts_plugin = prod
  ? typescript({
    target: 'es2022',               // ES2022 pour les features modernes
    module: 'esnext',               // Garde la syntaxe ESM intacte
    include: 'src/**',
    outDir: output_dir,
    typescript: ts,
    declaration: true,
    declarationDir: output_dir,
  })
  : sucrase({
    exclude: ['node_modules/**'],
    transforms: ['typescript'],
  });

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

const dump = (file) => path.join(output_dir, file);

const copy = (files) => {
  return {
    name: 'copy-files',
    buildStart() {
      files.forEach((file) => {
        if (fs.existsSync(file)) {
          fs.copyFileSync(file, dump(file));
        }
      });
    }
  };
};

// ============================================================================
// PLUGINS ROLLUP PERSONNALISÉS
// ============================================================================

const cleanOutputDir = () => {
  return {
    name: 'clean-output-dir',
    buildStart() {
      if (fs.existsSync(output_dir)) {
        fs.rmSync(output_dir, { recursive: true, force: true });
      }
      fs.mkdirSync(output_dir, { recursive: true });
    }
  };
};

/**
 * Écrit le package.json racine avec ESM comme format par défaut
 */
const writeRootManifest = () => {
  return {
    name: 'write-root-manifest',
    writeBundle() {
      // Génération dynamique des exports basée sur la structure du projet
      const exports = {
        '.': {
          types: './index.d.ts',
          import: './index.js',      // ESM par défaut (.js = ESM)
          require: './index.cjs',    // CommonJS explicite (.cjs)
        },
        './colors': {
          types: './colors.d.ts',
          import: './colors.js',
          require: './colors.cjs',
        },
        './defaultConfig': {
          types: './defaultConfig.d.ts',
          import: './defaultConfig.js',
          require: './defaultConfig.cjs',
        },
        './defaultTheme': {
          types: './defaultTheme.d.ts',
          import: './defaultTheme.js',
          require: './defaultTheme.cjs',
        },
        './resolveConfig': {
          types: './resolveConfig.d.ts',
          import: './resolveConfig.js',
          require: './resolveConfig.cjs',
        },
        './plugin': {
          types: './plugin/index.d.ts',
          import: './plugin/index.js',
          require: './plugin/index.cjs',
        },
        './config': {
          types: './config/index.d.ts',
          import: './config/index.js',
          require: './config/index.cjs',
        },
        './lib': {
          types: './lib/index.d.ts',
          import: './lib/index.js',
          require: './lib/index.cjs',
        },
        './helpers': {
          types: './helpers/index.d.ts',
          import: './helpers/index.js',
          require: './helpers/index.cjs',
        },
        './utils': {
          types: './utils/index.d.ts',
          import: './utils/index.js',
          require: './utils/index.cjs',
        },
        './utils/parser': {
          types: './utils/parser/index.d.ts',
          import: './utils/parser/index.js',
          require: './utils/parser/index.cjs',
        },
        './utils/style': {
          types: './utils/style/index.d.ts',
          import: './utils/style/index.js',
          require: './utils/style/index.cjs',
        },
      };

      // Ajout dynamique des plugins
      if (fs.existsSync('src/plugin')) {
        const plugins = fs.readdirSync('src/plugin')
          .filter(dir => fs.statSync(`src/plugin/${dir}`).isDirectory());
        
        plugins.forEach(plugin => {
          exports[`./plugin/${plugin}`] = {
            types: `./plugin/${plugin}/index.d.ts`,
            import: `./plugin/${plugin}/index.js`,
            require: `./plugin/${plugin}/index.cjs`,
          };
        });
      }

      fs.writeFileSync(
        dump('package.json'),
        JSON.stringify(
          {
            name: pkg.name,
            version: pkg.version,
            description: pkg.description,
            type: 'module',               // ESM par défaut !
            main: './index.cjs',          // Point d'entrée CommonJS (fallback)
            module: './index.js',         // Point d'entrée ESM (principal)
            types: './index.d.ts',
            bin: {
              'nailuscss': './cli/index.js'
            },
            exports,
            repository: pkg.repository,
            keywords: pkg.keywords,
            author: pkg.author,
            license: pkg.license,
            engines: pkg.engines,
          },
          null,
          '  '
        )
      );
    },
  };
};

/**
 * Crée un package.json pour un sous-dossier avec ESM par défaut
 */
const pack = (dir) => {
  return {
    name: `pack-${dir}`,
    writeBundle() {
      const dirPath = dump(dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      fs.writeFileSync(
        `${dirPath}/package.json`,
        JSON.stringify({
          type: 'module',           // ESM par défaut
          main: './index.cjs',      // CommonJS fallback
          module: './index.js',     // ESM principal
          types: './index.d.ts',
        }, null, '  ')
      );
    },
  };
};

/**
 * Génère un fichier de définition TypeScript
 */
const types = (dest = "index.d.ts", src = "../types/index", module = "*") => {
  return {
    name: `generate-types-${dest}`,
    writeBundle() {
      const destPath = dump(dest);
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      fs.writeFileSync(destPath, `export ${module} from "${src}";`);
    },
  };
};

// ============================================================================
// FONCTION HELPER POUR GÉNÉRER LES OUTPUTS ESM + CJS
// ============================================================================

/**
 * Génère les configurations de sortie standard (ESM .js + CJS .cjs)
 * @param {string} basePath - Chemin de base pour le fichier
 * @param {object} options - Options additionnelles
 */
const standardOutputs = (basePath, options = {}) => {
  const outputs = [
    // ESM - Format par défaut (extension .js)
    {
      file: dump(`${basePath}.js`),
      format: 'esm',
      ...options.esm,
    },
    // CommonJS - Format fallback (extension .cjs)
    {
      file: dump(`${basePath}.cjs`),
      format: 'cjs',
      ...options.cjs,
    },
  ];
  return outputs;
};

// ============================================================================
// CONFIGURATION DES BUNDLES
// ============================================================================

export default [
  
  // --------------------------------------------------------------------------
  // BUNDLE PRINCIPAL (ENTRY POINT)
  // --------------------------------------------------------------------------
  {
    input: 'src/index.ts',
    output: standardOutputs('index', {
      esm: {
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      cjs: {
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.cjs`,
      },
    }),
    external: (id) => id.startsWith('./'),
    plugins: [
      cleanOutputDir(),
      ts_plugin,
      copy(['README.md', 'LICENSE']),
      writeRootManifest(),
      types("index.d.ts", "./types/lib", "{ Processor as default }"),
    ],
  },

  // --------------------------------------------------------------------------
  // MODULE COLORS
  // --------------------------------------------------------------------------
  {
    input: 'src/colors.ts',
    output: standardOutputs('colors', {
      esm: {
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      cjs: {
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.cjs`,
      },
    }),
    external: (id) => id.startsWith('./'),
    plugins: [
      ts_plugin,
      types("colors.d.ts", "./types/config", "{ colors as default }"),
    ],
  },

  // --------------------------------------------------------------------------
  // MODULE DEFAULTCONFIG
  // --------------------------------------------------------------------------
  {
    input: 'src/defaultConfig.ts',
    output: standardOutputs('defaultConfig', {
      esm: {
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      cjs: {
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.cjs`,
      },
    }),
    external: (id) => id.startsWith('./'),
    plugins: [
      ts_plugin,
      types("defaultConfig.d.ts", "./types/defaultConfig", "{ default }"),
    ],
  },

  // --------------------------------------------------------------------------
  // MODULE DEFAULT THEME
  // --------------------------------------------------------------------------
  {
    input: 'src/defaultTheme.ts',
    output: standardOutputs('defaultTheme', {
      esm: {
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      cjs: {
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.cjs`,
      },
    }),
    external: (id) => id.startsWith('./'),
    plugins: [
      ts_plugin,
      types("defaultTheme.d.ts", "./types/defaultTheme", "{ default }"),
    ],
  },

  // --------------------------------------------------------------------------
  // MODULE RESOLVECONFIG
  // --------------------------------------------------------------------------
  {
    input: 'src/resolveConfig.ts',
    output: standardOutputs('resolveConfig', {
      esm: {
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      cjs: {
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.cjs`,
      },
    }),
    external: (id) => id.startsWith('./'),
    plugins: [
      ts_plugin,
      types("resolveConfig.d.ts", "./types/resolveConfig", "{ default }"),
    ],
  },

  // --------------------------------------------------------------------------
  // MODULE PLUGIN (ENTRY POINT)
  // --------------------------------------------------------------------------
  {
    input: 'src/plugin/index.ts',
    output: standardOutputs('plugin/index', {
      cjs: {
        exports: 'default',
      },
    }),
    plugins: [
      ts_plugin,
      resolve(),
      pack('plugin'),
      types(`plugin/index.d.ts`, `../types/plugin/index`, "{ default }"),
    ],
  },

  // --------------------------------------------------------------------------
  // SOUS-MODULES DE PLUGIN (AVEC ESM + CJS)
  // --------------------------------------------------------------------------
  ...fs.readdirSync('src/plugin')
    .filter(dir => fs.statSync(`src/plugin/${dir}`).isDirectory())
    .flatMap((dir) => [
      // Configuration ESM
      {
        input: `src/plugin/${dir}/index.ts`,
        output: [
          {
            file: dump(`plugin/${dir}/index.js`),
            format: 'esm',
          },
        ],
        plugins: [
          ts_plugin,
          resolve(),
          commonjs(),
          types(`plugin/${dir}/index.d.ts`, `../../types/plugin/${dir}/index`, "{ default }"),
        ],
      },
      // Configuration CJS
      {
        input: `src/plugin/${dir}/index.ts`,
        output: [
          {
            file: dump(`plugin/${dir}/index.cjs`),
            format: 'cjs',
            exports: 'default',
          },
        ],
        plugins: [
          ts_plugin,
          resolve(),
          commonjs(),
        ],
      },
    ]),

  // --------------------------------------------------------------------------
  // CLI (ESM + CJS)
  // --------------------------------------------------------------------------
  {
    input: 'src/cli/index.ts',
    output: [
      // ESM version
      {
        file: dump('cli/index.js'),
        banner: '#!/usr/bin/env node',
        format: 'esm',
        paths: (id) =>
          id.match(/\/src\/(lib|utils|plugin|config|colors)/) &&
          `../${path.dirname(path.relative('./src', id))}/index.js`,
      },
      // CJS version (fallback)
      {
        file: dump('cli/index.cjs'),
        banner: '#!/usr/bin/env node',
        format: 'cjs',
        paths: (id) =>
          id.match(/\/src\/(lib|utils|plugin|config|colors)/) &&
          `../${path.dirname(path.relative('./src', id))}/index.cjs`,
      },
    ],
    onwarn: (warning) => {
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    },
    external: (id) =>
      id.match(/\/src\/(lib|utils|plugin|config|colors)/),
    plugins: [
      replace({
        preventAssignment: true,
        __NAME__: pkg.name,
        __VERSION__: pkg.version,
      }),
      ts_plugin,
      resolve(),
      commonjs(),
      {
        name: 'create-cli-package-json',
        writeBundle() {
          const cliDir = dump('cli');
          if (!fs.existsSync(cliDir)) {
            fs.mkdirSync(cliDir, { recursive: true });
          }
          
          fs.writeFileSync(
            path.join(cliDir, 'package.json'),
            JSON.stringify({
              type: 'module',           // ESM par défaut
              main: './index.cjs',      // Fallback CJS
              module: './index.js',     // Principal ESM
              types: './index.d.ts',
            }, null, '  ')
          );
          
          // Rend le fichier exécutable sur Unix
          try {
            fs.chmodSync(dump('cli/index.js'), 0o755);
            fs.chmodSync(dump('cli/index.cjs'), 0o755);
          } catch (e) {
            // Ignore les erreurs sur Windows
          }
        }
      },
      types(`cli/index.d.ts`, `../types/cli/index`),
    ],
  },

  // --------------------------------------------------------------------------
  // MODULES UTILITAIRES PRINCIPAUX
  // --------------------------------------------------------------------------
  ...fs.readdirSync('src/')
    .filter((dir) => ['config', 'lib', 'utils', 'helpers'].includes(dir) && fs.statSync(`src/${dir}`).isDirectory())
    .map((dir) => ({
      input: `src/${dir}/index.ts`,
      output: standardOutputs(`${dir}/index`),
      plugins: [
        ts_plugin,
        json(),
        resolve(),
        commonjs(),
        pack(dir),
        types(`${dir}/index.d.ts`, `../types/${dir}/index`),
      ],
    })),

  // --------------------------------------------------------------------------
  // SOUS-MODULES D'UTILITAIRES
  // --------------------------------------------------------------------------
  ...fs.readdirSync('src/utils')
    .filter(
      (dir) =>
        dir !== 'algorithm' && fs.statSync(`src/utils/${dir}`).isDirectory()
    )
    .map((dir) => ({
      input: `src/utils/${dir}/index.ts`,
      output: standardOutputs(`utils/${dir}/index`),
      plugins: [
        ts_plugin,
        json(),
        resolve(),
        commonjs(),
        pack(`utils/${dir}`),
        types(`utils/${dir}/index.d.ts`, `../../types/utils/${dir}/index`),
      ],
    })),
];