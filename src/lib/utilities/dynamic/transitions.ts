import { pluginOrder } from '../../../packages-engine/config/order';
import { toType } from '../../../utils/tools';
import { Property, Style, Keyframes } from '../../../utils/style';
import type { Utility } from '../handler';
import type { PluginUtils, Output } from '../../../interfaces';



// https://nailuscss.org/utilities/transitions.html#transition-property
export function transition(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  const props = toType(theme('transitionProperty'), 'object') as { [key: string]: string };
  for (const [key, value] of Object.entries(props)) {
    if (body === key || (body === '' && key === 'DEFAULT')) {
      if (value === 'none') return new Property(['-webkit-transition-property', '-o-transition-property', 'transition-property'], 'none').updateMeta('utilities', 'transitionProperty', pluginOrder.transitionProperty, 1, true);
      return new Style(utility.class, [
        new Property('-webkit-transition-property', value.replace(/(?=(transform|box-shadow))/g, '-webkit-')),
        new Property('-o-transition-property', value),
        new Property('transition-property', value.replace(/transform/g, 'transform, -webkit-transform').replace(/box-shadow/g, 'box-shadow, -webkit-box-shadow')),
        new Property(['-webkit-transition-timing-function', '-o-transition-timing-function', 'transition-timing-function'], toType(theme('transitionTimingFunction.DEFAULT'), 'string') ?? 'cubic-bezier(0.4, 0, 0.2, 1)'),
        new Property(['-webkit-transition-duration', '-o-transition-duration', 'transition-duration'], toType(theme('transitionDuration.DEFAULT'), 'string') ?? '150ms'),
      ]).updateMeta('utilities', 'transitionProperty', pluginOrder.transitionProperty, 2, true);
    }
  }
}



// https://nailuscss.org/utilities/transitions.html#transition-duration
export function duration(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('transitionDuration'))
    .handleSquareBrackets()
    .handleTime(0, undefined, 'float')
    .handleNumber(0, undefined, 'int', (number: number) => `${number}ms`)
    .handleVariable()
    .createProperty(['-webkit-transition-duration', '-o-transition-duration', 'transition-duration'])
    ?.updateMeta('utilities', 'transitionDuration', pluginOrder.transitionDuration, 1, true);
}



// https://nailuscss.org/utilities/transitions.html#transition-timing-function
export function transitionTimingFunction(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('transitionTimingFunction'))
    .createProperty(['-webkit-transition-timing-function', '-o-transition-timing-function', 'transition-timing-function'])
    ?.updateMeta('utilities', 'transitionTimingFunction', pluginOrder.transitionTimingFunction, 1, true);
}



// https://nailuscss.org/utilities/transitions.html#transition-delay
export function delay(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('transitionDelay'))
    .handleSquareBrackets()
    .handleTime(0, undefined, 'float')
    .handleNumber(0, undefined, 'int', (number: number) => `${number}ms`)
    .handleVariable()
    .createProperty(['-webkit-transition-delay', '-o-transition-delay', 'transition-delay'])
    ?.updateMeta('utilities', 'transitionDelay', pluginOrder.transitionDelay, 0, true);
}



// https://nailuscss.org/utilities/behaviors.html#animation
export function animation(utility: Utility, { theme, config }: PluginUtils): Output {
  const body = utility.body;
  if (utility.raw.startsWith('animate-ease')) {
    return utility.clone(utility.raw.slice(8)).handler
      .handleBody(theme('animationTimingFunction'))
      .handleSquareBrackets()
      .createProperty(['-webkit-animation-timing-function', 'animation-timing-function'])
      ?.updateMeta('utilities', 'animation', pluginOrder.animation, 20, true);
  }
  if (utility.raw.startsWith('animate-duration')) {
    return utility.clone(utility.raw.slice(8)).handler
      .handleStatic(theme('animationDuration'))
      .handleSquareBrackets()
      .handleTime(0, undefined, 'float')
      .handleNumber(0, undefined, 'int', (number: number) => `${number}ms`)
      .handleVariable()
      .createProperty(['-webkit-animation-duration', 'animation-duration'])
      ?.updateMeta('utilities', 'animation', pluginOrder.animation, 21, true);
  }
  if (utility.raw.startsWith('animate-delay')) {
    return utility.clone(utility.raw.slice(8)).handler
      .handleStatic(theme('animationDelay'))
      .handleSquareBrackets()
      .handleTime(0, undefined, 'float')
      .handleNumber(0, undefined, 'int', (number: number) => `${number}ms`)
      .handleVariable()
      .createProperty(['-webkit-animation-delay', 'animation-delay'])
      ?.updateMeta('utilities', 'animation', pluginOrder.animation, 22, true);
  }
  const animateIterationCount = utility.handler.handleBody(theme('animationIterationCount')).handleNumber(0, undefined, 'int').handleSquareBrackets().value;
  if (animateIterationCount) return new Property(['-webkit-animation-iteration-count', 'animation-iteration-count'], animateIterationCount).updateMeta('utilities', 'animation', pluginOrder.animation, 23, true);
  const animations = toType(theme('animation'), 'object') as { [key: string]: string | { [key: string]: string } };
  if (Object.keys(animations).includes(body)) {
    let value = animations[body];
    const prop = config('prefixer') ? ['-webkit-animation', 'animation'] : 'animation';
    if (value === 'none') return new Property(prop, 'none').updateMeta('utilities', 'animation', pluginOrder.animation, 1, true);
    let styles, keyframe;
    if (typeof value === 'string') {
      keyframe = value.match(/^\w+/)?.[0];
      styles = [new Style(utility.class, new Property(prop, value))];
    } else {
      keyframe = value['animation'] || value['animationName'] || value['animation-name'];
      if (config('prefixer')) {
        const props: { [key: string]: string } = {};
        for (const [k, v] of Object.entries(value)) {
          if (k.startsWith('animation') || k.startsWith('backface')) {
            props['-webkit-' + k] = v;
          } else if (k.startsWith('transform')) {
            props['-webkit-' + k] = v;
            props['-ms-' + k] = v;
          }
          props[k] = v;
        }
        value = props;
      }
      styles = Style.generate(utility.class, value).map(i => i.updateMeta('utilities', 'animation', pluginOrder.animation, 2, true));
    }

    if (styles) {
      return [
        ...styles.map(i => i.updateMeta('utilities', 'animation', pluginOrder.animation, 2, true)),
        ...keyframe ? Keyframes.generate(
          keyframe,
          (theme(`keyframes.${keyframe}`) ?? {}) as { [key: string]: { [key: string]: string } },
          undefined,
          config('prefixer', false) as boolean
        ).map(i => i.updateMeta('utilities', 'keyframes', pluginOrder.keyframes, 1, true)) : [],
      ];
    }
  }
}
