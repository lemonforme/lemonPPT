#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(__dirname, '..', 'packages', 'cli', 'dist', 'cli.js');

function parseAgentArgs(argv) {
  const flags = [];
  for (const arg of argv) {
    if (arg === '--claude' || arg === '--codex' || arg === '--cursor' || arg === '--all') {
      flags.push(arg);
    }
  }
  return flags.length ? flags : ['--all'];
}

const agentFlags = parseAgentArgs(process.argv.slice(2));
const child = spawn('node', [cliPath, 'install-skill', ...agentFlags], {
  stdio: 'inherit',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
