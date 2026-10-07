import { pluginOrder } from '../../../packages-engine/config/order';
import { toType } from '../../../utils/tools';
import { Property, Style } from '../../../utils/style';
import { linearGradient } from '../../../utils/style/prefixer';
import type { Utility } from '../handler';
import type { PluginUtils, Output } from '../../../interfaces';
import { notNumberLead } from './helpers';



// https://nailuscss.org/utilities/backgrounds.html#background-color
// https://nailuscss.org/utilities/backgrounds.html#background-opacity
// https://nailuscss.org/utilities/backgrounds.html#background-position
// https://nailuscss.org/utilities/backgrounds.html#background-size
// https://nailuscss.org/utilities/backgrounds.html#background-image
export function background(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  // handle background positions
  const positions = toType(theme('backgroundPosition'), 'object') as { [key: string]: string };
  if (Object.keys(positions).includes(body)) return new Property('background-position', positions[body]).updateMeta('utilities', 'backgroundPosition', pluginOrder.backgroundPosition, 1, true);
  // handle background sizes
  const sizes = toType(theme('backgroundSize'), 'object') as { [key: string]: string };
  if (Object.keys(sizes).includes(body)) return new Property('background-size', sizes[body]).updateMeta('utilities', 'backgroundSize', pluginOrder.backgroundSize, 1, true);
  // handle background image
  const images = toType(theme('backgroundImage'), 'object') as { [key: string]: string };
  if (Object.keys(images).includes(body)) {
    const prefixer = linearGradient(images[body]);
    if (Array.isArray(prefixer)) return new Style(utility.class, prefixer.map((i) => new Property('background-image', i))).updateMeta('utilities', 'backgroundImage', pluginOrder.backgroundImage, 2, true);
    return new Property('background-image', prefixer).updateMeta('utilities', 'backgroundImage', pluginOrder.backgroundImage, 1, true);
  }
  // handle background opacity
  if (utility.raw.startsWith('bg-opacity'))
    return utility.handler
      .handleStatic(theme('backgroundOpacity'))
      .handleSquareBrackets()
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-bg-opacity')
      ?.updateMeta('utilities', 'backgroundOpacity', pluginOrder.backgroundOpacity, 1, true);

  // handle background color
  return utility.handler
    .handleColor(theme('backgroundColor'))
    .handleOpacity(theme('backgroundOpacity'))
    .handleSquareBrackets(notNumberLead)
    .handleVariable()
    .createColorStyle(utility.class, 'background-color', '--tw-bg-opacity')
    ?.updateMeta('utilities', 'backgroundColor', pluginOrder.backgroundColor, 0, true);
}



// https://nailuscss.org/utilities/backgrounds.html#gradient-from
export function gradientColorFrom(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw.startsWith('from-opacity')) {
    return utility.handler
      .handleStatic(theme('opacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-from-opacity')
      ?.updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 2, true);
  }
  const handler = utility.handler.handleColor(theme('gradientColorStops')).handleOpacity(theme('opacity')).handleVariable().handleSquareBrackets();
  if (handler.color || handler.value) {
    return new Style(utility.class, [
      new Property('--tw-gradient-from', handler.createColorValue('var(--tw-from-opacity, 1)')),
      new Property('--tw-gradient-stops', 'var(--tw-gradient-from), var(--tw-gradient-to, rgba(255, 255, 255, 0))'),
    ]).updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 1, true);
  }
}



// https://nailuscss.org/utilities/backgrounds.html#gradient-via
export function gradientColorVia(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw.startsWith('via-opacity')) {
    return utility.handler
      .handleStatic(theme('opacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-via-opacity')
      ?.updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 4, true);
  }
  const handler = utility.handler.handleColor(theme('gradientColorStops')).handleOpacity(theme('opacity')).handleVariable().handleSquareBrackets();
  if (handler.color || handler.value) {
    return new Style(utility.class,
      new Property('--tw-gradient-stops', `var(--tw-gradient-from), ${handler.createColorValue('var(--tw-via-opacity, 1)')}, var(--tw-gradient-to, rgba(255, 255, 255, 0))`)
    )?.updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 3, true);
  }
}



// https://nailuscss.org/utilities/backgrounds.html#gradient-to
export function gradientColorTo(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw.startsWith('to-opacity')) {
    return utility.handler
      .handleStatic(theme('opacity'))
      .handleNumber(0, 100, 'int', (number: number) => (number / 100).toString())
      .handleVariable()
      .createProperty('--tw-to-opacity')
      ?.updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 6, true);
  }
  const handler = utility.handler.handleColor(theme('gradientColorStops')).handleOpacity(theme('opacity')).handleVariable().handleSquareBrackets();
  if (handler.color || handler.value) {
    return new Style(utility.class,
      new Property('--tw-gradient-to', handler.createColorValue('var(--tw-to-opacity, 1)'))
    )?.updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 5, true);
  }
}
