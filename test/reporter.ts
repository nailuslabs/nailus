import { DisplayProcessor, SpecReporter } from 'jasmine-spec-reporter';
import type Jasmine from 'jasmine';

class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(): string {
    return 'TypeScript test started';
  }
}

export function setupReporter(jasmine: Jasmine): void {
  jasmine.clearReporters();
  jasmine.addReporter(
    new SpecReporter({
      spec: {
        displayPending: true,
        displayDuration: true,
      },
      customProcessors: [CustomProcessor],
    })
  );
}
