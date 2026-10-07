import { pluginOrder } from '../../../packages-engine/config/order';
import { toType } from '../../../utils/tools';
import { Property, Style } from '../../../utils/style';
import type { Utility } from '../handler';
import type { PluginUtils, Output } from '../../../interfaces';
import { notNumberLead } from './helpers';



// https://nailuscss.org/utilities/behaviors.html#cursor
export function cursor(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  const cursors = toType(theme('cursor'), 'object') as { [key: string]: string };
  if (Object.keys(cursors).includes(body)) return new Property('cursor', cursors[body]).updateMeta('utilities', 'cursor', pluginOrder.cursor, 1, true);
}



// https://nailuscss.org/utilities/borders/outline.html
export function outline(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw.startsWith('outline-offset')) {
    return utility.handler
      .handleStatic(theme('outlineOffset'))
      .handleNumber(0, undefined, 'int')
      .handleVariable()
      .handleSquareBrackets()
      .createProperty('outline-offset')
      ?.updateMeta('utilities', 'outline', pluginOrder.outline, 0, true);
  }

  if (utility.raw.startsWith('outline-opacity')) {
    return utility.handler
      .handleStatic(theme('opacity'))
      .handleNumber(0, 1, 'float')
      .handleVariable()
      .handleSquareBrackets()
      .createProperty('--tw-outline-opacity')
      ?.updateMeta('utilities', 'outline', pluginOrder.outline, 1, true);
  }

  const outlineColor = utility.handler
    .handleColor(theme('outlineColor'))
    .handleOpacity(theme('opacity'))
    .handleSquareBrackets(notNumberLead)
    .handleVariable((variable: string) => utility.raw.startsWith('outline-$') ? `var(--${variable})` : undefined)
    .createColorStyle(utility.class, 'outline-color', '--tw-outline-opacity')
    ?.updateMeta('utilities', 'outline', pluginOrder.outline, 2, true);

  if (outlineColor) return outlineColor;

  return utility.handler
    .handleStatic(theme('outlineWidth'))
    .handleNumber(0, undefined, 'float', (number: number) => `${number}px`)
    .handleSquareBrackets()
    .handleVariable()
    .createProperty('outline-width')
    ?.updateMeta('utilities', 'outline', pluginOrder.outline, 3, true);
}



// https://nailuscss.org/utilities/svg.html#fill-color
export function fill(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw.startsWith('fill-opacity')) {
    return utility.handler
      .handleStatic(theme('opacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-fill-opacity')
      ?.updateMeta('utilities', 'fill', pluginOrder.ringOffsetColor, 2, true);
  }
  return utility.handler
    .handleColor(theme('fill'))
    .handleOpacity(theme('opacity'))
    .handleSquareBrackets()
    .handleVariable()
    .createColorStyle(utility.class, 'fill', '--tw-fill-opacity')
    ?.updateMeta('utilities', 'fill', pluginOrder.fill, 1, true);
}



// https://nailuscss.org/utilities/svg.html#stroke-color
// https://nailuscss.org/utilities/svg.html#stroke-width
export function stroke(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw.startsWith('stroke-dash')) {
    return utility.handler.handleNumber().createProperty('stroke-dasharray')?.updateMeta('utilities', 'strokeDashArray', pluginOrder.strokeDashArray, 0, true);
  }
  if (utility.raw.startsWith('stroke-offset')) {
    return utility.handler.handleNumber().createProperty('stroke-dashoffset')?.updateMeta('utilities', 'strokeDashOffset', pluginOrder.strokeDashOffset, 0, true);
  }

  if (utility.raw.startsWith('stroke-opacity')) {
    return utility.handler
      .handleStatic(theme('opacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-stroke-opacity')
      ?.updateMeta('utilities', 'stroke', pluginOrder.stroke, 2, true);
  }
  return utility.handler
    .handleColor(theme('stroke'))
    .handleOpacity(theme('opacity'))
    .handleVariable()
    .handleSquareBrackets()
    .createColorStyle(utility.class, 'stroke', '--tw-stroke-opacity')
    ?.updateMeta('utilities', 'stroke', pluginOrder.stroke, 1, true)
    || (utility.raw.startsWith('stroke-$')
      ? utility.handler
        .handleVariable()
        .createProperty('stroke-width')
        ?.updateMeta('utilities', 'strokeWidth', pluginOrder.strokeWidth, 2, true)
      : utility.handler
        .handleStatic(theme('strokeWidth'))
        .handleNumber(0, undefined, 'int')
        .createProperty('stroke-width')
        ?.updateMeta('utilities', 'strokeWidth', pluginOrder.strokeWidth, 1, true)
    );
}



export function content(utility: Utility, { theme }: PluginUtils): Output {
  if (!/^content-(?!$)/.test(utility.raw))
    return;
  return utility.handler
    .handleBody(theme('content'))
    .handleSquareBrackets()
    .handleVariable()
    .handleString((string) => `"${string}"`)
    .createProperty('content')
    ?.updateMeta('utilities', 'content', pluginOrder.content, 1, true);
}



// https://nailuscss.org/utilities/behaviors.html#accent-color
export function accent(utility: Utility, { theme }: PluginUtils): Output {
  const color = utility.handler
    .handleColor(theme('boxShadowColor'))
    .handleOpacity(theme('opacity'))
    .handleSquareBrackets()
    .handleVariable()
    .createColorValue('1');

  return new Style(utility.class, new Property('accent-color', color))
    .updateMeta('utilities', 'accentColor', pluginOrder.accentColor, 0, true);
}
