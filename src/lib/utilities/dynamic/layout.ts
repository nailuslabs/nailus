import { pluginOrder } from '../../../packages-engine/config/order';
import { dashToCamel, toType } from '../../../utils/tools';
import { Property, Style, Container } from '../../../utils/style';
import { minMaxContent } from '../../../utils/style/prefixer';
import { isString, expandDirection } from '../../../utils/helpers';
import type { Utility } from '../handler';
import type { PluginUtils, Output } from '../../../interfaces';



// https://nailuscss.org/utilities/container.html
export function container(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === 'container') {
    const className = utility.class;
    const baseStyle = new Container(utility.class, new Property('width', '100%'));
    const paddingDefault = toType(theme('container.padding'), 'string') ? toType(theme('container.padding'), 'string') : toType(theme('container.padding.DEFAULT'), 'string');

    if (paddingDefault) {
      baseStyle.add(new Property('padding-left', paddingDefault));
      baseStyle.add(new Property('padding-right', paddingDefault));
    }

    const center = theme('container.center');

    if (center && typeof center === 'boolean') {
      baseStyle.add(new Property(['margin-left', 'margin-right'], 'auto'));
    }

    const output: Container[] = [baseStyle];
    const screens = toType(theme('container.screens', theme('screens')), 'object');

    for (const [screen, size] of Object.entries(screens)) {
      if (!isString(size)) continue;
      const props = [new Property('max-width', `${size}`)];
      const padding = theme(`container.padding.${screen}`);
      if (padding && typeof padding === 'string') {
        props.push(new Property('padding-left', padding));
        props.push(new Property('padding-right', padding));
      }
      output.push(new Container(className, props).atRule(`@media (min-width: ${size})`));
    }

    output.forEach(style => style.updateMeta('utilities', 'container', pluginOrder.container, 0, true));

    return output;
  }
}



// https://nailuscss.org/utilities/positioning.html#object-position
export function objectPosition(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleBody(theme('objectPosition'))
    .createProperty(['-o-object-position', 'object-position'])
    ?.updateMeta('utilities', 'objectPosition', pluginOrder.objectPosition, 0, true);
}



// https://nailuscss.org/utilities/positioning.html#top-right-bottom-left
export function inset(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('inset'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .callback(value => {
      switch (utility.identifier) {
      case 'top':
      case 'right':
      case 'bottom':
      case 'left':
        return new Property(utility.identifier, value).updateMeta('utilities', 'inset', pluginOrder.inset, 4, true);
      case 'inset':
        if (utility.raw.match(/^-?inset-x/)) return new Property(['right', 'left'], value).updateMeta('utilities', 'inset', pluginOrder.inset, 3, true);
        if (utility.raw.match(/^-?inset-y/)) return new Property(['top', 'bottom'], value).updateMeta('utilities', 'inset', pluginOrder.inset, 2, true);
        return new Property(['top', 'right', 'bottom', 'left'], value).updateMeta('utilities', 'inset', pluginOrder.inset, 1, true);
      }
    });
}



// https://nailuscss.org/utilities/positioning.html#z-index
export function zIndex(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('zIndex'))
    .handleNumber(0, 99999, 'int')
    .handleNegative()
    .handleVariable()
    .createProperty('z-index')
    ?.updateMeta('utilities', 'zIndex', pluginOrder.zIndex, 0, true);
}



// https://nailuscss.org/utilities/flexbox.html#flex
// https://nailuscss.org/utilities/flexbox.html#flex-grow
// https://nailuscss.org/utilities/flexbox.html#flex-shrink
export function flex(utility: Utility, { theme }: PluginUtils): Output {
  const className = utility.raw;
  if (className.startsWith('flex-grow')) {
    const map = toType(theme('flexGrow'), 'object') as { [key: string]: string };
    const amount = className.replace(/flex-grow-?/, '') || 'DEFAULT';
    if (Object.keys(map).includes(amount)) return new Property(['-webkit-box-flex', '-ms-flex-positive', '-webkit-flex-grow', 'flex-grow'], map[amount]).toStyle(utility.class).updateMeta('utilities', 'flexGrow', pluginOrder.flexGrow, 0, true);
    return utility.handler.handleSquareBrackets().createProperty(['-webkit-box-flex', '-ms-flex-positive', '-webkit-flex-grow', 'flex-grow'])?.updateMeta('utilities', 'flexGrow', pluginOrder.flexGrow, 1, true);
  } else if (className.startsWith('flex-shrink')) {
    const map = toType(theme('flexShrink'), 'object') as { [key: string]: string };
    const amount = className.replace(/flex-shrink-?/, '') || 'DEFAULT';
    if (Object.keys(map).includes(amount)) return new Property(['-ms-flex-negative', '-webkit-flex-shrink', 'flex-shrink'], map[amount]).toStyle(utility.class).updateMeta('utilities', 'flexShrink', pluginOrder.flexShrink, 0, true);
    return utility.handler.handleSquareBrackets().createProperty(['-ms-flex-negative', '-webkit-flex-shrink', 'flex-shrink'])?.updateMeta('utilities', 'flexShrink', pluginOrder.flexShrink, 1, true);
  } else {
    return utility.handler.handleStatic(theme('flex')).handleSquareBrackets().createStyle(utility.class, value => {
      value = value.trim();
      return [
        new Property('-webkit-box-flex', value.startsWith('0') || value === 'none' ? '0' : '1'),
        new Property(['-ms-flex', '-webkit-flex', 'flex'], value),
      ];
    })?.updateMeta('utilities', 'flex', pluginOrder.flex, 0, true);
  }
}



// https://nailuscss.org/utilities/flexbox.html#flex-basis
export function basis(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('spacing'))
    .handleNumber(1, Infinity, undefined, number => `${number / 4}rem`)
    .handleSize()
    .handleFraction()
    .handleVariable()
    .handleSquareBrackets()
    .createProperty('flex-basis')
    ?.updateMeta('utilities', 'flexBasis', pluginOrder.flexBasis, 1, true);
}



// https://nailuscss.org/utilities/positioning.html#order
export function order(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('order'))
    .handleNumber(1, 9999, 'int')
    .handleNegative()
    .handleVariable()
    .createStyle(utility.class, (value) => [
      new Property('-webkit-box-ordinal-group', value.includes('var') ? `calc(${value}+1)` : (parseInt(value) + 1).toString()),
      new Property(['-webkit-order', '-ms-flex-order', 'order'], value),
    ])
    ?.updateMeta('utilities', 'order', pluginOrder.order, utility.raw.charAt(0) === '-' ? 2 : 1, true);
}



// https://nailuscss.org/utilities/grid.html#grid-template-columns
// https://nailuscss.org/utilities/grid.html#grid-template-rows
export function gridTemplate(utility: Utility, { theme }: PluginUtils): Output {
  const type = utility.raw.match(/^grid-rows-/) ? 'rows' : utility.raw.match(/^grid-cols-/) ? 'columns' : undefined;
  if (!type) return;
  const group = type === 'rows' ? 'gridTemplateRows' : 'gridTemplateColumns';
  return utility.handler
    .handleStatic(theme(group))
    .handleSquareBrackets(i => i
      .replace(/\(.*?\)|,/g, (r) => r === ',' ? ' ' : r /* ignore content inside nested-brackets */)
      .replace(/_/g, ' ')
    )
    .createProperty(`grid-template-${type}`, (value) => value === 'none' ? 'none' : value)
    ?.updateMeta('utilities', group, pluginOrder[group], 1, true)
    || utility.handler
      .handleNumber(1, undefined, 'int')
      .handleVariable()
      .createProperty(`grid-template-${type}`, (value) => `repeat(${value}, minmax(0, 1fr))`)
      ?.updateMeta('utilities', group, pluginOrder[group], 2, true);
}



// https://nailuscss.org/utilities/grid.html#grid-column-span
// https://nailuscss.org/utilities/grid.html#grid-column-start
// https://nailuscss.org/utilities/grid.html#grid-column-end
export function gridColumn(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  // col span
  const spans = toType(theme('gridColumn'), 'object') as { [key: string]: string };
  if (Object.keys(spans).includes(body)) return new Property(['-ms-grid-column-span', 'grid-column'], spans[body]).updateMeta('utilities', 'gridColumn', pluginOrder.gridColumn, 1, true);
  if (utility.raw.startsWith('col-span')) {
    return utility.handler
      .handleNumber(1, undefined, 'int')
      .handleVariable()
      .createProperty(['-ms-grid-column-span', 'grid-column'], (value) => `span ${value} / span ${value}`)
      ?.updateMeta('utilities', 'gridColumn', pluginOrder.gridColumn, 1, true);
  }
  // col end
  if (utility.raw.startsWith('col-end')) {
    return utility.handler
      .handleStatic(theme('gridColumnEnd'))
      .handleSquareBrackets()
      .handleNumber(1, undefined, 'int')
      .handleVariable()
      .createProperty('grid-column-end')
      ?.updateMeta('utilities', 'gridColumnEnd', pluginOrder.gridColumnEnd, 1, true);
  }
  // col start
  if (utility.raw.startsWith('col-start')) {
    return utility.handler
      .handleStatic(theme('gridColumnStart'))
      .handleSquareBrackets()
      .handleNumber(1, undefined, 'int')
      .handleVariable()
      .createProperty('grid-column-start')
      ?.updateMeta('utilities', 'gridColumnStart', pluginOrder.gridColumnStart, 1, true);
  }
  return utility.handler
    .handleSquareBrackets()
    .createProperty(['-ms-grid-column-span', 'grid-column'], (value) => `span ${value} / span ${value}`)
    ?.updateMeta('utilities', 'gridColumn', pluginOrder.gridColumn, 1, true);
}



// https://nailuscss.org/utilities/grid.html#grid-row-span
// https://nailuscss.org/utilities/grid.html#grid-row-start
// https://nailuscss.org/utilities/grid.html#grid-row-end
export function gridRow(utility: Utility, { theme }: PluginUtils): Output {
  const body = utility.body;
  // row span
  const spans = toType(theme('gridRow'), 'object') as { [key: string]: string };
  if (Object.keys(spans).includes(body)) return new Property(['-ms-grid-row-span', 'grid-row'], spans[body]).updateMeta('utilities', 'gridRow', pluginOrder.gridRow, 1, true);
  if (utility.raw.startsWith('row-span')) {
    return utility.handler
      .handleNumber(1, undefined, 'int')
      .handleVariable()
      .createProperty(['-ms-grid-row-span', 'grid-row'], (value: string) => `span ${value} / span ${value}`)
      ?.updateMeta('utilities', 'gridRow', pluginOrder.gridRow, 2, true);
  }
  // row end
  if (utility.raw.startsWith('row-end')) {
    return utility.handler
      .handleStatic(theme('gridRowEnd'))
      .handleSquareBrackets()
      .handleNumber(1, undefined, 'int')
      .handleVariable()
      .createProperty('grid-row-end')
      ?.updateMeta('utilities', 'gridRowEnd', pluginOrder.gridRowEnd, 1, true);
  }
  // row start
  if (utility.raw.startsWith('row-start')) {
    return utility.handler
      .handleStatic(theme('gridRowStart'))
      .handleSquareBrackets()
      .handleNumber(1, undefined, 'int')
      .handleVariable()
      .createProperty('grid-row-start')
      ?.updateMeta('utilities', 'gridRowStart', pluginOrder.gridRowStart, 1, true);
  }
  return utility.handler
    .handleSquareBrackets()
    .createProperty(['-ms-grid-row-span', 'grid-row'], (value: string) => `span ${value} / span ${value}`)
    ?.updateMeta('utilities', 'gridRow', pluginOrder.gridRow, 2, true);
}



// https://nailuscss.org/utilities/grid.html#grid-auto-columns
// https://nailuscss.org/utilities/grid.html#grid-auto-rows
export function gridAuto(utility: Utility, { theme }: PluginUtils): Output {
  const type = utility.raw.startsWith('auto-cols') ? 'columns' : utility.raw.startsWith('auto-rows') ? 'rows' : undefined;
  if (!type) return;
  const group = type === 'columns' ? 'gridAutoColumns' : 'gridAutoRows';
  const value = utility.handler.handleStatic(theme(group)).value;
  if (value) {
    const prefixer = minMaxContent(value);
    if (typeof prefixer === 'string') return new Property(`grid-auto-${type}`, prefixer).updateMeta('utilities', group, pluginOrder[group], 1, true);
    return new Style(utility.class, prefixer.map((i) => new Property(`grid-auto-${type}`, i))).updateMeta('utilities', group, pluginOrder[group], 2, true);
  }
}



// https://nailuscss.org/utilities/grid.html#gap
export function gap(utility: Utility, { theme, config }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('gap'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleSize()
    .handleVariable()
    .callback(value => {
      if (utility.raw.match(/^gap-x-/)) return new Property(config('prefixer') ? ['-webkit-column-gap', '-moz-column-gap', 'grid-column-gap', 'column-gap'] : 'column-gap', value).updateMeta('utilities', 'gap', pluginOrder.gap, 2, true);
      if (utility.raw.match(/^gap-y-/)) return new Property(config('prefixer') ? ['-webkit-row-gap', '-moz-row-gap', 'grid-row-gap', 'row-gap'] : 'row-gap', value).updateMeta('utilities', 'gap', pluginOrder.gap, 3, true);
      return new Property(config('prefixer') ? ['grid-gap', 'gap'] : 'gap', value).updateMeta('utilities', 'gap', pluginOrder.gap, 1, true);
    });
}



// https://nailuscss.org/utilities/columns.html
export function columns(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('columns'))
    .handleSquareBrackets()
    .handleSize()
    .handleNxl((number: number) => `${(number - 3) * 8 + 48}rem`)
    .handleVariable()
    .createProperty('columns')
    ?.updateMeta('utilities', 'columns', pluginOrder.columns, 1, true);
}



// https://nailuscss.org/utilities/spacing.html#padding
export function padding(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('padding'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleVariable()
    .callback(value => {
      const directions = expandDirection(utility.identifier.substring(1), false);
      if (directions) {
        if (directions[0] === '*') return new Property('padding', value).updateMeta('utilities', 'padding', pluginOrder.padding, -4, true);
        return new Property(directions.map((i) => `padding-${i}`), value).updateMeta('utilities', 'padding', pluginOrder.padding, -directions.length, true);
      }
    });
}



// https://nailuscss.org/utilities/spacing.html#margin
export function margin(utility: Utility, { theme }: PluginUtils): Output {
  return utility.handler
    .handleStatic(theme('margin'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .callback(value => {
      const directions = expandDirection(utility.identifier.substring(1), false);
      if (directions) {
        if (directions[0] === '*') return new Property('margin', value).updateMeta('utilities', 'margin', pluginOrder.margin, -4, true);
        return new Property(directions.map((i) => `margin-${i}`), value).updateMeta('utilities', 'margin', pluginOrder.margin, -directions.length, true);
      }
    });
}



// https://nailuscss.org/utilities/spacing.html#space-between-y
export function space(utility: Utility, { theme }: PluginUtils): Output {
  if (utility.raw === 'space-x-reverse') {
    return new Style(utility.class, [
      new Property('--tw-space-x-reverse', '1'),
    ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, 6, true);
  }
  if (utility.raw === 'space-y-reverse') {
    return new Style(utility.class, [
      new Property('--tw-space-y-reverse', '1'),
    ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, 5, true);
  }
  return utility.handler
    .handleStatic(theme('space'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .callback(value => {
      if (utility.raw.match(/^-?space-x-/)) {
        return new Style(utility.class, [
          new Property('--tw-space-x-reverse', '0'),
          new Property('margin-right', `calc(${value} * var(--tw-space-x-reverse))`),
          new Property('margin-left', `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`),
        ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, (utility.raw.charAt(0) === '-' ? 4 : 2), true);
      }
      if (utility.raw.match(/^-?space-y-/)) {
        return new Style(utility.class, [
          new Property('--tw-space-y-reverse', '0'),
          new Property('margin-top', `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`),
          new Property('margin-bottom', `calc(${value} * var(--tw-space-y-reverse))`),
        ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, (utility.raw.charAt(0) === '-' ? 3 : 1), true);
      }
    });
}



// https://nailuscss.org/utilities/sizing.html#width
// https://nailuscss.org/utilities/sizing.html#height
export function size(utility: Utility, { theme }: PluginUtils): Output {
  const name = utility.identifier === 'w' ? 'width' : 'height';
  const body = utility.body;
  const sizes = toType(theme(name), 'object') as { [key: string]: string };
  // handle static
  if (Object.keys(sizes).includes(body)) {
    const value = sizes[body];
    if (value === 'min-content') {
      return new Style(utility.class, [
        new Property(name, '-webkit-min-content'),
        new Property(name, '-moz-min-content'),
        new Property(name, 'min-content'),
      ]).updateMeta('utilities', name, pluginOrder[name], 2, true);
    }
    if (value === 'max-content') {
      return new Style(utility.class, [
        new Property(name, '-webkit-max-content'),
        new Property(name, '-moz-max-content'),
        new Property(name, 'max-content'),
      ]).updateMeta('utilities', name, pluginOrder[name], 3, true);
    }
    return new Style(utility.class, new Property(name, value)).updateMeta('utilities', name, pluginOrder[name], 1, true);
  }
  return utility.handler
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNxl((number: number) => `${(number - 3) * 8 + 48}rem`)
    .handleVariable()
    .createProperty(name)
    ?.updateMeta('utilities', name, pluginOrder[name], 4, true);
}



// https://nailuscss.org/utilities/sizing.html#min-width
// https://nailuscss.org/utilities/sizing.html#min-height
// https://nailuscss.org/utilities/sizing.html#max-width
// https://nailuscss.org/utilities/sizing.html#max-height
export function minMaxSize(utility: Utility, { theme }: PluginUtils): Output {
  if (!utility.raw.match(/^(min|max)-[w|h]-/))
    return;
  const body = utility.raw.replace(/^(min|max)-[w|h]-/, '');
  const prop = utility.raw.substring(0, 5).replace('h', 'height').replace('w', 'width');
  const group = dashToCamel(prop) as ('minHeight' | 'maxHeight' | 'minWidth' | 'maxWidth');
  const sizes = toType(theme(group), 'object') as { [key: string]: string };
  // handle static
  if (Object.keys(sizes).includes(body)) {
    const value = sizes[body];
    if (value === 'min-content') {
      return new Style(utility.class, [
        new Property(prop, '-webkit-min-content'),
        new Property(prop, '-moz-min-content'),
        new Property(prop, 'min-content'),
      ]).updateMeta('utilities', group, pluginOrder[group], 2, true);
    }
    if (value === 'max-content') {
      return new Style(utility.class, [
        new Property(prop, '-webkit-max-content'),
        new Property(prop, '-moz-max-content'),
        new Property(prop, 'max-content'),
      ]).updateMeta('utilities', group, pluginOrder[group], 3, true);
    }
    return new Style(utility.class, new Property(prop, value)).updateMeta('utilities', group, pluginOrder[group], 1, true);
  }

  return utility.handler
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNxl((number: number) => `${(number - 3) * 8 + 48}rem`)
    .handleVariable()
    .createProperty(prop)
    ?.updateMeta('utilities', group, pluginOrder[group], 4, true);
}
