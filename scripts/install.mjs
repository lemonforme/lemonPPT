#!/usr/bin/env node
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultProjectDir = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = { projectDir: defaultProjectDir, agents: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--project-dir' || arg === '-p') {
      args.projectDir = path.resolve(argv[++i] || defaultProjectDir);
    } else if (arg === '--claude') {
      args.agents.push('claude');
    } else if (arg === '--codex') {
      args.agents.push('codex');
    } else if (arg === '--cursor') {
      args.agents.push('cursor');
    } else if (arg === '--all') {
      args.agents = ['claude', 'codex', 'cursor'];
    }
  }
  if (args.agents.length === 0) {
    args.agents = ['claude', 'codex', 'cursor'];
  }
  return args;
}

async function installAgent(agent, projectDir) {
  const homeDir = os.homedir();
  const skillDir = path.join(homeDir, `.${agent}/skills/lemonppt`);
  await mkdir(skillDir, { recursive: true });

  const skillMdSource = path.join(projectDir, 'SKILL.md');
  if (!existsSync(skillMdSource)) {
    throw new Error(`SKILL.md not found at ${skillMdSource}`);
  }

  await copyFile(skillMdSource, path.join(skillDir, 'SKILL.md'));
  await copyFile(skillMdSource, path.join(skillDir, 'README.md'));

  const scriptsDir = path.join(skillDir, 'scripts');
  await mkdir(scriptsDir, { recursive: true });

  const cliPath = path.join(projectDir, 'packages/cli/dist/cli.js');
  const wrapperSh = `#!/bin/bash
set -e
exec node "${cliPath}" "$@"
`;
  await writeFile(path.join(scriptsDir, 'lemonppt.sh'), wrapperSh, { mode: 0o755 });

  const wrapperPs1 = `#Requires -Version 5.1
& node "${cliPath}" @args
`;
  await writeFile(path.join(scriptsDir, 'lemonppt.ps1'), wrapperPs1, { mode: 0o755 });

  console.log(`✓ Installed lemonPPT skill for ${agent} at ${skillDir}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  for (const agent of args.agents) {
    await installAgent(agent, args.projectDir);
  }

  console.log('\nInstallation complete.');
  console.log('Agents can now reference lemonPPT via SKILL.md in their skill directories.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
