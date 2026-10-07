import { pluginOrder } from '../../../packages-engine/config/order';
import { toType } from '../../../utils/tools';
import { Property } from '../../../utils/style';
import type { Utility } from '../handler';
import type { PluginUtils, Output } from '../../../interfaces';



// https://nailuscss.org/utilities/transforms.html#transform-origin
export function transformOrigin(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  const origins = toType(theme('transformOrigin'), 'object') as { [key: string]: string };
  if (Object.keys(origins).includes(body)) return new Property(['-webkit-transform-origin', '-ms-transform-origin', 'transform-origin'], origins[body]).updateMeta('utilities', 'transformOrigin', pluginOrder.transformOrigin, 0, true);
}



// https://nailuscss.org/utilities/transforms.html#transform-scale
export function scale(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('scale'))
    .handleNumber(0, undefined, 'int', (number: number) => (number / 100).toString())
    .handleVariable()
    .callback(value => {
      if (utility.raw.startsWith('scale-x')) return new Property('--tw-scale-x', value).updateMeta('utilities', 'scale', pluginOrder.scale, 2, true);
      if (utility.raw.startsWith('scale-y')) return new Property('--tw-scale-y', value).updateMeta('utilities', 'scale', pluginOrder.scale, 3, true);
      if (utility.raw.startsWith('scale-z')) return new Property('--tw-scale-z', value).updateMeta('utilities', 'scale', pluginOrder.scale, 4, true);
      return new Property(['--tw-scale-x', '--tw-scale-y', '--tw-scale-z'], value).updateMeta('utilities', 'scale', pluginOrder.scale, 1, true);
    });
}



// https://nailuscss.org/utilities/transforms.html#transform-rotate
export function rotate(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('rotate'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'float', (number: number) => `${number}deg`)
    .handleNegative()
    .handleVariable()
    .callback(value => {
      const abs = utility.absolute;
      if (abs.startsWith('rotate-x')) return new Property('--tw-rotate-x', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 2, true);
      if (abs.startsWith('rotate-y')) return new Property('--tw-rotate-y', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 3, true);
      if (abs.startsWith('rotate-z')) return new Property('--tw-rotate-z', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 4, true);
      return new Property('--tw-rotate', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 1, true);
    });
}



// https://nailuscss.org/utilities/transforms.html#transform-translate
export function translate(utility: Utility, { theme }: PluginUtils): Output {
  const centerMatch = utility.raw.match(/^-?translate-[x|y|z]/);
  if (centerMatch) {
    const center = centerMatch[0].replace(/^-?translate-/, '');
    return utility.handler
      .handleStatic(theme('translate'))
      .handleSquareBrackets()
      .handleSpacing()
      .handleFraction()
      .handleSize()
      .handleNegative()
      .handleVariable()
      .createProperty(`--tw-translate-${center}`)
      ?.updateMeta('utilities', 'translate', pluginOrder.translate, utility.raw.charAt(0) === '-' ? 2 : 1, true);
  }
}



// https://nailuscss.org/utilities/transforms.html#transform-skew
export function skew(utility: Utility, { theme }: PluginUtils): Output {
  const centerMatch = utility.raw.match(/^-?skew-[x|y]/);
  if (centerMatch) {
    const center = centerMatch[0].replace(/^-?skew-/, '');
    return utility.handler
      .handleStatic(theme('skew'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'float', (number: number) => `${number}deg`)
      .handleNegative()
      .handleVariable()
      .createProperty(`--tw-skew-${center}`)
      ?.updateMeta('utilities', 'skew', pluginOrder.skew, utility.raw.charAt(0) === '-' ? 2 : 1, true);
  }
}



// https://nailuscss.org/utilities/transforms.html#perspective
export function perspective(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw.startsWith('perspect-origin')) {
    const origin = utility.clone('perspectOrigin' + utility.raw.slice(15)).handler
      .handleBody(theme('perspectiveOrigin'))
      .handleSquareBrackets()
      .createProperty(['-webkit-perspective-origin', 'perspective-origin'])
      ?.updateMeta('utilities', 'perspectiveOrigin', pluginOrder.perspectiveOrigin, 0, true);
    if (origin) return origin;
  }
  return utility.handler
    .handleStatic(theme('perspective'))
    .handleNumber(0, undefined, 'int', number => `${number}px`)
    .handleSize()
    .handleSquareBrackets()
    .createProperty(['-webkit-perspective', 'perspective'])
    ?.updateMeta('utilities', 'perspective', pluginOrder.perspective, 0, true);
}
