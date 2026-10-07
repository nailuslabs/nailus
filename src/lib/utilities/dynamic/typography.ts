import { pluginOrder } from '../../../packages-engine/config/order';
import { toType } from '../../../utils/tools';
import { Property, Style } from '../../../utils/style';
import { generatePlaceholder, generateFontSize } from '../../../utils/helpers';
import type { FontSize, PluginUtils, Output } from '../../../interfaces';
import type { Utility } from '../handler';
import { isNumberLead, notNumberLead } from './helpers';



// https://nailuscss.org/utilities/typography.html#text-opacity
// https://nailuscss.org/utilities/typography.html#text-shadow
// https://nailuscss.org/utilities/typography.html#text-stroke
// https://nailuscss.org/utilities/typography.html#text-color
// https://nailuscss.org/utilities/typography.html#font-size
export function text(utility: Utility, { theme }: PluginUtils): Output {
  // handle font opacity
  if (utility.raw.startsWith('text-opacity')) {
    return utility.handler
      .handleStatic(theme('textOpacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-text-opacity')
      ?.updateMeta('utilities', 'textOpacity', pluginOrder.textOpacity, 1, true);
  }
  if (utility.raw.startsWith('text-shadow')) {
    return (utility.raw === 'text-shadow'
      ? new Property('text-shadow', theme('textShadow.DEFAULT', '0px 0px 1px rgb(0 0 0 / 20%), 0px 0px 1px rgb(1 0 5 / 10%)') as string)
      : utility.handler
        .handleStatic(theme('textShadow'))
        .createProperty('text-shadow')
    )?.updateMeta('utilities', 'textShadow', pluginOrder.textShadow, 1, true);
  }
  if (utility.raw.startsWith('text-stroke')) {
    if (utility.raw === 'text-stroke') return new Style('text-stroke', [
      new Property('-webkit-text-stroke-color', theme('textStrokeColor.DEFAULT', '#e4e4e7') as string),
      new Property('-webkit-text-stroke-width', theme('textStrokeWidth.DEFAULT', 'medium') as string),
    ]).updateMeta('utilities', 'textStrokeColor', pluginOrder.textStrokeColor, 1, true);

    if (utility.raw.startsWith('text-stroke-opacity')) {
      return utility.handler
        .handleStatic(theme('opacity'))
        .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
        .handleVariable()
        .createProperty('--tw-ring-offset-opacity')
        ?.updateMeta('utilities', 'textStrokeColor', pluginOrder.textStrokeColor, 3, true);
    }

    return utility.clone('textStroke' + utility.raw.slice(11)).handler
      .handleColor(theme('textStrokeColor'))
      .handleOpacity(theme('opacity'))
      .handleVariable()
      .createColorStyle(utility.class, '-webkit-text-stroke-color', '--tw-text-stroke-opacity')
      ?.updateMeta('utilities', 'textStrokeColor', pluginOrder.textStrokeColor, 2, true)
      || utility.handler
        .handleStatic(theme('textStrokeWidth'))
        .handleNumber(0, undefined, 'int', (number) => `${number}px`)
        .handleSize()
        .createProperty('-webkit-text-stroke-width')
        ?.updateMeta('utilities', 'textStrokeWidth', pluginOrder.textStrokeWidth, 1, true);
  }
  // handle text colors
  const textColor = utility.handler
    .handleColor(theme('textColor'))
    .handleOpacity(theme('textOpacity'))
    .handleSquareBrackets(notNumberLead)
    .handleVariable()
    .createColorStyle(utility.class, 'color', '--tw-text-opacity')
    ?.updateMeta('utilities', 'textColor', pluginOrder.textColor, 0, true);
  if (textColor) return textColor;

  // handle font sizes
  const amount = utility.amount;
  const fontSizes = toType(theme('fontSize'), 'object') as { [key: string]: FontSize };
  if (Object.keys(fontSizes).includes(amount)) return new Style(utility.class, generateFontSize(fontSizes[amount])).updateMeta('utilities', 'fontSize', pluginOrder.fontSize, 1, true);
  let value = utility.handler
    .handleSquareBrackets(isNumberLead)
    .handleNxl((number: number) => `${number}rem`)
    .handleSize()
    .value;
  if (utility.raw.startsWith('text-size-$')) value = utility.handler.handleVariable().value;
  if (value) return new Style(utility.class, [new Property('font-size', value), new Property('line-height', '1')]).updateMeta('utilities', 'fontSize', pluginOrder.fontSize, 2, true);
}



// https://nailuscss.org/utilities/typography.html#font-family
// https://nailuscss.org/utilities/typography.html#font-weight
export function font(utility: Utility, { theme }: PluginUtils): Output {
  const fonts = theme('fontFamily') as { [key: string]: string | string[] };
  const map: { [key: string]: string } = {};
  for (const [key, value] of Object.entries(fonts)) {
    map[key] = Array.isArray(value) ? value.join(',') : value;
  }
  return (
    utility.handler
      .handleStatic(map)
      .createProperty('font-family')
      ?.updateMeta('utilities', 'fontFamily', pluginOrder.fontFamily, 1, true)
    || utility.handler
      .handleStatic(theme('fontWeight'))
      .handleNumber(0, 900, 'int')
      .handleVariable()
      .createProperty('font-weight')
      ?.updateMeta('utilities', 'fontWeight', pluginOrder.fontWeight, 1, true)
  );
}



// https://nailuscss.org/utilities/typography.html#letter-spacing
export function letterSpacing(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('letterSpacing'))
    .handleSquareBrackets()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .createProperty('letter-spacing')
    ?.updateMeta('utilities', 'letterSpacing', pluginOrder.letterSpacing, 1, true);
}



// https://nailuscss.org/utilities/typography.html#text-decoration
export function textDecoration(utility: Utility, { theme }: PluginUtils): Output {
  return (
    // .decoration-{color}/{opacity}
    utility.handler
      .handleColor(theme('textDecorationColor'))
      .handleOpacity(theme('textDecorationOpacity'))
      .handleSquareBrackets(notNumberLead)
      .handleVariable()
      .createColorStyle(utility.class, ['-webkit-text-decoration-color', 'text-decoration-color'], '--tw-text-decoration-opacity')
      ?.updateMeta('utilities', 'textDecorationColor', pluginOrder.textDecorationColor, 1, true)
    // .decoration-{thickness}
    || utility.handler
      .handleStatic(theme('textDecorationThickness'))
      .handleNumber(0, undefined, 'int', number => `${number}px`)
      .handleSize()
      .createProperty('text-decoration-thickness')
      ?.updateMeta('utilities', 'textDecorationThickness', pluginOrder.textDecorationThickness, 1, true)
  );
}



// https://nailuscss.org/utilities/typography.html#text-decoration
export function textUnderline(utility: Utility, { theme }: PluginUtils): Output {
  // .underline-offset-{offset}
  if (utility.raw.startsWith('underline-offset')) {
    return utility.handler
      .handleStatic(theme('textDecorationOffset'))
      .handleNumber(0, undefined, 'int', number => `${number}px`)
      .handleSize()
      .createProperty('text-underline-offset')
      ?.updateMeta('utilities', 'textDecorationOffset', pluginOrder.textDecorationOffset, 1, true);
  }

  // .underline-opacity-{opacity} - This is a fallback for .decoration-{color}/{opacity}
  if (utility.raw.startsWith('underline-opacity')) {
    return utility.handler
      .handleStatic(theme('textDecorationOpacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-line-opacity')
      ?.updateMeta('utilities', 'textDecorationOpacity', pluginOrder.textDecorationOpacity, 1, true);
  }

  // .underline-{color} - This is a fallback for .decoration-{color} to avoid breaking changes
  // .underline-{thickness} - This is a fallback for .decoration-{thickness} to avoid breaking changes
  return utility.handler
    .handleColor(theme('textDecorationColor'))
    .handleOpacity(theme('opacity'))
    .handleVariable()
    .createColorStyle(utility.class, ['-webkit-text-decoration-color', 'text-decoration-color'], '--tw-line-opacity')
    ?.updateMeta('utilities', 'textDecorationColor', pluginOrder.textDecorationColor, 0, true)
    || utility.handler
      .handleStatic(theme('textDecorationLength'))
      .handleNumber(0, undefined, 'int', (number: number) => `${number}px`)
      .handleSize()
      .createProperty('text-decoration-thickness')
      ?.updateMeta('utilities', 'textDecorationLength', pluginOrder.textDecorationLength, 1, true);
}



// https://nailuscss.org/utilities/typography.html#line-height
export function lineHeight(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('lineHeight'))
    .handleNumber(0, undefined, 'int', (number: number) => `${number * 0.25}rem`)
    .handleSquareBrackets()
    .handleSize()
    .handleVariable()
    .createProperty('line-height')
    ?.updateMeta('utilities', 'lineHeight', pluginOrder.lineHeight, 1, true);
}



// https://nailuscss.org/utilities/behaviors.html#list-style-type
export function listStyleType(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('listStyleType'))
    .createProperty('list-style-type')
    ?.updateMeta('utilities', 'listStyleType', pluginOrder.listStyleType, 1, true);
}



// https://nailuscss.org/utilities/behaviors.html#placeholder-color
// https://nailuscss.org/utilities/behaviors.html#placeholder-opacity
export function placeholder(utility: Utility, { theme, config }: PluginUtils): Output {
  // handle placeholder opacity
  if (utility.raw.startsWith('placeholder-opacity')) {
    return utility.handler
      .handleStatic(theme('placeholderOpacity'))
      .handleSquareBrackets()
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .callback(value => generatePlaceholder(utility.class, new Property('--tw-placeholder-opacity', value), config('prefixer') as boolean)
        .map(style => style.updateMeta('utilities', 'placeholderOpacity', pluginOrder.placeholderOpacity, 1, true)));
  }
  const color = utility.handler
    .handleColor(theme('placeholderColor'))
    .handleOpacity(theme('placeholderOpacity'))
    .handleSquareBrackets()
    .handleVariable()
    .createColorStyle(utility.class, 'color', '--tw-placeholder-opacity');
  if (color) return generatePlaceholder(color.selector || '', color.property, config('prefixer') as boolean).map(i => i.updateMeta('utilities', 'placeholderColor', pluginOrder.placeholderColor, 2, true));
}



// https://nailuscss.org/utilities/behaviors.html#caret-color
// https://nailuscss.org/utilities/behaviors.html#caret-opacity
export function caret(utility: Utility, { theme }: PluginUtils): Output {
  // handle caret opacity
  if (utility.raw.startsWith('caret-opacity')) {
    return utility.handler
      .handleStatic(theme('caretOpacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-caret-opacity')
      ?.updateMeta('utilities', 'caretOpacity', pluginOrder.caretOpacity, 1, true);
  }
  return utility.handler
    .handleColor(theme('caretColor'))
    .handleOpacity(theme('caretOpacity'))
    .handleVariable()
    .createColorStyle(utility.class, 'caret-color', '--tw-caret-opacity')
    ?.updateMeta('utilities', 'caretColor', pluginOrder.caretColor, 0, true);
}



// https://nailuscss.org/utilities/typography.html#tab-size
export function tabSize(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('tabSize'))
    .handleNumber(0, undefined, 'int')
    .handleSize()
    .createProperty(['-moz-tab-size', '-o-tab-size', 'tab-size'])
    ?.updateMeta('utilities', 'tabSize', pluginOrder.tabSize, 1, true);
}



// https://nailuscss.org/utilities/typography.html#text-indent
export function textIndent(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('textIndent'))
    .handleSize()
    .handleFraction()
    .handleNegative()
    .createProperty('text-indent')
    ?.updateMeta('utilities', 'textIndent', pluginOrder.textIndent, 1, true);
}
