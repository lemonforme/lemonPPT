// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, it, expect } from 'vitest';
import { exportDomToPptx, validatePptxOutput } from './index.js';

function createSimpleSlideHtml(text: string, extraStyle = '') {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    .lp-slide-wrapper {
      position: relative;
      width: 1280px;
      height: 720px;
      font-family: Arial, sans-serif;
      color: #1a1a1a;
      background: #ffffff;
    }
    .box {
      position: absolute;
      left: 100px;
      top: 100px;
      width: 200px;
      height: 80px;
      background: #e5e7eb;
      border-radius: 12px;
      border: 2px solid #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .line {
      position: absolute;
      left: 400px;
      top: 140px;
      width: 200px;
      height: 2px;
      background: transparent;
      border-top: 2px solid #ef4444;
    }
    ${extraStyle}
  </style>
</head>
<body>
  <div class="lp-slide-wrapper" data-slide-index="0">
    <div class="box">${text}</div>
    <div class="line"></div>
  </div>
</body>
</html>
  `.trim();
}

describe('validatePptxOutput', () => {
  it('拒绝空 buffer', async () => {
    const result = await validatePptxOutput(Buffer.alloc(0));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('PPTX buffer 为空');
  });

  it('拒绝非 ZIP buffer', async () => {
    const result = await validatePptxOutput(Buffer.from('not a zip'));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('PPTX buffer 不是合法 ZIP 格式');
  });

  it('校验合法 PPTX 页数', async () => {
    const buffer = await exportDomToPptx({
      html: createSimpleSlideHtml('Hello'),
      editableText: true,
      vectorizeShapes: true,
      extractImages: true,
    });
    const result = await validatePptxOutput(buffer, { expectedSlideCount: 1 });
    expect(result.valid).toBe(true);
    expect(result.slideCount).toBe(1);
    expect(result.fileSize).toBeGreaterThan(0);
  });

  it('检测页数不匹配', async () => {
    const buffer = await exportDomToPptx({
      html: createSimpleSlideHtml('Hello'),
    });
    const result = await validatePptxOutput(buffer, { expectedSlideCount: 5 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('页数不匹配'))).toBe(true);
  });
});

describe('exportDomToPptx', () => {
  it('导出单页基础幻灯片', async () => {
    const buffer = await exportDomToPptx({
      html: createSimpleSlideHtml('Hello World'),
      title: 'Test Deck',
      author: 'Tester',
    });
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(4096);
    const validation = await validatePptxOutput(buffer, { expectedSlideCount: 1 });
    expect(validation.valid).toBe(true);
  });

  it('多页幻灯片导出正确页数', async () => {
    const html = `
<!DOCTYPE html>
<html><body>
  <div class="lp-slide-wrapper" data-slide-index="0"><div style="width:1280px;height:720px;background:#fff;color:#000;">Slide 1</div></div>
  <div class="lp-slide-wrapper" data-slide-index="1"><div style="width:1280px;height:720px;background:#fff;color:#000;">Slide 2</div></div>
</body></html>`;
    const buffer = await exportDomToPptx({ html });
    const validation = await validatePptxOutput(buffer, { expectedSlideCount: 2 });
    expect(validation.valid).toBe(true);
  });

  it('无幻灯片时抛出清晰错误', async () => {
    await expect(
      exportDomToPptx({
        html: '<html><body><div>no slides</div></body></html>',
      }),
    ).rejects.toThrow('未找到任何 .lp-slide-wrapper 幻灯片节点');
  });

  it('可禁用文字/形状/图片提取', async () => {
    const buffer = await exportDomToPptx({
      html: createSimpleSlideHtml('Disabled'),
      editableText: false,
      vectorizeShapes: false,
      extractImages: false,
    });
    const validation = await validatePptxOutput(buffer, { expectedSlideCount: 1 });
    expect(validation.valid).toBe(true);
  });

  it('区域级 fallback 对 canvas 单独截图并叠加', async () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    .lp-slide-wrapper {
      position: relative;
      width: 1280px;
      height: 720px;
      background: #ffffff;
      color: #000000;
    }
    .outside-text {
      position: absolute;
      left: 50px;
      top: 50px;
      font-size: 24px;
    }
    canvas {
      position: absolute;
      left: 400px;
      top: 100px;
      width: 400px;
      height: 300px;
      background: #f3f4f6;
    }
  </style>
</head>
<body>
  <div class="lp-slide-wrapper" data-slide-index="0">
    <div class="outside-text">Outside</div>
    <canvas id="chart"></canvas>
  </div>
</body>
</html>`;
    const buffer = await exportDomToPptx({
      html,
      editableText: true,
      vectorizeShapes: true,
      extractImages: true,
      regionFallback: true,
    });
    const validation = await validatePptxOutput(buffer, { expectedSlideCount: 1 });
    expect(validation.valid).toBe(true);
    expect(buffer.length).toBeGreaterThan(4096);
  });
});
