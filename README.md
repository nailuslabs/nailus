# NailusCSS

Instant on-demand atomic CSS engine with zero runtime output.

NailusCSS ships a processor, a CLI, plugin entry points, an attributify mode, and a `lang="nailus"` style parser for authoring utilities and generated CSS from templates.

## Installation

```bash
npm install nailuscss
```

## Quick Start

Generate a single CSS file from HTML and template files:

```bash
npx nailuscss "src/**/*.{html,tsx,vue,svelte}" -o nailus.css
```

Generate CSS in watch mode with preflight enabled:

```bash
npx nailuscss "src/**/*.{html,tsx,vue,svelte}" -t -d -o nailus.css
```

Use a config file:

```bash
npx nailuscss "src/**/*.{html,tsx,vue,svelte}" -f nailus.config.ts -o nailus.css
```

## Local Development

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

## Package Layout

- `src/lib`: processor core, variants, extraction, utilities
- `src/cli`: command-line interface and file watching
- `src/plugin`: official plugin entry points
- `src/utils/parser`: class, HTML and CSS parsers
- `test`: runtime, snapshot and typing coverage

## Status

The published npm package is expected to ship compiled files from `dist/`.
The root repository keeps source, tests and examples for development.

## Community

- Documentation: https://nailuscss.com
- Discussions: https://github.com/nailuslabs/nailuscss/discussions
- Issues: https://github.com/nailuslabs/nailuscss/issues
