// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { spawn } from 'node:child_process';
import process from 'node:process';
import { resolveCli } from './resolve-cli.mjs';

const command = process.argv[2];
const args = process.argv.slice(3);

const cli = await resolveCli();
const spawnArgs = [...cli.args, command, ...args];

const isNpx = cli.cmd === 'npx' || cli.cmd === 'npx.cmd';
const child = spawn(cli.cmd, spawnArgs, {
  stdio: 'inherit',
  shell: isNpx ? process.platform === 'win32' : false,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
