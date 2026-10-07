import { pluginOrder } from '../../../packages-engine/config/order';
import { toType } from '../../../utils/tools';
import { Property, Style } from '../../../utils/style';
import type { Utility } from '../handler';
import type { PluginUtils, Output } from '../../../interfaces';



// https://nailuscss.org/utilities/filters.html#filter-blur
export function blur(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === 'blur') utility.raw = 'blur-DEFAULT';
  return utility.handler
    .handleBody(theme('blur'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'int', (number) => `${number}px`)
    .handleSize()
    .createProperty('--tw-blur', value => `blur(${value})`)
    ?.updateMeta('utilities', 'blur', pluginOrder.blur, 1, true);
}



// https://nailuscss.org/utilities/filters.html#filter-brightness
export function brightness(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('brightness'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'int', (number) => `${number / 100}`)
    .createProperty('--tw-brightness', value => `brightness(${value})`)
    ?.updateMeta('utilities', 'brightness', pluginOrder.brightness, 1, true);
}



// https://nailuscss.org/utilities/filters.html#filter-contrast
export function contrast(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('contrast'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'int', (number) => `${number / 100}`)
    .createProperty('--tw-contrast', value => `contrast(${value})`)
    ?.updateMeta('utilities', 'contrast', pluginOrder.contrast, 1, true);
}



// https://nailuscss.org/utilities/filters.html#filter-drop-shadow
export function dropShadow(utility: Utility, { theme }: PluginUtils): Output {
  let value;
  if (utility.raw === 'drop-shadow') {
    value = theme('dropShadow.DEFAULT', ['0 1px 2px rgba(0, 0, 0, 0.1)', '0 1px 1px rgba(0, 0, 0, 0.06)']) as string | string[];
  } else {
    const dropShadows = theme('dropShadow') as { [key: string]: string | string[] };
    const amount = utility.amount;
    if (utility.raw.startsWith('drop-shadow') && amount in dropShadows) value = dropShadows[amount];
  }
  if (value) return new Property('--tw-drop-shadow', Array.isArray(value) ? value.map(i => `drop-shadow(${i})`).join(' ') : `drop-shadow(${value})`).updateMeta('utilities', 'dropShadow', pluginOrder.dropShadow, 1, true);
}



// https://nailuscss.org/utilities/filters.html#filter-grayscale
export function grayscale(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === 'grayscale') utility.raw = 'grayscale-DEFAULT';
  return utility.handler
    .handleBody(theme('grayscale'))
    .handleSquareBrackets()
    .handleNumber(0, 100, 'int', (number) => `${number / 100}`)
    .createProperty('--tw-grayscale', value => `grayscale(${value})`)
    ?.updateMeta('utilities', 'grayscale', pluginOrder.grayscale, 1, true);
}



// https://nailuscss.org/utilities/filters.html#filter-hue-rotate
export function hueRotate(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('hueRotate'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'float', (number) => `${number}deg`)
    .handleNegative()
    .createProperty('--tw-hue-rotate', value => `hue-rotate(${value})`)
    ?.updateMeta('utilities', 'hueRotate', pluginOrder.hueRotate, 1, true);
}



// https://nailuscss.org/utilities/filters.html#filter-invert
export function invert(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === 'invert') utility.raw = 'invert-DEFAULT';
  return utility.handler
    .handleBody(theme('invert'))
    .handleSquareBrackets()
    .handleNumber(0, 100, 'int', (number) => `${number / 100}`)
    .createProperty('--tw-invert', value => `invert(${value})`)
    ?.updateMeta('utilities', 'invert', pluginOrder.invert, 1, true);
}



// https://nailuscss.org/utilities/filters.html#filter-saturate
export function saturate(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('saturate'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'int', (number) => `${number / 100}`)
    .createProperty('--tw-saturate', value => `saturate(${value})`)
    ?.updateMeta('utilities', 'saturate', pluginOrder.saturate, 1, true);
}



// https://nailuscss.org/utilities/filters.html#filter-sepia
export function sepia(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === 'sepia') utility.raw = 'sepia-DEFAULT';
  return utility.handler
    .handleBody(theme('sepia'))
    .handleSquareBrackets()
    .handleNumber(0, 100, 'int', (number) => `${number / 100}`)
    .createProperty('--tw-sepia', value => `sepia(${value})`)
    ?.updateMeta('utilities', 'sepia', pluginOrder.sepia, 1, true);
}



// https://nailuscss.org/utilities/filters.html#backdrop-filter
// https://nailuscss.org/utilities/filters.html#backdrop-blur
// https://nailuscss.org/utilities/filters.html#backdrop-brightness
// https://nailuscss.org/utilities/filters.html#backdrop-contrast
// https://nailuscss.org/utilities/filters.html#backdrop-grayscale
// https://nailuscss.org/utilities/filters.html#backdrop-hue-rotate
// https://nailuscss.org/utilities/filters.html#backdrop-invert
// https://nailuscss.org/utilities/filters.html#backdrop-opacity
// https://nailuscss.org/utilities/filters.html#backdrop-saturate
// https://nailuscss.org/utilities/filters.html#backdrop-sepia
export function backdrop(utility: Utility, { theme }: PluginUtils): Output {
  utility = utility.clone(utility.raw.slice(9));
  switch (utility.match(/[^-]+/)) {
  case 'blur':
    if (utility.raw === 'blur') utility.raw = 'blur-DEFAULT';
    return utility.handler
      .handleBody(theme('backdropBlur'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'int', (number) => `${number}px`)
      .handleSize()
      .createProperty('--tw-backdrop-blur', value => `blur(${value})`)
      ?.updateMeta('utilities', 'backdropBlur', pluginOrder.backdropBlur, 1, true);
  case 'brightness':
    return utility.handler
      .handleBody(theme('backdropBrightness'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'int', (number) => `${number / 100}`)
      .createProperty('--tw-backdrop-brightness', value => `brightness(${value})`)
      ?.updateMeta('utilities', 'backdropBrightness', pluginOrder.backdropBrightness, 1, true);
  case 'contrast':
    return utility.handler
      .handleBody(theme('backdropContrast'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'int', (number) => `${number / 100}`)
      .createProperty('--tw-backdrop-contrast', value => `contrast(${value})`)
      ?.updateMeta('utilities', 'backdropContrast', pluginOrder.backdropContrast, 1, true);
  case 'grayscale':
    if (utility.raw === 'grayscale') utility.raw = 'grayscale-DEFAULT';
    return utility.handler
      .handleBody(theme('backdropGrayscale'))
      .handleSquareBrackets()
      .handleNumber(0, 100, 'int', (number) => `${number / 100}`)
      .createProperty('--tw-backdrop-grayscale', value => `grayscale(${value})`)
      ?.updateMeta('utilities', 'backdropGrayscale', pluginOrder.backdropGrayscale, 1, true);
  case 'hue':
    return utility.handler
      .handleBody(theme('backdropHueRotate'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'float', (number) => `${number}deg`)
      .handleNegative()
      .createProperty('--tw-backdrop-hue-rotate', value => `hue-rotate(${value})`)
      ?.updateMeta('utilities', 'backdropHueRotate', pluginOrder.backdropHueRotate, 1, true);
  case 'invert':
    if (utility.raw === 'invert') utility.raw = 'invert-DEFAULT';
    return utility.handler
      .handleBody(theme('backdropInvert'))
      .handleSquareBrackets()
      .handleNumber(0, 100, 'int', (number) => `${number / 100}`)
      .createProperty('--tw-backdrop-invert', value => `invert(${value})`)
      ?.updateMeta('utilities', 'backdropInvert', pluginOrder.backdropInvert, 1, true);
  case 'opacity':
    return utility.handler
      .handleBody(theme('backdropOpacity'))
      .handleSquareBrackets()
      .handleNumber(0, 100, 'int', (number) => `${number / 100}`)
      .createProperty('--tw-backdrop-opacity', value => `opacity(${value})`)
      ?.updateMeta('utilities', 'backdropOpacity', pluginOrder.backdropOpacity, 1, true);
  case 'saturate':
    return utility.handler
      .handleBody(theme('backdropSaturate'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'int', (number) => `${number / 100}`)
      .createProperty('--tw-backdrop-saturate', value => `saturate(${value})`)
      ?.updateMeta('utilities', 'backdropSaturate', pluginOrder.backdropSaturate, 1, true);
  case 'sepia':
    if (utility.raw === 'sepia') utility.raw = 'sepia-DEFAULT';
    return utility.handler
      .handleBody(theme('backdropSepia'))
      .handleSquareBrackets()
      .handleNumber(0, 100, 'int', (number) => `${number / 100}`)
      .createProperty('--tw-backdrop-sepia', value => `sepia(${value})`)
      ?.updateMeta('utilities', 'backdropSepia', pluginOrder.backdropSepia, 1, true);
  }
}



// https://nailuscss.org/utilities/effects.html#box-shadow
export function boxShadow(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body || 'DEFAULT';
  const shadows = toType(theme('boxShadow'), 'object') as { [key: string]: string };

  if (Object.keys(shadows).includes(body)) {
    const coloredShadow = shadows[body].replace(/rgba?\([0-9.,/\s]*\)/g, 'var(--tw-shadow-color)');
    return new Style(utility.class, [
      new Property('--tw-shadow', shadows[body]),
      new Property('--tw-shadow-colored', coloredShadow),
      new Property('-webkit-box-shadow', 'var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)'),
      new Property('box-shadow', 'var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)'),
    ]).updateMeta('utilities', 'boxShadow', pluginOrder.boxShadow, 0, true);
  }

  const color = utility.handler
    .handleColor(theme('boxShadowColor'))
    .handleOpacity(theme('opacity'))
    .handleSquareBrackets()
    .handleVariable();

  return new Style(utility.class, [
    new Property('--tw-shadow-color', color.createColorValue(color.opacity || '1')),
    new Property('--tw-shadow', 'var(--tw-shadow-colored)'),
  ]).updateMeta('utilities', 'boxShadowColor', pluginOrder.boxShadowColor, 0, true);
}



// https://nailuscss.org/utilities/effects.html#opacity
export function opacity(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('opacity'))
    .handleSquareBrackets()
    .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .createProperty('opacity')
    ?.updateMeta('utilities', 'opacity', pluginOrder.opacity, 0, true);
}
