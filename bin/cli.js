#!/usr/bin/env node

import('../dist/cli/index.js').catch((err) => {
  console.error('Failed to start CLI:', err.message);
  console.error('Run "npm run build" first to compile TypeScript.');
  process.exit(1);
});
