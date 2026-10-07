import type { StaticUtility } from './types';

export const staticUtilities: StaticUtility = {
  // https://nailuscss.org/utilities/behaviors.html#box-decoration-break
  'decoration-slice': {
    'utility': {
      '-webkit-box-decoration-break': 'slice',
      'box-decoration-break': 'slice',
    },
    'meta': {
      'group': 'boxDecorationBreak',
      'order': 1,
    },
  },

  'decoration-clone': {
    'utility': {
      '-webkit-box-decoration-break': 'clone',
      'box-decoration-break': 'clone',
    },
    'meta': {
      'group': 'boxDecorationBreak',
      'order': 2,
    },
  },

  // https://nailuscss.org/utilities/flexbox.html#flex-basis
  'basis-auto': {
    'utility': {
      'flex-basis': 'auto',
    },
    'meta': {
      'group': 'flexBasis',
      'order': 1,
    },
  },
  'basis-full': {
    'utility': {
      'flex-basis': '100%',
    },
    'meta': {
      'group': 'flexBasis',
      'order': 2,
    },
  },

  // https://nailuscss.org/utilities/sizing.html#box-sizing
  'box-border': {
    'utility': {
      '-webkit-box-sizing': 'border-box',
      'box-sizing': 'border-box',
    },
    'meta': {
      'group': 'boxSizing',
      'order': 1,
    },
  },
  'box-content': {
    'utility': {
      '-webkit-box-sizing': 'content-box',
      'box-sizing': 'content-box',
    },
    'meta': {
      'group': 'boxSizing',
      'order': 2,
    },
  },

  // https://nailuscss.org/utilities/display.html
  'block': {
    'utility': {
      'display': 'block',
    },
    'meta': {
      'group': 'display',
      'order': 1,
    },
  },
  'inline-block': {
    'utility': {
      'display': 'inline-block',
    },
    'meta': {
      'group': 'display',
      'order': 2,
    },
  },
  'inline': {
    'utility': {
      'display': 'inline',
    },
    'meta': {
      'group': 'display',
      'order': 3,
    },
  },

  // https://nailuscss.org/utilities/flexbox.html
  'flex': {
    'utility': {
      'display': [
        '-webkit-box',
        '-ms-flexbox',
        '-webkit-flex',
        'flex',
      ],
    },
    'meta': {
      'group': 'display',
      'order': 4,
    },
  },
  'inline-flex': {
    'utility': {
      'display': [
        '-webkit-inline-box',
        '-ms-inline-flexbox',
        '-webkit-inline-flex',
        'inline-flex',
      ],
    },
    'meta': {
      'group': 'display',
      'order': 5,
    },
  },

  // https://nailuscss.org/utilities/tables.html
  'table': {
    'utility': {
      'display': 'table',
    },
    'meta': {
      'group': 'display',
      'order': 6,
    },
  },
  'inline-table': {
    'utility': {
      'display': 'inline-table',
    },
    'meta': {
      'group': 'display',
      'order': 7,
    },
  },
  'table-caption': {
    'utility': {
      'display': 'table-caption',
    },
    'meta': {
      'group': 'display',
      'order': 8,
    },
  },
  'table-cell': {
    'utility': {
      'display': 'table-cell',
    },
    'meta': {
      'group': 'display',
      'order': 9,
    },
  },
  'table-column': {
    'utility': {
      'display': 'table-column',
    },
    'meta': {
      'group': 'display',
      'order': 10,
    },
  },
  'table-column-group': {
    'utility': {
      'display': 'table-column-group',
    },
    'meta': {
      'group': 'display',
      'order': 11,
    },
  },
  'table-footer-group': {
    'utility': {
      'display': 'table-footer-group',
    },
    'meta': {
      'group': 'display',
      'order': 12,
    },
  },
  'table-header-group': {
    'utility': {
      'display': 'table-header-group',
    },
    'meta': {
      'group': 'display',
      'order': 13,
    },
  },
  'table-row-group': {
    'utility': {
      'display': 'table-row-group',
    },
    'meta': {
      'group': 'display',
      'order': 14,
    },
  },
  'table-row': {
    'utility': {
      'display': 'table-row',
    },
    'meta': {
      'group': 'display',
      'order': 15,
    },
  },
  'flow-root': {
    'utility': {
      'display': 'flow-root',
    },
    'meta': {
      'group': 'display',
      'order': 16,
    },
  },

  // https://nailuscss.org/utilities/grid.html
  'grid': {
    'utility': {
      'display': [
        '-ms-grid',
        'grid',
      ],
    },
    'meta': {
      'group': 'display',
      'order': 17,
    },
  },
  'inline-grid': {
    'utility': {
      'display': [
        '-ms-inline-grid',
        'inline-grid',
      ],
    },
    'meta': {
      'group': 'display',
      'order': 18,
    },
  },
  'contents': {
    'utility': {
      'display': 'contents',
    },
    'meta': {
      'group': 'display',
      'order': 19,
    },
  },
  'list-item': {
    'utility': {
      'display': 'list-item',
    },
    'meta': {
      'group': 'display',
      'order': 20,
    },
  },
  'hidden': {
    'utility': {
      'display': 'none',
    },
    'meta': {
      'group': 'display',
      'order': 21,
    },
  },

  // https://nailuscss.org/utilities/columns.html
  'break-after-auto': {
    'utility': {
      'break-after': 'auto',
    },
    'meta': {
      'group': 'columns',
      'order': 1,
    },
  },
  'break-after-avoid': {
    'utility': {
      'break-after': 'avoid',
    },
    'meta': {
      'group': 'columns',
      'order': 2,
    },
  },
  'break-after-all': {
    'utility': {
      'break-after': 'all',
    },
    'meta': {
      'group': 'columns',
      'order': 3,
    },
  },
  'break-after-avoid-page': {
    'utility': {
      'break-after': 'avoid-page',
    },
    'meta': {
      'group': 'columns',
      'order': 4,
    },
  },
  'break-after-page': {
    'utility': {
      'break-after': 'page',
    },
    'meta': {
      'group': 'columns',
      'order': 5,
    },
  },
  'break-after-left': {
    'utility': {
      'break-after': 'left',
    },
    'meta': {
      'group': 'columns',
      'order': 6,
    },
  },
  'break-after-right': {
    'utility': {
      'break-after': 'right',
    },
    'meta': {
      'group': 'columns',
      'order': 7,
    },
  },
  'break-after-column': {
    'utility': {
      'break-after': 'column',
    },
    'meta': {
      'group': 'columns',
      'order': 8,
    },
  },
  'break-before-auto': {
    'utility': {
      'break-before': 'auto',
    },
    'meta': {
      'group': 'columns',
      'order': 9,
    },
  },
  'break-before-avoid': {
    'utility': {
      'break-before': 'avoid',
    },
    'meta': {
      'group': 'columns',
      'order': 10,
    },
  },
  'break-before-all': {
    'utility': {
      'break-before': 'all',
    },
    'meta': {
      'group': 'columns',
      'order': 11,
    },
  },
  'break-before-avoid-page': {
    'utility': {
      'break-before': 'avoid-page',
    },
    'meta': {
      'group': 'columns',
      'order': 12,
    },
  },
  'break-before-page': {
    'utility': {
      'break-before': 'page',
    },
    'meta': {
      'group': 'columns',
      'order': 13,
    },
  },
  'break-before-left': {
    'utility': {
      'break-before': 'left',
    },
    'meta': {
      'group': 'columns',
      'order': 14,
    },
  },
  'break-before-right': {
    'utility': {
      'break-before': 'right',
    },
    'meta': {
      'group': 'columns',
      'order': 15,
    },
  },
  'break-before-column': {
    'utility': {
      'break-before': 'column',
    },
    'meta': {
      'group': 'columns',
      'order': 16,
    },
  },
  'break-inside-auto': {
    'utility': {
      'break-inside': 'auto',
    },
    'meta': {
      'group': 'columns',
      'order': 17,
    },
  },
  'break-inside-avoid': {
    'utility': {
      'break-inside': 'avoid',
    },
    'meta': {
      'group': 'columns',
      'order': 18,
    },
  },
  'break-inside-avoid-page': {
    'utility': {
      'break-inside': 'avoid-page',
    },
    'meta': {
      'group': 'columns',
      'order': 19,
    },
  },
  'break-inside-avoid-column': {
    'utility': {
      'break-inside': 'avoid-column',
    },
    'meta': {
      'group': 'columns',
      'order': 20,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#floats
  'float-right': {
    'utility': {
      'float': 'right',
    },
    'meta': {
      'group': 'float',
      'order': 1,
    },
  },
  'float-left': {
    'utility': {
      'float': 'left',
    },
    'meta': {
      'group': 'float',
      'order': 2,
    },
  },
  'float-none': {
    'utility': {
      'float': 'none',
    },
    'meta': {
      'group': 'float',
      'order': 3,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#clear
  'clear-left': {
    'utility': {
      'clear': 'left',
    },
    'meta': {
      'group': 'clear',
      'order': 1,
    },
  },
  'clear-right': {
    'utility': {
      'clear': 'right',
    },
    'meta': {
      'group': 'clear',
      'order': 2,
    },
  },
  'clear-both': {
    'utility': {
      'clear': 'both',
    },
    'meta': {
      'group': 'clear',
      'order': 3,
    },
  },
  'clear-none': {
    'utility': {
      'clear': 'none',
    },
    'meta': {
      'group': 'clear',
      'order': 4,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#isolation
  'isolate': {
    'utility': {
      'isolation': 'isolate',
    },
    'meta': {
      'group': 'isolation',
      'order': 1,
    },
  },
  'isolation-auto': {
    'utility': {
      'isolation': 'auto',
    },
    'meta': {
      'group': 'isolation',
      'order': 2,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#object-fit
  'object-contain': {
    'utility': {
      '-o-object-fit': 'contain',
      'object-fit': 'contain',
    },
    'meta': {
      'group': 'objectFit',
      'order': 1,
    },
  },
  'object-cover': {
    'utility': {
      '-o-object-fit': 'cover',
      'object-fit': 'cover',
    },
    'meta': {
      'group': 'objectFit',
      'order': 2,
    },
  },
  'object-fill': {
    'utility': {
      '-o-object-fit': 'fill',
      'object-fit': 'fill',
    },
    'meta': {
      'group': 'objectFit',
      'order': 3,
    },
  },
  'object-none': {
    'utility': {
      '-o-object-fit': 'none',
      'object-fit': 'none',
    },
    'meta': {
      'group': 'objectFit',
      'order': 4,
    },
  },
  'object-scale-down': {
    'utility': {
      '-o-object-fit': 'scale-down',
      'object-fit': 'scale-down',
    },
    'meta': {
      'group': 'objectFit',
      'order': 5,
    },
  },

  // https://nailuscss.org/utilities/behaviors.html#overflow
  'overflow-auto': {
    'utility': {
      'overflow': 'auto',
    },
    'meta': {
      'group': 'overflow',
      'order': 1,
    },
  },
  'overflow-hidden': {
    'utility': {
      'overflow': 'hidden',
    },
    'meta': {
      'group': 'overflow',
      'order': 2,
    },
  },
  'overflow-clip': {
    'utility': {
      'overflow': 'clip',
    },
    'meta': {
      'group': 'overflow',
      'order': 3,
    },
  },
  'overflow-visible': {
    'utility': {
      'overflow': 'visible',
    },
    'meta': {
      'group': 'overflow',
      'order': 4,
    },
  },
  'overflow-scroll': {
    'utility': {
      'overflow': 'scroll',
    },
    'meta': {
      'group': 'overflow',
      'order': 5,
    },
  },
  'overflow-x-auto': {
    'utility': {
      'overflow-x': 'auto',
    },
    'meta': {
      'group': 'overflow',
      'order': 6,
    },
  },
  'overflow-y-auto': {
    'utility': {
      'overflow-y': 'auto',
    },
    'meta': {
      'group': 'overflow',
      'order': 7,
    },
  },
  'overflow-x-hidden': {
    'utility': {
      'overflow-x': 'hidden',
    },
    'meta': {
      'group': 'overflow',
      'order': 8,
    },
  },
  'overflow-y-hidden': {
    'utility': {
      'overflow-y': 'hidden',
    },
    'meta': {
      'group': 'overflow',
      'order': 9,
    },
  },
  'overflow-x-clip': {
    'utility': {
      'overflow-x': 'clip',
    },
    'meta': {
      'group': 'overflow',
      'order': 10,
    },
  },
  'overflow-y-clip': {
    'utility': {
      'overflow-y': 'clip',
    },
    'meta': {
      'group': 'overflow',
      'order': 11,
    },
  },
  'overflow-x-visible': {
    'utility': {
      'overflow-x': 'visible',
    },
    'meta': {
      'group': 'overflow',
      'order': 12,
    },
  },
  'overflow-y-visible': {
    'utility': {
      'overflow-y': 'visible',
    },
    'meta': {
      'group': 'overflow',
      'order': 13,
    },
  },
  'overflow-x-scroll': {
    'utility': {
      'overflow-x': 'scroll',
    },
    'meta': {
      'group': 'overflow',
      'order': 14,
    },
  },
  'overflow-y-scroll': {
    'utility': {
      'overflow-y': 'scroll',
    },
    'meta': {
      'group': 'overflow',
      'order': 15,
    },
  },

  // https://nailuscss.org/utilities/behaviors.html#overscroll-behavior
  'overscroll-auto': {
    'utility': {
      'overscroll-behavior': 'auto',
      '-ms-scroll-chaining': 'chained',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 1,
    },
  },
  'overscroll-contain': {
    'utility': {
      'overscroll-behavior': 'contain',
      '-ms-scroll-chaining': 'none',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 2,
    },
  },
  'overscroll-none': {
    'utility': {
      'overscroll-behavior': 'none',
      '-ms-scroll-chaining': 'none',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 3,
    },
  },
  'overscroll-y-auto': {
    'utility': {
      'overscroll-behavior-y': 'auto',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 4,
    },
  },
  'overscroll-y-contain': {
    'utility': {
      'overscroll-behavior-y': 'contain',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 5,
    },
  },
  'overscroll-y-none': {
    'utility': {
      'overscroll-behavior-y': 'none',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 6,
    },
  },
  'overscroll-x-auto': {
    'utility': {
      'overscroll-behavior-x': 'auto',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 7,
    },
  },
  'overscroll-x-contain': {
    'utility': {
      'overscroll-behavior-x': 'contain',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 8,
    },
  },
  'overscroll-x-none': {
    'utility': {
      'overscroll-behavior-x': 'none',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 9,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#position
  'static': {
    'utility': {
      'position': 'static',
    },
    'meta': {
      'group': 'position',
      'order': 1,
    },
  },
  'fixed': {
    'utility': {
      'position': 'fixed',
    },
    'meta': {
      'group': 'position',
      'order': 2,
    },
  },
  'absolute': {
    'utility': {
      'position': 'absolute',
    },
    'meta': {
      'group': 'position',
      'order': 3,
    },
  },
  'relative': {
    'utility': {
      'position': 'relative',
    },
    'meta': {
      'group': 'position',
      'order': 4,
    },
  },
  'sticky': {
    'utility': {
      'position': [
        '-webkit-sticky',
        'sticky',
      ],
    },
    'meta': {
      'group': 'position',
      'order': 5,
    },
  },

  // https://nailuscss.org/utilities/display.html#visibility
  'visible': {
    'utility': {
      'visibility': 'visible',
    },
    'meta': {
      'group': 'visibility',
      'order': 1,
    },
  },
  'invisible': {
    'utility': {
      'visibility': 'hidden',
    },
    'meta': {
      'group': 'visibility',
      'order': 2,
    },
  },

  // https://nailuscss.org/utilities/display.html#backface-visibility
  'backface-visible': {
    'utility': {
      '-webkit-backface-visibility': 'visible',
      'backface-visibility': 'visible',
    },
    'meta': {
      'group': 'backfaceVisibility',
      'order': 1,
    },
  },
  'backface-hidden': {
    'utility': {
      '-webkit-backface-visibility': 'hidden',
      'backface-visibility': 'hidden',
    },
    'meta': {
      'group': 'backfaceVisibility',
      'order': 2,
    },
  },

  // https://nailuscss.org/utilities/flexbox.html#flex-direction
  'flex-row': {
    'utility': {
      '-webkit-box-orient': 'horizontal',
      '-webkit-box-direction': 'normal',
      '-ms-flex-direction': 'row',
      '-webkit-flex-direction': 'row',
      'flex-direction': 'row',
    },
    'meta': {
      'group': 'flexDirection',
      'order': 1,
    },
  },
  'flex-row-reverse': {
    'utility': {
      '-webkit-box-orient': 'horizontal',
      '-webkit-box-direction': 'reverse',
      '-ms-flex-direction': 'row-reverse',
      '-webkit-flex-direction': 'row-reverse',
      'flex-direction': 'row-reverse',
    },
    'meta': {
      'group': 'flexDirection',
      'order': 2,
    },
  },
  'flex-col': {
    'utility': {
      '-webkit-box-orient': 'vertical',
      '-webkit-box-direction': 'normal',
      '-ms-flex-direction': 'column',
      '-webkit-flex-direction': 'column',
      'flex-direction': 'column',
    },
    'meta': {
      'group': 'flexDirection',
      'order': 3,
    },
  },
  'flex-col-reverse': {
    'utility': {
      '-webkit-box-orient': 'vertical',
      '-webkit-box-direction': 'reverse',
      '-ms-flex-direction': 'column-reverse',
      '-webkit-flex-direction': 'column-reverse',
      'flex-direction': 'column-reverse',
    },
    'meta': {
      'group': 'flexDirection',
      'order': 4,
    },
  },

  // https://nailuscss.org/utilities/flexbox.html#flex-wrap
  'flex-wrap': {
    'utility': {
      '-ms-flex-wrap': 'wrap',
      '-webkit-flex-wrap': 'wrap',
      'flex-wrap': 'wrap',
    },
    'meta': {
      'group': 'flexWrap',
      'order': 1,
    },
  },
  'flex-wrap-reverse': {
    'utility': {
      '-ms-flex-wrap': 'wrap-reverse',
      '-webkit-flex-wrap': 'wrap-reverse',
      'flex-wrap': 'wrap-reverse',
    },
    'meta': {
      'group': 'flexWrap',
      'order': 2,
    },
  },
  'flex-nowrap': {
    'utility': {
      '-ms-flex-wrap': 'nowrap',
      '-webkit-flex-wrap': 'nowrap',
      'flex-wrap': 'nowrap',
    },
    'meta': {
      'group': 'flexWrap',
      'order': 3,
    },
  },

  // https://nailuscss.org/utilities/grid.html#grid-column-span
  'col-auto': {
    'utility': {
      'grid-column': 'auto',
    },
    'meta': {
      'group': 'gridColumn',
      'order': 1,
    },
  },

  // https://nailuscss.org/utilities/grid.html#grid-row-span
  'row-auto': {
    'utility': {
      'grid-row': 'auto',
    },
    'meta': {
      'group': 'gridRow',
      'order': 1,
    },
  },

  // https://nailuscss.org/utilities/grid.html#grid-auto-flow
  'grid-flow-row': {
    'utility': {
      'grid-auto-flow': 'row',
    },
    'meta': {
      'group': 'gridAutoFlow',
      'order': 1,
    },
  },
  'grid-flow-col': {
    'utility': {
      'grid-auto-flow': 'column',
    },
    'meta': {
      'group': 'gridAutoFlow',
      'order': 2,
    },
  },
  'grid-flow-row-dense': {
    'utility': {
      'grid-auto-flow': 'row dense',
    },
    'meta': {
      'group': 'gridAutoFlow',
      'order': 3,
    },
  },
  'grid-flow-col-dense': {
    'utility': {
      'grid-auto-flow': 'column dense',
    },
    'meta': {
      'group': 'gridAutoFlow',
      'order': 4,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#justify-content
  'justify-start': {
    'utility': {
      '-webkit-box-pack': 'start',
      '-ms-flex-pack': 'start',
      '-webkit-justify-content': 'flex-start',
      'justify-content': 'flex-start',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 1,
    },
  },
  'justify-end': {
    'utility': {
      '-webkit-box-pack': 'end',
      '-ms-flex-pack': 'end',
      '-webkit-justify-content': 'flex-end',
      'justify-content': 'flex-end',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 2,
    },
  },
  'justify-center': {
    'utility': {
      '-webkit-box-pack': 'center',
      '-ms-flex-pack': 'center',
      '-webkit-justify-content': 'center',
      'justify-content': 'center',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 3,
    },
  },
  'justify-between': {
    'utility': {
      '-webkit-box-pack': 'justify',
      '-ms-flex-pack': 'justify',
      '-webkit-justify-content': 'space-between',
      'justify-content': 'space-between',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 4,
    },
  },
  'justify-around': {
    'utility': {
      '-ms-flex-pack': 'distribute',
      '-webkit-justify-content': 'space-around',
      'justify-content': 'space-around',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 5,
    },
  },
  'justify-evenly': {
    'utility': {
      '-webkit-box-pack': 'space-evenly',
      '-ms-flex-pack': 'space-evenly',
      '-webkit-justify-content': 'space-evenly',
      'justify-content': 'space-evenly',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 6,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#justify-items
  'justify-items-auto': {
    'utility': {
      'justify-items': 'auto',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 1,
    },
  },
  'justify-items-start': {
    'utility': {
      'justify-items': 'start',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 2,
    },
  },
  'justify-items-end': {
    'utility': {
      'justify-items': 'end',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 3,
    },
  },
  'justify-items-center': {
    'utility': {
      'justify-items': 'center',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 4,
    },
  },
  'justify-items-stretch': {
    'utility': {
      'justify-items': 'stretch',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 5,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#justify-self
  'justify-self-auto': {
    'utility': {
      '-ms-grid-column-align': 'auto',
      'justify-self': 'auto',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 1,
    },
  },
  'justify-self-start': {
    'utility': {
      '-ms-grid-column-align': 'start',
      'justify-self': 'start',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 2,
    },
  },
  'justify-self-end': {
    'utility': {
      '-ms-grid-column-align': 'end',
      'justify-self': 'end',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 3,
    },
  },
  'justify-self-center': {
    'utility': {
      '-ms-grid-column-align': 'center',
      'justify-self': 'center',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 4,
    },
  },
  'justify-self-stretch': {
    'utility': {
      '-ms-grid-column-align': 'stretch',
      'justify-self': 'stretch',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 5,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#align-content
  'content-center': {
    'utility': {
      '-ms-flex-line-pack': 'center',
      '-webkit-align-content': 'center',
      'align-content': 'center',
    },
    'meta': {
      'group': 'alignContent',
      'order': 1,
    },
  },
  'content-start': {
    'utility': {
      '-ms-flex-line-pack': 'start',
      '-webkit-align-content': 'flex-start',
      'align-content': 'flex-start',
    },
    'meta': {
      'group': 'alignContent',
      'order': 2,
    },
  },
  'content-end': {
    'utility': {
      '-ms-flex-line-pack': 'end',
      '-webkit-align-content': 'flex-end',
      'align-content': 'flex-end',
    },
    'meta': {
      'group': 'alignContent',
      'order': 3,
    },
  },
  'content-between': {
    'utility': {
      '-ms-flex-line-pack': 'justify',
      '-webkit-align-content': 'space-between',
      'align-content': 'space-between',
    },
    'meta': {
      'group': 'alignContent',
      'order': 4,
    },
  },
  'content-around': {
    'utility': {
      '-ms-flex-line-pack': 'distribute',
      '-webkit-align-content': 'space-around',
      'align-content': 'space-around',
    },
    'meta': {
      'group': 'alignContent',
      'order': 5,
    },
  },
  'content-evenly': {
    'utility': {
      '-ms-flex-line-pack': 'space-evenly',
      '-webkit-align-content': 'space-evenly',
      'align-content': 'space-evenly',
    },
    'meta': {
      'group': 'alignContent',
      'order': 6,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#align-items
  'items-start': {
    'utility': {
      '-webkit-box-align': 'start',
      '-ms-flex-align': 'start',
      '-webkit-align-items': 'flex-start',
      'align-items': 'flex-start',
    },
    'meta': {
      'group': 'alignItems',
      'order': 1,
    },
  },
  'items-end': {
    'utility': {
      '-webkit-box-align': 'end',
      '-ms-flex-align': 'end',
      '-webkit-align-items': 'flex-end',
      'align-items': 'flex-end',
    },
    'meta': {
      'group': 'alignItems',
      'order': 2,
    },
  },
  'items-center': {
    'utility': {
      '-webkit-box-align': 'center',
      '-ms-flex-align': 'center',
      '-webkit-align-items': 'center',
      'align-items': 'center',
    },
    'meta': {
      'group': 'alignItems',
      'order': 3,
    },
  },
  'items-baseline': {
    'utility': {
      '-webkit-box-align': 'baseline',
      '-ms-flex-align': 'baseline',
      '-webkit-align-items': 'baseline',
      'align-items': 'baseline',
    },
    'meta': {
      'group': 'alignItems',
      'order': 4,
    },
  },
  'items-stretch': {
    'utility': {
      '-webkit-box-align': 'stretch',
      '-ms-flex-align': 'stretch',
      '-webkit-align-items': 'stretch',
      'align-items': 'stretch',
    },
    'meta': {
      'group': 'alignItems',
      'order': 5,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#align-self
  'self-auto': {
    'utility': {
      '-ms-flex-item-align': 'auto',
      '-ms-grid-row-align': 'auto',
      '-webkit-align-self': 'auto',
      'align-self': 'auto',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 1,
    },
  },
  'self-start': {
    'utility': {
      '-ms-flex-item-align': 'start',
      '-webkit-align-self': 'flex-start',
      'align-self': 'flex-start',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 2,
    },
  },
  'self-end': {
    'utility': {
      '-ms-flex-item-align': 'end',
      '-webkit-align-self': 'flex-end',
      'align-self': 'flex-end',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 3,
    },
  },
  'self-center': {
    'utility': {
      '-ms-flex-item-align': 'center',
      '-ms-grid-row-align': 'center',
      '-webkit-align-self': 'center',
      'align-self': 'center',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 4,
    },
  },
  'self-stretch': {
    'utility': {
      '-ms-flex-item-align': 'stretch',
      '-ms-grid-row-align': 'stretch',
      '-webkit-align-self': 'stretch',
      'align-self': 'stretch',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 5,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#place-content
  'place-content-center': {
    'utility': {
      'place-content': 'center',
    },
    'meta': {
      'group': 'placeContent',
      'order': 1,
    },
  },
  'place-content-start': {
    'utility': {
      'place-content': 'start',
    },
    'meta': {
      'group': 'placeContent',
      'order': 2,
    },
  },
  'place-content-end': {
    'utility': {
      'place-content': 'end',
    },
    'meta': {
      'group': 'placeContent',
      'order': 3,
    },
  },
  'place-content-between': {
    'utility': {
      'place-content': 'space-between',
    },
    'meta': {
      'group': 'placeContent',
      'order': 4,
    },
  },
  'place-content-around': {
    'utility': {
      'place-content': 'space-around',
    },
    'meta': {
      'group': 'placeContent',
      'order': 5,
    },
  },
  'place-content-evenly': {
    'utility': {
      'place-content': 'space-evenly',
    },
    'meta': {
      'group': 'placeContent',
      'order': 6,
    },
  },
  'place-content-stretch': {
    'utility': {
      'place-content': 'stretch',
    },
    'meta': {
      'group': 'placeContent',
      'order': 7,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#place-items
  'place-items-auto': {
    'utility': {
      'place-items': 'auto',
    },
    'meta': {
      'group': 'placeItems',
      'order': 1,
    },
  },
  'place-items-start': {
    'utility': {
      'place-items': 'start',
    },
    'meta': {
      'group': 'placeItems',
      'order': 2,
    },
  },
  'place-items-end': {
    'utility': {
      'place-items': 'end',
    },
    'meta': {
      'group': 'placeItems',
      'order': 3,
    },
  },
  'place-items-center': {
    'utility': {
      'place-items': 'center',
    },
    'meta': {
      'group': 'placeItems',
      'order': 4,
    },
  },
  'place-items-stretch': {
    'utility': {
      'place-items': 'stretch',
    },
    'meta': {
      'group': 'placeItems',
      'order': 5,
    },
  },

  // https://nailuscss.org/utilities/positioning.html#place-self
  'place-self-auto': {
    'utility': {
      '-ms-grid-row-align': 'auto',
      '-ms-grid-column-align': 'auto',
      'place-self': 'auto',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 1,
    },
  },
  'place-self-start': {
    'utility': {
      '-ms-grid-row-align': 'start',
      '-ms-grid-column-align': 'start',
      'place-self': 'start',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 2,
    },
  },
  'place-self-end': {
    'utility': {
      '-ms-grid-row-align': 'end',
      '-ms-grid-column-align': 'end',
      'place-self': 'end',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 3,
    },
  },
  'place-self-center': {
    'utility': {
      '-ms-grid-row-align': 'center',
      '-ms-grid-column-align': 'center',
      'place-self': 'center',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 4,
    },
  },
  'place-self-stretch': {
    'utility': {
      '-ms-grid-row-align': 'stretch',
      '-ms-grid-column-align': 'stretch',
      'place-self': 'stretch',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 5,
    },
  }
};
