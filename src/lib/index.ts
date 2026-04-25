import { getNestedValue, hash, deepCopy, testRegexr, guessClassName, toArray } from '../utils';
import { negative, breakpoints } from '../utils';
import { Keyframes, Container, Property, Style, StyleSheet } from '../utils/style';
import { resolveVariants } from './variants';
import { staticUtilities, dynamicUtilities } from './utilities';
import { createHandler, HandlerCreator } from './utilities/handler';
import extract, { generateStaticStyle } from './extract';
import test from './test';
import preflight from './preflight';
import plugin from '../plugin/index';
import { baseConfig } from '../config';
import { sortGroup } from '../utils/algorithm/sortStyle';
import { layerOrder, pluginOrder } from '../config/order';
import cssEscape from '../utils/algorithm/cssEscape';
import diffConfig from '../utils/algorithm/diffConfig';
import combineConfig from '../utils/algorithm/combineConfig';
import ClassParser from '../utils/parser/class';
import toSource from 'tosource';

import type {
  Config,
  DictStr,
  DefaultConfig,
  DynamicUtility,
  ConfigUtil,
  Theme,
  DefaultTheme,
  Element,
  Shortcut,
  PluginUtils,
  PluginUtilOptions,
  PluginOutput,
  PluginWithOptions,
  DeepNestObject,
  UtilityGenerator,
  VariantGenerator,
  ProcessorCache,
  ThemeType,
  NestObject,
  Validata,
  StyleArrayObject,
  PluginCache,
  ResolvedVariants,
  VariantTypes,
  AddPluginType,
  VariantUtils,
} from '../interfaces';

import type { Utility } from './utilities/handler';

interface OptimisedProcessorCache {
  count: number;
  html: Set<string>;
  attrs: Set<string>;
  classes: Set<string>;
  utilities: Set<string>;
  variants: string[];          // gardé en array car itéré souvent
  variantSet: Set<string>;     // lookup O(1)
}

class LRUCache<K, V> {
  private _map = new Map<K, V>();
  private _max: number;

  constructor(max = 5000) {
    this._max = max;
  }

  get(key: K): V | undefined {
    const value = this._map.get(key);
    if (value !== undefined) {
      // Rafraîchir l'ordre LRU
      this._map.delete(key);
      this._map.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this._map.has(key)) {
      this._map.delete(key);
    } else if (this._map.size >= this._max) {
      // Supprimer l'entrée la plus ancienne
      this._map.delete(this._map.keys().next().value as K);
    }
    this._map.set(key, value);
  }

  has(key: K): boolean {
    return this._map.has(key);
  }

  clear(): void {
    this._map.clear();
  }
}

type AttrTransformer = (utility: string) => string;

const ATTR_TRANSFORMERS: Record<string, AttrTransformer> = {
  w: (u) => {
    if (['w-min', 'w-max', 'w-min-content', 'w-max-content'].includes(u)) return u.slice(0, 5);
    if (u.startsWith('w-min')) return 'min-w' + u.slice(5);
    if (u.startsWith('w-max')) return 'max-w' + u.slice(5);
    return u;
  },
  h: (u) => {
    if (['h-min', 'h-max', 'h-min-content', 'h-max-content'].includes(u)) return u.slice(0, 5);
    if (u.startsWith('h-min')) return 'min-h' + u.slice(5);
    if (u.startsWith('h-max')) return 'max-h' + u.slice(5);
    return u;
  },
  flex: (u) => {
    if (u === 'flex-default') return 'flex';
    if (u === 'flex-inline') return 'inline-flex';
    if (/^flex-gap-/.test(u)) return u.slice(5);
    return u;
  },
  grid: (u) => {
    if (u === 'grid-default') return 'grid';
    if (u === 'grid-inline') return 'inline-grid';
    if (/^grid-(auto|gap|col|row)-/.test(u)) return u.slice(5);
    return u;
  },
  justify: (u) => {
    if (u.startsWith('justify-content-')) return 'justify-' + u.slice(16);
    return u;
  },
  align: (u) => {
    if (/^align-(items|self|content)-/.test(u)) return u.slice(6);
    return 'content-' + u.slice(6);
  },
  place: (u) => {
    if (!/^place-(items|self|content)-/.test(u)) return 'place-content-' + u.slice(6);
    return u;
  },
  font: (u) => {
    if (
      /^font-(tracking|leading)-/.test(u) ||
      ['font-italic','font-not-italic','font-antialiased','font-subpixel-antialiased',
       'font-normal-nums','font-ordinal','font-slashed-zero','font-lining-nums',
       'font-oldstyle-nums','font-proportional-nums','font-tabular-nums',
       'font-diagonal-fractions','font-stacked-fractions'].includes(u)
    ) return u.slice(5);
    return u;
  },
  text: (u) => {
    if (['text-baseline','text-top','text-middle','text-bottom','text-text-top',
         'text-text-bottom','text-sub','text-super'].includes(u)) return 'align-' + u.slice(5);
    if (u.startsWith('text-placeholder') || u.startsWith('text-underline') ||
        u.startsWith('text-tab') || u.startsWith('text-indent') ||
        u.startsWith('text-hyphens') || u.startsWith('text-write')) return u.slice(5);
    if (['text-underline','text-overline','text-line-through','text-no-underline',
         'text-uppercase','text-lowercase','text-capitalize','text-normal-case',
         'text-truncate','text-overflow-ellipsis','text-text-ellipsis','text-text-clip',
         'text-break-normal','text-break-words','text-break-all'].includes(u)) return u.slice(5);
    if (u.startsWith('text-space')) return 'white' + u.slice(5);
    return u;
  },
  underline: (u) => {
    if (u === 'underline-none') return 'no-underline';
    if (u === 'underline-line-through') return 'line-through';
    return u;
  },
  svg: (u) => {
    if (u.startsWith('svg-fill') || u.startsWith('svg-stroke')) return u.slice(4);
    return u;
  },
  border: (u) => {
    if (u.startsWith('border-rounded')) return u.slice(7);
    return u;
  },
  gradient: (u) => {
    if (u === 'gradient-none') return 'bg-none';
    if (/^gradient-to-[trbl]{1,2}$/.test(u)) return 'bg-' + u;
    if (/^gradient-(from|via|to)-/.test(u)) return u.slice(9);
    return u;
  },
  display:    (u) => u.slice(8),
  pos:        (u) => u.slice(4),
  position:   (u) => u.slice(9),
  box: (u) => {
    if (/^box-(decoration|shadow)/.test(u)) return u.slice(4);
    return u;
  },
  filter: (u) => {
    if (u !== 'filter-none' && u !== 'filter') return u.slice(7);
    return u;
  },
  backdrop: (u) => {
    if (u === 'backdrop') return 'backdrop-filter';
    if (u === 'backdrop-none') return 'backdrop-filter-none';
    return u;
  },
  transition: (u) => {
    if (/transition-(duration|ease|delay)-/.test(u)) return u.slice(11);
    return u;
  },
  transform: (u) => {
    if (!['transform-gpu','transform-none','transform'].includes(u)) return u.slice(10);
    return u;
  },
  isolation: (u) => {
    if (u === 'isolation-isolate') return 'isolate';
    return u;
  },
  table: (u) => {
    if (u === 'table-inline') return 'inline-table';
    if (u.startsWith('table-caption-') || u.startsWith('table-empty-cells')) return u.slice(6);
    return u;
  },
  pointer:  (u) => 'pointer-events' + u.slice(7),
  resize:   (u) => u === 'resize-both' ? 'resize' : u,
  ring:     (u) => u,
  blend:    (u) => 'mix-' + u,
  sr:       (u) => u === 'sr-not-only' ? 'not-sr-only' : u,
};

export class Processor {
  private _config: Config;
  private _theme: Config['theme'];
  private _variants: ResolvedVariants = {};

  // Cache optimisé : Sets pour O(1), LRU pour le parsing
  private _cache: OptimisedProcessorCache = {
    count: 0,
    html: new Set<string>(),
    attrs: new Set<string>(),
    classes: new Set<string>(),
    utilities: new Set<string>(),
    variants: [],
    variantSet: new Set<string>(),
  };

  // Cache LRU pour le parsing de classes — évite de re-parser les mêmes classes
  private _parseCache = new LRUCache<string, Element[]>(8000);

  // Cache pour extract() — même classe → même Style
  private _extractCache = new LRUCache<string, Style | Style[] | undefined>(8000);

  // Cache pour la résolution de thème (lazy)
  private _themeResolutionCache = new Map<string, unknown>();

  public _handler: HandlerCreator;

  readonly _plugin: PluginCache = {
    static: {},
    dynamic: {},
    utilities: {},
    components: {},
    preflights: {},
    shortcuts: {},
    alias: {},
    completions: {},
  };

  public pluginUtils: PluginUtils = {
    addDynamic:    (...args) => this.addDynamic(...args),
    addUtilities:  (...args) => this.addUtilities(...args),
    addComponents: (...args) => this.addComponents(...args),
    addBase:       (...args) => this.addBase(...args),
    addVariant:    (...args) => this.addVariant(...args),
    e:             (...args) => this.e(...args),
    prefix:        (...args) => this.prefix(...args),
    config:        (...args) => this.config(...args),
    theme:         (...args) => this.theme(...args),
    variants:      (...args) => this.variants(...args),
  };

  public variantUtils: VariantUtils = {
    modifySelectors: (modifier) =>
      new Style().wrapSelector((selector) =>
        modifier({
          className: /^[.#]/.test(selector) ? selector.substring(1) : selector,
        })),
    atRule:       (name) => new Style().atRule(name),
    pseudoClass:  (name) => new Style().pseudoClass(name),
    pseudoElement:(name) => new Style().pseudoElement(name),
    parent:       (name) => new Style().parent(name),
    child:        (name) => new Style().child(name),
  };

  constructor(config?: Config) {
    this._config = this.resolveConfig(config, baseConfig);
    this._theme = this._config.theme;
    this._handler = createHandler(this._config.handlers);
    this._config.shortcuts && this.loadShortcuts(this._config.shortcuts);
    this._config.alias && this.loadAlias(this._config.alias);

    if (this._config.preflight && this._config.preflight.safelist) {
      if (typeof this._config.preflight.safelist === 'string') {
        this._config.preflight.safelist = this._config.preflight.safelist.split(/\s+/);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Résolution de config
  // -------------------------------------------------------------------------

  private _resolveConfig(userConfig: Config, presets: Config = {}): Config {
    if (userConfig.presets) {
      const resolved = this._resolvePresets(userConfig.presets);
      presets = this._resolveConfig(resolved, presets);
      delete userConfig.presets;
    }
    const userTheme = userConfig.theme;
    if (userTheme) delete userConfig.theme;
    const extendTheme: Theme = userTheme && 'extend' in userTheme ? userTheme.extend ?? {} : {};
    const theme = (presets.theme || {}) as Record<string, ThemeType>;
    if (userTheme) {
      if ('extend' in userTheme) delete userTheme.extend;
      for (const [key, value] of Object.entries(userTheme)) {
        theme[key] = typeof value === 'function' ? value : { ...value };
      }
    }
    if (extendTheme && typeof extendTheme === 'object') this._reduceFunction(theme, extendTheme);
    return { ...presets, ...userConfig, theme };
  }

  private _reduceFunction(theme: Record<string, ThemeType>, extendTheme: Theme): void {
    for (const [key, value] of Object.entries(extendTheme)) {
      const themeValue = theme[key];
      switch (typeof themeValue) {
      case 'function':
        theme[key] = (theme, { negative, breakpoints }) => combineConfig(
          (themeValue as ConfigUtil)(theme, { negative, breakpoints }),
          (typeof value === 'function' ? value(theme, { negative, breakpoints }) : value ?? {}),
        );
        break;
      case 'object':
        theme[key] = (theme, { negative, breakpoints }) => combineConfig(
          themeValue,
          (typeof value === 'function' ? value(theme, { negative, breakpoints }) : value ?? {}),
          0,
        );
        break;
      default:
        theme[key] = value;
      }
    }
  }

  private _resolvePresets(presets: Config[]): Config {
    let config: Config = {};
    const extend: Config = {};
    presets.forEach(p => {
      if (p.theme && 'extend' in p.theme && p.theme.extend) {
        this._reduceFunction(extend, p.theme.extend);
        delete p.theme.extend;
      }
      config = this._resolveConfig(p, config);
    });
    if (config.theme) {
      (config.theme as Record<string, ThemeType>).extend = extend;
    } else {
      config.theme = { extend };
    }
    return config;
  }

  private _resolveFunction(config: Config): Config {
    if (!config.theme) return config;
    const theme = (path: string, defaultValue?: unknown) => this.theme(path, defaultValue);
    for (const dict of [config.theme, 'extend' in config.theme ? config.theme.extend ?? {} : {}]) {
      for (const [key, value] of Object.entries(dict)) {
        if (typeof value === 'function') {
          (dict as Record<string, ThemeType>)[key] = value(theme, { negative, breakpoints }) as ConfigUtil;
        }
      }
    }
    return config;
  }

  // -------------------------------------------------------------------------
  // Lazy theme proxy — résout uniquement ce qui est accédé
  // -------------------------------------------------------------------------
  private _buildThemeProxy(rawTheme: Record<string, ThemeType>): Record<string, ThemeType> {
    const cache = this._themeResolutionCache;
    const themeGetter = (path: string, defaultValue?: unknown) => this.theme(path, defaultValue);

    return new Proxy(rawTheme, {
      get(target, key: string) {
        if (cache.has(key)) return cache.get(key);
        const value = target[key];
        if (value === undefined) return undefined;
        const resolved = typeof value === 'function'
          ? value(themeGetter, { negative, breakpoints })
          : value;
        cache.set(key, resolved);
        return resolved;
      },
      set(target, key: string, value) {
        cache.delete(key); // invalider le cache si la valeur change
        target[key] = value;
        return true;
      },
    }) as Record<string, ThemeType>;
  }

  private _invalidateThemeCache(): void {
    this._themeResolutionCache.clear();
  }

  // -------------------------------------------------------------------------
  // Helpers internes
  // -------------------------------------------------------------------------

  private _replaceStyleVariants(styles: Style[]): void {
    styles.forEach(style => {
      style.atRules = style.atRules?.map(i => {
        if (i.match(/@screen/)) {
          const variant = i.replace(/\s*@screen\s*/, '');
          const atRule = this._variants[variant]().atRules?.[0];
          return atRule ?? i;
        }
        return i;
      });
    });
  }

  private _addPluginProcessorCache(type: AddPluginType, key: string, styles: Style | Style[]): void {
    styles = toArray(styles);
    this._plugin[type][key] = key in this._plugin[type]
      ? [...this._plugin[type][key], ...styles]
      : styles;
  }

  private _loadVariables(): void {
    const config = this.theme('vars') as NestObject | undefined;
    if (!config) return;
    this.addBase({
      ':root': Object.assign(
        {},
        ...Object.keys(config).map(i => ({ [`--${i}`]: config[i] }))
      ) as NestObject,
    });
  }

  // -------------------------------------------------------------------------
  // Parsing avec cache LRU
  // -------------------------------------------------------------------------
  private _parse(classNames: string, separator: string): Element[] {
    const cacheKey = classNames + '\0' + separator;
    const cached = this._parseCache.get(cacheKey);
    if (cached) return cached;
    const result = new ClassParser(classNames, separator, this._cache.variants).parse();
    this._parseCache.set(cacheKey, result);
    return result;
  }

  // -------------------------------------------------------------------------
  // extract() avec cache LRU
  // -------------------------------------------------------------------------
  private _cachedExtract(className: string, addComment = false, prefix?: string): Style | Style[] | undefined {
    // Ne mettre en cache que sans commentaire (le cas le plus fréquent)
    if (addComment) return extract(this, className, addComment, prefix);
    const cacheKey = className + '\0' + (prefix ?? '');
    const cached = this._extractCache.get(cacheKey);
    if (cached !== undefined || this._extractCache.has(cacheKey)) return cached;
    const result = extract(this, className, false, prefix);
    this._extractCache.set(cacheKey, result);
    return result;
  }

  // Invalider les caches de style quand la config change
  private _invalidateStyleCaches(): void {
    this._extractCache.clear();
    this._parseCache.clear();
  }

  // -------------------------------------------------------------------------
  // API publique — chargement de config
  // -------------------------------------------------------------------------

  loadConfig(config?: Config): Config {
    this._config = this.resolveConfig(config, baseConfig);
    // _theme est déjà proxifié par resolveConfig — pas de réassignation nécessaire
    this._handler = createHandler(this._config.handlers);
    this._config.shortcuts && this.loadShortcuts(this._config.shortcuts);
    this._config.alias && this.loadAlias(this._config.alias);
    this._invalidateStyleCaches();
    this._invalidateThemeCache();
    return this._config;
  }

  resolveConfig(config: Config | undefined, presets: Config): Config {
    // Cloner uniquement config (sera muté), pas presets (lecture seule)
    this._config = this._resolveConfig(
      { ...((config && typeof config === 'object') ? deepCopy(config) : {}), exclude: config?.exclude },
      presets, // pas de clone — presets est traité en lecture seule
    );
    this._theme = this._config.theme
      ? this._buildThemeProxy(this._config.theme as Record<string, ThemeType>)
      : this._config.theme;
    this._config.plugins?.map(i =>
      typeof i === 'function'
        ? ('__isOptionsFunction' in i ? this.loadPluginWithOptions(i) : this.loadPlugin(plugin(i)))
        : this.loadPlugin(i)
    );
    this._config = this._resolveFunction(this._config);
    this._variants = { ...this._variants, ...this.resolveVariants() };

    // Mettre à jour les caches de variants
    const variantKeys = Object.keys(this._variants);
    this._cache.variants = variantKeys;
    this._cache.variantSet = new Set(variantKeys);

    this._loadVariables();
    if (this._config.corePlugins) {
      this._plugin.core = Array.isArray(this._config.corePlugins)
        ? Object.assign({}, ...(this._config.corePlugins as string[]).map(i => ({ [i]: true })))
        : {
          ...Object.assign({}, ...Object.keys(pluginOrder).slice(Object.keys(pluginOrder).length / 2).map(i => ({ [i]: true }))),
          ...this._config.corePlugins,
        };
    }
    return this._config;
  }

  resolveVariants(type?: VariantTypes): ResolvedVariants {
    const variants = resolveVariants(this._config);
    if (type) return variants[type];
    return { ...variants.screen, ...variants.theme, ...variants.state, ...variants.orientation };
  }

  resolveStaticUtilities(includePlugins = false): StyleArrayObject {
    const staticStyles: StyleArrayObject = {};
    for (const key in staticUtilities) {
      const style = generateStaticStyle(this, key, true);
      if (style) staticStyles[key] = [style];
    }
    if (!includePlugins) return staticStyles;
    return { ...staticStyles, ...this._plugin.utilities, ...this._plugin.components };
  }

  resolveDynamicUtilities(includePlugins = false): DynamicUtility {
    if (!includePlugins) return dynamicUtilities;
    return { ...dynamicUtilities, ...this._plugin.dynamic };
  }

  // -------------------------------------------------------------------------
  // Getters
  // -------------------------------------------------------------------------

  get allConfig(): DefaultConfig {
    return this._config as unknown as DefaultConfig;
  }

  get allTheme(): DefaultTheme {
    return (this._theme ?? {}) as DefaultTheme;
  }

  get allVariant(): string[] {
    return this._cache.variants;
  }

  // -------------------------------------------------------------------------
  // wrapWithVariants — sans objets intermédiaires inutiles
  // -------------------------------------------------------------------------
  wrapWithVariants(variants: string[], styles: Style | Style[]): Style[] | undefined {
    if (!Array.isArray(styles)) styles = [styles];
    if (variants.length === 0) return styles;

    // Pré-calculer les variant styles une seule fois (pas dans la map)
    const variantStyleObjects = variants
      .filter(i => this._variants?.[i])
      .map(i => this._variants[i]());

    return styles.map(style => {
      if (style instanceof Keyframes) return style;
      const atrules: string[] = [];
      let wrapped = variantStyleObjects.reduce((prev: Style, curr: Style) => {
        const output = prev.extend(curr);
        if (prev.isAtrule) atrules.push((prev.atRules as string[])[0]);
        return output;
      }, new Style()).extend(style);
      if (style instanceof Container) wrapped = new Container().extend(wrapped);
      if (atrules.length > 0) wrapped.meta.variants = atrules;
      return wrapped;
    });
  }

  // -------------------------------------------------------------------------
  // Utilitaires publics
  // -------------------------------------------------------------------------

  removePrefix(className: string): string {
    const prefix = this.config('prefix') as string | undefined;
    return prefix ? className.replace(new RegExp(`^${prefix}`), '') : className;
  }

  markAsImportant(style: Style, force: boolean | string = false): Style {
    const _important = force ? force : this.config('important', false);
    const important = typeof _important === 'string' ? (_important as string) : (_important as boolean);
    if (important) {
      if (typeof important === 'string') {
        style.parent(important);
      } else {
        style.important = true;
        style.property.forEach(i => (i.important = true));
      }
    }
    return style;
  }

  extract(className: string, addComment = false, prefix?: string): Style | Style[] | undefined {
    return extract(this, className, addComment, prefix);
  }

  test(className: string, prefix?: string): boolean {
    return test(this, className, prefix);
  }

  preflight(
    html?: string,
    includeBase = true,
    includeGlobal = true,
    includePlugins = true,
    ignoreProcessed = false,
  ): StyleSheet {
    let id: string | undefined;
    if (html) {
      id = hash(html);
      if (ignoreProcessed && this._cache.html.has(id)) return new StyleSheet();
    }
    if (id && ignoreProcessed) this._cache.html.add(id);
    return preflight(this, html, includeBase, includeGlobal, includePlugins);
  }

  // -------------------------------------------------------------------------
  // interpret() — avec cache Set O(1) + parsing LRU
  // -------------------------------------------------------------------------
  interpret(
    classNames: string,
    ignoreProcessed = false,
    handleIgnored?: (ignored: string) => Style | Style[] | undefined,
  ): { success: string[]; ignored: string[]; styleSheet: StyleSheet } {
    const separator = this.config('separator', ':') as string;
    const ast = this._parse(classNames, separator);
    const success: string[] = [];
    const ignored: string[] = [];
    const styleSheet = new StyleSheet();
    const pluginMap = { ...this._plugin.utilities, ...this._plugin.components };

    const _hIgnored = (className: string) => {
      if (handleIgnored) {
        const style = handleIgnored(className);
        if (style) {
          styleSheet.add(style);
          success.push(className);
          return;
        }
      }
      ignored.push(className);
    };

    const _gStyle = (
      baseClass: string,
      variants: string[],
      selector: string,
      important = false,
      prefix?: string,
    ) => {
      if (this._config.exclude && testRegexr(selector, this._config.exclude)) {
        ignored.push(selector);
        return;
      }
      if (variants[0] && selector in pluginMap) {
        success.push(selector);
        styleSheet.add(deepCopy(this._plugin.utilities[selector]));
        return;
      }
      let result = this._cachedExtract(baseClass, false, prefix);
      if (result) {
        // Cloner seulement si nécessaire (le résultat du cache ne doit pas être muté)
        result = Array.isArray(result) ? result.map(s => s.clone()) : result.clone();
        const escapedSelector = '.' + cssEscape(selector);
        if (result instanceof Style) {
          if (!result.meta.respectSelector) result.selector = escapedSelector;
          this.markAsImportant(result, important);
        } else if (Array.isArray(result)) {
          result = result.map(i => {
            if (i instanceof Keyframes) return i;
            if (!i.meta.respectSelector) i.selector = escapedSelector;
            this.markAsImportant(i, important);
            return i;
          });
        }
        const wrapped = this.wrapWithVariants(variants, result);
        if (wrapped) {
          success.push(selector);
          styleSheet.add(wrapped);
        } else {
          _hIgnored(selector);
        }
      } else {
        _hIgnored(selector);
      }
    };

    const _hGroup = (obj: Element, parentVariants: string[] = []) => {
      const _eval = (u: Element) => {
        if (u.type === 'group') {
          _hGroup(u, obj.variants);
        } else if (u.type === 'alias' && (u.content as string) in this._plugin.alias) {
          this._plugin.alias[u.content as string].forEach(i => _eval(i));
        } else {
          const variants = [...parentVariants, ...obj.variants, ...u.variants];
          const important = obj.important || u.important;
          const selector = (important ? '!' : '') + [...variants, u.content].join(':');
          typeof u.content === 'string' &&
            _gStyle(u.content, variants, selector, important, this.config('prefix') as string);
        }
      };
      Array.isArray(obj.content) && obj.content.forEach(u => _eval(u));
    };

    const _gAst = (ast: Element[]) => {
      ast.forEach(obj => {
        if (!(ignoreProcessed && this._cache.utilities.has(obj.raw))) {
          if (ignoreProcessed) this._cache.utilities.add(obj.raw);
          if (obj.type === 'utility') {
            if (Array.isArray(obj.content)) {
              // #functions stuff
            } else if (obj.content) {
              _gStyle(obj.content, obj.variants, obj.raw, obj.important, this.config('prefix') as string);
            }
          } else if (obj.type === 'group') {
            _hGroup(obj);
          } else if (obj.type === 'alias' && (obj.content as string) in this._plugin.alias) {
            _gAst(this._plugin.alias[obj.content as string]);
          } else {
            _hIgnored(obj.raw);
          }
        }
      });
    };

    _gAst(ast);

    if (!this.config('prefixer')) styleSheet.prefixer = false;
    return {
      success,
      ignored,
      styleSheet: styleSheet.sort(),
    };
  }

  // -------------------------------------------------------------------------
  // validate() — lookup O(1) via variantSet
  // -------------------------------------------------------------------------
  validate(classNames: string): { success: Validata[]; ignored: Validata[] } {
    const separator = this.config('separator', ':') as string;
    const ast = this._parse(classNames, separator);
    const success: Validata[] = [];
    const ignored: Validata[] = [];

    const _hSuccess = (className: string, self: Element, parent?: Element) => {
      success.push({ className, ...self, parent });
    };
    const _hIgnored = (className: string, self: Element, parent?: Element) => {
      ignored.push({ className, ...self, parent });
    };

    const _gStyle = (
      baseClass: string,
      variants: string[],
      selector: string,
      self: Element,
      parent?: Element,
      prefix?: string,
    ) => {
      if (this._config.exclude && testRegexr(selector, this._config.exclude)) {
        _hIgnored(selector, self, parent);
        return;
      }
      if (variants[0] && selector in { ...this._plugin.utilities, ...this._plugin.components }) {
        _hSuccess(selector, self, parent);
        return;
      }
      // O(1) lookup via variantSet
      if (this.test(baseClass, prefix) && variants.filter(i => !this._cache.variantSet.has(i)).length === 0) {
        _hSuccess(selector, self, parent);
      } else {
        _hIgnored(selector, self, parent);
      }
    };

    const _hGroup = (obj: Element, parentVariants: string[] = []) => {
      const _eval = (u: Element, parent: Element) => {
        if (u.type === 'group') {
          _hGroup(u, obj.variants);
        } else if (u.type === 'alias' && (u.content as string) in this._plugin.alias) {
          this._plugin.alias[u.content as string].forEach(i => _eval(i, u));
        } else {
          const variants = [...parentVariants, ...obj.variants, ...u.variants];
          const important = obj.important || u.important;
          const selector = (important ? '!' : '') + [...variants, u.content].join(':');
          typeof u.content === 'string' &&
            _gStyle(u.content, variants, selector, u, parent, this.config('prefix') as string);
        }
      };
      Array.isArray(obj.content) && obj.content.forEach(u => _eval(u, obj));
    };

    const _gAst = (ast: Element[]) => {
      ast.forEach(obj => {
        if (obj.type === 'utility') {
          if (Array.isArray(obj.content)) {
            // #functions stuff
          } else if (obj.content) {
            _gStyle(obj.content, obj.variants, obj.raw, obj, undefined, this.config('prefix') as string);
          }
        } else if (obj.type === 'group') {
          _hGroup(obj);
        } else if (obj.type === 'alias' && (obj.content as string) in this._plugin.alias) {
          _gAst(this._plugin.alias[obj.content as string]);
        } else {
          _hIgnored(obj.raw, obj);
        }
      });
    };

    _gAst(ast);
    return { success, ignored };
  }

  // -------------------------------------------------------------------------
  // compile() — avec Set O(1)
  // -------------------------------------------------------------------------
  compile(
    classNames: string,
    prefix = 'nailus-',
    showComment = false,
    ignoreGenerated = false,
    handleIgnored?: (ignored: string) => Style | Style[] | undefined,
    outputClassName?: string,
  ): {
    success: string[];
    ignored: string[];
    className?: string;
    styleSheet: StyleSheet;
  } {
    const separator = this.config('separator', ':') as string;
    const ast = this._parse(classNames, separator);
    const success: string[] = [];
    const ignored: string[] = [];
    const styleSheet = new StyleSheet();
    let className: string | undefined = outputClassName ?? prefix + hash(classNames.trim().split(/\s+/g).join(' '));
    if (ignoreGenerated && this._cache.classes.has(className)) return { success, ignored, styleSheet, className };
    const buildSelector = '.' + className;

    const _hIgnored = (className: string) => {
      if (handleIgnored) {
        const style = handleIgnored(className);
        if (style) {
          styleSheet.add(style);
          success.push(className);
          return;
        }
      }
      ignored.push(className);
    };

    const _gStyle = (
      baseClass: string,
      variants: string[],
      selector: string,
      important = false,
    ) => {
      if (this._config.exclude && testRegexr(selector, this._config.exclude)) {
        ignored.push(selector);
        return;
      }
      if (variants[0] && selector in { ...this._plugin.utilities, ...this._plugin.components }) {
        success.push(selector);
        styleSheet.add(deepCopy(this._plugin.utilities[selector]));
        return;
      }
      const result = this.extract(baseClass, showComment);
      if (result) {
        if (Array.isArray(result)) {
          result.forEach(i => {
            if (i instanceof Keyframes) {
              i.meta.order = 20;
              return i;
            }
            i.selector = buildSelector;
            this.markAsImportant(i, important);
          });
        } else {
          result.selector = buildSelector;
          this.markAsImportant(result, important);
        }
        const wrapped = this.wrapWithVariants(variants, result);
        if (wrapped) {
          success.push(selector);
          styleSheet.add(wrapped);
        } else {
          _hIgnored(selector);
        }
      } else {
        _hIgnored(selector);
      }
    };

    const _hGroup = (obj: Element, parentVariants: string[] = []) => {
      Array.isArray(obj.content) &&
        obj.content.forEach(u => {
          if (u.type === 'group') {
            _hGroup(u, obj.variants);
          } else {
            const variants = [...parentVariants, ...obj.variants, ...u.variants];
            const selector = [...variants, u.content].join(':');
            typeof u.content === 'string' &&
              _gStyle(this.removePrefix(u.content), variants, selector, obj.important || u.important);
          }
        });
    };

    ast.forEach(obj => {
      if (obj.type === 'utility') {
        if (Array.isArray(obj.content)) {
          // #functions stuff
        } else if (obj.content) {
          _gStyle(this.removePrefix(obj.content), obj.variants, obj.raw, obj.important);
        }
      } else if (obj.type === 'group') {
        _hGroup(obj);
      } else {
        _hIgnored(obj.raw);
      }
    });

    className = success.length > 0 ? className : undefined;
    if (ignoreGenerated && className) this._cache.classes.add(className);
    if (!this.config('prefixer')) styleSheet.prefixer = false;
    return {
      success,
      ignored,
      className,
      styleSheet: styleSheet.sortby(sortGroup).combine(),
    };
  }

  // -------------------------------------------------------------------------
  // attributify() — table de dispatch au lieu du switch géant
  // -------------------------------------------------------------------------
  attributify(
    attrs: { [key: string]: string | string[] },
    ignoreProcessed = false,
  ): { success: string[]; ignored: string[]; styleSheet: StyleSheet } {
    const success: string[] = [];
    const ignored: string[] = [];
    const styleSheet = new StyleSheet();
    const {
      prefix,
      separator,
      disable,
    }: { prefix?: string; separator?: string; disable?: string[] } =
      this._config.attributify && typeof this._config.attributify === 'boolean'
        ? {}
        : this._config.attributify || {};

    const _gStyle = (
      key: string,
      value: string,
      equal = false,
      notAllow = false,
      ignoreProcessed = false,
    ) => {
      const buildSelector = `[${this.e((prefix || '') + key)}${equal ? '=' : '~='}"${value}"]`;
      if (notAllow || (ignoreProcessed && this._cache.attrs.has(buildSelector))) {
        ignored.push(buildSelector);
        return;
      }
      const importantValue = value.startsWith('!');
      if (importantValue) value = value.slice(1);
      const importantKey = key.startsWith('!');
      if (importantKey) key = key.slice(1);
      const id = key.match(/\w+$/)?.[0] ?? '';
      const splits = value.split(separator || ':');
      let variants = splits.slice(0, -1);
      let utility = splits.slice(-1)[0];
      let keys = key.split(separator || ':');
      const lastKey = keys.slice(-1)[0];

      if (lastKey in this._variants && lastKey !== 'svg') {
        variants = [...keys, ...variants];
      } else if (id in this._variants && id !== 'svg') {
        const matches = key.match(/[@<\w]+/g);
        if (!matches) { ignored.push(buildSelector); return; }
        variants = [...matches, ...variants];
      } else {
        if (!keys) { ignored.push(buildSelector); return; }
        if (keys.length === 1) keys = key.split('-');
        let last: string;
        if (['min', 'max'].includes(keys.slice(-2, -1)[0])) {
          variants = [...keys.slice(0, -2), ...variants];
          last = keys.slice(-2).join('-');
        } else {
          variants = [...keys.slice(0, -1), ...variants];
          last = keys[keys.length - 1];
        }
        const isNegative = utility.charAt(0) === '-';
        if (isNegative) utility = utility.slice(1);
        utility = ['m', 'p'].includes(last) && ['t', 'l', 'b', 'r', 'x', 'y'].includes(utility.charAt(0))
          ? last + utility
          : last + '-' + utility;
        if (isNegative) utility = '-' + utility;
        utility !== 'cursor-default' && (utility = utility.replace(/-(~|default)$/, ''));

        // Table de dispatch — remplace le switch géant
        const transformer = ATTR_TRANSFORMERS[last];
        if (transformer) utility = transformer(utility);
      }

      const style = this.extract(utility, false);
      if (style) {
        const important = importantKey || importantValue;
        if (Array.isArray(style)) {
          style.forEach(i => {
            if (i instanceof Keyframes) return i;
            i.selector = buildSelector;
            this.markAsImportant(i, important);
          });
        } else {
          style.selector = buildSelector;
          this.markAsImportant(style, important);
        }
        if (variants.find(i => !this._cache.variantSet.has(i))) {
          ignored.push(buildSelector);
        } else {
          const wrapped = this.wrapWithVariants(variants, style);
          if (wrapped) {
            ignoreProcessed && this._cache.attrs.add(buildSelector);
            success.push(buildSelector);
            styleSheet.add(wrapped);
          } else {
            ignored.push(buildSelector);
          }
        }
      } else {
        ignored.push(buildSelector);
      }
    };

    for (let [key, value] of Object.entries(attrs)) {
      let notAllow = false;
      if (prefix) {
        if (key.startsWith(prefix)) {
          key = key.slice(prefix.length);
        } else {
          notAllow = true;
        }
      }
      if (disable?.includes(key)) notAllow = true;
      if (Array.isArray(value)) {
        value.forEach(i => _gStyle(key, i, false, notAllow, ignoreProcessed));
      } else {
        _gStyle(key, value, true, notAllow, ignoreProcessed);
      }
    }

    return {
      success,
      ignored,
      styleSheet: styleSheet.sort().combine(),
    };
  }

  loadPlugin({ handler, config }: PluginOutput): void {
    if (config) {
      config = this._resolveFunction(config);
      config = combineConfig(
        config as { [key: string]: unknown },
        this._config as { [key: string]: unknown },
      );
      const pluginTheme = config.theme as Record<string, ThemeType>;
      const extendTheme = pluginTheme?.extend as undefined | Record<string, ThemeType>;
      if (pluginTheme && extendTheme && typeof extendTheme === 'object') {
        for (const [key, value] of Object.entries(extendTheme)) {
          const themeValue = pluginTheme[key];
          if (themeValue && typeof themeValue === 'object') {
            pluginTheme[key] = { ...(themeValue ?? {}), ...value as { [key: string]: unknown } };
          } else if (value && typeof value === 'object') {
            pluginTheme[key] = value as { [key: string]: unknown };
          }
        }
      }
      this._config = { ...config, theme: pluginTheme };
      this._theme = this._buildThemeProxy(pluginTheme);
    }
    this._config = this._resolveFunction(this._config);
    this._theme = this._config.theme
      ? this._buildThemeProxy(this._config.theme as Record<string, ThemeType>)
      : this._config.theme;
    this._variants = { ...this._variants, ...this.resolveVariants() };
    // Mettre à jour variantSet après chargement de plugin
    this._cache.variantSet = new Set(Object.keys(this._variants));
    this._cache.variants = [...this._cache.variantSet];
    this._invalidateStyleCaches();
    this._invalidateThemeCache();
    handler(this.pluginUtils);
  }

  loadPluginWithOptions(optionsFunction: PluginWithOptions<any>, userOptions?: DictStr): void {
    const p = optionsFunction(userOptions ?? {});
    this.loadPlugin(p);
  }

  loadShortcuts(shortcuts: { [key: string]: Shortcut }): void {
    for (const [key, value] of Object.entries(shortcuts)) {
      const prefixStr = this.config('prefix', '') as string;
      if (typeof value === 'string') {
        this._plugin.shortcuts[key] = this.compile(value, undefined, undefined, false, undefined, cssEscape(prefixStr + key))
          .styleSheet.children.map(i => i.updateMeta('components', 'shortcuts', layerOrder['shortcuts'], ++this._cache.count));
      } else {
        let styles: Style[] = [];
        Style.generate('.' + cssEscape(key), value).forEach(style => {
          for (const prop of style.property) {
            if (!prop.value) continue;
            if (prop.name === '@apply') {
              styles = styles.concat(
                this.compile(Array.isArray(prop.value) ? prop.value.join(' ') : prop.value)
                  .styleSheet.children.map(i => {
                    const newStyle = deepCopy(style);
                    newStyle.property = [];
                    return newStyle.extend(i);
                  }),
              );
            } else {
              const newStyle = deepCopy(style);
              newStyle.property = [prop];
              styles.push(newStyle);
            }
          }
        });
        this._plugin.shortcuts[key] = styles.map(i =>
          i.updateMeta('components', 'shortcuts', layerOrder['shortcuts'], ++this._cache.count),
        );
      }
    }
  }

  loadAlias(alias: { [key: string]: string }): void {
    const separator = this.config('separator', ':') as string;
    for (const [key, value] of Object.entries(alias)) {
      this._plugin.alias[key] = this._parse(value, separator);
    }
  }

  config(path: string, defaultValue?: unknown): unknown {
    if (path === 'corePlugins') {
      return this._plugin.core
        ? Object.keys(this._plugin.core).filter(i => this._plugin.core?.[i])
        : Object.keys(pluginOrder).slice(Object.keys(pluginOrder).length / 2);
    }
    return getNestedValue(this._config, path) ?? defaultValue;
  }

  theme(path: string, defaultValue?: unknown): unknown {
    return this._theme ? getNestedValue(this._theme, path) ?? defaultValue : undefined;
  }

  corePlugins(path: string): boolean {
    if (Array.isArray(this._config.corePlugins)) {
      return (this._config.corePlugins as string[]).includes(path);
    }
    return (this.config(`corePlugins.${path}`, true) as boolean) ?? false;
  }

  variants(path: string, defaultValue: string[] = []): string[] {
    if (Array.isArray(this._config.variants)) return this._config.variants;
    return this.config(`variants.${path}`, defaultValue) as string[];
  }

  e(selector: string): string {
    return cssEscape(selector);
  }

  prefix(selector: string): string {
    return selector.replace(/(?=[\w])/, this._config.prefix ?? '');
  }

  addUtilities(
    utilities: DeepNestObject | DeepNestObject[],
    options: PluginUtilOptions = {
      layer: 'utilities',
      variants: [],
      respectPrefix: true,
      respectImportant: true,
    },
  ): Style[] {
    if (Array.isArray(options)) options = { variants: options };
    if (Array.isArray(utilities))
      utilities = utilities.reduce(
        (previous: { [key: string]: unknown }, current) => combineConfig(previous, current),
        {},
      ) as DeepNestObject;
    let output: Style[] = [];
    const layer = options.layer ?? 'utilities';
    const order = layerOrder[layer] + 1;
    for (const [key, value] of Object.entries(utilities)) {
      let propertyValue = value;
      if (Array.isArray(value)) propertyValue = Object.assign({}, ...value);
      const styles = Style.generate(
        key.startsWith('.') && options.respectPrefix ? this.prefix(key) : key,
        propertyValue,
      );
      if (options.layer) styles.forEach(style => style.updateMeta(layer, 'plugin', order, ++this._cache.count));
      if (options.respectImportant && this._config.important) styles.forEach(style => (style.important = true));
      let className = guessClassName(key);
      if (key.charAt(0) === '@') {
        styles.forEach(style => {
          if (style.selector) className = guessClassName(style.selector);
          if (Array.isArray(className)) {
            className.filter(i => i.isClass).forEach(({ selector, pseudo }) =>
              this._addPluginProcessorCache(
                'utilities',
                selector,
                pseudo
                  ? style.clone('.' + cssEscape(selector)).wrapSelector(s => s + pseudo)
                  : style.clone(),
              ),
            );
            const base = className.filter(i => !i.isClass).map(i => i.selector).join(', ');
            if (base) this._addPluginProcessorCache('static', base, style.clone(base));
          } else {
            this._addPluginProcessorCache(
              className.isClass ? 'utilities' : 'static',
              className.selector,
              className.pseudo
                ? style.clone('.' + cssEscape(className.selector)).wrapSelector(s => s + (className as { pseudo: string }).pseudo)
                : style.clone(),
            );
          }
        });
      } else if (Array.isArray(className)) {
        className.filter(i => i.isClass).forEach(({ selector, pseudo }) =>
          this._addPluginProcessorCache(
            'utilities',
            selector,
            pseudo ? styles.map(i => i.clone('.' + cssEscape(selector)).wrapSelector(s => s + pseudo)) : deepCopy(styles),
          ),
        );
        const base = className.filter(i => !i.isClass).map(i => i.selector).join(', ');
        if (base) this._addPluginProcessorCache('static', base, styles.map(i => i.clone(base)));
      } else {
        this._addPluginProcessorCache(
          className.isClass ? 'utilities' : 'static',
          className.selector,
          className.pseudo
            ? styles.map(style =>
              style.clone('.' + cssEscape((className as { selector: string }).selector)).wrapSelector(s => s + (className as { pseudo: string }).pseudo),
            )
            : styles,
        );
      }
      output = [...output, ...styles];
    }
    // Invalider le cache d'extract après ajout d'utilitaires
    this._invalidateStyleCaches();
    return output;
  }

  addDynamic(
    key: string,
    generator: UtilityGenerator,
    options: PluginUtilOptions = {
      layer: 'utilities',
      group: 'plugin',
      variants: [],
      completions: [],
      respectPrefix: true,
      respectImportant: true,
      respectSelector: false,
    },
  ): UtilityGenerator {
    const uOptions = Array.isArray(options) ? { variants: options } : options;
    const layer = uOptions.layer || 'utilities';
    const group = uOptions.group || 'plugin';
    const order = uOptions.order || layerOrder[layer] + 1;
    if (uOptions.completions)
      this._plugin.completions[group] = group in this._plugin.completions
        ? [...this._plugin.completions[group], ...uOptions.completions]
        : uOptions.completions;
    const important = uOptions.respectImportant && this._config.important ? true : false;
    const style = (selector: string, property?: Property | Property[], imp = important) =>
      new Style(selector, property, imp);
    const prop = (name: string | string[], value?: string, comment?: string, imp = important) =>
      new Property(name, value, comment, imp);
    const keyframes = (selector: string, property?: Property | Property[], imp = important) =>
      new Keyframes(selector, property, imp);
    keyframes.generate = Keyframes.generate;
    style.generate = Style.generate;
    prop.parse = Property.parse;
    this._plugin.dynamic[key] =
      key in this._plugin.dynamic
        ? (Utility: Utility) =>
          deepCopy(this._plugin.dynamic[key])(Utility) ||
          generator({ Utility, Style: style, Property: prop, Keyframes: keyframes })
        : (Utility: Utility) => {
          const output = generator({ Utility, Style: style, Property: prop, Keyframes: keyframes });
          if (!output) return;
          if (Array.isArray(output))
            return output.map(i =>
              i.updateMeta(layer, group, order, ++this._cache.count, false, i.meta.respectSelector || uOptions.respectSelector),
            );
          return output.updateMeta(
            layer, group, order, ++this._cache.count, false,
            output.meta.respectSelector || uOptions.respectSelector,
          );
        };
    this._invalidateStyleCaches();
    return generator;
  }

  addComponents(
    components: DeepNestObject | DeepNestObject[],
    options: PluginUtilOptions = { layer: 'components', variants: [], respectPrefix: false },
  ): Style[] {
    if (Array.isArray(options)) options = { variants: options };
    if (Array.isArray(components))
      components = components.reduce(
        (previous: { [key: string]: unknown }, current) => combineConfig(previous, current),
        {},
      ) as DeepNestObject;
    let output: Style[] = [];
    const layer = options.layer ?? 'components';
    const order = layerOrder[layer] + 1;
    for (const [key, value] of Object.entries(components)) {
      let propertyValue = value;
      if (Array.isArray(value)) propertyValue = Object.assign({}, ...value);
      const styles = Style.generate(
        key.startsWith('.') && options.respectPrefix ? this.prefix(key) : key,
        propertyValue,
      );
      styles.forEach(style => style.updateMeta(layer, 'plugin', order, ++this._cache.count));
      if (options.respectImportant && this._config.important) styles.forEach(style => (style.important = true));
      let className = guessClassName(key);
      if (key.charAt(0) === '@') {
        styles.forEach(style => {
          if (style.selector) className = guessClassName(style.selector);
          if (Array.isArray(className)) {
            className.filter(i => i.isClass).forEach(({ selector, pseudo }) =>
              this._addPluginProcessorCache(
                'components',
                selector,
                pseudo
                  ? style.clone('.' + cssEscape(selector)).wrapSelector(s => s + pseudo)
                  : style.clone(),
              ),
            );
            const base = className.filter(i => !i.isClass).map(i => i.selector).join(', ');
            if (base) this._addPluginProcessorCache('static', base, style.clone(base));
          } else {
            this._addPluginProcessorCache(
              className.isClass ? 'components' : 'static',
              className.selector,
              className.pseudo
                ? style.clone('.' + cssEscape(className.selector)).wrapSelector(s => s + (className as { pseudo: string }).pseudo)
                : style.clone(),
            );
          }
        });
      } else if (Array.isArray(className)) {
        if (className.some(i => !i.isClass)) {
          const base = className.map(i => i.selector).join(', ');
          if (base) this._addPluginProcessorCache('static', base, styles.map(i => i.clone(base)));
        } else {
          className.forEach(({ selector, pseudo }) =>
            this._addPluginProcessorCache(
              'components',
              selector,
              pseudo
                ? styles.map(i => i.clone('.' + cssEscape(selector)).wrapSelector(s => s + pseudo))
                : deepCopy(styles),
            ),
          );
        }
      } else {
        this._addPluginProcessorCache(
          className.isClass ? 'components' : 'static',
          className.selector,
          className.pseudo
            ? styles.map(style =>
              style.clone('.' + cssEscape((className as { selector: string }).selector)).wrapSelector(s => s + (className as { pseudo: string }).pseudo),
            )
            : styles,
        );
      }
      output = [...output, ...styles];
    }
    this._invalidateStyleCaches();
    return output;
  }

  addBase(baseStyles: DeepNestObject): Style[] {
    let output: Style[] = [];
    for (const [key, value] of Object.entries(baseStyles)) {
      let propertyValue = value;
      if (Array.isArray(value)) propertyValue = Object.assign({}, ...value);
      const styles = Style.generate(key, propertyValue).map(i =>
        i.updateMeta('base', 'plugin', 10, ++this._cache.count),
      );
      this._replaceStyleVariants(styles);
      this._addPluginProcessorCache('preflights', key, styles);
      output = [...output, ...styles];
    }
    return output;
  }

  addVariant(name: string, generator: VariantGenerator): Style | Style[] {
    const style = generator({
      ...this.variantUtils,
      separator: this.config('separator', ':') as string,
      style: new Style(),
    });
    this._variants[name] = () => style;
    this._cache.variants.push(name);
    this._cache.variantSet.add(name);
    return style;
  }

  dumpConfig(): string {
    const processor = new Processor();
    const diff = diffConfig(processor._config, this._config) as Config;
    let output = { theme: { extend: {} }, plugins: [] } as { [key: string]: any };
    if (diff.theme) {
      for (const [key, value] of Object.entries(diff.theme)) {
        if (key !== 'extend') {
          (output.theme.extend as { [key: string]: unknown })[key] = value;
        }
      }
      delete diff.theme;
    }
    if (diff.plugins) {
      for (const p of diff.plugins) {
        if ('config' in p) delete p.config;
        output.plugins.push(p);
      }
      delete diff.plugins;
    }
    output = { ...diff, ...output };

    return `module.exports = ${toSource(output)}`;
  }
}
