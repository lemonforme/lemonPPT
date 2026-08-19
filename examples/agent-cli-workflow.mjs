#!/usr/bin/env node
// 外部 AI Agent 通过 CLI 调用 lemonPPT 的端到端示例
// 用法：node examples/agent-cli-workflow.mjs

import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const cli = path.join(repoRoot, 'packages', 'cli', 'dist', 'cli.js');
const outDir = path.join(repoRoot, 'output', 'agent-example');
const goalPath = path.join(outDir, 'goal.json');

const goal = {
  title: 'AI Agent 集成 lemonPPT 示例',
  goal: '演示外部 Agent 如何调用 lemonPPT 生成可编辑 PPT',
  audience: '开发者',
  themePack: 'theme02',
  language: 'zh',
  slides: [
    {
      layout: 'theme02_cover_v1',
      props: {
        kicker: 'EXAMPLE',
        title: 'AI Agent 驱动 PPT 生成',
        subtitle: '从 goal.json 到可编辑 PPTX 的完整链路',
        date: '2026-08-18',
      },
    },
    {
      layout: 'theme02_content_v1',
      props: {
        kicker: 'WORKFLOW',
        title: '调用流程',
        bullets: [
          'Agent 生成 goal.json',
          '校验 → 渲染 → 校验 deck',
          '校验 copy → 导出 PPTX',
        ],
      },
    },
    {
      layout: 'theme02_closing_v1',
      props: {
        kicker: 'NEXT',
        title: '开始集成',
        subtitle: '把这段脚本复制到你的 Agent 编排层即可',
        cta: '立即接入',
      },
    },
  ],
};

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
  });
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await writeFile(goalPath, JSON.stringify(goal, null, 2));
  console.log('\n[1/5] 已生成 goal.json');

  await run('node', [cli, 'validate-goal-spec', goalPath]);
  console.log('[2/5] goal.json 校验通过');

  await run('node', [cli, 'render', goalPath, '--out', outDir]);
  console.log('[3/5] HTML 渲染完成');

  await run('node', [cli, 'validate-deck', outDir, '--goal', goalPath]);
  console.log('[4/5] deck 结构校验通过');

  await run('node', [cli, 'validate-copy', goalPath, outDir]);
  console.log('[5/5] copy 覆盖校验通过');

  await run('node', [cli, 'export', goalPath, '--pptx', path.join(outDir, 'deck.pptx')]);
  console.log('\n导出完成：');
  console.log(`  goal:  ${goalPath}`);
  console.log(`  html:  ${path.join(outDir, 'index.html')}`);
  console.log(`  pptx:  ${path.join(outDir, 'deck.pptx')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
