#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const ROLES = [
  'cover',
  'tableOfContents',
  'metric',
  'stats',
  'chart',
  'comparison',
  'pricing',
  'process',
  'timeline',
  'roadmap',
  'quote',
  'testimonial',
  'content',
  'faq',
  'feature',
  'team',
  'partners',
  'image',
  'gallery',
  'bento',
  'table',
  'tags',
  'filmstrip',
  'swot',
  'pest',
  'closing',
];

async function main() {
  const { listLayoutsByRoleAndTheme, getLayoutSchema } = await import('@lemonppt/templates');
  const { themes } = await import('@lemonppt/themes');

  const themeList = themes.map((t) => t.id).sort();
  const lines = [
    '# lemonPPT 版式角色速查表',
    '',
    '> 本文件由 `scripts/gen-layout-roles-md.mjs` 自动生成，供 AI Agent 选页参考。',
    '> 每页必须有一个 `role`；每个 `role` 下会列出各主题可用的版式及其必填字段。',
    '',
    '## 角色总览',
    '',
    ROLES.map((r) => `- \`${r}\``).join('\n'),
    '',
    '---',
    '',
  ];

  for (const role of ROLES) {
    lines.push(`## ${role}`, '');
    let roleHasLayouts = false;
    for (const theme of themeList) {
      const layouts = listLayoutsByRoleAndTheme(role, theme);
      if (!layouts || layouts.length === 0) continue;
      roleHasLayouts = true;
      lines.push(`### ${theme}`, '');
      for (const layout of layouts) {
        const schema = getLayoutSchema(layout.id);
        const fields = schema?.fields ?? [];
        const media = (layout.mediaSlots ?? [])
          .map((m) => `${m.name}${m.fieldPath ? ` (${m.fieldPath})` : ''}`)
          .join(', ') || '无';
        const fieldSummary = fields
          .map((f) => `\`${f.key}\`: ${f.type}`)
          .join(', ');
        lines.push(`- **\`${layout.id}\`** — ${layout.displayName || ''}`);
        if (layout.description) lines.push(`  - 描述：${layout.description}`);
        lines.push(`  - 媒体槽：${media}`);
        if (fieldSummary) lines.push(`  - 字段：${fieldSummary}`);
      }
      lines.push('');
    }
    if (!roleHasLayouts) {
      lines.push('（当前没有任何主题实现该角色）', '');
    }
  }

  const content = lines.join('\n');

  const refsDir = path.join(repoRoot, 'references');
  const skillRefsDir = path.join(repoRoot, 'skills', 'lemonppt', 'references');
  await mkdir(refsDir, { recursive: true });
  await mkdir(skillRefsDir, { recursive: true });

  await writeFile(path.join(refsDir, 'layout-roles.md'), content);
  await writeFile(path.join(skillRefsDir, 'layout-roles.md'), content);
  console.log(`Generated references/layout-roles.md and skills/lemonppt/references/layout-roles.md`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
