/**
 * Rollup Configuration File
 * 
 * Cette configuration génère une bibliothèque multi-formats (CJS, ESM) avec
 * des définitions TypeScript complètes. Elle est optimisée pour les projets
 * modernes comme Tailwind CSS et UnoCSS.
 * 
 * Fonctionnalités principales :
 * - Génération de bundles ESM (.mjs) et CommonJS (.js)
 * - Génération automatique des fichiers de définition TypeScript (.d.ts)
 * - Support des sous-modules (plugin/, utils/, etc.)
 * - Optimisation pour le développement et la production
 * - Gestion des dépendances externes et des chemins relatifs
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

/** Dossier de sortie pour tous les fichiers générés */
const output_dir = './dist';

/** Mode production (optimisé) ou développement (rapide) */
const prod = process.env.NODE_ENV === 'production';

/**
 * Plugin TypeScript configuré selon le mode
 * - Production : Compilation complète avec typescript
 * - Développement : Transpilation rapide avec sucrase
 */
const ts_plugin = prod
  ? typescript({
    target: 'es2020',        // Cible moderne pour les bundles ESM
    include: 'src/**',
    outDir: output_dir,
    typescript: ts,
    declaration: true,        // Génère les fichiers .d.ts
    declarationDir: output_dir,
  })
  : sucrase({
    exclude: ['node_modules/**'],
    transforms: ['typescript'],
  });

// ============================================================================
// FONCTIONS UTILITAIRES POUR LA GESTION DES FICHIERS
// ============================================================================

/**
 * Construit un chemin complet vers le dossier de sortie
 * @param {string} file - Nom du fichier ou chemin relatif
 * @returns {string} Chemin complet dans le dossier dist
 */
const dump = (file) => path.join(output_dir, file);

/**
 * Copie une liste de fichiers vers le dossier de sortie
 * @param {string[]} files - Liste des noms de fichiers à copier
 */
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
// PLUGINS ROLLUP PERSONNALISÉS (HOOKS DE BUILD)
// ============================================================================

/**
 * Nettoie le dossier de sortie avant le build
 * CORRECTION: Retourne un objet plugin Rollup valide
 */
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
 * Écrit le package.json racine avec le type "commonjs"
 * pour assurer la compatibilité avec les anciens environnements
 */
const writeRootManifest = () => {
  return {
    name: 'write-root-manifest',
    writeBundle() {
      fs.writeFileSync(
        dump('package.json'),
        JSON.stringify(
          {
            ...pkg,
            type: 'commonjs',      // Force le mode CommonJS par défaut
            main: './index.js',    // Point d'entrée principal (CJS)
            module: './index.mjs', // Point d'entrée ESM
            types: './index.d.ts', // Types TypeScript
            exports: {
              '.': {
                import: './index.mjs',
                require: './index.js',
                types: './index.d.ts'
              },
              './colors': {
                import: './colors.mjs',
                require: './colors.js',
                types: './colors.d.ts'
              },
              './plugin': {
                import: './plugin/index.mjs',
                require: './plugin/index.js',
                types: './plugin/index.d.ts'
              },
              './utils/*': {
                import: './utils/*/index.mjs',
                require: './utils/*/index.js',
                types: './utils/*/index.d.ts'
              }
            }
          },
          null,
          '  '
        )
      );
    },
  };
};

/**
 * Crée un package.json pour un sous-dossier (plugin, utils, etc.)
 * Cela permet les imports comme `import { x } from 'mon-package/plugin'`
 * 
 * @param {string} dir - Nom du sous-dossier
 * @param {boolean} mjs - Si true, génère aussi un point d'entrée ESM
 */
const pack = (dir, mjs = true) => {
  return {
    name: `pack-${dir}`,
    writeBundle() {
      const pkgJson = {
        main: './index.js',
        types: './index.d.ts',
      };
      
      // Ajoute le point d'entrée module uniquement si ESM est supporté
      if (mjs) {
        pkgJson.module = './index.mjs';
      }
      
      const dirPath = dump(dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      fs.writeFileSync(
        `${dirPath}/package.json`,
        JSON.stringify(pkgJson, null, '  ')
      );
    },
  };
};

/**
 * Génère un fichier de définition TypeScript qui ré-exporte depuis le dossier types
 * 
 * @param {string} dest - Chemin de destination du fichier .d.ts
 * @param {string} src - Chemin source depuis le dossier types
 * @param {string} module - Type d'export (ex: "{ default }", "*")
 */
const types = (dest = "index.d.ts", src = "../types/index", module = "*") => {
  return {
    name: `generate-types-${dest}`,
    writeBundle() {
      // Crée le dossier parent si nécessaire
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
// CONFIGURATION DES BUNDLES
// ============================================================================

export default [
  
  // --------------------------------------------------------------------------
  // BUNDLE PRINCIPAL (ENTRY POINT)
  // Génère le point d'entrée principal de la bibliothèque
  // --------------------------------------------------------------------------
  {
    input: 'src/index.ts',
    output: [
      {
        file: dump('index.js'),
        format: 'cjs',              // Format CommonJS pour Node.js
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      {
        file: dump('index.mjs'),
        format: 'esm',              // Format ES Modules pour les bundlers modernes
        paths: (id) => `./${path.relative('./src', id)}/index.mjs`,
      },
    ],
    external: (id) => id.startsWith('./'),  // Considère les imports relatifs comme externes
    plugins: [
      cleanOutputDir(),             // Nettoie et crée le dossier de sortie
      ts_plugin,
      copy(['README.md', 'LICENSE']),
      writeRootManifest(),
      types("index.d.ts", "./types/lib", "{ Processor as default }"),
    ],
  },

  // --------------------------------------------------------------------------
  // MODULE COLORS
  // Exporte la configuration des couleurs (palette)
  // --------------------------------------------------------------------------
  {
    input: 'src/colors.ts',
    output: [
      {
        file: dump('colors.js'),
        format: 'cjs',
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      {
        file: dump('colors.mjs'),
        format: 'esm',
        paths: (id) => `./${path.relative('./src', id)}/index.mjs`,
      },
    ],
    external: (id) => id.startsWith('./'),
    plugins: [
      ts_plugin,
      types("colors.d.ts", "./types/config", "{ colors as default }"),
    ],
  },

  // --------------------------------------------------------------------------
  // MODULE DEFAULTCONFIG
  // Exporte la configuration par défaut de la bibliothèque
  // --------------------------------------------------------------------------
  {
    input: 'src/defaultConfig.ts',
    output: [
      {
        file: dump('defaultConfig.js'),
        format: 'cjs',
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      {
        file: dump('defaultConfig.mjs'),
        format: 'esm',
        paths: (id) => `./${path.relative('./src', id)}/index.mjs`,
      },
    ],
    external: (id) => id.startsWith('./'),
    plugins: [
      ts_plugin,
      types("defaultConfig.d.ts", "./types/defaultConfig", "{ default }"),
    ],
  },

  // --------------------------------------------------------------------------
  // MODULE DEFAULT THEME
  // Exporte le thème par défaut
  // --------------------------------------------------------------------------
  {
    input: 'src/defaultTheme.ts',
    output: [
      {
        file: dump('defaultTheme.js'),
        format: 'cjs',
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      {
        file: dump('defaultTheme.mjs'),
        format: 'esm',
        paths: (id) => `./${path.relative('./src', id)}/index.mjs`,
      },
    ],
    external: (id) => id.startsWith('./'),
    plugins: [
      ts_plugin,
      types("defaultTheme.d.ts", "./types/defaultTheme", "{ default }"),
    ],
  },

  // --------------------------------------------------------------------------
  // MODULE RESOLVECONFIG
  // Utilitaire pour résoudre et fusionner les configurations
  // --------------------------------------------------------------------------
  {
    input: 'src/resolveConfig.ts',
    output: [
      {
        file: dump('resolveConfig.js'),
        format: 'cjs',
        exports: 'default',
        paths: (id) => `./${path.relative('./src', id)}/index.js`,
      },
      {
        file: dump('resolveConfig.mjs'),
        format: 'esm',
        paths: (id) => `./${path.relative('./src', id)}/index.mjs`,
      },
    ],
    external: (id) => id.startsWith('./'),
    plugins: [
      ts_plugin,
      types("resolveConfig.d.ts", "./types/resolveConfig", "{ default }"),
    ],
  },

  // --------------------------------------------------------------------------
  // MODULE PLUGIN (ENTRY POINT)
  // Point d'entrée principal pour le système de plugins
  // --------------------------------------------------------------------------
  {
    input: 'src/plugin/index.ts',
    output: [
      {
        file: dump('plugin/index.js'),
        exports: 'default',
        format: 'cjs',
      },
      {
        file: dump('plugin/index.mjs'),
        format: 'esm',
      },
    ],
    plugins: [
      ts_plugin,
      resolve(),                    // Résout les modules node_modules
      pack('plugin'),
      types(`plugin/index.d.ts`, `../types/plugin/index`, "{ default }"),
    ],
  },

  // --------------------------------------------------------------------------
  // SOUS-MODULES DE PLUGIN (GÉNÉRATION DYNAMIQUE)
  // Génère automatiquement des bundles pour chaque sous-dossier de plugin/
  // --------------------------------------------------------------------------
  ...fs.readdirSync('src/plugin')
    .filter(dir => fs.statSync(`src/plugin/${dir}`).isDirectory())
    .map((dir) => ({
      input: `src/plugin/${dir}/index.ts`,
      output: [
        {
          file: dump(`plugin/${dir}/index.js`),
          exports: 'default',
          format: 'cjs',
        },
        // Note: Pas de sortie ESM pour les sous-plugins profonds
        // (peut être ajouté si nécessaire)
      ],
      plugins: [
        ts_plugin,
        resolve(),
        commonjs(),                 // Convertit les modules CommonJS en ESM
        types(`plugin/${dir}/index.d.ts`, `../../types/plugin/${dir}/index`, "{ default }"),
      ],
    })),

  // --------------------------------------------------------------------------
  // CLI (COMMAND LINE INTERFACE)
  // Bundle exécutable pour l'outil en ligne de commande
  // --------------------------------------------------------------------------
  {
    input: 'src/cli/index.ts',
    output: [
      {
        file: dump('cli/index.js'),
        banner: '#!/usr/bin/env node',  // Shebang pour exécution directe
        format: 'cjs',                  // CommonJS pour compatibilité Node.js
        paths: (id) =>
          id.match(/\/src\/(lib|utils|plugin|config|colors)/) &&
          `../${path.dirname(path.relative('./src', id))}/index.js`,
      },
      // Ajout du format ESM pour la CLI
      {
        file: dump('cli/index.mjs'),
        banner: '#!/usr/bin/env node',  // Shebang pour exécution directe (ESM)
        format: 'esm',                  // ES Modules pour les environnements modernes
        paths: (id) =>
          id.match(/\/src\/(lib|utils|plugin|config|colors)/) &&
          `../${path.dirname(path.relative('./src', id))}/index.mjs`,
      },
    ],
    onwarn: (warning) => {
      // Ignore les avertissements de dépendance circulaire (courant dans les CLI)
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    },
    external: (id) =>
      id.match(/\/src\/(lib|utils|plugin|config|colors)/),
    plugins: [
      replace({
        preventAssignment: true,
        __NAME__: pkg.name,         // Injecte le nom du package
        __VERSION__: pkg.version,   // Injecte la version
      }),
      ts_plugin,
      resolve(),
      commonjs(),
      // Ajout d'un plugin pour créer le package.json dans le dossier cli
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
              type: 'commonjs',     // Force CommonJS pour la compatibilité Node.js
              main: './index.js',
              module: './index.mjs',
              types: './index.d.ts',
              bin: {
                'nailuscss': './index.js'
              }
            }, null, '  ')
          );
        }
      },
      // Génération des types TypeScript pour la CLI
      types(`cli/index.d.ts`, `../types/cli/index`),
    ],
  },

  // --------------------------------------------------------------------------
  // MODULES UTILITAIRES PRINCIPAUX (GÉNÉRATION DYNAMIQUE)
  // Génère des bundles pour config/, lib/, utils/, helpers/
  // --------------------------------------------------------------------------
  ...fs.readdirSync('src/')
    .filter((dir) => ['config', 'lib', 'utils', 'helpers'].includes(dir) && fs.statSync(`src/${dir}`).isDirectory())
    .map((dir) => ({
      input: `src/${dir}/index.ts`,
      output: [
        {
          file: dump(`${dir}/index.js`),
          format: 'cjs',
        },
        {
          file: dump(`${dir}/index.mjs`),
          format: 'esm',
        },
      ],
      plugins: [
        ts_plugin,
        json(),                     // Support pour l'import de fichiers JSON
        resolve(),
        commonjs(),
        pack(dir),
        types(`${dir}/index.d.ts`, `../types/${dir}/index`),
      ],
    })),

  // --------------------------------------------------------------------------
  // SOUS-MODULES D'UTILITAIRES (GÉNÉRATION DYNAMIQUE)
  // Génère des bundles pour chaque sous-dossier de utils/ (sauf algorithm/)
  // --------------------------------------------------------------------------
  ...fs.readdirSync('src/utils')
    .filter(
      (dir) =>
        dir !== 'algorithm' && fs.statSync(`src/utils/${dir}`).isDirectory()
    )
    .map((dir) => ({
      input: `src/utils/${dir}/index.ts`,
      output: [
        {
          file: dump(`utils/${dir}/index.js`),
          format: 'cjs',
        },
        {
          file: dump(`utils/${dir}/index.mjs`),
          format: 'esm',
        },
      ],
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