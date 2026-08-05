// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 将 theme01 组件中的硬编码颜色/字体替换为 CSS 变量。
 * 仅处理 packages/templates/src/themes/theme01 下除 tokens.ts 与 echart.tsx 外的 tsx 文件。
 */

import fs from 'fs';
import path from 'path';

const THEME_DIR = path.resolve(process.cwd(), 'packages/templates/src/themes/theme01');

const COLOR_MAP = {
  '#2563EB': 'var(--lp-blue)',
  '#10B981': 'var(--lp-green)',
  '#F59E0B': 'var(--lp-amber)',
  '#EF4444': 'var(--lp-red)',
  '#8B5CF6': 'var(--lp-violet)',
  '#EC4899': 'var(--lp-pink)',
  '#06B6D4': 'var(--lp-cyan)',
  '#F97316': 'var(--lp-orange)',
  '#84CC16': 'var(--lp-lime)',
  '#4B5563': 'var(--lp-gray-600)',
  '#6B7280': 'var(--lp-gray-500)',
  '#9CA3AF': 'var(--lp-gray-400)',
  '#E5E7EB': 'var(--lp-gray-200)',
  '#F3F4F6': 'var(--lp-gray-100)',
  '#DBEAFE': 'var(--lp-blue-100)',
  '#374151': 'var(--lp-gray-700)',
  '#fff': 'var(--lp-white)',
  '#ffffff': 'var(--lp-white)',
  '#FFFFFF': 'var(--lp-white)',
};

const FONT_MAP = {
  '"Inter", "Noto Sans SC", sans-serif': 'var(--lp-font)',
  '"Inter", "Noto Sans SC", "PingFang SC", sans-serif': 'var(--lp-font)',
  'Inter, "Noto Sans SC", sans-serif': 'var(--lp-font)',
};

function replaceColors(source) {
  let result = source;
  for (const [hex, cssVar] of Object.entries(COLOR_MAP)) {
    const re = new RegExp(hex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(re, cssVar);
  }
  for (const [font, cssVar] of Object.entries(FONT_MAP)) {
    result = result.replaceAll(font, cssVar);
  }
  return result;
}

function main() {
  const files = fs.readdirSync(THEME_DIR)
    .filter((name) => name.endsWith('.tsx'))
    .filter((name) => name !== 'tokens.ts' && name !== 'echart.tsx')
    .map((name) => path.join(THEME_DIR, name));

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf-8');
    const updated = replaceColors(source);
    if (updated !== source) {
      fs.writeFileSync(file, updated, 'utf-8');
      console.log('updated', path.relative(process.cwd(), file));
    }
  }
}

main();
