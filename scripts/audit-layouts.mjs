#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 版式导出完整性审计
 * 对比 templates 注册的所有版式与 export-pptx.ts 中注册的渲染器，
 * 输出未覆盖的版式列表。
 *
 * 用法：
 *   node scripts/audit-layouts.mjs
 * 退出码：
 *   0 - 全部覆盖
 *   1 - 存在缺失
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listLayouts } from '@lemonppt/templates';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const exportPptxPath = path.join(rootDir, 'packages', 'renderer', 'src', 'export-pptx.ts');

async function main() {
  const layouts = listLayouts();
  const registeredIds = layouts.map((m) => m.id).sort();

  const source = await readFile(exportPptxPath, 'utf-8');

  // 1. 按 layoutId 注册的通用渲染器
  const layoutRendererMatches = source.matchAll(
    /registerPptxLayoutRenderer\(\s*['"]([^'"]+)['"]\s*,/g
  );
  const layoutRendererIds = new Set([...layoutRendererMatches].map((m) => m[1]));

  // 2. 按 (role, theme) 注册的主题专属渲染器
  const roleRendererMatches = source.matchAll(
    /registerPptxRoleRenderer\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*,/g
  );
  const roleRenderers = new Map();
  for (const [, role, theme] of roleRendererMatches) {
    if (!roleRenderers.has(role)) {
      roleRenderers.set(role, new Set());
    }
    roleRenderers.get(role).add(theme);
  }

  const missing = [];
  const unknownLayoutRenderers = [];
  const unknownRoleRenderers = [];

  for (const meta of layouts) {
    const byLayout = layoutRendererIds.has(meta.id);
    const byRoleTheme =
      roleRenderers.get(meta.role)?.has(meta.theme) ?? false;
    if (!byLayout && !byRoleTheme) {
      missing.push(meta.id);
    }
  }

  // 发现注册表里没有的渲染器（可能是废弃或拼写错误）
  for (const id of layoutRendererIds) {
    if (!registeredIds.includes(id)) {
      unknownLayoutRenderers.push(id);
    }
  }
  for (const [role, themes] of roleRenderers) {
    for (const theme of themes) {
      const hasLayout = layouts.some(
        (m) => m.role === role && m.theme === theme
      );
      if (!hasLayout) {
        unknownRoleRenderers.push(`${role}/${theme}`);
      }
    }
  }

  const coveredCount = layouts.length - missing.length;

  console.log(`注册版式数：${layouts.length}`);
  console.log(`已覆盖版式数：${coveredCount}`);
  console.log(`通用 layout 渲染器数：${layoutRendererIds.size}`);
  console.log(`主题专属 role 渲染器数：${[...roleRenderers.values()].reduce((acc, s) => acc + s.size, 0)}`);

  if (missing.length === 0 && unknownLayoutRenderers.length === 0 && unknownRoleRenderers.length === 0) {
    console.log('✅ 所有注册版式均已映射到 PPTX 导出。');
    return;
  }

  if (missing.length) {
    console.error('\n❌ 以下版式未在 export-pptx.ts 中处理：');
    for (const id of missing.sort()) {
      console.error(`  - ${id}`);
    }
  }

  if (unknownLayoutRenderers.length) {
    console.error('\n⚠️ 以下通用 layout 渲染器在注册表中不存在（可能是废弃版式）：');
    for (const id of unknownLayoutRenderers.sort()) {
      console.error(`  - ${id}`);
    }
  }

  if (unknownRoleRenderers.length) {
    console.error('\n⚠️ 以下主题专属 role 渲染器在注册表中不存在：');
    for (const key of unknownRoleRenderers.sort()) {
      console.error(`  - ${key}`);
    }
  }

  process.exit(1);
}

main().catch((err) => {
  console.error('审计失败：', err);
  process.exit(1);
});
