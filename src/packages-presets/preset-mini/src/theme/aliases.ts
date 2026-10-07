import type { ConfigUtil, ThemeUtil } from '../../../../interfaces';

export const caretColor = (theme: ThemeUtil) => ({
  auto: 'auto',
  ...(theme('colors') ?? {}),
});

export const caretOpacity = (theme: ThemeUtil) => theme('opacity');
export const divideColor = (theme: ThemeUtil) => theme('borderColor');
export const divideOpacity = (theme: ThemeUtil) => theme('borderOpacity');
export const divideWidth = (theme: ThemeUtil) => theme('borderWidth');

export const fill = (theme: ThemeUtil) => ({
  ...(theme('colors') ?? {}),
  none: 'none',
});

export const minHeight = (theme: ThemeUtil) => theme('maxHeight');
export const minWidth = (theme: ThemeUtil) => theme('maxWidth');
export const padding = (theme: ThemeUtil) => theme('spacing');
export const placeholderColor = (theme: ThemeUtil) => theme('colors');
export const placeholderOpacity = (theme: ThemeUtil) => theme('opacity');

export const space: ConfigUtil = (theme, { negative }) => ({
  ...theme('spacing'),
  ...negative(theme('spacing')),
});

export const stroke = (theme: ThemeUtil) => ({
  ...(theme('colors') ?? {}),
  none: 'none',
});