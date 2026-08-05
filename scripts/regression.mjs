#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 视觉回归 diff 工具
 * 对比 output/snapshots 与 output/snapshots/baseline，生成 diff 图并报告差异。
 *
 * 用法：
 *   node scripts/regression.mjs           # 执行对比
 *   node scripts/regression.mjs --update  # 将当前快照更新为基线
 */

import { mkdir, readdir, readFile, writeFile, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const snapshotsDir = path.join(rootDir, 'output', 'snapshots');
const baselineDir = path.join(snapshotsDir, 'baseline');
const diffDir = path.join(snapshotsDir, 'diff');

const UPDATE = process.argv.includes('--update');
const THRESHOLD = 0.1;

async function* walkPngs(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(base, fullPath);
    if (entry.isDirectory()) {
      // 跳过 baseline 与 diff 目录，避免递归自身
      if (relPath === 'baseline' || relPath === 'diff') {
        continue;
      }
      yield* walkPngs(fullPath, base);
    } else if (entry.isFile() && entry.name.endsWith('.png')) {
      yield relPath;
    }
  }
}

async function readPng(filePath) {
  const buffer = await readFile(filePath);
  return PNG.sync.read(buffer);
}

async function updateBaseline() {
  console.log('正在将当前快照更新为基线...');
  let count = 0;
  for await (const relPath of walkPngs(snapshotsDir)) {
    const src = path.join(snapshotsDir, relPath);
    const dest = path.join(baselineDir, relPath);
    await mkdir(path.dirname(dest), { recursive: true });
    await cp(src, dest, { force: true });
    count++;
  }
  console.log(`✅ 已更新 ${count} 张基线快照。`);
}

async function compare() {
  const currentFiles = [];
  for await (const relPath of walkPngs(snapshotsDir)) {
    currentFiles.push(relPath);
  }

  const baselineFiles = [];
  try {
    for await (const relPath of walkPngs(baselineDir)) {
      baselineFiles.push(relPath);
    }
  } catch {
    // baseline 目录可能不存在
  }

  const currentSet = new Set(currentFiles);
  const baselineSet = new Set(baselineFiles);

  const newFiles = currentFiles.filter((p) => !baselineSet.has(p));
  const removedFiles = baselineFiles.filter((p) => !currentSet.has(p));
  const commonFiles = currentFiles.filter((p) => baselineSet.has(p));

  const changed = [];
  const diffs = [];

  for (const relPath of commonFiles) {
    const current = await readPng(path.join(snapshotsDir, relPath));
    const baseline = await readPng(path.join(baselineDir, relPath));

    if (current.width !== baseline.width || current.height !== baseline.height) {
      changed.push({ file: relPath, reason: `尺寸变化 ${baseline.width}x${baseline.height} -> ${current.width}x${current.height}` });
      continue;
    }

    const { width, height } = current;
    const diff = new PNG({ width, height });
    const diffPixels = pixelmatch(
      current.data,
      baseline.data,
      diff.data,
      width,
      height,
      { threshold: THRESHOLD }
    );

    if (diffPixels > 0) {
      changed.push({ file: relPath, reason: `${diffPixels} 个像素不同` });
      const diffPath = path.join(diffDir, relPath);
      await mkdir(path.dirname(diffPath), { recursive: true });
      await writeFile(diffPath, PNG.sync.write(diff));
      diffs.push(relPath);
    }
  }

  console.log(`当前快照：${currentFiles.length}`);
  console.log(`基线快照：${baselineFiles.length}`);
  console.log(`新增：${newFiles.length}`);
  console.log(`删除：${removedFiles.length}`);
  console.log(`变化：${changed.length}`);

  if (newFiles.length) {
    console.error('\n❌ 新增快照（需要更新基线）：');
    for (const f of newFiles) {
      console.error(`  - ${f}`);
    }
  }

  if (removedFiles.length) {
    console.error('\n❌ 缺失快照（已从当前版本中删除）：');
    for (const f of removedFiles) {
      console.error(`  - ${f}`);
    }
  }

  if (changed.length) {
    console.error('\n❌ 以下快照与基线不一致：');
    for (const { file, reason } of changed) {
      console.error(`  - ${file} (${reason})`);
    }
  }

  if (diffs.length) {
    console.log(`\n📝 diff 图已保存到 output/snapshots/diff/`);
  }

  if (newFiles.length || removedFiles.length || changed.length) {
    process.exit(1);
  }

  console.log('\n✅ 视觉回归通过，无差异。');
}

async function main() {
  if (UPDATE) {
    await updateBaseline();
    return;
  }
  await compare();
}

main().catch((err) => {
  console.error('回归测试失败：', err);
  process.exit(1);
});
