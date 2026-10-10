import type { ThemeUtil } from '../types';

export const backgroundColor = (theme: ThemeUtil) => theme('colors');

export const backgroundImage = {
  none: 'none',
  'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
  'gradient-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
  'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
  'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
  'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
  'gradient-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
  'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
  'gradient-to-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))',
};

export const backgroundOpacity = (theme: ThemeUtil) => theme('opacity');

export const backgroundPosition = {
  bottom: 'bottom',
  center: 'center',
  left: 'left',
  'left-bottom': 'left bottom',
  'left-top': 'left top',
  right: 'right',
  'right-bottom': 'right bottom',
  'right-top': 'right top',
  top: 'top',
};

export const backgroundSize = {
  auto: 'auto',
  cover: 'cover',
  contain: 'contain',
};