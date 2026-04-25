import resolveConfig from '../../src/resolveConfig';

import type { Config } from '../../src/interfaces';

describe('resolveConfig export', () => {
  it('supports function-based theme extensions', () => {
    const userConfig: Config = {
      theme: {
        extend: {
          height: (theme) => ({
            custom: `calc(100% - ${theme('spacing.16') as string})`,
          }),
        },
      },
    };

    const resolved = resolveConfig(userConfig);
    const theme = resolved.theme as Record<string, unknown>;
    const height = theme.height as Record<string, string>;

    expect(height.custom).toContain('calc(100% - ');
  });
});
