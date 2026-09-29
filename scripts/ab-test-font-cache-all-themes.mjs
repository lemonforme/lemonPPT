#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 全量 11 主题字体缓存 A/B 测试（阶段 4 验收）。
 *
 * 模拟用户只提供空/不完整的 fontDir，对比：
 * - baseline：fontDir = 空目录，fontCacheDir = 空目录（无字体可嵌入）
 * - integration：fontDir = 空目录，fontCacheDir = renderer 内置字体缓存（阶段 4 fallback）
 *
 * 用法：
 *   node scripts/ab-test-font-cache-all-themes.mjs
 *   node scripts/ab-test-font-cache-all-themes.mjs --themes theme01,theme02
 */

import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportDeckToPptxScreenshot } from '@lemonppt/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'output', 'ab-font-cache-all-themes');

const ALL_THEMES = [
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

function parseThemesArg() {
  const args = process.argv.slice(2);
  const flagIndex = args.indexOf('--themes');
  if (flagIndex !== -1 && args[flagIndex + 1]) {
    const filtered = args[flagIndex + 1].split(',').filter(Boolean);
    if (filtered.length > 0) return ALL_THEMES.filter((t) => filtered.includes(t));
  }
  const themeFilterArg = args.find((a) => a.startsWith('--themes='));
  if (themeFilterArg) {
    const filtered = themeFilterArg.replace('--themes=', '').split(',').filter(Boolean);
    if (filtered.length > 0) return ALL_THEMES.filter((t) => filtered.includes(t));
  }
  return ALL_THEMES;
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

function createLogger(label) {
  return {
    debug: () => {},
    info: (message, ...args) => console.log(`[${label}] ${message}`, ...args),
    warn: (message, ...args) => console.warn(`[${label}] ⚠️ ${message}`, ...args),
    error: (message, ...args) => console.error(`[${label}] ❌ ${message}`, ...args),
  };
}

function countWarningsByType(warnings) {
  const counts = {};
  for (const w of warnings) {
    counts[w.type] = (counts[w.type] || 0) + 1;
  }
  return counts;
}

async function runExport(theme, name, fontDir, fontCacheDir) {
  const goalPath = path.join(rootDir, 'output', `${theme}-gallery-goal.json`);
  if (!existsSync(goalPath)) {
    throw new Error(`goal file not found: ${goalPath}`);
  }
  const goal = JSON.parse(await readFile(goalPath, 'utf-8'));
  const outDir = path.join(outputDir, name);
  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, `${theme}.pptx`);

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
    logger: createLogger(`${name}/${theme}`),
  });
  const duration = Date.now() - start;
  const { size } = await stat(outFile);

  const reportPath = outFile.replace(/\.pptx$/i, '') + '.report.json';
  const report = JSON.parse(await readFile(reportPath, 'utf-8'));

  return { name, theme, outFile, reportPath, size, duration, report };
}

async function runTheme(theme, emptyDir) {
  console.log(`\n🎨 ${theme}`);
  const baseline = await runExport(theme, 'baseline', emptyDir, emptyDir);
  const integration = await runExport(theme, 'integration', emptyDir, undefined);

  const baselineCounts = countWarningsByType(baseline.report.warnings);
  const integrationCounts = countWarningsByType(integration.report.warnings);

  return {
    theme,
    baseline: {
      fidelity: baseline.report.fidelity,
      slideCount: baseline.report.slideCount,
      textObjects: baseline.report.textObjects,
      shapeObjects: baseline.report.shapeObjects,
      imageObjects: baseline.report.imageObjects,
      regionObjects: baseline.report.regionObjects,
      warningsTotal: baseline.report.warnings.length,
      warningsByType: baselineCounts,
      fontWarnings: baselineCounts['font-not-embedded'] || 0,
      embeddedFonts: baseline.report.embeddedFonts || [],
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
      fontWarnings: integrationCounts['font-not-embedded'] || 0,
      embeddedFonts: integration.report.embeddedFonts || [],
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
}

async function main() {
  const selectedThemes = parseThemesArg();
  await mkdir(outputDir, { recursive: true });
  const emptyDir = await mkdtemp(path.join(os.tmpdir(), 'lemonppt-empty-fonts-'));

  console.log(`输出目录: ${outputDir}`);
  console.log(`测试主题: ${selectedThemes.join(', ')}\n`);

  const results = [];
  for (const theme of selectedThemes) {
    try {
      const result = await runTheme(theme, emptyDir);
      results.push(result);
    } catch (err) {
      console.error(`❌ ${theme} 导出失败:`, err.message);
      results.push({ theme, error: err.message });
    }
  }

  const baselineTotalFont = results
    .filter((r) => !r.error)
    .reduce((sum, r) => sum + r.baseline.fontWarnings, 0);
  const integrationTotalFont = results
    .filter((r) => !r.error)
    .reduce((sum, r) => sum + r.integration.fontWarnings, 0);
  const baselineTotalWarnings = results
    .filter((r) => !r.error)
    .reduce((sum, r) => sum + r.baseline.warningsTotal, 0);
  const integrationTotalWarnings = results
    .filter((r) => !r.error)
    .reduce((sum, r) => sum + r.integration.warningsTotal, 0);
  const baselineTotalSize = results
    .filter((r) => !r.error)
    .reduce((sum, r) => sum + r.baseline.size, 0);
  const integrationTotalSize = results
    .filter((r) => !r.error)
    .reduce((sum, r) => sum + r.integration.size, 0);
  const baselineTotalDuration = results
    .filter((r) => !r.error)
    .reduce((sum, r) => sum + r.baseline.duration, 0);
  const integrationTotalDuration = results
    .filter((r) => !r.error)
    .reduce((sum, r) => sum + r.integration.duration, 0);
  const baselineTotalEmbedded = results
    .filter((r) => !r.error)
    .reduce((sum, r) => sum + r.baseline.embeddedFonts.length, 0);
  const integrationTotalEmbedded = results
    .filter((r) => !r.error)
    .reduce((sum, r) => sum + r.integration.embeddedFonts.length, 0);

  const reduction = baselineTotalFont
    ? Math.round(((baselineTotalFont - integrationTotalFont) / baselineTotalFont) * 100)
    : 0;

  const comparison = {
    themes: selectedThemes,
    perTheme: results,
    totals: {
      baseline: {
        fontWarnings: baselineTotalFont,
        warningsTotal: baselineTotalWarnings,
        size: baselineTotalSize,
        duration: baselineTotalDuration,
        embeddedFonts: baselineTotalEmbedded,
      },
      integration: {
        fontWarnings: integrationTotalFont,
        warningsTotal: integrationTotalWarnings,
        size: integrationTotalSize,
        duration: integrationTotalDuration,
        embeddedFonts: integrationTotalEmbedded,
      },
      delta: {
        fontWarnings: integrationTotalFont - baselineTotalFont,
        warningsTotal: integrationTotalWarnings - baselineTotalWarnings,
        size: integrationTotalSize - baselineTotalSize,
        duration: integrationTotalDuration - baselineTotalDuration,
        embeddedFonts: integrationTotalEmbedded - baselineTotalEmbedded,
      },
      fontWarningReductionPercent: reduction,
    },
  };

  const comparisonPath = path.join(outputDir, 'comparison.json');
  await writeFile(comparisonPath, JSON.stringify(comparison, null, 2), 'utf-8');

  console.log('\n\n📊 全量主题字体缓存 A/B 测试汇总');
  console.log('──────────────────────────────────────────────────────────────────');
  console.log(
    `font-not-embedded    baseline ${baselineTotalFont}  →  integration ${integrationTotalFont}  (Δ ${comparison.totals.delta.fontWarnings >= 0 ? '+' : ''}${comparison.totals.delta.fontWarnings}, 减少 ${reduction}%)`,
  );
  console.log(
    `warnings 总数        baseline ${baselineTotalWarnings}  →  integration ${integrationTotalWarnings}  (Δ ${comparison.totals.delta.warningsTotal >= 0 ? '+' : ''}${comparison.totals.delta.warningsTotal})`,
  );
  console.log(
    `嵌入字体种类         baseline ${baselineTotalEmbedded}  →  integration ${integrationTotalEmbedded}  (Δ ${comparison.totals.delta.embeddedFonts >= 0 ? '+' : ''}${comparison.totals.delta.embeddedFonts})`,
  );
  console.log(
    `文件大小总计         baseline ${formatBytes(baselineTotalSize)}  →  integration ${formatBytes(integrationTotalSize)}  (Δ ${formatBytes(comparison.totals.delta.size)})`,
  );
  console.log(
    `导出耗时总计         baseline ${formatMs(baselineTotalDuration)}  →  integration ${formatMs(integrationTotalDuration)}  (Δ ${formatMs(comparison.totals.delta.duration)})`,
  );
  console.log('──────────────────────────────────────────────────────────────────');
  console.log(`详细对比已写入: ${comparisonPath}\n`);

  console.log('每主题对比（font-not-embedded / 嵌入字体种类 / fidelity）');
  console.log('──────────────────────────────────────────────────────────────────');
  for (const r of results) {
    if (r.error) {
      console.log(`${r.theme.padEnd(8)} ❌ 失败: ${r.error}`);
      continue;
    }
    const b = r.baseline.fontWarnings;
    const i = r.integration.fontWarnings;
    const d = i - b;
    const pct = b ? Math.round(((b - i) / b) * 100) : 0;
    const embB = r.baseline.embeddedFonts.length;
    const embI = r.integration.embeddedFonts.length;
    console.log(
      `${r.theme.padEnd(8)} warnings ${String(b).padStart(4)}→${String(i).padStart(4)} (Δ${String(d).padStart(4)}, ${pct}%↓)  fonts ${String(embB).padStart(2)}→${String(embI).padStart(2)}  fidelity ${(r.integration.fidelity * 100).toFixed(1)}%`,
    );
  }
  console.log('──────────────────────────────────────────────────────────────────');

  const sizeIncreasePercent = baselineTotalSize ? Math.round((comparison.totals.delta.size / baselineTotalSize) * 1000) / 10 : 0;
  const durationIncreasePercent = baselineTotalDuration ? Math.round((comparison.totals.delta.duration / baselineTotalDuration) * 1000) / 10 : 0;
  const pass =
    comparison.totals.delta.warningsTotal >= 0 &&
    sizeIncreasePercent <= 20 &&
    durationIncreasePercent <= 20 &&
    comparison.totals.delta.embeddedFonts > 0;
  if (pass) {
    console.log(`\n✅ 验收通过：warnings 未增加，文件大小 +${sizeIncreasePercent}%，导出耗时 +${durationIncreasePercent}%，新增 ${comparison.totals.delta.embeddedFonts} 种嵌入字体`);
  } else {
    console.log(`\n⚠️ 验收未通过：请检查 warnings / 文件大小 / 耗时 / 嵌入字体数量`);
  }

  if (results.some((r) => r.error)) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
