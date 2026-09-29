#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme02 gallery CSS 效果矢量化 A/B 测试。
 *
 * 对比 baseline（vectorizeCssEffects=false）与 integration（vectorizeCssEffects=true）
 * 的 PPTX 导出 fidelity、warnings、shape 数量等指标。
 *
 * 用法：
 *   node scripts/ab-test-css-effects-theme02.mjs
 */

import { existsSync } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportDeckToPptxScreenshot } from '@lemonppt/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'output', 'ab-css-effects-theme02');
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

async function runExport(name, vectorizeCssEffects) {
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
    vectorizeCssEffects,
    extractImages: true,
    regionFallback: true,
    deviceScaleFactor: 2,
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

function compareSlide(baselineReport, integrationReport, slideIdx) {
  const b = baselineReport.slideSummaries[slideIdx];
  const i = integrationReport.slideSummaries[slideIdx];
  const diff = {
    slide: b.slide,
    fidelityDelta: Math.round((i.fidelity - b.fidelity) * 1000) / 1000,
    shapesDelta: i.shapes - b.shapes,
    textBoxesDelta: i.textBoxes - b.textBoxes,
    imagesDelta: i.images - b.images,
    fallbackRegionsDelta: i.fallbackRegions - b.fallbackRegions,
  };
  return diff;
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  console.log(`输出目录: ${outputDir}\n`);

  console.log('▶️  运行 baseline（vectorizeCssEffects=false）...');
  const baseline = await runExport('baseline', false);
  console.log(`   文件: ${formatBytes(baseline.size)}, 耗时: ${formatMs(baseline.duration)}\n`);

  console.log('▶️  运行 integration（vectorizeCssEffects=true）...');
  const integration = await runExport('integration', true);
  console.log(`   文件: ${formatBytes(integration.size)}, 耗时: ${formatMs(integration.duration)}\n`);

  const baselineCounts = countWarningsByType(baseline.report.warnings);
  const integrationCounts = countWarningsByType(integration.report.warnings);
  const allTypes = new Set([...Object.keys(baselineCounts), ...Object.keys(integrationCounts)]);

  const perSlideDiffs = baseline.report.slideSummaries.map((_, idx) =>
    compareSlide(baseline.report, integration.report, idx),
  );

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
      shapeObjects: integration.report.shapeObjects - baseline.report.shapeObjects,
      warningsTotal: integration.report.warnings.length - baseline.report.warnings.length,
      size: integration.size - baseline.size,
      duration: integration.duration - baseline.duration,
    },
    warningsByTypeDelta: Object.fromEntries(
      Array.from(allTypes).map((type) => [type, (integrationCounts[type] || 0) - (baselineCounts[type] || 0)]),
    ),
    perSlide: perSlideDiffs,
  };

  const comparisonPath = path.join(outputDir, 'comparison.json');
  await writeFile(comparisonPath, JSON.stringify(comparison, null, 2), 'utf-8');

  // 控制台摘要
  console.log('📊 A/B 测试汇总');
  console.log('───────────────────────────────────────────────');
  console.log(`全局 fidelity       baseline ${(baseline.report.fidelity * 100).toFixed(1)}%  →  integration ${(integration.report.fidelity * 100).toFixed(1)}%  (Δ ${comparison.delta.fidelity >= 0 ? '+' : ''}${(comparison.delta.fidelity * 100).toFixed(1)}%)`);
  console.log(`shape 对象总数      baseline ${baseline.report.shapeObjects}  →  integration ${integration.report.shapeObjects}  (Δ ${comparison.delta.shapeObjects >= 0 ? '+' : ''}${comparison.delta.shapeObjects})`);
  console.log(`text 对象总数       baseline ${baseline.report.textObjects}  →  integration ${integration.report.textObjects}`);
  console.log(`image 对象总数      baseline ${baseline.report.imageObjects}  →  integration ${integration.report.imageObjects}`);
  console.log(`fallback 区域总数   baseline ${baseline.report.regionObjects}  →  integration ${integration.report.regionObjects}`);
  console.log(`warnings 总数       baseline ${baseline.report.warnings.length}  →  integration ${integration.report.warnings.length}  (Δ ${comparison.delta.warningsTotal >= 0 ? '+' : ''}${comparison.delta.warningsTotal})`);
  console.log(`文件大小            baseline ${formatBytes(baseline.size)}  →  integration ${formatBytes(integration.size)}  (Δ ${formatBytes(comparison.delta.size)})`);
  console.log(`导出耗时            baseline ${formatMs(baseline.duration)}  →  integration ${formatMs(integration.duration)}  (Δ ${formatMs(comparison.delta.duration)})`);
  console.log('───────────────────────────────────────────────');
  console.log('warnings 按类型变化：');
  for (const [type, delta] of Object.entries(comparison.warningsByTypeDelta).sort((a, b) => b[1] - a[1])) {
    const sign = delta > 0 ? '+' : '';
    console.log(`   ${type}: baseline ${baselineCounts[type] || 0}, integration ${integrationCounts[type] || 0} (Δ ${sign}${delta})`);
  }
  console.log('───────────────────────────────────────────────');
  console.log(`逐页差异已写入: ${comparisonPath}`);

  const slidesWithFidelityChange = perSlideDiffs.filter((d) => d.fidelityDelta !== 0);
  const slidesWithShapeChange = perSlideDiffs.filter((d) => d.shapesDelta !== 0);
  if (slidesWithFidelityChange.length > 0) {
    console.log(`\n⚠️  fidelity 变化的幻灯片: ${slidesWithFidelityChange.length} 页`);
    for (const d of slidesWithFidelityChange.slice(0, 10)) {
      console.log(`   slide ${d.slide}: Δ ${d.fidelityDelta >= 0 ? '+' : ''}${(d.fidelityDelta * 100).toFixed(1)}%`);
    }
  } else {
    console.log('\n✅ 各页 fidelity 无变化');
  }
  if (slidesWithShapeChange.length > 0) {
    console.log(`\nℹ️  shape 数量变化的幻灯片: ${slidesWithShapeChange.length} 页`);
    for (const d of slidesWithShapeChange.slice(0, 10)) {
      console.log(`   slide ${d.slide}: Δ ${d.shapesDelta >= 0 ? '+' : ''}${d.shapesDelta}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
