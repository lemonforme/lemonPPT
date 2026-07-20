#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 根据自然语言生成 goal.json
 * 用法: node scripts/generate-goal.mjs "描述你的演示文稿主题" [path/to/output.json]
 */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateGoal } from '@lemonppt/agent-prompts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const input = process.argv[2];
const outFile = process.argv[3] ?? path.join(rootDir, 'output', 'generated-goal.json');

if (!input) {
  console.error('用法: node scripts/generate-goal.mjs "描述你的演示文稿主题" [path/to/output.json]');
  process.exit(1);
}

async function main() {
  const result = await generateGoal({
    input,
    pageCount: 8,
    theme: 'base',
    language: 'zh',
    llm: {
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL,
      model: process.env.OPENAI_MODEL,
    },
  });

  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(result.goal, null, 2), 'utf-8');

  console.log(`已生成 goal.json: ${outFile}`);
  console.log(`来源: ${result.source === 'llm' ? 'LLM' : 'Fallback（未配置 API Key）'}`);
  console.log(`页数: ${result.goal.slides.length}`);
  console.log(`标题: ${result.goal.title}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
