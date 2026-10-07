import type { StaticUtility } from './types';
import { staticUtilities as layoutUtilities } from './layout';
import { staticUtilities as typographyUtilities } from './typography';
import { staticUtilities as backgroundsUtilities } from './backgrounds';
import { staticUtilities as effectsUtilities } from './effects';
import { staticUtilities as transformsUtilities } from './transforms';
import { staticUtilities as behaviorsUtilities } from './behaviors';

export const staticUtilities: StaticUtility = {
  ...layoutUtilities,
  ...typographyUtilities,
  ...backgroundsUtilities,
  ...effectsUtilities,
  ...transformsUtilities,
  ...behaviorsUtilities,
};
