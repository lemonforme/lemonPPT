// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { copyFile, cp, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface InstallSkillOptions {
  /** 指定安装的 Agent，默认全部 */
  agents?: string[];
  /** 自定义目标目录（直接复制整个 skill 包） */
  target?: string;
}

const DEFAULT_AGENTS = ['claude', 'codex', 'cursor'];

function resolveSkillMdPath(): string {
  const mainUrl = import.meta.resolve('@lemonppt/cli');
  const pkgRoot = path.resolve(path.dirname(fileURLToPath(mainUrl)), '..');

  // Local monorepo dev: repo root is two levels above the package root
  const local = path.resolve(pkgRoot, '..', '..', 'SKILL.md');
  if (existsSync(local) && existsSync(path.resolve(pkgRoot, '..', '..', 'apps', 'server'))) {
    return local;
  }

  // Published package: SKILL.md lives next to the package root (one level above dist/)
  const published = path.join(pkgRoot, 'SKILL.md');
  if (existsSync(published)) {
    return published;
  }

  throw new Error('SKILL.md not found. It should be bundled with @lemonppt/cli or exist at the repo root.');
}

function resolveRepoRoot(skillMdPath: string): string {
  return path.dirname(skillMdPath);
}

function resolveSkillBundlePath(skillMdPath: string): string {
  const repoRoot = resolveRepoRoot(skillMdPath);
  const bundlePath = path.join(repoRoot, 'skills', 'lemonppt');
  if (existsSync(bundlePath)) {
    return bundlePath;
  }
  throw new Error('Skill bundle not found at skills/lemonppt. Did you run the build script?');
}

function isSourceRepo(repoRoot: string): boolean {
  return existsSync(path.join(repoRoot, 'apps', 'server'));
}

function resolveCliWrapper(repoRoot: string): { sh: string; ps1: string; type: 'source' | 'published'; cli?: string } {
  if (isSourceRepo(repoRoot)) {
    const cliPath = path.join(repoRoot, 'packages', 'cli', 'dist', 'cli.js');
    return {
      type: 'source',
      cli: cliPath,
      sh: `#!/bin/bash\nset -e\nexec "${cliPath}" "$@"\n`,
      ps1: `#Requires -Version 5.1\n& node "${cliPath}" @args\n`,
    };
  }
  return {
    type: 'published',
    sh: `#!/bin/bash\nset -e\nexec npx lemonppt "$@"\n`,
    ps1: `#Requires -Version 5.1\n& npx lemonppt @args\n`,
  };
}

function resolveCliMarker(wrapper: { type: 'source' | 'published'; cli?: string }): string {
  return JSON.stringify(
    wrapper.type === 'source' && wrapper.cli
      ? { type: wrapper.type, cli: wrapper.cli }
      : { type: wrapper.type },
    null,
    2,
  );
}

async function installAgent(agent: string): Promise<void> {
  const homeDir = os.homedir();
  const skillDir = path.join(homeDir, `.${agent}/skills/lemonppt`);
  await mkdir(skillDir, { recursive: true });

  const skillMdSource = resolveSkillMdPath();
  const bundlePath = resolveSkillBundlePath(skillMdSource);
  await cp(bundlePath, skillDir, { recursive: true, force: true });

  // 兼容 OpenAI/Codex 等同时读取根目录 openai.yaml 的框架
  const agentYamlSource = path.join(bundlePath, 'agents', 'openai.yaml');
  if (existsSync(agentYamlSource)) {
    await copyFile(agentYamlSource, path.join(skillDir, 'openai.yaml'));
  }

  const repoRoot = resolveRepoRoot(skillMdSource);
  const wrapper = resolveCliWrapper(repoRoot);
  const scriptsDir = path.join(skillDir, 'scripts');
  await writeFile(path.join(scriptsDir, 'lemonppt.sh'), wrapper.sh, { mode: 0o755 });
  await writeFile(path.join(scriptsDir, 'lemonppt.ps1'), wrapper.ps1, { mode: 0o755 });
  await writeFile(path.join(scriptsDir, '.cli-path.json'), resolveCliMarker(wrapper));

  console.log(`✓ Installed lemonPPT skill for ${agent} at ${skillDir} (${wrapper.type} mode)`);
}

/**
 * 将 lemonPPT skill 安装到常见 AI Agent 的技能目录。
 */
export async function installSkill(options: InstallSkillOptions = {}): Promise<void> {
  if (options.target) {
    const skillMdSource = resolveSkillMdPath();
    const bundlePath = resolveSkillBundlePath(skillMdSource);
    await mkdir(options.target, { recursive: true });
    await cp(bundlePath, options.target, { recursive: true, force: true });

    const repoRoot = resolveRepoRoot(skillMdSource);
    const wrapper = resolveCliWrapper(repoRoot);
    const scriptsDir = path.join(options.target, 'scripts');
    await writeFile(path.join(scriptsDir, 'lemonppt.sh'), wrapper.sh, { mode: 0o755 });
    await writeFile(path.join(scriptsDir, 'lemonppt.ps1'), wrapper.ps1, { mode: 0o755 });
    await writeFile(path.join(scriptsDir, '.cli-path.json'), resolveCliMarker(wrapper));

    console.log(`✓ Copied skill bundle to ${options.target} (${wrapper.type} mode)`);
    return;
  }

  const agents = options.agents?.length ? options.agents : DEFAULT_AGENTS;

  for (const agent of agents) {
    await installAgent(agent);
  }

  console.log('\nInstallation complete.');
  console.log('Agents can now reference lemonPPT via SKILL.md in their skill directories.');
}
