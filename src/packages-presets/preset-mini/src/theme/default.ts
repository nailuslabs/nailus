import { defaultColors } from '../theme';
import * as animation from './animation';
import * as aliases from './aliases';
import * as background from './background';
import * as borders from './borders';
import * as filters from './filters';
import * as grid from './grid';
import { keyframes } from './keyframes';
import * as sizing from './sizing';
import * as staticTheme from './static';
import * as transitions from './transitions';
import * as typography from './typography';
import { breakpoints } from './screens';
import { spacing } from './spacing';

export const defaultTheme = {
  ...staticTheme,
  screens: breakpoints,
  colors: defaultColors,
  spacing,
  ...animation,
  ...aliases,
  ...background,
  ...borders,
  ...filters,
  ...grid,
  container: {},
  keyframes,
  minHeight: aliases.minHeight,
  minWidth: aliases.minWidth,
  padding: aliases.padding,
  ...sizing,
  ...transitions,
  ...typography,
};