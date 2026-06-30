import { spawnSync } from 'node:child_process';
import process from 'node:process';

const filters = [
  './packages-engine/*',
  './packages-pressets/*',
  './packages-integrations/*',
];

const result = spawnSync('pnpm', ['-r', ...filters.flatMap((filter) => ['--filter', filter]), 'run', 'build'], {
  stdio: 'inherit',
  shell: true,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
