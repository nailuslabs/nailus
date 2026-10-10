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

const { minHeight, minWidth, ...themeAliases } = aliases;

export const defaultTheme = {
  ...staticTheme,
  screens: breakpoints,
  colors: defaultColors,
  spacing,
  ...animation,
  ...themeAliases,
  ...background,
  ...borders,
  ...filters,
  ...grid,
  container: {},
  keyframes,
  padding: aliases.padding,
  ...sizing,
  minHeight,
  minWidth,
  ...transitions,
  ...typography,
};