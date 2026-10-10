// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

import Jasmine from 'jasmine';
import { addHook } from 'pirates';
import { resolve } from 'path';
import { compareDiff, compareSnapshot } from './snapshot';

addHook(
  (code, ) => code.replace(/(?<=toMatchSnapshot\([^,)]+)\)/g, ', __filename)'),
  { exts: ['.ts'], ignoreNodeModules: true }
);

const jasmine = new Jasmine({
  loader: {
    load: (file: string) => Promise.resolve(require(file)),
  },
});

beforeEach(() => {
  jasmine.addMatchers({
    toEqualDiff() {
      return {
        compare: compareDiff,
      };
    },
    toMatchSnapshot() {
      return {
        compare: (value: unknown, name: string, file: string) => {
          return compareSnapshot(value, name, file);
        },
      };
    },
  });
});

jasmine.loadConfigFile(resolve(__dirname, '..', 'jasmine.json'));
jasmine.configureDefaultReporter({ showColors: true });
jasmine.loadConfig(resolve(__dirname, '..', 'jasmine.json'));
jasmine.execute();
