#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 全主题 PPTX 基线管理脚本（阶段 6）。
 *
 * 为 theme01~theme11 生成 PPTX 并建立/校验基线：
 * - 页数、文件大小
 * - 媒体文件数量、每页形状与文本框数量
 * - 幻灯片截图背景图的像素级 SHA-256（用于捕捉视觉漂移）
 *
 * diff 策略：
 * - 结构（页数、媒体/形状/文本框数量）必须完全一致
 * - 文件大小允许 5% 浮动
 * - 截图像素差异默认仅作为警告；--strict-pixels 可提升为错误
 *
 * 用法：
 *   node scripts/theme-pptx-baseline.mjs              # 与现有基线 diff
 *   node scripts/theme-pptx-baseline.mjs --update     # 更新基线
 *   node scripts/theme-pptx-baseline.mjs --strict-pixels
 *   node scripts/theme-pptx-baseline.mjs --themes theme01,theme02
 */

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import {
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportDeckToPptxScreenshot } from '@lemonppt/renderer';

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const baselineDir = path.join(rootDir, 'output', 'theme-baseline');
const trackedBaselineDir = path.join(rootDir, 'packages', 'renderer', 'baselines');

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
const updateMode = args.includes('--update');

let selectedThemes = themes;
const themesFlagIndex = args.indexOf('--themes');
if (themesFlagIndex !== -1 && args[themesFlagIndex + 1]) {
  const filtered = args[themesFlagIndex + 1].split(',').filter(Boolean);
  if (filtered.length > 0) selectedThemes = themes.filter((t) => filtered.includes(t));
} else {
  const themeFilterArg = args.find((a) => a.startsWith('--themes='));
  if (themeFilterArg) {
    const filtered = themeFilterArg.replace('--themes=', '').split(',').filter(Boolean);
    if (filtered.length > 0) selectedThemes = themes.filter((t) => filtered.includes(t));
  }
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
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

/**
 * 使用系统 unzip 列出 PPTX 中的文件。
 */
async function listPptxFiles(pptxPath) {
  const { stdout } = await execFileAsync('unzip', ['-l', pptxPath], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  const lines = stdout.split('\n');
  const files = [];
  for (const line of lines) {
    const m = line.match(/^\s*\d+\s+\S+\s+\S+\s+(.+)$/);
    if (m && !m[1].startsWith('--------')) {
      files.push(m[1]);
    }
  }
  return files;
}

/**
 * 统计 PPTX 中的幻灯片、媒体、形状、文本框数量。
 */
async function analyzePptx(pptxPath) {
  const files = await listPptxFiles(pptxPath);
  const slideFiles = files.filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f));
  const mediaFiles = files.filter((f) => f.startsWith('ppt/media/'));

  const slideDetails = [];
  for (const slideFile of slideFiles.sort()) {
    const { stdout: xml } = await execFileAsync('unzip', ['-p', pptxPath, slideFile], {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
    const shapeCount = (xml.match(/<p:sp[\s>]/g) || []).length;
    const textBoxCount = (xml.match(/<p:txBody>/g) || []).length;
    slideDetails.push({ file: slideFile, shapeCount, textBoxCount });
  }

  const screenshotHashes = {};
  for (const mediaFile of mediaFiles) {
    if (/image-\d+-\d+\.png$/.test(mediaFile)) {
      const { stdout, stderr } = await execFileAsync('unzip', ['-p', pptxPath, mediaFile], {
        encoding: 'buffer',
        maxBuffer: 64 * 1024 * 1024,
      });
      const buf = Buffer.concat([Buffer.from(stdout), Buffer.from(stderr ?? '')]);
      screenshotHashes[mediaFile] = sha256(buf);
    }
  }

  return {
    slideCount: slideFiles.length,
    mediaCount: mediaFiles.length,
    shapeCount: slideDetails.reduce((s, d) => s + d.shapeCount, 0),
    textBoxCount: slideDetails.reduce((s, d) => s + d.textBoxCount, 0),
    slideDetails,
    screenshotHashes,
  };
}

async function generateSnapshot(theme) {
  const goalPath = path.join(rootDir, 'output', `${theme}-gallery-goal.json`);
  if (!existsSync(goalPath)) {
    return { theme, status: 'skipped', reason: `goal file not found: ${goalPath}` };
  }

  const raw = await readFile(goalPath, 'utf-8');
  const goal = JSON.parse(raw);
  const themeDir = path.join(baselineDir, theme);
  const outFile = path.join(themeDir, `${theme}.pptx`);
  await mkdir(themeDir, { recursive: true });

  const start = Date.now();
  try {
    await exportDeckToPptxScreenshot(goal, {
      outFile,
      title: goal.title,
      subject: goal.goal,
      author: goal.owner || 'lemonPPT',
      overlayText: true,
      vectorizeShapes: true,
      extractImages: true,
    });
  } catch (err) {
    return {
      theme,
      status: 'error',
      reason: err instanceof Error ? err.message : String(err),
      duration: Date.now() - start,
    };
  }

  const { size } = await stat(outFile);
  const buffer = await readFile(outFile);
  const analysis = await analyzePptx(outFile);

  return {
    theme,
    status: 'ok',
    duration: Date.now() - start,
    fileSize: size,
    sha256: sha256(buffer),
    slides: goal.slides.length,
    ...analysis,
  };
}

const SIZE_TOLERANCE = 0.05; // 文件大小允许 5% 浮动
const strictPixels = args.includes('--strict-pixels');

function compareSnapshot(current, baseline) {
  const errors = [];
  const warnings = [];

  if (current.slideCount !== baseline.slideCount) {
    errors.push(`页数变化: ${baseline.slideCount} -> ${current.slideCount}`);
  }
  if (current.mediaCount !== baseline.mediaCount) {
    errors.push(`媒体数量变化: ${baseline.mediaCount} -> ${current.mediaCount}`);
  }
  if (current.shapeCount !== baseline.shapeCount) {
    errors.push(`形状数量变化: ${baseline.shapeCount} -> ${current.shapeCount}`);
  }
  if (current.textBoxCount !== baseline.textBoxCount) {
    errors.push(`文本框数量变化: ${baseline.textBoxCount} -> ${current.textBoxCount}`);
  }

  if (baseline.fileSize > 0) {
    const ratio = Math.abs(current.fileSize - baseline.fileSize) / baseline.fileSize;
    if (ratio > SIZE_TOLERANCE) {
      errors.push(
        `文件大小变化超过 ${(SIZE_TOLERANCE * 100).toFixed(0)}%: ${formatBytes(
          baseline.fileSize,
        )} -> ${formatBytes(current.fileSize)}`,
      );
    } else if (current.fileSize !== baseline.fileSize) {
      warnings.push(
        `文件大小变化: ${formatBytes(baseline.fileSize)} -> ${formatBytes(current.fileSize)}`,
      );
    }
  }

  const baseScreens = baseline.screenshotHashes || {};
  const currScreens = current.screenshotHashes || {};
  const pixelChanges = [];
  for (const [name, hash] of Object.entries(currScreens)) {
    if (!(name in baseScreens)) {
      pixelChanges.push(`新增截图: ${name}`);
    } else if (baseScreens[name] !== hash) {
      pixelChanges.push(`${name}`);
    }
  }
  for (const name of Object.keys(baseScreens)) {
    if (!(name in currScreens)) {
      pixelChanges.push(`截图缺失: ${name}`);
    }
  }
  if (pixelChanges.length > 0) {
    const msg = `截图像素变化 ${pixelChanges.length} 张: ${pixelChanges.slice(0, 3).join(', ')}${
      pixelChanges.length > 3 ? ` 等` : ''
    }`;
    if (strictPixels) {
      errors.push(msg);
    } else {
      warnings.push(msg);
    }
  }

  return { errors, warnings };
}

async function main() {
  await mkdir(baselineDir, { recursive: true });
  console.log(`${updateMode ? '更新' : '校验'} ${selectedThemes.length} 个主题的 PPTX 基线...\n`);

  const results = [];
  for (const theme of selectedThemes) {
    const current = await generateSnapshot(theme);
    results.push(current);

    if (current.status === 'skipped') {
      console.log(`⏭️  ${current.theme}: ${current.reason}`);
      continue;
    }
    if (current.status === 'error') {
      console.log(`❌ ${current.theme}: ${current.reason} (${formatMs(current.duration)})`);
      continue;
    }

    const baselinePath = path.join(baselineDir, `${theme}.baseline.json`);
    const trackedBaselinePath = path.join(trackedBaselineDir, `${theme}.baseline.json`);
    if (updateMode) {
      await mkdir(trackedBaselineDir, { recursive: true });
      const json = JSON.stringify(current, null, 2) + '\n';
      await writeFile(baselinePath, json);
      await writeFile(trackedBaselinePath, json);
      console.log(
        `📝 ${current.theme}: 已更新基线 (${current.slideCount} 页, ${formatBytes(
          current.fileSize,
        )}, ${formatMs(current.duration)})`,
      );
    } else if (!existsSync(baselinePath)) {
      console.log(
        `⚠️  ${current.theme}: 基线不存在，使用 --update 创建 (${current.slideCount} 页, ${formatBytes(
          current.fileSize,
        )})`,
      );
    } else {
      const baselineRaw = await readFile(baselinePath, 'utf-8');
      const baseline = JSON.parse(baselineRaw);
      const { errors, warnings } = compareSnapshot(current, baseline);
      if (errors.length === 0 && warnings.length === 0) {
        console.log(
          `✅ ${current.theme}: 与基线一致 (${current.slideCount} 页, ${formatBytes(
            current.fileSize,
          )}, ${formatMs(current.duration)})`,
        );
      } else {
        const statusIcon = errors.length > 0 ? '❌' : '🔍';
        console.log(
          `${statusIcon} ${current.theme}: 发现差异 (${current.slideCount} 页, ${formatBytes(
            current.fileSize,
          )}, ${formatMs(current.duration)})`,
        );
        for (const e of errors) console.log(`   - ${e}`);
        for (const w of warnings) console.log(`   - ${w}`);
        if (errors.length > 0) current.status = 'error';
      }
    }
  }

  const ok = results.filter((r) => r.status === 'ok');
  const errors = results.filter((r) => r.status === 'error');
  const skipped = results.filter((r) => r.status === 'skipped');
  console.log(
    `\n汇总: ${ok.length} 成功生成, ${errors.length} 失败, ${skipped.length} 跳过`,
  );
  console.log(`基线目录: ${baselineDir}`);

  if (errors.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
