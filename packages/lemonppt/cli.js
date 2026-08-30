#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Unscoped alias entrypoint for lemonPPT CLI.
 * This thin wrapper delegates to the real implementation in @lemonppt/cli.
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const mainUrl = import.meta.resolve('@lemonppt/cli');
const mainPath = fileURLToPath(mainUrl);
const pkgDir = path.resolve(mainPath, '..', '..');
const cliPkg = JSON.parse(readFileSync(path.join(pkgDir, 'package.json'), 'utf-8'));
const binEntry = typeof cliPkg.bin === 'string' ? cliPkg.bin : cliPkg.bin?.lemonppt;
if (!binEntry) {
  console.error('无法定位 @lemonppt/cli 的 bin 入口');
  process.exit(1);
}
const cliPath = path.join(pkgDir, binEntry);

const result = spawnSync(
  process.execPath,
  [cliPath, ...process.argv.slice(2)],
  { stdio: 'inherit' },
);

process.exit(result.status ?? (result.signal ? 1 : 0));
