// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

import Jasmine from 'jasmine';
import { fileURLToPath } from 'node:url';
import { compareDiff, compareSnapshot, context, finishSnapshots } from './snapshot';
import { setupReporter } from './reporter';

const jasmine = new Jasmine(undefined);
const configPath = fileURLToPath(new URL('../jasmine.json', import.meta.url));
const files = process.argv.slice(2);

jasmine.exitOnCompletion = false;
const suiteStack: string[] = [];

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

jasmine.loadConfigFile(configPath);
setupReporter(jasmine);
jasmine.addReporter({
  suiteStarted(result) {
    suiteStack.push(result.description);
  },
  suiteDone() {
    suiteStack.pop();
  },
  specStarted(result) {
    context.describe = suiteStack.join(' / ');
    context.it = result.description;
    context.count = 0;
  },
});
jasmine.configureDefaultReporter({ showColors: true });

try {
  const result = await jasmine.execute(files.length > 0 ? files : undefined);
  const passed = result.overallStatus === 'passed';
  finishSnapshots(passed);
  if (!passed) process.exitCode = 1;
} catch (error) {
  finishSnapshots(false);
  throw error;
}
