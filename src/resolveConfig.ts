import { baseConfig } from './config';
import { Processor } from './lib';

import type { Config } from './interfaces';

export default function resolveConfig(config?: Config, presets: Config = baseConfig): Config {
  return new Processor().resolveConfig(config, presets);
}
