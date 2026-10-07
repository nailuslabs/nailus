import { tShirtScale } from './size';

export const orientation = { portrait: 'portrait', landscape: 'landscape' };

export const columns = {
  ...tShirtScale,
  auto: 'auto',
  1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
  7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12',
  '3xs': '16rem',
  '2xs': '18rem',
};

export const content = {
  DEFAULT: '""',
  'open-quote': 'open-quote',
  'close-quote': 'close-quote',
  'open-square': '"["',
  'close-square': '"]"',
  'open-curly': '"{"',
  'close-curly': '"}"',
  'open-bracket': '"("',
  'close-bracket': '")"',
};

export const cursor = {
  auto: 'auto',
  default: 'default',
  pointer: 'pointer',
  wait: 'wait',
  text: 'text',
  move: 'move',
  help: 'help',
  'not-allowed': 'not-allowed',
};

export const flex = { 1: '1 1 0%', auto: '1 1 auto', initial: '0 1 auto', none: 'none' };
export const flexGrow = { DEFAULT: '1', 0: '0' };
export const flexShrink = { DEFAULT: '1', 0: '0' };

export const listStyleType = {
  none: 'none',
  circle: 'circle',
  square: 'square',
  disc: 'disc',
  decimal: 'decimal',
  'zero-decimal': 'decimal-leading-zero',
  greek: 'lower-greek',
  roman: 'lower-roman',
  alpha: 'lower-alpha',
  'upper-roman': 'upper-roman',
  'upper-alpha': 'upper-alpha',
};

export const objectPosition = {
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

export const opacity = {
  0: '0', 5: '0.05', 10: '0.1', 20: '0.2', 25: '0.25',
  30: '0.3', 40: '0.4', 50: '0.5', 60: '0.6', 70: '0.7',
  75: '0.75', 80: '0.8', 90: '0.9', 95: '0.95', 100: '1',
};

export const order = {
  first: '-9999', last: '9999', none: '0',
  1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
  7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12',
};

export const perspectiveOrigin = {
  center: 'center',
  top: 'top',
  'top-right': 'top right',
  right: 'right',
  'bottom-right': 'bottom right',
  bottom: 'bottom',
  'bottom-left': 'bottom left',
  left: 'left',
  'top-left': 'top left',
};

export const rotate = {
  '-180': '-180deg', '-90': '-90deg', '-45': '-45deg', '-12': '-12deg',
  '-6': '-6deg', '-3': '-3deg', '-2': '-2deg', '-1': '-1deg',
  0: '0deg', 1: '1deg', 2: '2deg', 3: '3deg', 6: '6deg',
  12: '12deg', 45: '45deg', 90: '90deg', 180: '180deg',
};

export const scale = {
  0: '0', 50: '.5', 75: '.75', 90: '.9', 95: '.95',
  100: '1', 105: '1.05', 110: '1.1', 125: '1.25', 150: '1.5',
};

export const skew = {
  '-12': '-12deg', '-6': '-6deg', '-3': '-3deg', '-2': '-2deg', '-1': '-1deg',
  0: '0deg', 1: '1deg', 2: '2deg', 3: '3deg', 6: '6deg', 12: '12deg',
};

export const tabSize = { DEFAULT: '4', 0: '0', 2: '2', 4: '4', 8: '8' };

export const strokeWidth = { 0: '0', 1: '1', 2: '2' };
export const strokeDashArray = { 0: '0', 1: '1', 2: '2' };
export const strokeDashOffset = { 0: '0', 1: '1', 2: '2' };

export const transformOrigin = {
  center: 'center',
  top: 'top',
  'top-right': 'top right',
  right: 'right',
  'bottom-right': 'bottom right',
  bottom: 'bottom',
  'bottom-left': 'bottom left',
  left: 'left',
  'top-left': 'top left',
};

export const zIndex = {
  auto: 'auto',
  0: '0', 10: '10', 20: '20', 30: '30', 40: '40', 50: '50',
};