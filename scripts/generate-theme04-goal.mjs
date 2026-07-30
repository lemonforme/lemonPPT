#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sampleProps } from './lib/sample-props.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const themeDir = path.join(rootDir, 'packages/templates/src/themes/theme04');

function extractMeta(source) {
  const idMatch = source.match(/id:\s*['"]([^'"]+)['"]/);
  const roleMatch = source.match(/role:\s*['"]([^'"]+)['"]/);
  return {
    id: idMatch?.[1],
    role: roleMatch?.[1],
  };
}

function layoutOrder(a, b) {
  const order = [
    'cover',
    'tableOfContents',
    'content',
    'chapter',
    'metric',
    'chart',
    'table',
    'process',
    'roadmap',
    'timeline',
    'feature',
    'bento',
    'gallery',
    'image',
    'team',
    'quote',
    'comparison',
    'closing',
  ];
  const ai = order.indexOf(a.role);
  const bi = order.indexOf(b.role);
  if (ai !== bi) return ai - bi;
  return a.id.localeCompare(b.id);
}

async function main() {
  const files = await readdir(themeDir);
  const tsxFiles = files.filter((f) => f.endsWith('.tsx') && f !== 'tokens.ts');

  const layouts = [];
  for (const file of tsxFiles) {
    const source = await readFile(path.join(themeDir, file), 'utf-8');
    const meta = extractMeta(source);
    if (!meta.id || !meta.role) {
      console.warn(`跳过无法解析 meta 的文件: ${file}`);
      continue;
    }
    layouts.push(meta);
  }

  layouts.sort(layoutOrder);

  const slides = layouts.map((layout) => ({
    role: layout.role,
    layout: layout.id,
    props: sampleProps({ id: layout.id, role: layout.role }),
  }));

  const goal = {
    title: 'theme04 玻璃糖果风演示',
    goal: '展示 theme04 全部版式',
    audience: '品牌团队、设计师、内容创作者',
    themePack: 'theme04',
    theme: 'theme04',
    colorScheme: 'green',
    appearance: 'dark',
    language: 'zh',
    pageCount: slides.length,
    slides,
  };

  const outFile = path.join(rootDir, 'examples/theme04-goal.json');
  await writeFile(outFile, JSON.stringify(goal, null, 2) + '\n', 'utf-8');
  console.log(`已生成 theme04 完整示例 goal: ${outFile}`);
  console.log(`共包含 ${slides.length} 个版式`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
