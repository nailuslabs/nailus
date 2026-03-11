#!/usr/bin/env node

import('../dist/cli/index.js').catch((err) => {
  console.error('Failed to load nailus CLI:', err);
  process.exit(1);
});