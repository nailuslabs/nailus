import { defaultTheme, variantOrder } from '../../packages-presets/preset-mini/src';
import plugin from '../../plugin';
import type { Config } from '../../interfaces';

export { defaultColors, tShirtScale } from '../../packages-presets/preset-mini/src';

export const baseConfig: Config = {
  // purge: [],
  presets: [],
  prefixer: true,
  attributify: false,
  darkMode: 'class', // or 'media'
  theme: defaultTheme,
  variantOrder: variantOrder,
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.before\\:contents': {
          '&::before': {
            content: '""',
            display: 'contents',
          },
        },
        '.after\\:contents': {
          '&::after': {
            content: '""',
            display: 'contents',
          },
        },
      });
    }),
  ],
  handlers: {
    static: true,
    time: true,
    color: true,
    opacity: true,
    number: true,
    string: true,
    bracket: true,
    hex: true,
    nxl: true,
    fraction: true,
    size: true,
    variable: true,
    negative: true,
  },
};