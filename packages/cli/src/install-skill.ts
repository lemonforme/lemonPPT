import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface InstallSkillOptions {
  /** 指定安装的 Agent，默认全部 */
  agents?: string[];
}

const DEFAULT_AGENTS = ['claude', 'codex', 'cursor'];

function resolveSkillMdPath(): string {
  // Published package: SKILL.md lives next to the package root (one level above dist/)
  const mainUrl = import.meta.resolve('@lemonppt/cli');
  const pkgRoot = path.resolve(path.dirname(fileURLToPath(mainUrl)), '..');
  const published = path.join(pkgRoot, 'SKILL.md');
  if (existsSync(published)) {
    return published;
  }

  // Local monorepo dev: fallback to repo root SKILL.md
  const local = path.resolve(pkgRoot, '..', '..', 'SKILL.md');
  if (existsSync(local)) {
    return local;
  }

  throw new Error('SKILL.md not found. It should be bundled with @lemonppt/cli or exist at the repo root.');
}

async function installAgent(agent: string): Promise<void> {
  const homeDir = os.homedir();
  const skillDir = path.join(homeDir, `.${agent}/skills/lemonppt`);
  await mkdir(skillDir, { recursive: true });

  const skillMdSource = resolveSkillMdPath();
  await copyFile(skillMdSource, path.join(skillDir, 'SKILL.md'));
  await copyFile(skillMdSource, path.join(skillDir, 'README.md'));

  const scriptsDir = path.join(skillDir, 'scripts');
  await mkdir(scriptsDir, { recursive: true });

  const wrapperSh = `#!/bin/bash
set -e
exec npx @lemonppt/cli "$@"
`;
  await writeFile(path.join(scriptsDir, 'lemonppt.sh'), wrapperSh, { mode: 0o755 });

  const wrapperPs1 = `#Requires -Version 5.1
& npx @lemonppt/cli @args
`;
  await writeFile(path.join(scriptsDir, 'lemonppt.ps1'), wrapperPs1, { mode: 0o755 });

  console.log(`✓ Installed lemonPPT skill for ${agent} at ${skillDir}`);
}

/**
 * 将 lemonPPT skill 安装到常见 AI Agent 的技能目录。
 */
export async function installSkill(options: InstallSkillOptions = {}): Promise<void> {
  const agents = options.agents?.length ? options.agents : DEFAULT_AGENTS;

  for (const agent of agents) {
    await installAgent(agent);
  }

  console.log('\nInstallation complete.');
  console.log('Agents can now reference lemonPPT via SKILL.md in their skill directories.');
}
