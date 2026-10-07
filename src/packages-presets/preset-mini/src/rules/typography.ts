import type { StaticUtility } from './types';

const fontVariants = {
  '--tw-ordinal': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-slashed-zero': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-numeric-figure': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-numeric-spacing': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-numeric-fraction': 'var(--tw-empty,/*!*/ /*!*/)',
  'font-variant-numeric': 'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)',
};

export const staticUtilities: StaticUtility = {

  // https://nailuscss.org/utilities/typography.html#font-smoothing
  'antialiased': {
    'utility': {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },
    'meta': {
      'group': 'fontSmoothing',
      'order': 1,
    },
  },
  'subpixel-antialiased': {
    'utility': {
      '-webkit-font-smoothing': 'auto',
      '-moz-osx-font-smoothing': 'auto',
    },
    'meta': {
      'group': 'fontSmoothing',
      'order': 2,
    },
  },

  // https://nailuscss.org/utilities/typography.html#font-style
  'italic': {
    'utility': {
      'font-style': 'italic',
    },
    'meta': {
      'group': 'fontStyle',
      'order': 1,
    },
  },
  'not-italic': {
    'utility': {
      'font-style': 'normal',
    },
    'meta': {
      'group': 'fontStyle',
      'order': 2,
    },
  },

  // https://nailuscss.org/utilities/typography.html#font-variant-numeric
  'normal-nums': {
    'utility': {
      'font-variant-numeric': 'normal',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 1,
    },
  },
  'ordinal': {
    'utility': {
      ...fontVariants,
      '--tw-ordinal': 'ordinal',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 2,
    },
  },
  'slashed-zero': {
    'utility': {
      ...fontVariants,
      '--tw-slashed-zero': 'slashed-zero',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 3,
    },
  },
  'lining-nums': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-figure': 'lining-nums',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 4,
    },
  },
  'oldstyle-nums': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-figure': 'oldstyle-nums',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 5,
    },
  },
  'proportional-nums': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-spacing': 'proportional-nums',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 6,
    },
  },
  'tabular-nums': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-spacing': 'tabular-nums',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 7,
    },
  },
  'diagonal-fractions': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-fraction': 'diagonal-fractions',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 8,
    },
  },
  'stacked-fractions': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-fraction': 'stacked-fractions',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 9,
    },
  },

  // https://nailuscss.org/utilities/behaviors.html#list-style-position
  'list-inside': {
    'utility': {
      'list-style-position': 'inside',
    },
    'meta': {
      'group': 'listStylePosition',
      'order': 1,
    },
  },
  'list-outside': {
    'utility': {
      'list-style-position': 'outside',
    },
    'meta': {
      'group': 'listStylePosition',
      'order': 2,
    },
  },

  // https://nailuscss.org/utilities/typography.html#text-alignment
  'text-left': {
    'utility': {
      'text-align': 'left',
    },
    'meta': {
      'group': 'textAlign',
      'order': 1,
    },
  },
  'text-center': {
    'utility': {
      'text-align': 'center',
    },
    'meta': {
      'group': 'textAlign',
      'order': 2,
    },
  },
  'text-right': {
    'utility': {
      'text-align': 'right',
    },
    'meta': {
      'group': 'textAlign',
      'order': 3,
    },
  },
  'text-justify': {
    'utility': {
      'text-align': 'justify',
    },
    'meta': {
      'group': 'textAlign',
      'order': 4,
    },
  },

  // https://nailuscss.org/utilities/typography.html#text-decoration
  'underline': {
    'utility': {
      '-webkit-text-decoration-line': 'underline',
      'text-decoration-line': 'underline',
    },
    'meta': {
      'group': 'textDecoration',
      'order': 1,
    },
  },
  'overline': {
    'utility': {
      '-webkit-text-decoration-line': 'overline',
      'text-decoration-line': 'overline',
    },
    'meta': {
      'group': 'textDecoration',
      'order': 2,
    },
  },
  'line-through': {
    'utility': {
      '-webkit-text-decoration-line': 'line-through',
      'text-decoration-line': 'line-through',
    },
    'meta': {
      'group': 'textDecoration',
      'order': 3,
    },
  },
  'no-underline': {
    'utility': {
      'text-decoration': 'none',
    },
    'meta': {
      'group': 'textDecoration',
      'order': 4,
    },
  },

  // http://localhost:3001/utilities/typography.html#text-decoration-style
  'decoration-solid': {
    'utility': {
      '-webkit-text-decoration-style': 'solid',
      'text-decoration-style': 'solid',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 1,
    },
  },
  'decoration-double': {
    'utility': {
      '-webkit-text-decoration-style': 'double',
      'text-decoration-style': 'double',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 2,
    },
  },
  'decoration-dotted': {
    'utility': {
      '-webkit-text-decoration-style': 'dotted',
      'text-decoration-style': 'dotted',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 3,
    },
  },
  'decoration-dashed': {
    'utility': {
      '-webkit-text-decoration-style': 'dashed',
      'text-decoration-style': 'dashed',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 4,
    },
  },
  'decoration-wavy': {
    'utility': {
      '-webkit-text-decoration-style': 'wavy',
      'text-decoration-style': 'wavy',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 5,
    },
  },

  // http://localhost:3001/utilities/typography.html#text-decoration-style - Fallback to .decoration-{style}
  'underline-solid': {
    'utility': {
      '-webkit-text-decoration-style': 'solid',
      'text-decoration-style': 'solid',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 1,
    },
  },
  'underline-double': {
    'utility': {
      '-webkit-text-decoration-style': 'double',
      'text-decoration-style': 'double',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 2,
    },
  },
  'underline-dotted': {
    'utility': {
      '-webkit-text-decoration-style': 'dotted',
      'text-decoration-style': 'dotted',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 3,
    },
  },
  'underline-dashed': {
    'utility': {
      '-webkit-text-decoration-style': 'dashed',
      'text-decoration-style': 'dashed',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 4,
    },
  },
  'underline-wavy': {
    'utility': {
      '-webkit-text-decoration-style': 'wavy',
      'text-decoration-style': 'wavy',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 5,
    },
  },

  // https://nailuscss.org/utilities/typography.html#text-transform
  'uppercase': {
    'utility': {
      'text-transform': 'uppercase',
    },
    'meta': {
      'group': 'textTransform',
      'order': 1,
    },
  },
  'lowercase': {
    'utility': {
      'text-transform': 'lowercase',
    },
    'meta': {
      'group': 'textTransform',
      'order': 2,
    },
  },
  'capitalize': {
    'utility': {
      'text-transform': 'capitalize',
    },
    'meta': {
      'group': 'textTransform',
      'order': 3,
    },
  },
  'normal-case': {
    'utility': {
      'text-transform': 'none',
    },
    'meta': {
      'group': 'textTransform',
      'order': 4,
    },
  },

  // https://nailuscss.org/utilities/typography.html#text-overflow
  'truncate': {
    'utility': {
      'overflow': 'hidden',
      '-o-text-overflow': 'ellipsis',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    },
    'meta': {
      'group': 'textOverflow',
      'order': 1,
    },
  },
  'overflow-ellipsis': { // deprecated
    'utility': {
      '-o-text-overflow': 'ellipsis',
      'text-overflow': 'ellipsis',
    },
    'meta': {
      'group': 'textOverflow',
      'order': 2,
    },
  },
  'text-ellipsis': {
    'utility': {
      '-o-text-overflow': 'ellipsis',
      'text-overflow': 'ellipsis',
    },
    'meta': {
      'group': 'textOverflow',
      'order': 3,
    },
  },
  'text-clip': {
    'utility': {
      '-o-text-overflow': 'clip',
      'text-overflow': 'clip',
    },
    'meta': {
      'group': 'textOverflow',
      'order': 4,
    },
  },

  // https://nailuscss.org/utilities/typography.html#vertical-alignment
  'align-baseline': {
    'utility': {
      'vertical-align': 'baseline',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 1,
    },
  },
  'align-top': {
    'utility': {
      'vertical-align': 'top',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 2,
    },
  },
  'align-middle': {
    'utility': {
      'vertical-align': 'middle',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 3,
    },
  },
  'align-bottom': {
    'utility': {
      'vertical-align': 'bottom',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 4,
    },
  },
  'align-text-top': {
    'utility': {
      'vertical-align': 'text-top',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 5,
    },
  },
  'align-text-bottom': {
    'utility': {
      'vertical-align': 'text-bottom',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 6,
    },
  },
  'align-sub': {
    'utility': {
      'vertical-align': 'sub',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 7,
    },
  },
  'align-super': {
    'utility': {
      'vertical-align': 'super',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 8,
    },
  },

  // https://nailuscss.org/utilities/typography.html#whitespace
  'whitespace-normal': {
    'utility': {
      'white-space': 'normal',
    },
    'meta': {
      'group': 'whitespace',
      'order': 1,
    },
  },
  'whitespace-nowrap': {
    'utility': {
      'white-space': 'nowrap',
    },
    'meta': {
      'group': 'whitespace',
      'order': 2,
    },
  },
  'whitespace-pre': {
    'utility': {
      'white-space': 'pre',
    },
    'meta': {
      'group': 'whitespace',
      'order': 3,
    },
  },
  'whitespace-pre-line': {
    'utility': {
      'white-space': 'pre-line',
    },
    'meta': {
      'group': 'whitespace',
      'order': 4,
    },
  },
  'whitespace-pre-wrap': {
    'utility': {
      'white-space': 'pre-wrap',
    },
    'meta': {
      'group': 'whitespace',
      'order': 5,
    },
  },

  // https://nailuscss.org/utilities/typography.html#word-break
  'break-normal': {
    'utility': {
      'word-break': 'normal',
      'overflow-wrap': 'normal',
    },
    'meta': {
      'group': 'wordBreak',
      'order': 1,
    },
  },
  'break-words': {
    'utility': {
      'overflow-wrap': 'break-word',
    },
    'meta': {
      'group': 'wordBreak',
      'order': 2,
    },
  },
  'break-all': {
    'utility': {
      'word-break': 'break-all',
    },
    'meta': {
      'group': 'wordBreak',
      'order': 3,
    },
  },

  // https://nailuscss.org/utilities/typography.html#writing-mode
  'write-normal': {
    'utility': {
      '-webkit-writing-mode': 'horizontal-tb',
      '-ms-writing-mode': 'lr-tb',
      'writing-mode': 'horizontal-tb',
    },
    'meta': {
      'group': 'writingMode',
      'order': 1,
    },
  },

  'write-vertical-right': {
    'utility': {
      '-webkit-writing-mode': 'vertical-rl',
      '-ms-writing-mode': 'tb-rl',
      'writing-mode': 'vertical-rl',
    },
    'meta': {
      'group': 'writingMode',
      'order': 2,
    },
  },

  'write-vertical-left': {
    'utility': {
      '-webkit-writing-mode': 'vertical-lr',
      '-ms-writing-mode': 'tb-lr',
      'writing-mode': 'vertical-lr',
    },
    'meta': {
      'group': 'writingMode',
      'order': 3,
    },
  },

  // https://nailuscss.org/utilities/typography.html#writing-orientation
  'write-orient-mixed': {
    'utility': {
      '-webkit-text-orientation': 'mixed',
      'text-orientation': 'mixed',
    },
    'meta': {
      'group': 'writingMode',
      'order': 4,
    },
  },

  'write-orient-upright': {
    'utility': {
      '-webkit-text-orientation': 'upright',
      'text-orientation': 'upright',
    },
    'meta': {
      'group': 'writingMode',
      'order': 5,
    },
  },

  'write-orient-sideways': {
    'utility': {
      '-webkit-text-orientation': 'sideways',
      'text-orientation': 'sideways',
    },
    'meta': {
      'group': 'writingMode',
      'order': 6,
    },
  },

  // https://nailuscss.org/utilities/typography.html#hyphens
  'hyphens-none': {
    'utility': {
      '-webkit-hyphens': 'none',
      '-ms-hyphens': 'none',
      'hyphens': 'none',
    },
    'meta': {
      'group': 'hyphens',
      'order': 1,
    },
  },
  'hyphens-manual': {
    'utility': {
      '-webkit-hyphens': 'manual',
      '-ms-hyphens': 'manual',
      'hyphens': 'manual',
    },
    'meta': {
      'group': 'hyphens',
      'order': 2,
    },
  },
  'hyphens-auto': {
    'utility': {
      '-webkit-hyphens': 'auto',
      '-ms-hyphens': 'auto',
      'hyphens': 'auto',
    },
    'meta': {
      'group': 'hyphens',
      'order': 3,
    },
  }
};
