import type { StaticUtility } from './types';

export const staticUtilities: StaticUtility = {

  // https://nailuscss.org/utilities/transforms.html
  'transform': {
    'utility': {
      '--tw-translate-x': '0',
      '--tw-translate-y': '0',
      '--tw-translate-z': '0',
      '--tw-rotate': '0',
      '--tw-rotate-x': '0',
      '--tw-rotate-y': '0',
      '--tw-rotate-z': '0',
      '--tw-skew-x': '0',
      '--tw-skew-y': '0',
      '--tw-scale-x': '1',
      '--tw-scale-y': '1',
      '--tw-scale-z': '1',
      '-webkit-transform': 'translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z)) rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z))',
      '-ms-transform': 'translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z)) rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z))',
      'transform': 'translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z)) rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z))',
    },
    'meta': {
      'group': 'transform',
      'order': 1,
    },
  },
  'transform-gpu': {
    'utility': {
      '--tw-translate-x': '0',
      '--tw-translate-y': '0',
      '--tw-translate-z': '0',
      '--tw-rotate': '0',
      '--tw-rotate-x': '0',
      '--tw-rotate-y': '0',
      '--tw-rotate-z': '0',
      '--tw-skew-x': '0',
      '--tw-skew-y': '0',
      '--tw-scale-x': '1',
      '--tw-scale-y': '1',
      '--tw-scale-z': '1',
      '-webkit-transform': 'translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z))',
      '-ms-transform': 'translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z))',
      'transform': 'translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z))',
    },
    'meta': {
      'group': 'transform',
      'order': 2,
    },
  },
  'transform-none': {
    'utility': {
      '-webkit-transform': 'none',
      '-ms-transform': 'none',
      'transform': 'none',
    },
    'meta': {
      'group': 'transform',
      'order': 3,
    },
  },

  // https://nailuscss.org/utilities/transforms.html#transform-type
  'preserve-flat': {
    'utility': {
      '-webkit-transform-style': 'flat',
      'transform-style': 'flat',
    },
    'meta': {
      'group': 'transform',
      'order': 4,
    },
  },

  'preserve-3d': {
    'utility': {
      '-webkit-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
    'meta': {
      'group': 'transform',
      'order': 5,
    },
  },

  'animated': {
    'utility': {
      '-webkit-animation-duration': '1000ms',
      '-webkit-animation-fill-mode': 'both',
      'animation-duration': '1000ms',
      'animation-fill-mode': 'both',
    },
    'meta': {
      'group': 'animation',
      'order': 3,
    },
  },

  'animate-reverse': {
    'utility': {
      '-webkit-animation-direction': 'reverse',
      'animation-direction': 'reverse',
    },
    'meta': {
      'group': 'animation',
      'order': 4,
    },
  },

  'animate-alternate': {
    'utility': {
      '-webkit-animation-direction': 'alternate',
      'animation-direction': 'alternate',
    },
    'meta': {
      'group': 'animation',
      'order': 5,
    },
  },

  'animate-alternate-reverse': {
    'utility': {
      '-webkit-animation-direction': 'alternate-reverse',
      'animation-direction': 'alternate-reverse',
    },
    'meta': {
      'group': 'animation',
      'order': 6,
    },
  },

  'animate-fill-none': {
    'utility': {
      '-webkit-animation-fill-mode': 'none',
      'animation-fill-mode': 'none',
    },
    'meta': {
      'group': 'animation',
      'order': 7,
    },
  },

  'animate-fill-forwards': {
    'utility': {
      '-webkit-animation-fill-mode': 'forwards',
      'animation-fill-mode': 'forwards',
    },
    'meta': {
      'group': 'animation',
      'order': 8,
    },
  },

  'animate-fill-backwards': {
    'utility': {
      '-webkit-animation-fill-mode': 'backwards',
      'animation-fill-mode': 'backwards',
    },
    'meta': {
      'group': 'animation',
      'order': 9,
    },
  },

  'animate-fill-both': {
    'utility': {
      '-webkit-animation-fill-mode': 'both',
      'animation-fill-mode': 'both',
    },
    'meta': {
      'group': 'animation',
      'order': 10,
    },
  },

  'animate-paused': {
    'utility': {
      '-webkit-animation-play-state': 'paused',
      'animation-play-state': 'paused',
    },
    'meta': {
      'group': 'animation',
      'order': 11,
    },
  },

  'animate-running': {
    'utility': {
      '-webkit-animation-play-state': 'running',
      'animation-play-state': 'running',
    },
    'meta': {
      'group': 'animation',
      'order': 12,
    },
  }
};
