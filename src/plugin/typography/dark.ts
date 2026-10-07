import { defaultColors as colors } from '../../packages-engine/config/base';
import type { ThemeUtil } from '../../interfaces';

const styles: (
  theme: ThemeUtil
) => { css: { [key: string]: unknown }[] } = (
  theme: ThemeUtil
) => ({
  css: [
    {
      color: theme('colors.gray.300', colors['gray'][300]),
      '[class~="lead"]': {
        color: theme('colors.gray.200', colors['gray'][200]),
      },
      a: {
        color: theme('colors.gray.200', colors['gray'][200]),
      },
      strong: {
        color: theme('colors.gray.200', colors['gray'][200]),
      },
      'ol > li::before': {
        color: theme('colors.gray.500', colors['gray'][500]),
      },
      'ul > li::before': {
        backgroundColor: theme('colors.gray.500', colors['gray'][500]),
      },
      hr: {
        borderColor: theme('colors.gray.800', colors['gray'][800]),
      },
      blockquote: {
        color: theme('colors.gray.500', colors['gray'][500]),
        borderColor: theme('colors.gray.700', colors['gray'][700]),
      },
      h1: {
        color: theme('colors.gray.200', colors['gray'][200]),
      },
      h2: {
        color: theme('colors.gray.200', colors['gray'][200]),
      },
      h3: {
        color: theme('colors.gray.200', colors['gray'][200]),
      },
      h4: {
        color: theme('colors.gray.200', colors['gray'][200]),
      },
      'figure figcaption': {
        color: theme('colors.gray.400', colors['gray'][400]),
      },
      code: {
        color: theme('colors.gray.300', colors['gray'][300]),
      },
      'a code': {
        color: theme('colors.gray.100', colors['gray'][100]),
      },
      pre: {
        color: theme('colors.gray.100', colors['gray'][100]),
        backgroundColor: theme('colors.gray.900', colors['gray'][900]),
      },
      'pre code': {
        backgroundColor: 'transparent',
        color: 'inherit',
      },
      thead: {
        color: theme('colors.gray.100', colors['gray'][100]),
        borderBottomColor: theme('colors.gray.700', colors['gray'][700]),
      },
      'tbody tr': {
        borderBottomColor: theme('colors.gray.800', colors['gray'][800]),
      },
    },
  ],
});

export default styles;



