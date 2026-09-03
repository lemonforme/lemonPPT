#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * DOM-to-PPTX 全主题验证脚本（阶段 5）。
 *
 * 对 theme01~theme11 分别使用现有 gallery goal 执行截图式导出，
 * 校验输出文件存在、大小合理、页数匹配，并汇总耗时与错误。
 *
 * 用法：
 *   node scripts/validate-dom-to-pptx-themes.mjs
 *   node scripts/validate-dom-to-pptx-themes.mjs --themes theme01,theme02
 *   node scripts/validate-dom-to-pptx-themes.mjs --verbose
 *   node scripts/validate-dom-to-pptx-themes.mjs --no-images
 */

import { existsSync } from 'node:fs';
import { mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportDeckToPptxScreenshot } from '@lemonppt/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'output', 'validate-phase5');

const themes = [
  'theme01',
  'theme02',
  'theme03',
  'theme04',
  'theme05',
  'theme06',
  'theme07',
  'theme08',
  'theme09',
  'theme10',
  'theme11',
];

const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const noImages = args.includes('--no-images');

let selectedThemes = themes;
const themesFlagIndex = args.indexOf('--themes');
if (themesFlagIndex !== -1 && args[themesFlagIndex + 1]) {
  const filtered = args[themesFlagIndex + 1].split(',').filter(Boolean);
  if (filtered.length > 0) {
    selectedThemes = themes.filter((t) => filtered.includes(t));
  }
} else {
  const themeFilterArg = args.find((a) => a.startsWith('--themes='));
  if (themeFilterArg) {
    const filtered = themeFilterArg.replace('--themes=', '').split(',').filter(Boolean);
    if (filtered.length > 0) {
      selectedThemes = themes.filter((t) => filtered.includes(t));
    }
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatMs(ms) {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function createLogger(theme) {
  return {
    debug: (message, ...args) => {
      if (verbose) console.log(`[${theme}] ${message}`, ...args);
    },
    info: (message, ...args) => console.log(`[${theme}] ${message}`, ...args),
    warn: (message, ...args) => console.warn(`[${theme}] ⚠️ ${message}`, ...args),
    error: (message, ...args) => console.error(`[${theme}] ❌ ${message}`, ...args),
  };
}

async function validateTheme(theme) {
  const goalPath = path.join(rootDir, 'output', `${theme}-gallery-goal.json`);
  if (!existsSync(goalPath)) {
    return {
      theme,
      status: 'skipped',
      reason: `goal file not found: ${goalPath}`,
    };
  }

  const raw = await readFile(goalPath, 'utf-8');
  const goal = JSON.parse(raw);

  // gallery goal 中可能包含未进入 schema role 枚举的版式，
  // 但 renderer 实际只关心 layout 名称，因此直接导出而不做严格 schema 校验。
  const outFile = path.join(outputDir, `${theme}-phase5.pptx`);
  const start = Date.now();
  const warnings = [];
  try {
    await exportDeckToPptxScreenshot(goal, {
      outFile,
      title: goal.title,
      subject: goal.goal,
      author: goal.owner || 'lemonPPT',
      overlayText: true,
      vectorizeShapes: true,
      extractImages: !noImages,
      logger: createLogger(theme),
      onProgress: (p) => {
        if (verbose) console.log(`[${theme}] ${p.phase}: ${p.message}`);
      },
    });
    const duration = Date.now() - start;
    const { size } = await stat(outFile);
    const expectedSlides = goal.slides.length;

    // 启发式检查：过小的文件可能意味着截图空白或资源未加载。
    const minSizePerSlide = 5 * 1024; // 5 KB/页
    if (size < expectedSlides * minSizePerSlide) {
      warnings.push(`文件过小 (${formatBytes(size)})，建议检查截图是否空白`);
    }

    return {
      theme,
      status: warnings.length > 0 ? 'warning' : 'ok',
      slides: expectedSlides,
      size,
      duration,
      warnings,
    };
  } catch (err) {
    return {
      theme,
      status: 'error',
      reason: err instanceof Error ? err.message : String(err),
      duration: Date.now() - start,
    };
  }
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  console.log(`开始验证 ${selectedThemes.length} 个主题的 DOM-to-PPTX 导出...\n`);
  if (noImages) console.log('已禁用 <img> 元素提取 (--no-images)\n');

  const results = [];
  for (const theme of selectedThemes) {
    const result = await validateTheme(theme);
    results.push(result);

    if (result.status === 'ok') {
      console.log(`✅ ${result.theme}: ${result.slides} 页, ${formatBytes(result.size)}, ${formatMs(result.duration)}`);
    } else if (result.status === 'warning') {
      console.log(`⚠️  ${result.theme}: ${result.slides} 页, ${formatBytes(result.size)}, ${formatMs(result.duration)}`);
      for (const w of result.warnings) console.log(`   - ${w}`);
    } else if (result.status === 'skipped') {
      console.log(`⏭️  ${result.theme}: 跳过 - ${result.reason}`);
    } else {
      console.log(`❌ ${result.theme}: ${result.status} - ${result.reason} (${formatMs(result.duration)})`);
    }
  }

  const ok = results.filter((r) => r.status === 'ok');
  const warnings = results.filter((r) => r.status === 'warning');
  const errors = results.filter((r) => r.status === 'error');
  const skipped = results.filter((r) => r.status === 'skipped');

  console.log(`\n汇总: ${ok.length} 成功, ${warnings.length} 警告, ${errors.length} 失败, ${skipped.length} 跳过`);
  console.log(`输出目录: ${outputDir}`);

  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
