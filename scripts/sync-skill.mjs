#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { copyFile, cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const skillRoot = path.join(repoRoot, 'skills', 'lemonppt');

await mkdir(path.join(skillRoot, 'agents'), { recursive: true });
await mkdir(path.join(skillRoot, 'assets'), { recursive: true });

await copyFile(path.join(repoRoot, 'SKILL.md'), path.join(skillRoot, 'SKILL.md'));
await copyFile(path.join(repoRoot, 'agents', 'openai.yaml'), path.join(skillRoot, 'agents', 'openai.yaml'));
await cp(path.join(repoRoot, 'assets'), path.join(skillRoot, 'assets'), { recursive: true, force: true });

console.log('Synced skills/lemonppt/ from repository root.');
