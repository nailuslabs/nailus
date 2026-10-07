import type { StaticUtility } from './types';

export const staticUtilities: StaticUtility = {

  // https://nailuscss.org/utilities/backgrounds.html#background-attachment
  'bg-fixed': {
    'utility': {
      'background-attachment': 'fixed',
    },
    'meta': {
      'group': 'backgroundAttachment',
      'order': 1,
    },
  },
  'bg-local': {
    'utility': {
      'background-attachment': 'local',
    },
    'meta': {
      'group': 'backgroundAttachment',
      'order': 2,
    },
  },
  'bg-scroll': {
    'utility': {
      'background-attachment': 'scroll',
    },
    'meta': {
      'group': 'backgroundAttachment',
      'order': 3,
    },
  },

  // https://nailuscss.org/utilities/backgrounds.html#background-clip
  'bg-clip-border': {
    'utility': {
      '-webkit-background-clip': 'border-box',
      'background-clip': 'border-box',
    },
    'meta': {
      'group': 'backgroundClip',
      'order': 1,
    },
  },
  'bg-clip-padding': {
    'utility': {
      '-webkit-background-clip': 'padding-box',
      'background-clip': 'padding-box',
    },
    'meta': {
      'group': 'backgroundClip',
      'order': 2,
    },
  },
  'bg-clip-content': {
    'utility': {
      '-webkit-background-clip': 'content-box',
      'background-clip': 'content-box',
    },
    'meta': {
      'group': 'backgroundClip',
      'order': 3,
    },
  },
  'bg-clip-text': {
    'utility': {
      '-webkit-background-clip': 'text',
      'background-clip': 'text',
    },
    'meta': {
      'group': 'backgroundClip',
      'order': 4,
    },
  },

  // https://nailuscss.org/utilities/backgrounds.html#background-repeat
  'bg-repeat': {
    'utility': {
      'background-repeat': 'repeat',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 1,
    },
  },
  'bg-no-repeat': {
    'utility': {
      'background-repeat': 'no-repeat',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 2,
    },
  },
  'bg-repeat-x': {
    'utility': {
      'background-repeat': 'repeat-x',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 3,
    },
  },
  'bg-repeat-y': {
    'utility': {
      'background-repeat': 'repeat-y',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 4,
    },
  },
  'bg-repeat-round': {
    'utility': {
      'background-repeat': 'round',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 5,
    },
  },
  'bg-repeat-space': {
    'utility': {
      'background-repeat': 'space',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 6,
    },
  },

  // https://nailuscss.org/utilities/backgrounds.html#background-origin
  'bg-origin-border': {
    'utility': {
      'background-origin': 'border-box',
    },
    'meta': {
      'group': 'backgroundOrigin',
      'order': 1,
    },
  },
  'bg-origin-padding': {
    'utility': {
      'background-origin': 'padding-box',
    },
    'meta': {
      'group': 'backgroundOrigin',
      'order': 2,
    },
  },
  'bg-origin-content': {
    'utility': {
      'background-origin': 'content-box',
    },
    'meta': {
      'group': 'backgroundOrigin',
      'order': 3,
    },
  },

  // https://nailuscss.org/utilities/borders.html#border-style
  'border-solid': {
    'utility': {
      'border-style': 'solid',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 1,
    },
  },
  'border-dashed': {
    'utility': {
      'border-style': 'dashed',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 2,
    },
  },
  'border-dotted': {
    'utility': {
      'border-style': 'dotted',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 3,
    },
  },
  'border-double': {
    'utility': {
      'border-style': 'double',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 4,
    },
  },
  'border-none': {
    'utility': {
      'border-style': 'none',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 5,
    },
  },
  'border-hidden': {
    'utility': {
      'border-style': 'hidden',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 6,
    },
  },

  // https://nailuscss.org/utilities/behaviors.html#image-rendering
  'image-render-auto': {
    'utility': {
      'image-rendering': 'auto',
    },
    'meta': {
      'group': 'imageRendering',
      'order': 1,
    },
  },
  'image-render-pixel': {
    'utility': {
      '-ms-interpolation-mode': 'nearest-neighbor',
      'image-rendering': ['-webkit-optimize-contrast', '-moz-crisp-edges', '-o-pixelated', 'pixelated'],
    },
    'meta': {
      'group': 'imageRendering',
      'order': 2,
    },
  },
  'image-render-edge': {
    'utility': {
      'image-rendering': 'crisp-edges',
    },
    'meta': {
      'group': 'imageRendering',
      'order': 3,
    },
  }
};
