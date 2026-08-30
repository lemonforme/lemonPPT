// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function resolveCli() {
  if (process.env.LEMONPPT_CLI) {
    return { type: 'source', cmd: process.env.LEMONPPT_CLI, args: [] };
  }

  const marker = path.join(__dirname, '.cli-path.json');
  if (existsSync(marker)) {
    const cfg = JSON.parse(await readFile(marker, 'utf-8'));
    if (cfg.cli && existsSync(cfg.cli)) {
      return { type: cfg.type || 'source', cmd: cfg.cli, args: [] };
    }
    if (cfg.type === 'published') {
      return { type: 'published', cmd: 'npx', args: ['lemonppt'] };
    }
  }

  // Monorepo dev: skill bundle at repo/skills/lemonppt/scripts
  const sourceCli = path.resolve(__dirname, '..', '..', '..', 'packages', 'cli', 'dist', 'cli.js');
  if (existsSync(sourceCli)) {
    return { type: 'source', cmd: sourceCli, args: [] };
  }

  // Fallback to published package
  return { type: 'published', cmd: 'npx', args: ['lemonppt'] };
}
