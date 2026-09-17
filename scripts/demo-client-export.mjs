#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 浏览器端快速导出 PPTX 演示脚本。
 *
 * 生成可编辑编辑器页面，然后在浏览器中打开，供用户点击「快速导出 PPTX」体验。
 *
 * 用法：
 *   node scripts/demo-client-export.mjs
 *   node scripts/demo-client-export.mjs --theme theme01
 *   node scripts/demo-client-export.mjs --goal ./examples/sample-goal.json
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const goalArgIndex = args.indexOf('--goal');
const goalFile = goalArgIndex !== -1 && args[goalArgIndex + 1]
  ? path.resolve(args[goalArgIndex + 1])
  : path.join(rootDir, 'examples', 'sample-goal.json');

const themeArg = args.find((a) => a.startsWith('--theme='));
const theme = themeArg ? themeArg.replace('--theme=', '') : undefined;

const renderArgs = [
  'packages/cli/dist/cli.js',
  'render',
  goalFile,
  '--out',
  './output',
  '--editable',
];
if (theme) {
  renderArgs.push('--theme', theme);
}

console.log('🍋 正在生成编辑器页面...');
console.log(`   目标：${goalFile}`);

const child = spawn('node', renderArgs, {
  cwd: rootDir,
  stdio: 'inherit',
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`渲染失败，退出码 ${code}`);
    process.exit(code ?? 1);
  }

  const editorPath = path.join(rootDir, 'output', 'editor.html');
  console.log('\n✅ 编辑器已生成：');
  console.log(`   ${editorPath}`);
  console.log('\n👉 在浏览器中打开该页面，点击右上角导出菜单 → 「⚡ 快速导出 PPTX」');
  console.log('   复杂图表或自定义字体场景若导出失败，可回退到「导出 PPTX」（服务端导出）。');
});
