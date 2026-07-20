#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 版式导出完整性审计
 * 对比 templates 注册的所有版式与 export-pptx.ts switch 中的 case，
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
  const caseMatches = source.matchAll(/case\s+['"]([a-z0-9_]+)['"]\s*:/g);
  const switchIds = [...new Set([...caseMatches].map((m) => m[1]))].sort();

  const missingInSwitch = registeredIds.filter((id) => !switchIds.includes(id));
  const unknownInSwitch = switchIds.filter((id) => !registeredIds.includes(id));

  console.log(`注册版式数：${registeredIds.length}`);
  console.log(`switch case 数：${switchIds.length}`);

  if (missingInSwitch.length === 0 && unknownInSwitch.length === 0) {
    console.log('✅ 所有注册版式均已映射到 PPTX 导出。');
    return;
  }

  if (missingInSwitch.length) {
    console.error('\n❌ 以下版式未在 export-pptx.ts 中处理：');
    for (const id of missingInSwitch) {
      console.error(`  - ${id}`);
    }
  }

  if (unknownInSwitch.length) {
    console.error('\n⚠️ 以下 case 在注册表中不存在（可能是废弃版式）：');
    for (const id of unknownInSwitch) {
      console.error(`  - ${id}`);
    }
  }

  process.exit(1);
}

main().catch((err) => {
  console.error('审计失败：', err);
  process.exit(1);
});
