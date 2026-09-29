#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 导出质量报告基线比对（P0-1 验收基础设施）。
 *
 * 对比 gallery 导出产生的 *.report.json 与基线：
 * - 全局 fidelity 下降 > 0.05 → 失败
 * - warnings 总数激增（>50% 且绝对增量 > 20）→ 失败
 * - 任一页 fallbackRegions 数量归零但基线 > 0 → 失败（区域识别退化）
 *
 * 用法:
 *   node scripts/export-report-baseline.mjs --update <report.json>   # 以该报告建立基线
 *   node scripts/export-report-baseline.mjs <report.json>            # 与基线比对
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const baselineDir = path.join(rootDir, 'output', 'baselines');

const args = process.argv.slice(2);
const updateMode = args.includes('--update');
const reportPath = args.find((a) => !a.startsWith('--'));

if (!reportPath) {
  console.error('用法: node scripts/export-report-baseline.mjs [--update] <report.json>');
  process.exit(2);
}

if (!existsSync(reportPath)) {
  console.error(`报告文件不存在: ${reportPath}`);
  process.exit(2);
}

const report = JSON.parse(await readFile(reportPath, 'utf-8'));
const baselineFile = path.join(baselineDir, 'theme01-gallery-report.json');

if (updateMode) {
  await mkdir(baselineDir, { recursive: true });
  await writeFile(baselineFile, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`✅ 基线已更新: ${baselineFile}`);
  console.log(`   ${report.slideCount} 页, fidelity=${report.fidelity}, warnings=${report.warnings.length}`);
  process.exit(0);
}

if (!existsSync(baselineFile)) {
  console.error(`基线不存在: ${baselineFile}，先运行 --update 建立`);
  process.exit(2);
}

const baseline = JSON.parse(await readFile(baselineFile, 'utf-8'));

const errors = [];
const warns = [];

// 1. 全局 fidelity 阈值
if (report.fidelity < baseline.fidelity - 0.05) {
  errors.push(
    `全局 fidelity 下降超阈值: ${baseline.fidelity} -> ${report.fidelity} (Δ=${(report.fidelity - baseline.fidelity).toFixed(3)})`,
  );
}

// 2. warnings 数量激增
const baseWarnCount = baseline.warnings.length;
const newWarnCount = report.warnings.length;
if (newWarnCount > baseWarnCount * 1.5 && newWarnCount - baseWarnCount > 20) {
  errors.push(`warnings 数量激增: ${baseWarnCount} -> ${newWarnCount}`);
} else if (newWarnCount !== baseWarnCount) {
  warns.push(`warnings 数量变化: ${baseWarnCount} -> ${newWarnCount}`);
}

// 3. 每页 fallbackRegions 退化检测（图表页区域识别失效）
const baseBySlide = new Map(baseline.slideSummaries.map((s) => [s.slide, s]));
for (const s of report.slideSummaries) {
  const base = baseBySlide.get(s.slide);
  if (!base) continue;
  if (base.fallbackRegions > 0 && s.fallbackRegions === 0) {
    errors.push(`第 ${s.slide} 页 fallbackRegions 归零（基线 ${base.fallbackRegions}）`);
  }
  if (s.fidelity < base.fidelity - 0.1) {
    warns.push(`第 ${s.slide} 页 fidelity 明显下降: ${base.fidelity} -> ${s.fidelity}`);
  }
}

// 4. 按类型统计差异
const countByType = (list) => {
  const m = new Map();
  for (const w of list) m.set(w.type, (m.get(w.type) || 0) + 1);
  return m;
};
const baseTypes = countByType(baseline.warnings);
const newTypes = countByType(report.warnings);
for (const [type, count] of newTypes) {
  const baseCount = baseTypes.get(type) || 0;
  if (count > baseCount) warns.push(`警告类型 ${type}: ${baseCount} -> ${count}`);
}
for (const [type] of baseTypes) {
  if (!newTypes.has(type)) warns.push(`警告类型 ${type} 消失（可能是修复，人工确认）`);
}

console.log(`报告: ${report.slideCount} 页, fidelity=${report.fidelity}, warnings=${newWarnCount}`);
console.log(`基线: ${baseline.slideCount} 页, fidelity=${baseline.fidelity}, warnings=${baseWarnCount}`);
for (const w of warns) console.log(`  ⚠️ ${w}`);

if (errors.length > 0) {
  for (const e of errors) console.error(`  ❌ ${e}`);
  process.exit(1);
}

console.log('✅ 质量报告回归通过');
