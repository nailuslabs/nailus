const { DisplayProcessor, SpecReporter } = require('jasmine-spec-reporter');
const { context, finishSnapshots } = require('./snapshot');

class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(): string {
    return 'TypeScript test started';
  }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  new SpecReporter({
    spec: {
      displayPending: true,
      displayDuration: true,
    },
    customProcessors: [CustomProcessor],
  })
);

jasmine.getEnv().addReporter({
  suiteStarted(result) {
    context.describe = result.description;
  },
  specStarted(result) {
    context.it = result.description;
    context.count = 0;
  },
  jasmineDone(result) {
    const passed = result.overallStatus === 'passed';
    finishSnapshots(passed);
    if (!passed) process.exitCode = 1;
  },
});
