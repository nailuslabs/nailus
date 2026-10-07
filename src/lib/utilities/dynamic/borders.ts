import { pluginOrder } from '../../../packages-engine/config/order';
import { toType } from '../../../utils/tools';
import { Property, Style } from '../../../utils/style';
import { expandDirection } from '../../../utils/helpers';
import type { Utility } from '../handler';
import type { PluginUtils, Output } from '../../../interfaces';
import { isNumberLead, notNumberLead } from './helpers';



// https://nailuscss.org/utilities/borders.html#border-radius
export function borderRadius(utility: Utility, { theme }: PluginUtils): Output {
  const raw = ['rounded', 'rounded-t', 'rounded-l', 'rounded-r', 'rounded-b', 'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl'].includes(utility.raw) ? utility.raw + '-DEFAULT' : utility.raw;
  utility = utility.clone(raw);
  const directions = expandDirection(raw.match(/rounded-[trbl][trbl]?-/)?.[0].slice(8, -1) || '', true);
  if (!directions) return;
  return utility.handler
    .handleStatic(theme('borderRadius'))
    .handleSquareBrackets()
    .handleFraction()
    .handleNxl((number: number) => `${number * 0.5}rem`)
    .handleSize()
    .handleVariable()
    .createProperty(directions[0] === '*' ? 'border-radius' : directions.map((i) => `border-${i}-radius`))
    ?.updateMeta('utilities', 'borderRadius', pluginOrder.borderRadius, -(directions[0] === '*' ? 3 : directions.length), true);
}



// https://nailuscss.org/utilities/borders.html#border-width
// https://nailuscss.org/utilities/borders.html#border-color
// https://nailuscss.org/utilities/borders.html#border-opacity
export function border(utility: Utility, { theme }: PluginUtils): Output {
  // handle border opacity
  if (utility.raw.startsWith('border-opacity')) {
    return utility.handler
      .handleStatic(theme('borderOpacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-border-opacity')
      ?.updateMeta('utilities', 'borderOpacity', pluginOrder.borderOpacity, 1, true);
  }

  // handle border color
  const borderColor = utility.handler
    .handleColor(theme('borderColor'))
    .handleOpacity(theme('borderOpacity'))
    .handleSquareBrackets(notNumberLead)
    .handleVariable((variable: string) => utility.raw.startsWith('border-$') ? `var(--${variable})` : undefined)
    .createColorStyle(utility.class, 'border-color', '--tw-border-opacity')
    ?.updateMeta('utilities', 'borderColor', pluginOrder.borderColor, 2, true);
  if (borderColor) return borderColor;

  // handle border width
  const directions = expandDirection(utility.raw.substring(7, 8), false) ?? ['*'];
  const borders = toType(theme('borderWidth'), 'object') as { [key: string]: string };
  const raw = ['border', 'border-t', 'border-r', 'border-b', 'border-l', 'border-x', 'border-y'].includes(utility.raw) ? `${utility.raw}-${borders.DEFAULT ?? '1px'}` : utility.raw;

  // handle border side color
  const borderSide = utility.clone(raw.slice(7)).handler
    .handleColor(theme('borderColor'))
    .handleOpacity(theme('borderOpacity'));

  if (borderSide.value || borderSide.color) {
    if (borderSide.opacity) {
      return new Property(`border-${directions[0]}-color`, borderSide.createColorValue(borderSide.opacity)).updateMeta('utilities', 'borderColor', pluginOrder.borderColor, 4, true);
    }
    return borderSide.createColorStyle(utility.class, `border-${directions[0]}-color`, '--tw-border-opacity')?.updateMeta('utilities', 'borderColor', pluginOrder.borderColor, 3, true);
  }

  utility = utility.clone(raw);
  return utility.handler
    .handleStatic(borders)
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'int', (number: number) => /^border(-[tlbrxy])?$/.test(utility.key) ? `${number}px` : undefined)
    .handleSize()
    .handleVariable()
    .createProperty(directions[0] === '*' ? 'border-width' : directions.map((i) => `border-${i}-width`))
    ?.updateMeta('utilities', 'borderWidth', pluginOrder.borderWidth, (directions[0] === '*' ? 1 : (directions.length + 1)), true);
}



// https://nailuscss.org/utilities/borders.html#divide-width
// https://nailuscss.org/utilities/borders.html#divide-color
// https://nailuscss.org/utilities/borders.html#divide-opacity
// https://nailuscss.org/utilities/borders.html#divide-style
export function divide(utility: Utility, { theme }: PluginUtils): Output {
  // handle divide style
  if (['solid', 'dashed', 'dotted', 'double', 'none'].includes(utility.amount)) return new Property('border-style', utility.amount).toStyle(utility.class).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideStyle', pluginOrder.divideStyle, 1, true);
  // handle divide opacity
  if (utility.raw.startsWith('divide-opacity'))
    return utility.handler
      .handleStatic(theme('divideOpacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-divide-opacity')
      ?.toStyle(utility.class)
      .child('> :not([hidden]) ~ :not([hidden])')
      .updateMeta('utilities', 'divideOpacity', pluginOrder.divideOpacity, 1, true);
  // handle divide color
  const divideColor = utility.handler
    .handleColor(theme('divideColor'))
    .handleOpacity(theme('divideOpacity'))
    .handleVariable((variable: string) => utility.raw.startsWith('divide-$') ? `var(--${variable})` : undefined)
    .createColorStyle(utility.class, 'border-color', '--tw-divide-opacity')
    ?.child('> :not([hidden]) ~ :not([hidden])')
    .updateMeta('utilities', 'divideColor', pluginOrder.divideColor, 0, true);
  if (divideColor) return divideColor;
  // handle divide width
  switch (utility.raw) {
  case 'divide-x-reverse':
    return new Style(utility.class, new Property('--tw-divide-x-reverse', '1')).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 6, true);
  case 'divide-y-reverse':
    return new Style(utility.class, new Property('--tw-divide-y-reverse', '1')).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 5, true);
  case 'divide-y':
    return new Style(utility.class, [
      new Property('--tw-divide-y-reverse', '0'),
      new Property('border-top-width', 'calc(1px * calc(1 - var(--tw-divide-y-reverse)))'),
      new Property('border-bottom-width', 'calc(1px * var(--tw-divide-y-reverse))'),
    ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 3, true);
  case 'divide-x':
    return new Style(utility.class, [
      new Property('--tw-divide-x-reverse', '0'),
      new Property('border-right-width', 'calc(1px * var(--tw-divide-x-reverse))'),
      new Property('border-left-width', 'calc(1px * calc(1 - var(--tw-divide-x-reverse)))'),
    ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 4, true);
  }
  return utility.handler
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'float', (number: number) => `${number}px`)
    .handleSize()
    .handleVariable()
    .callback(value => {
      const centerMatch = utility.raw.match(/^-?divide-[x|y]/);
      if (centerMatch) {
        const center = centerMatch[0].replace(/^-?divide-/, '');
        switch (center) {
        case 'x':
          return new Style(utility.class, [
            new Property('--tw-divide-x-reverse', '0'),
            new Property('border-right-width', `calc(${value} * var(--tw-divide-x-reverse))`),
            new Property('border-left-width', `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`),
          ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 2, true);
        case 'y':
          return new Style(utility.class, [
            new Property('--tw-divide-y-reverse', '0'),
            new Property('border-top-width', `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`),
            new Property('border-bottom-width', `calc(${value} * var(--tw-divide-y-reverse))`),
          ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 1, true);
        }
      }
    });
}



// https://nailuscss.org/utilities/borders.html#ring-offset-width
// https://nailuscss.org/utilities/borders.html#ring-offset-color
export function ringOffset(utility: Utility, { theme }: PluginUtils): Output {
  let value;
  // handle ring offset width variable
  if (utility.raw.startsWith('ringOffset-width-$')) {
    value = utility.handler.handleVariable().value;
    if (value) return new Property('--tw-ring-offset-width', value).toStyle(utility.class.replace('ringOffset', 'ring-offset')).updateMeta('utilities', 'ringOffsetWidth', pluginOrder.ringOffsetWidth, 2, true);
  }

  if (utility.raw.startsWith('ringOffset-opacity')) {
    return utility.handler
      .handleStatic(theme('opacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-ring-offset-opacity')
      ?.updateMeta('utilities', 'ringOffsetColor', pluginOrder.ringOffsetColor, 2, true);
  }

  // handle ring offset color || ring offset width
  return utility.handler
    .handleColor(theme('ringOffsetColor'))
    .handleOpacity('ringOpacity')
    .handleVariable()
    .handleSquareBrackets()
    .createColorStyle(utility.class.replace('ringOffset', 'ring-offset'), '--tw-ring-offset-color', '--tw-ring-offset-opacity')
    ?.updateMeta('utilities', 'ringOffsetColor', pluginOrder.ringOffsetColor, 1, true)
    || utility.handler
      .handleStatic(theme('ringOffsetWidth'))
      .handleSquareBrackets(isNumberLead)
      .handleNumber(0, undefined, 'float', (number: number) => `${number}px`)
      .handleSize()
      .createStyle(utility.class.replace('ringOffset', 'ring-offset'), value => new Property('--tw-ring-offset-width', value))
      ?.updateMeta('utilities', 'ringOffsetWidth', pluginOrder.ringOffsetWidth, 1, true);
}



// https://nailuscss.org/utilities/borders.html#ring-width
// https://nailuscss.org/utilities/borders.html#ring-color
// https://nailuscss.org/utilities/borders.html#ring-opacity
export function ring(utility: Utility, utils: PluginUtils): Output {
  // handle ring offset
  if (utility.raw.startsWith('ring-offset')) return ringOffset(utility.clone(utility.raw.replace('ring-offset', 'ringOffset')), utils);
  // handle ring opacity
  if (utility.raw.startsWith('ring-opacity'))
    return utility.handler
      .handleStatic(utils.theme('ringOpacity'))
      .handleSquareBrackets()
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-ring-opacity')
      ?.updateMeta('utilities', 'ringOpacity', pluginOrder.ringOpacity, 1, true);
  // handle ring color
  const ringColor = utility.handler
    .handleColor(utils.theme('ringColor'))
    .handleOpacity(utils.theme('ringOpacity'))
    .handleSquareBrackets(notNumberLead)
    .handleVariable((variable: string) => utility.raw.startsWith('ring-$') ? `var(--${variable})` : undefined)
    .createColorStyle(utility.class, '--tw-ring-color', '--tw-ring-opacity')
    ?.updateMeta('utilities', 'ringColor', pluginOrder.ringColor, 0, true);

  if (ringColor) return ringColor;
  // handle ring width
  if (utility.raw === 'ring-inset') return new Property('--tw-ring-inset', 'inset').updateMeta('utilities', 'ringWidth', pluginOrder.ringWidth, 3, true);
  const value = utility.raw === 'ring'
    ? (toType(utils.theme('ringWidth.DEFAULT'), 'string') ?? '3px')
    : utility.handler
      .handleStatic(utils.theme('ringWidth'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'float', (number: number) => `${number}px`)
      .handleSize()
      .handleVariable()
      .value;
  if (!value) return;
  return new Style(utility.class, [
    new Property('--tw-ring-offset-shadow', 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)'),
    new Property('--tw-ring-shadow', `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`),
    new Property(['-webkit-box-shadow', 'box-shadow'], 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)'),
  ]).updateMeta('utilities', 'ringWidth', pluginOrder.ringWidth, (utility.raw === 'ring' ? 1 : 2), true);
}
