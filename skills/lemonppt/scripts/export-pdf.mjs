// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node scripts/export-pdf.mjs <goal.json> <output.pdf>');
  process.exit(1);
}
const [goal, out, ...rest] = args;
const child = spawn(process.execPath, [path.join(__dirname, 'run-cli.mjs'), 'export', goal, '--pdf', out, ...rest], {
  stdio: 'inherit',
});
child.on('exit', (code) => process.exit(code ?? 0));
