#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 版式导出完整性审计
 * 对比 templates 注册的所有版式与 themeNN-pptx.ts 中注册的渲染器，
 * 输出未覆盖的版式列表。
 *
 * 用法：
 *   node scripts/audit-layouts.mjs
 * 退出码：
 *   0 - 全部覆盖
 *   1 - 存在缺失
 */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listLayouts } from '@lemonppt/templates';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const rendererDir = path.join(rootDir, 'packages', 'renderer', 'src');

async function findThemeRendererPaths() {
  const entries = await readdir(rendererDir);
  return entries
    .filter((f) => /^theme\d{2}-pptx\.ts$/.test(f))
    .map((f) => path.join(rendererDir, f))
    .sort();
}

/**
 * 从单个 themeNN-pptx.ts 文件提取已注册的 layoutId。
 * 支持两种写法：
 *   1) registerPptxLayoutRenderer('themeNN_xxx_v1', renderFn)
 *   2) const RENDERERS = { 'themeNN_xxx_v1': renderFn, ... }
 */
function extractStringArray(src, varName) {
  const re = new RegExp(`const\\s+${varName}\\s*=\\s*\\[`, 's');
  const m = src.match(re);
  if (!m) return [];
  const start = m.index + m[0].length - 1;
  let depth = 1;
  let i = start + 1;
  while (depth > 0 && i < src.length) {
    const ch = src[i];
    if (ch === '[') depth++;
    else if (ch === ']') depth--;
    i++;
  }
  const block = src.slice(start + 1, i - 1);
  const items = [];
  for (const mm of block.matchAll(/['"]([^'"]+)['"]/g)) {
    items.push(mm[1]);
  }
  return items;
}

async function extractRegisteredIds(filePath) {
  const src = await readFile(filePath, 'utf-8');
  const ids = new Set();

  // 模式 1：直接注册
  for (const m of src.matchAll(/registerPptxLayoutRenderer\(\s*['"]([^'"]+)['"]\s*,/g)) {
    ids.add(m[1]);
  }

  // 模式 2：RENDERERS 映射表（theme01 / theme08 / theme09 / theme10 等）
  const renderersMatch = src.match(/const\s+RENDERERS[\s\S]*?=\s*\{/s);
  if (renderersMatch) {
    const startIndex = renderersMatch.index + renderersMatch[0].length;
    // 取到下一个顶层 '}' 之前的文本。简化处理：从起始位置向后查找未匹配的右花括号。
    let braceDepth = 1;
    let endIndex = startIndex;
    while (braceDepth > 0 && endIndex < src.length) {
      const ch = src[endIndex];
      if (ch === '{') braceDepth++;
      else if (ch === '}') braceDepth--;
      endIndex++;
    }
    const block = src.slice(startIndex, endIndex - 1);
    for (const m of block.matchAll(/(?:['"]([^'"]+)['"]|([A-Za-z0-9_]+))\s*:/g)) {
      const key = m[1] || m[2];
      // RENDERERS 中只应包含版式 id（themeNN_xxx_vN）
      if (/^theme\d{2}_/.test(key)) {
        ids.add(key);
      }
    }

    // 模式 2b：展开由 Object.fromEntries(XXX_LAYOUTS.map(...)) 生成的渲染器表
    for (const m of block.matchAll(/\.\.\.(\w+_RENDERERS)/g)) {
      const tableName = m[1];
      const layoutsName = tableName.replace(/_RENDERERS$/, '_LAYOUTS');
      const items = extractStringArray(src, layoutsName);
      for (const id of items) {
        if (/^theme\d{2}_/.test(id)) ids.add(id);
      }
    }
  }

  return ids;
}

async function main() {
  const layouts = listLayouts();
  const registeredIds = layouts.map((m) => m.id).sort();

  const themePaths = await findThemeRendererPaths();
  const layoutRendererIds = new Set();
  for (const p of themePaths) {
    const ids = await extractRegisteredIds(p);
    for (const id of ids) {
      layoutRendererIds.add(id);
    }
  }

  const missing = [];
  for (const meta of layouts) {
    if (!layoutRendererIds.has(meta.id)) {
      missing.push(meta.id);
    }
  }

  const unknownLayoutRenderers = [];
  for (const id of layoutRendererIds) {
    if (!registeredIds.includes(id)) {
      unknownLayoutRenderers.push(id);
    }
  }

  const coveredCount = layouts.length - missing.length;

  console.log(`注册版式数：${layouts.length}`);
  console.log(`已覆盖版式数：${coveredCount}`);
  console.log(`扫描到的渲染器注册数：${layoutRendererIds.size}`);
  console.log(`扫描的渲染器文件：${themePaths.map((p) => path.basename(p)).join(', ')}`);

  if (missing.length === 0 && unknownLayoutRenderers.length === 0) {
    console.log('✅ 所有注册版式均已映射到 PPTX 导出。');
    return;
  }

  if (missing.length) {
    console.error('\n❌ 以下版式未在 themeNN-pptx.ts 中处理：');
    for (const id of missing.sort()) {
      console.error(`  - ${id}`);
    }
  }

  if (unknownLayoutRenderers.length) {
    console.error('\n⚠️ 以下渲染器在注册表中不存在（可能是废弃版式）：');
    for (const id of unknownLayoutRenderers.sort()) {
      console.error(`  - ${id}`);
    }
  }

  process.exit(1);
}

main().catch((err) => {
  console.error('审计失败：', err);
  process.exit(1);
});
