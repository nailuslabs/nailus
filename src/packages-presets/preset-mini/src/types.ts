export type ThemeUtil = (path: string, defaultValue?: unknown) => any;

export type ConfigUtil = (
  theme: ThemeUtil,
  helpers: {
    negative: (config: Record<string, string>) => Record<string, string>;
    breakpoints: (config: Record<string, string>) => Record<string, string>;
  }
) => Record<string, any>;