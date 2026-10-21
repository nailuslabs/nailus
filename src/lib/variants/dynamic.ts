import { Style } from '../../utils/style';
import { isString, increaseWithUnit } from '../../utils';
import { pseudoClassNames } from '../../packages-presets/preset-mini/src/variants';
import type { BaseTheme, Config, DictStr } from '../../interfaces';

/**
 * Variants dynamiques
 * -------------------
 * Contrairement aux variants "statiques" (hover, md, dark…), dont la liste est
 * connue à l'avance, ceux-ci sont résolus À LA DEMANDE à partir du nom écrit
 * dans la classe : `aria-[sort=asc]:`, `min-[500px]:`, `has-[:checked]:`,
 * `[&>div]:`, `group-hover/item:`…
 *
 * Un resolver reçoit le nom du variant (ce qui précède le `:`) et renvoie une
 * fabrique de Style, ou `undefined` s'il ne le reconnaît pas.
 */
export type VariantFactory = () => Style;
export type VariantResolver = (variant: string) => VariantFactory | undefined;

const ARIA_BOOLEANS = [
  'busy', 'checked', 'disabled', 'expanded', 'hidden', 'pressed', 'readonly', 'required', 'selected',
];

/** `[a_b]` -> `a b` ; `\_` reste un underscore littéral. */
function decodeArbitrary(value: string): string {
  return value
    .replace(/\\_/g, '\u0000')
    .replace(/_/g, ' ')
    .replace(/\u0000/g, '_');
}

/** `[contenu]` -> `contenu` (décodé), sinon `undefined`. */
function getArbitrary(value: string): string | undefined {
  const matched = value.match(/^\[(.+)\]$/);
  return matched ? decodeArbitrary(matched[1]) : undefined;
}

/** `sort=asc` + `aria` -> `[aria-sort="asc"]` ; `active` + `data` -> `[data-active]`. */
function attribute(prefix: string, raw: string): string {
  const matched = raw.match(/^([\w-]+)\s*([~|^$*]?=)\s*(.*)$/);
  if (!matched) return `[${prefix}-${raw}]`;
  const [, key, operator, rawValue] = matched;
  const value = /^(['"]).*\1$/.test(rawValue) ? rawValue : `"${rawValue}"`;
  return `[${prefix}-${key}${operator}${value}]`;
}

/** `aria-checked`, `aria-[sort=asc]`, `data-active`, `data-[state=open]` -> sélecteur d'attribut. */
function attributeSelector(variant: string): string | undefined {
  const matched = variant.match(/^(aria|data)-(.+)$/);
  if (!matched) return;
  const [, prefix, rest] = matched;
  const arbitrary = getArbitrary(rest);
  if (arbitrary !== undefined) return attribute(prefix, arbitrary);
  if (prefix === 'aria' && ARIA_BOOLEANS.includes(rest)) return `[aria-${rest}="true"]`;
  if (prefix === 'data' && /^[\w-]+$/.test(rest)) return `[data-${rest}]`;
}

const staticExtras: { [key: string]: VariantFactory } = {
  print: () => new Style().atRule('@media print'),
  'contrast-more': () => new Style().atRule('@media (prefers-contrast: more)'),
  'contrast-less': () => new Style().atRule('@media (prefers-contrast: less)'),
  'forced-colors': () => new Style().atRule('@media (forced-colors: active)'),
  starting: () => new Style().atRule('@starting-style'),
  open: () => new Style().wrapSelector(selector => `${selector}[open]`),
  '*': () => new Style().wrapSelector(selector => `${selector} > *`),
};

const resolveStaticExtras: VariantResolver = variant =>
  Object.prototype.hasOwnProperty.call(staticExtras, variant) ? staticExtras[variant] : undefined;

const resolveAttribute: VariantResolver = variant => {
  const selector = attributeSelector(variant);
  if (selector) return () => new Style().wrapSelector(s => s + selector);
};

const resolveSupports: VariantResolver = variant => {
  const matched = variant.match(/^supports-(.+)$/);
  const condition = matched && getArbitrary(matched[1]);
  if (!condition) return;
  const wrapped = /^(\(|not[\s(]|selector\()/.test(condition) ? condition : `(${condition})`;
  return () => new Style().atRule(`@supports ${wrapped}`);
};

const resolveHas: VariantResolver = variant => {
  const matched = variant.match(/^has-(.+)$/);
  if (!matched) return;
  const arbitrary = getArbitrary(matched[1]);
  if (arbitrary !== undefined) return () => new Style().pseudoClass(`has(${arbitrary})`);
  if (pseudoClassNames.includes(matched[1])) return () => new Style().pseudoClass(`has(:${matched[1]})`);
};

const resolveNot: VariantResolver = variant => {
  const matched = variant.match(/^not-(.+)$/);
  if (!matched) return;
  const arbitrary = getArbitrary(matched[1]);
  if (arbitrary !== undefined) return () => new Style().pseudoClass(`not(${arbitrary})`);
  if (pseudoClassNames.includes(matched[1])) return () => new Style().pseudoClass(`not(:${matched[1]})`);
};

const resolveNth: VariantResolver = variant => {
  const matched = variant.match(/^nth-(?:(last)-)?(?:(of-type)-)?(.+)$/);
  if (!matched) return;
  const [, last, ofType, rest] = matched;
  const value = getArbitrary(rest) ?? (/^(\d+|odd|even)$/.test(rest) ? rest : undefined);
  if (value === undefined) return;
  const pseudo = `nth-${last ? 'last-' : ''}${ofType ? 'of-type' : 'child'}(${value})`;
  return () => new Style().pseudoClass(pseudo);
};

/** `group-hover`, `group-hover/item`, `peer-[.is-dirty]`, `group-aria-[sort=asc]`… */
const resolveGroupPeer: VariantResolver = variant => {
  const matched = variant.match(/^(group|peer)-(.+?)(?:\/([\w-]+))?$/);
  if (!matched) return;
  const [, kind, inner, name] = matched;
  const base = `.${kind}${name ? `\\/${name}` : ''}`;

  let selector: string | undefined;
  const arbitrary = getArbitrary(inner);
  if (arbitrary !== undefined) {
    selector = arbitrary.includes('&') ? arbitrary.replace(/&/g, base) : `${base}${arbitrary}`;
  } else if (pseudoClassNames.includes(inner)) {
    selector = `${base}:${inner}`;
  } else if (inner.startsWith('not-') && pseudoClassNames.includes(inner.slice(4))) {
    selector = `${base}:not(:${inner.slice(4)})`;
  } else {
    const attr = attributeSelector(inner);
    if (attr) selector = `${base}${attr}`;
  }
  if (!selector) return;

  const parent = kind === 'peer' ? `${selector} ~` : selector;
  return () => new Style().parent(parent);
};

/** `[&>div]`, `[&_p]`, `[&:nth-child(3)]`, `[@media(min-width:300px)]`. */
const resolveArbitrary: VariantResolver = variant => {
  const inner = getArbitrary(variant);
  if (!inner) return;
  if (inner.startsWith('@')) {
    const atRule = inner.replace(/^@(media|supports|container)(?=[(])/, '@$1 ');
    return () => new Style().atRule(atRule);
  }
  if (inner.includes('&')) return () => new Style().wrapSelector(selector => inner.replace(/&/g, selector));
};

/** `min-[500px]`, `max-[30rem]`, `min-md`, `max-md` (comme `<md`). */
function createMinMaxResolver(screens: DictStr): VariantResolver {
  const lengthPattern = /^([\d.]+[a-z%]+|(calc|var|env)\(.+\))$/;
  return variant => {
    const matched = variant.match(/^(min|max)-(.+)$/);
    if (!matched) return;
    const [, kind, rest] = matched;
    const arbitrary = getArbitrary(rest);
    let size: string | undefined;
    if (arbitrary !== undefined) {
      if (lengthPattern.test(arbitrary)) size = arbitrary;
    } else if (isString(screens[rest])) {
      size = kind === 'max' ? increaseWithUnit(screens[rest], -0.1) : screens[rest];
    }
    if (!size) return;
    return () => new Style().atRule(`@media (${kind}-width: ${size})`);
  };
}

export function generateDynamicVariants(config: Config): VariantResolver[] {
  const screens = ((config.theme as BaseTheme)?.screens ?? {}) as DictStr;
  return [
    resolveStaticExtras,
    resolveAttribute,
    resolveSupports,
    resolveHas,
    resolveNot,
    resolveNth,
    resolveGroupPeer,
    createMinMaxResolver(screens),
    resolveArbitrary,
  ];
}
