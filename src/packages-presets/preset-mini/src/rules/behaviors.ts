import type { StaticUtility } from './types';

export const staticUtilities: StaticUtility = {

  // https://nailuscss.org/utilities/behaviors.html#appearance
  'appearance-none': {
    'utility': {
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      'appearance': 'none',
    },
    'meta': {
      'group': 'appearance',
      'order': 1,
    },
  },

  // https://nailuscss.org/utilities/behaviors.html#pointer-events
  'pointer-events-none': {
    'utility': {
      'pointer-events': 'none',
    },
    'meta': {
      'group': 'pointerEvents',
      'order': 1,
    },
  },
  'pointer-events-auto': {
    'utility': {
      'pointer-events': 'auto',
    },
    'meta': {
      'group': 'pointerEvents',
      'order': 2,
    },
  },

  // https://nailuscss.org/utilities/behaviors.html#resize
  'resize-none': {
    'utility': {
      'resize': 'none',
    },
    'meta': {
      'group': 'resize',
      'order': 1,
    },
  },
  'resize-y': {
    'utility': {
      'resize': 'vertical',
    },
    'meta': {
      'group': 'resize',
      'order': 2,
    },
  },
  'resize-x': {
    'utility': {
      'resize': 'horizontal',
    },
    'meta': {
      'group': 'resize',
      'order': 3,
    },
  },
  'resize': {
    'utility': {
      'resize': 'both',
    },
    'meta': {
      'group': 'resize',
      'order': 4,
    },
  },

  // https://nailuscss.org/utilities/behaviors.html#user-select
  'select-none': {
    'utility': {
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
      'user-select': 'none',
    },
    'meta': {
      'group': 'userSelect',
      'order': 1,
    },
  },
  'select-text': {
    'utility': {
      '-webkit-user-select': 'text',
      '-moz-user-select': 'text',
      '-ms-user-select': 'text',
      'user-select': 'text',
    },
    'meta': {
      'group': 'userSelect',
      'order': 2,
    },
  },
  'select-all': {
    'utility': {
      '-webkit-user-select': 'all',
      '-moz-user-select': 'all',
      '-ms-user-select': 'all',
      'user-select': 'all',
    },
    'meta': {
      'group': 'userSelect',
      'order': 3,
    },
  },
  'select-auto': {
    'utility': {
      '-webkit-user-select': 'auto',
      '-moz-user-select': 'auto',
      '-ms-user-select': 'auto',
      'user-select': 'auto',
    },
    'meta': {
      'group': 'userSelect',
      'order': 4,
    },
  },

  // https://nailuscss.org/utilities/svg.html#fill-color
  // https://nailuscss.org/utilities/svg.html#stroke-color
  'fill-current': {
    'utility': {
      'fill': 'currentColor',
    },
    'meta': {
      'group': 'fill',
      'order': 1,
    },
  },
  'stroke-current': {
    'utility': {
      'stroke': 'currentColor',
    },
    'meta': {
      'group': 'stroke',
      'order': 1,
    },
  },
  // https://nailuscss.org/utilities/svg.html#stroke-linecap
  'stroke-cap-auto': {
    'utility': {
      'stroke-linecap': 'butt',
    },
    'meta': {
      'group': 'stroke',
      'order': 2,
    },
  },
  'stroke-cap-square': {
    'utility': {
      'stroke-linecap': 'square',
    },
    'meta': {
      'group': 'stroke',
      'order': 3,
    },
  },
  'stroke-cap-round': {
    'utility': {
      'stroke-linecap': 'round',
    },
    'meta': {
      'group': 'stroke',
      'order': 4,
    },
  },
  // https://nailuscss.org/utilities/svg.html#stroke-linejoin
  'stroke-join-auto': {
    'utility': {
      'stroke-linejoin': 'miter',
    },
    'meta': {
      'group': 'stroke',
      'order': 5,
    },
  },
  'stroke-join-arcs': {
    'utility': {
      'stroke-linejoin': 'arcs',
    },
    'meta': {
      'group': 'stroke',
      'order': 6,
    },
  },
  'stroke-join-bevel': {
    'utility': {
      'stroke-linejoin': 'bevel',
    },
    'meta': {
      'group': 'stroke',
      'order': 7,
    },
  },
  'stroke-join-clip': {
    'utility': {
      'stroke-linejoin': 'miter-clip',
    },
    'meta': {
      'group': 'stroke',
      'order': 8,
    },
  },
  'stroke-join-round': {
    'utility': {
      'stroke-linejoin': 'round',
    },
    'meta': {
      'group': 'stroke',
      'order': 9,
    },
  },
  // https://nailuscss.org/utilities/behaviors.html#screen-readers-access
  'sr-only': {
    'utility': {
      'position': 'absolute',
      'width': '1px',
      'height': '1px',
      'padding': '0',
      'margin': '-1px',
      'overflow': 'hidden',
      'clip': 'rect(0, 0, 0, 0)',
      'white-space': 'nowrap',
      'border-width': '0',
    },
    'meta': {
      'group': 'accessibility',
      'order': 1,
    },
  },
  'not-sr-only': {
    'utility': {
      'position': 'static',
      'width': 'auto',
      'height': 'auto',
      'padding': '0',
      'margin': '0',
      'overflow': 'visible',
      'clip': 'auto',
      'white-space': 'normal',
    },
    'meta': {
      'group': 'accessibility',
      'order': 2,
    },
  },

  // https://nailuscss.org/utilities/behaviors.html#will-change
  'will-change-auto': {
    'utility': {
      'will-change': 'auto',
    },
    'meta': {
      'group': 'willChange',
      'order': 1,
    },
  },
  'will-change-scroll': {
    'utility': {
      'will-change': 'scroll',
    },
    'meta': {
      'group': 'willChange',
      'order': 2,
    },
  },
  'will-change-contents': {
    'utility': {
      'will-change': 'contents',
    },
    'meta': {
      'group': 'willChange',
      'order': 3,
    },
  },
  'will-change-transform': {
    'utility': {
      'will-change': 'transform',
    },
    'meta': {
      'group': 'willChange',
      'order': 4,
    },
  },

  // https://nailuscss.org/utilities/behaviors.html#touch-action
  'touch-auto': {
    'utility': {
      'touch-action': 'auto',
    },
    'meta': {
      'group': 'touchAction',
      'order': 1,
    },
  },
  'touch-none': {
    'utility': {
      'touch-action': 'none',
    },
    'meta': {
      'group': 'touchAction',
      'order': 2,
    },
  },
  'touch-pan-x': {
    'utility': {
      'touch-action': 'pan-x',
    },
    'meta': {
      'group': 'touchAction',
      'order': 3,
    },
  },
  'touch-pan-left': {
    'utility': {
      'touch-action': 'pan-left',
    },
    'meta': {
      'group': 'touchAction',
      'order': 4,
    },
  },
  'touch-pan-right': {
    'utility': {
      'touch-action': 'pan-right',
    },
    'meta': {
      'group': 'touchAction',
      'order': 5,
    },
  },
  'touch-pan-y': {
    'utility': {
      'touch-action': 'pan-y',
    },
    'meta': {
      'group': 'touchAction',
      'order': 6,
    },
  },
  'touch-pan-up': {
    'utility': {
      'touch-action': 'pan-up',
    },
    'meta': {
      'group': 'touchAction',
      'order': 7,
    },
  },
  'touch-pan-down': {
    'utility': {
      'touch-action': 'pan-down',
    },
    'meta': {
      'group': 'touchAction',
      'order': 8,
    },
  },
  'touch-pinch-zoom': {
    'utility': {
      'touch-action': 'pinch-zoom',
    },
    'meta': {
      'group': 'touchAction',
      'order': 9,
    },
  },
  'touch-manipulation': {
    'utility': {
      'touch-action': 'manipulation',
    },
    'meta': {
      'group': 'touchAction',
      'order': 10,
    },
  },

  // https://nailuscss.org/utilities/behaviors.html#scroll-behavior
  'scroll-auto': {
    'utility': {
      'scroll-behavior': 'auto',
    },
    'meta': {
      'group': 'scrollBehavior',
      'order': 1,
    },
  },
  'scroll-smooth': {
    'utility': {
      'scroll-behavior': 'smooth',
    },
    'meta': {
      'group': 'scrollBehavior',
      'order': 2,
    },
  },

  // https://nailuscss.org/utilities/borders/outline.html
  'outline-none': {
    'utility': {
      'outline': '2px solid transparent',
      'outline-offset': '2px',
    },
    'meta': {
      'group': 'outline',
      'order': 1,
    },
  },
  'outline': {
    'utility': {
      'outline-style': 'solid',
    },
    'meta': {
      'group': 'outline',
      'order': 2,
    },
  },
  'outline-dashed': {
    'utility': {
      'outline-style': 'dashed',
    },
    'meta': {
      'group': 'outline',
      'order': 3,
    },
  },
  'outline-dotted': {
    'utility': {
      'outline-style': 'dotted',
    },
    'meta': {
      'group': 'outline',
      'order': 4,
    },
  },
  'outline-double': {
    'utility': {
      'outline-style': 'double',
    },
    'meta': {
      'group': 'outline',
      'order': 5,
    },
  },
  'outline-hidden': {
    'utility': {
      'outline-style': 'hidden',
    },
    'meta': {
      'group': 'outline',
      'order': 6,
    },
  }
};
