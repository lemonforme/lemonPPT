#!/usr/bin/env node
// 外部 AI Agent 通过 HTTP API 调用 lemonPPT 的端到端示例
// 前置条件：lemonppt serve 已启动（默认端口 3456）
// 用法：node examples/agent-http-workflow.mjs

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const baseUrl = process.env.LEMONPPT_API || 'http://localhost:3456';
const outDir = path.join(repoRoot, 'output', 'agent-http-example');

const goal = {
  title: 'AI Agent HTTP 调用 lemonPPT',
  goal: '演示外部 Agent 通过 HTTP 接口调用 lemonPPT',
  audience: '开发者',
  themePack: 'theme01',
  language: 'zh',
  slides: [
    {
      layout: 'theme01_cover_v1',
      props: {
        kicker: 'HTTP API',
        title: 'Agent 服务化集成',
        subtitle: 'goal.json → 渲染 → PPTX，全部通过 API 完成',
        date: '2026-08-18',
      },
    },
    {
      layout: 'theme01_content_v1',
      props: {
        title: '常用接口',
        bullets: [
          'POST /api/render',
          'POST /api/export/pptx',
          'POST /api/render-editor',
          'POST /api/stage-media',
        ],
      },
    },
    {
      layout: 'theme01_closing_v2',
      props: {
        kicker: 'START',
        title: '开始接入',
        subtitle: '把 baseUrl 改成你的服务地址即可',
        cta: '立即接入',
      },
    },
  ],
};

async function post(endpoint, body) {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`${endpoint} failed: ${res.status} ${await res.text()}`);
  }
  return res;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  console.log('\n[1/3] 调用 /api/render');
  const renderRes = await post('/api/render', goal);
  const renderJson = await renderRes.json();
  console.log(JSON.stringify(renderJson, null, 2));

  console.log('[2/3] 调用 /api/export/pptx');
  const exportRes = await post('/api/export/pptx', goal);
  const pptxBuffer = Buffer.from(await exportRes.arrayBuffer());
  const pptxPath = path.join(outDir, 'deck.pptx');
  await writeFile(pptxPath, pptxBuffer);
  console.log(`已保存 PPTX: ${pptxPath}`);

  console.log('[3/3] 调用 /api/render-editor');
  const editorRes = await fetch(`${baseUrl}/api/render-editor?theme=theme01`);
  if (!editorRes.ok) throw new Error(`/api/render-editor failed: ${editorRes.status}`);
  const editorJson = await editorRes.json();
  await writeFile(path.join(outDir, 'editor-data.json'), JSON.stringify(editorJson, null, 2));
  console.log(`已保存 editor data: ${path.join(outDir, 'editor-data.json')}`);

  console.log('\n完成');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
