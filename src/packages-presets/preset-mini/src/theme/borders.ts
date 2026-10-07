import type { ThemeUtil } from '../../../../interfaces';

export const borderColor = (theme: ThemeUtil) => ({
  DEFAULT: theme('colors.gray.200', 'currentColor'),
  ...(theme('colors') ?? {}),
});

export const borderOpacity = (theme: ThemeUtil) => theme('opacity');

export const borderRadius = {
  DEFAULT: '0.25rem',
  none: '0px',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  '1': '100%',
  full: '9999px',
};

export const borderWidth = {
  DEFAULT: '1px',
  0: '0px',
  2: '2px',
  4: '4px',
  8: '8px',
};

export const boxShadow = {
  DEFAULT: '0 1px 3px 0 rgb(0 0 0/0.1),0 1px 2px -1px rgb(0 0 0/0.1)',
  sm: '0 1px 2px 0 rgb(0 0 0/0.05)',
  md: '0 4px 6px -1px rgb(0 0 0/0.1),0 2px 4px -2px rgb(0 0 0/0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0/0.1),0 4px 6px -4px rgb(0 0 0/0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0/0.1),0 8px 10px -6px rgb(0 0 0/0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0/0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0/0.05)',
  none: '0 0 #0000',
};

export const boxShadowColor = (theme: ThemeUtil) => theme('colors');
export const outlineColor = (theme: ThemeUtil) => theme('colors');

export const outlineWidth = {
  0: '0px',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
};

export const outlineOffset = {
  0: '0px',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
};

export const ringColor = (theme: ThemeUtil) => ({
  DEFAULT: theme('colors.blue.500', '#3b82f6'),
  ...(theme('colors') ?? {}),
});

export const ringOffsetColor = (theme: ThemeUtil) => theme('colors');

export const ringOffsetWidth = {
  0: '0px',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
};

export const ringOpacity = (theme: ThemeUtil) => ({
  DEFAULT: '0.5',
  ...(theme('opacity') ?? {}),
});

export const ringWidth = {
  DEFAULT: '3px',
  0: '0px',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
};