#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * DOM-to-PPTX 引擎 mock 测试。
 *
 * 不依赖 renderer/theme，直接喂一段包含文字、图形、图片的 HTML，
 * 验证 exportDomToPptx 能否正常提取并生成 PPTX。
 */

import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { exportDomToPptx } from '../packages/dom-to-pptx/dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'output');
const outFile = path.join(outDir, 'dom-to-pptx-mock.pptx');

function createPngBuffer(width, height, color) {
  const png = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (png.width * y + x) << 2;
      png.data[idx] = color.r;
      png.data[idx + 1] = color.g;
      png.data[idx + 2] = color.b;
      png.data[idx + 3] = color.a ?? 255;
    }
  }
  return PNG.sync.write(png);
}

async function prepareMockAssets() {
  const assetsDir = await mkdtemp(path.join(os.tmpdir(), 'lemonppt-mock-assets-'));
  await writeFile(path.join(assetsDir, 'mock-image.png'), createPngBuffer(480, 270, { r: 233, g: 69, b: 96 }));
  return assetsDir;
}

async function main() {
  const assetsDir = await prepareMockAssets();
  await mkdir(outDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #111; }
    .lp-slide-wrapper {
      position: relative;
      width: 1280px;
      height: 720px;
      overflow: hidden;
      padding: 48px;
    }
    .slide-1 { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #fff; }
    .slide-2 { background: #f5f5f5; color: #222; }
    h1 { font-size: 56px; font-weight: 700; margin-bottom: 24px; }
    p { font-size: 24px; line-height: 1.5; max-width: 800px; }
    .badge {
      position: absolute;
      left: 900px;
      top: 80px;
      width: 140px;
      height: 48px;
      background: #e94560;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
    }
    .circle {
      position: absolute;
      left: 960px;
      top: 240px;
      width: 120px;
      height: 120px;
      background: #0f3460;
      border-radius: 50%;
      border: 4px solid #e94560;
    }
    .line {
      position: absolute;
      left: 80px;
      top: 420px;
      width: 400px;
      height: 4px;
      background: transparent;
      border-bottom: 4px solid #e94560;
    }
    .cta {
      position: absolute;
      left: 80px;
      top: 540px;
      width: 200px;
      height: 56px;
      background: #e94560;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
    }
    .feature-img {
      position: absolute;
      left: 680px;
      top: 320px;
      width: 480px;
      height: 270px;
      object-fit: cover;
      border-radius: 12px;
    }
  </style>
</head>
<body>
  <div class="lp-slide-wrapper slide-1" data-slide-index="0">
    <h1>Mock Deck Title</h1>
    <p>这是第一段可编辑文本，用于验证文字提取、字号与颜色。</p>
    <div class="badge">BETA</div>
    <div class="circle"></div>
    <div class="line"></div>
    <div class="cta">Get Started</div>
    <img class="feature-img" src="./assets/mock-image.png" alt="mock" />
  </div>

  <div class="lp-slide-wrapper slide-2" data-slide-index="1">
    <h1 style="color:#16213e;">第二页</h1>
    <p style="color:#333;">这是第二页的正文，背景为浅色，用于验证不同主题色下的文字颜色提取。</p>
    <div style="position:absolute;left:80px;top:420px;width:300px;height:60px;background:#16213e;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;">
      Rounded Button
    </div>
  </div>
</body>
</html>
`;

  const buffer = await exportDomToPptx({
    html,
    assetsDir,
    width: 1280,
    height: 720,
    title: 'Mock DOM-to-PPTX Test',
    subject: 'Phase 5 mock verification',
    author: 'lemonPPT',
    editableText: true,
    vectorizeShapes: true,
    extractImages: true,
    echartsWaitMs: 0,
    initECharts: false,
    logger: {
      debug: (...args) => console.log('[debug]', ...args),
      info: (...args) => console.log('[info]', ...args),
      warn: (...args) => console.warn('[warn]', ...args),
      error: (...args) => console.error('[error]', ...args),
    },
    onProgress: (p) => console.log(`[${p.phase}] ${p.message}${p.current !== undefined ? ` (${p.current}/${p.total})` : ''}`),
  });

  await writeFile(outFile, buffer);
  console.log(`\n已生成 mock PPTX: ${outFile} (${(buffer.length / 1024).toFixed(1)} KB)`);
  console.log(`临时资源目录: ${assetsDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
