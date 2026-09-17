#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme02 gallery 字体缓存 A/B 测试。
 *
 * 模拟用户只提供了空/不完整的 fontDir，对比：
 * - baseline：fontDir = 空目录，fontCacheDir = 空目录（无字体可嵌入）
 * - integration：fontDir = 空目录，fontCacheDir = renderer 内置 fonts（阶段 4 缓存 fallback）
 *
 * 用法：
 *   node scripts/ab-test-font-cache-theme02.mjs
 */

import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportDeckToPptxScreenshot } from '@lemonppt/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'output', 'ab-font-cache-theme02');
const goalPath = path.join(rootDir, 'output', 'theme02-gallery-goal.json');

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatMs(ms) {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function createLogger(label) {
  return {
    debug: () => {},
    info: (message, ...args) => console.log(`[${label}] ${message}`, ...args),
    warn: (message, ...args) => console.warn(`[${label}] ⚠️ ${message}`, ...args),
    error: (message, ...args) => console.error(`[${label}] ❌ ${message}`, ...args),
  };
}

async function runExport(name, fontDir, fontCacheDir) {
  if (!existsSync(goalPath)) {
    throw new Error(`goal file not found: ${goalPath}`);
  }
  const goal = JSON.parse(await readFile(goalPath, 'utf-8'));
  const outDir = path.join(outputDir, name);
  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, 'theme02.pptx');

  const start = Date.now();
  await exportDeckToPptxScreenshot(goal, {
    outFile,
    title: goal.title,
    subject: goal.goal,
    author: goal.owner || 'lemonPPT',
    overlayText: true,
    vectorizeShapes: true,
    vectorizeCssEffects: true,
    extractImages: true,
    regionFallback: true,
    deviceScaleFactor: 2,
    fontDir,
    fontCacheDir,
    logger: createLogger(name),
  });
  const duration = Date.now() - start;
  const { size } = await stat(outFile);

  const reportPath = outFile.replace(/\.pptx$/i, '') + '.report.json';
  const report = JSON.parse(await readFile(reportPath, 'utf-8'));

  return { name, outFile, reportPath, size, duration, report };
}

function countWarningsByType(warnings) {
  const counts = {};
  for (const w of warnings) {
    counts[w.type] = (counts[w.type] || 0) + 1;
  }
  return counts;
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const emptyDir = await mkdtemp(path.join(os.tmpdir(), 'lemonppt-empty-fonts-'));

  console.log(`输出目录: ${outputDir}\n`);

  console.log('▶️  运行 baseline（无字体缓存，fontDir/cache 均为空）...');
  const baseline = await runExport('baseline', emptyDir, emptyDir);
  console.log(`   文件: ${formatBytes(baseline.size)}, 耗时: ${formatMs(baseline.duration)}\n`);

  console.log('▶️  运行 integration（空 fontDir + renderer 内置字体缓存）...');
  const integration = await runExport('integration', emptyDir, undefined);
  console.log(`   文件: ${formatBytes(integration.size)}, 耗时: ${formatMs(integration.duration)}\n`);

  const baselineCounts = countWarningsByType(baseline.report.warnings);
  const integrationCounts = countWarningsByType(integration.report.warnings);

  const comparison = {
    theme: 'theme02',
    baseline: {
      fidelity: baseline.report.fidelity,
      slideCount: baseline.report.slideCount,
      textObjects: baseline.report.textObjects,
      shapeObjects: baseline.report.shapeObjects,
      imageObjects: baseline.report.imageObjects,
      regionObjects: baseline.report.regionObjects,
      warningsTotal: baseline.report.warnings.length,
      warningsByType: baselineCounts,
      size: baseline.size,
      duration: baseline.duration,
    },
    integration: {
      fidelity: integration.report.fidelity,
      slideCount: integration.report.slideCount,
      textObjects: integration.report.textObjects,
      shapeObjects: integration.report.shapeObjects,
      imageObjects: integration.report.imageObjects,
      regionObjects: integration.report.regionObjects,
      warningsTotal: integration.report.warnings.length,
      warningsByType: integrationCounts,
      size: integration.size,
      duration: integration.duration,
    },
    delta: {
      fidelity: Math.round((integration.report.fidelity - baseline.report.fidelity) * 1000) / 1000,
      fontWarnings: (integrationCounts['font-not-embedded'] || 0) - (baselineCounts['font-not-embedded'] || 0),
      warningsTotal: integration.report.warnings.length - baseline.report.warnings.length,
      size: integration.size - baseline.size,
      duration: integration.duration - baseline.duration,
    },
  };

  const comparisonPath = path.join(outputDir, 'comparison.json');
  await writeFile(comparisonPath, JSON.stringify(comparison, null, 2), 'utf-8');

  console.log('📊 A/B 测试汇总');
  console.log('───────────────────────────────────────────────');
  console.log(`全局 fidelity        baseline ${(baseline.report.fidelity * 100).toFixed(1)}%  →  integration ${(integration.report.fidelity * 100).toFixed(1)}%  (Δ ${comparison.delta.fidelity >= 0 ? '+' : ''}${(comparison.delta.fidelity * 100).toFixed(1)}%)`);
  console.log(`font-not-embedded    baseline ${baselineCounts['font-not-embedded'] || 0}  →  integration ${integrationCounts['font-not-embedded'] || 0}  (Δ ${comparison.delta.fontWarnings >= 0 ? '+' : ''}${comparison.delta.fontWarnings})`);
  console.log(`warnings 总数        baseline ${baseline.report.warnings.length}  →  integration ${integration.report.warnings.length}  (Δ ${comparison.delta.warningsTotal >= 0 ? '+' : ''}${comparison.delta.warningsTotal})`);
  console.log(`文件大小             baseline ${formatBytes(baseline.size)}  →  integration ${formatBytes(integration.size)}  (Δ ${formatBytes(comparison.delta.size)})`);
  console.log(`导出耗时             baseline ${formatMs(baseline.duration)}  →  integration ${formatMs(integration.duration)}  (Δ ${formatMs(comparison.delta.duration)})`);
  console.log('───────────────────────────────────────────────');
  console.log(`详细对比已写入: ${comparisonPath}`);

  const reduction = baselineCounts['font-not-embedded']
    ? Math.round(((baselineCounts['font-not-embedded'] - (integrationCounts['font-not-embedded'] || 0)) / baselineCounts['font-not-embedded']) * 100)
    : 0;
  console.log(`\n✅ font-not-embedded 警告减少 ${reduction}%`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
