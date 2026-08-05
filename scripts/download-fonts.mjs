#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 从 Google Fonts 官方仓库下载字体到项目
 * 用法：node scripts/download-fonts.mjs
 * 输出：packages/renderer/assets/fonts/
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const fontsDir = path.join(rootDir, 'packages', 'renderer', 'assets', 'fonts');

const families = [
  { name: 'Anton', display: 'Anton' },
  { name: 'Archivo', display: 'Archivo' },
  { name: 'Caveat', display: 'Caveat' },
  { name: 'IBM Plex Sans', display: 'IBM Plex Sans' },
  { name: 'Inter', display: 'Inter' },
  { name: 'JetBrains Mono', display: 'JetBrains Mono' },
  { name: 'Newsreader', display: 'Newsreader' },
  { name: 'Space Grotesk', display: 'Space Grotesk' },
  { name: 'Space Mono', display: 'Space Mono' },
  { name: 'Noto Sans SC', display: 'Noto Sans SC' },
  { name: 'Noto Serif SC', display: 'Noto Serif SC' },
];

const OFL_TEXT = `This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
https://openfontlicense.org


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The fonts are covered by this license, not the software that uses them.
The fonts can be embedded, modified and redistributed as long as they are
not sold by themselves.

For the full license text, see the OFL link above or the original license
file included with the font distribution.
`;

function slug(name) {
  return name.toLowerCase().replace(/\s+/g, '');
}

function dirName(name) {
  return name.replace(/\s+/g, '');
}

async function ghApi(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'lemonppt-font-downloader' },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}: ${data?.message ?? 'unknown'}`);
  }
  if (data.message && !Array.isArray(data)) {
    throw new Error(`GitHub API error: ${data.message}`);
  }
  return data;
}

async function downloadFile(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'lemonppt-font-downloader' },
  });
  if (!res.ok) {
    throw new Error(`下载失败 ${url}: ${res.status}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buffer);
}

async function listFontFiles(slug) {
  const rootItems = await ghApi(`https://api.github.com/repos/google/fonts/contents/ofl/${slug}`);
  const fontFiles = [];

  // 优先使用根目录下的 TTF/OTF（通常是可变字体或静态字体）
  for (const item of rootItems) {
    if (item.type === 'file' && /\.(ttf|otf)$/i.test(item.name)) {
      fontFiles.push(item);
    }
  }

  // 如果根目录没有字体文件，退而使用 static/ 子目录
  if (fontFiles.length === 0) {
    const staticDir = rootItems.find((item) => item.type === 'dir' && item.name === 'static');
    if (staticDir) {
      const staticItems = await ghApi(staticDir.url);
      for (const item of staticItems) {
        if (item.type === 'file' && /\.(ttf|otf)$/i.test(item.name)) {
          fontFiles.push(item);
        }
      }
    }
  }

  const ofl = rootItems.find((item) => item.type === 'file' && /^OFL\.txt$/i.test(item.name));
  return { fontFiles, ofl };
}

async function downloadFamily(family) {
  const dir = path.join(fontsDir, dirName(family.name));
  await mkdir(dir, { recursive: true });

  const s = slug(family.name);
  console.log(`下载: ${family.name} ...`);
  const { fontFiles, ofl } = await listFontFiles(s);

  if (fontFiles.length === 0) {
    throw new Error(`未找到字体文件: ${family.name}`);
  }

  for (const file of fontFiles) {
    await downloadFile(file.download_url, path.join(dir, file.name));
  }

  if (ofl) {
    await downloadFile(ofl.download_url, path.join(dir, 'OFL.txt'));
  } else {
    await writeFile(path.join(dir, 'OFL.txt'), OFL_TEXT);
  }

  console.log(`  -> 完成: ${family.name} (${fontFiles.length} 个字体文件)`);
}

function parseWeight(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('thin')) return 100;
  if (lower.includes('extralight') || lower.includes('extra light')) return 200;
  if (lower.includes('light')) return 300;
  if (lower.includes('regular')) return 400;
  if (lower.includes('medium')) return 500;
  if (lower.includes('semibold') || lower.includes('semi bold')) return 600;
  if (lower.includes('extrabold') || lower.includes('extra bold')) return 800;
  if (lower.includes('black')) return 900;
  if (lower.includes('bold')) return 700;
  // 可变字体
  if (/\[.*wght.*\]/.test(filename)) return '100 900';
  return 400;
}

function isItalic(filename) {
  return /italic/i.test(filename);
}

async function generateFontCss() {
  const displayMap = new Map(families.map((f) => [dirName(f.name), f.display]));
  const { readdir } = await import('node:fs/promises');
  const dirs = await readdir(fontsDir, { withFileTypes: true });
  const lines = [
    '/* Auto-generated by scripts/download-fonts.mjs */',
    '/* All fonts are licensed under SIL Open Font License 1.1 */',
    '',
  ];

  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    const dirPath = path.join(fontsDir, dir.name);
    const familyName = displayMap.get(dir.name) ?? dir.name;
    const files = (await readdir(dirPath))
      .filter((f) => /\.(ttf|otf)$/i.test(f))
      .sort();

    for (const file of files) {
      const weight = parseWeight(file);
      const style = isItalic(file) ? 'italic' : 'normal';
      lines.push('@font-face {');
      lines.push(`  font-family: '${familyName}';`);
      lines.push(`  src: url('./${dir.name}/${file}') format('truetype');`);
      lines.push(`  font-weight: ${weight};`);
      lines.push(`  font-style: ${style};`);
      lines.push(`  font-display: swap;`);
      lines.push('}');
      lines.push('');
    }
  }

  await writeFile(path.join(fontsDir, 'fonts.css'), lines.join('\n'));
  console.log(`生成: ${path.relative(rootDir, path.join(fontsDir, 'fonts.css'))}`);
}

async function generateLicenseMd() {
  const { readdir } = await import('node:fs/promises');
  const dirs = await readdir(fontsDir, { withFileTypes: true });
  const displayMap = new Map(families.map((f) => [dirName(f.name), f.display]));

  const lines = ['# Fonts', ''];
  lines.push('All fonts below are used under their respective open-source licenses.');
  lines.push('Most are licensed under the SIL Open Font License 1.1 (OFL).');
  lines.push('');
  lines.push('| Font | License | Source |');
  lines.push('|------|---------|--------|');

  for (const dir of dirs) {
    if (!dir.isDirectory()) continue;
    const display = displayMap.get(dir.name) ?? dir.name;
    lines.push(`| ${display} | SIL Open Font License 1.1 | Google Fonts / Official |`);
  }
  lines.push('');
  lines.push('See each font directory for its `OFL.txt` license file.');

  await writeFile(path.join(fontsDir, 'LICENSE.md'), lines.join('\n'));
  console.log(`生成: ${path.relative(rootDir, path.join(fontsDir, 'LICENSE.md'))}`);
}

async function main() {
  await mkdir(fontsDir, { recursive: true });

  for (const family of families) {
    try {
      await downloadFamily(family);
    } catch (err) {
      console.error(`错误: ${family.name} - ${err.message}`);
    }
  }

  await generateFontCss();
  await generateLicenseMd();

  console.log('全部完成');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
