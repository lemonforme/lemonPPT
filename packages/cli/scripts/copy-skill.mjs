#!/usr/bin/env node
import { copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const source = path.join(repoRoot, 'SKILL.md');
const dest = path.join(__dirname, '..', 'SKILL.md');

await copyFile(source, dest);
console.log('Copied SKILL.md to packages/cli/SKILL.md');
