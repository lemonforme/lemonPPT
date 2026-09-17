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
    const { buffer } = await exportDomToPptx({
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
    const { buffer } = await exportDomToPptx({
      html: createSimpleSlideHtml('Hello'),
    });
    const result = await validatePptxOutput(buffer, { expectedSlideCount: 5 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('页数不匹配'))).toBe(true);
  });
});

describe('exportDomToPptx', () => {
  it('导出单页基础幻灯片', async () => {
    const { buffer, report } = await exportDomToPptx({
      html: createSimpleSlideHtml('Hello World'),
      title: 'Test Deck',
      author: 'Tester',
    });
    // vitest 环境会包装 node:fs 返回值，跨 realm 的 Buffer 检测不可靠，
    // 类型正确性由 validatePptxOutput 内部的 ZIP/幻灯片结构校验覆盖。
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
    const { buffer } = await exportDomToPptx({ html });
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
    const { buffer } = await exportDomToPptx({
      html: createSimpleSlideHtml('Disabled'),
      editableText: false,
      vectorizeShapes: false,
      extractImages: false,
    });
    const validation = await validatePptxOutput(buffer, { expectedSlideCount: 1 });
    expect(validation.valid).toBe(true);
  });

  it('装饰性文本被过滤并记录警告', async () => {
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
      font-family: Arial, sans-serif;
    }
    .stroke-text {
      position: absolute;
      left: 50px;
      top: 50px;
      font-size: 80px;
      -webkit-text-stroke: 2px #999;
      -webkit-text-fill-color: transparent;
    }
    .watermark {
      position: absolute;
      left: 50px;
      top: 200px;
      font-size: 60px;
      color: rgba(0, 0, 0, 0.04);
    }
    .rotated-small {
      position: absolute;
      left: 50px;
      top: 350px;
      font-size: 11px;
      transform: rotate(-8deg);
    }
    .normal-text {
      position: absolute;
      left: 50px;
      top: 450px;
      font-size: 24px;
      color: #111111;
    }
    canvas {
      width: 400px;
      height: 300px;
      background: #f3f4f6;
    }
    .lp-chart-body {
      position: absolute;
      left: 500px;
      top: 100px;
      width: 400px;
      height: 300px;
    }
    .chart-label {
      position: absolute;
      left: 20px;
      top: 220px;
      font-size: 11px;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="lp-slide-wrapper" data-slide-index="0">
    <div class="stroke-text">WATERMARK</div>
    <div class="watermark">DRAFT</div>
    <div class="rotated-small">decor label</div>
    <div class="normal-text">Editable Content</div>
    <div class="lp-chart-body">
      <canvas id="chart"></canvas>
      <div class="chart-label">axis label</div>
    </div>
  </div>
</body>
</html>`;
    const { buffer, report } = await exportDomToPptx({
      html,
      editableText: true,
      vectorizeShapes: true,
      extractImages: true,
      regionFallback: true,
    });
    const validation = await validatePptxOutput(buffer, { expectedSlideCount: 1 });
    expect(validation.valid).toBe(true);

    // 正常文本被提取为文本框
    expect(report.textObjects).toBeGreaterThanOrEqual(1);
    const warningTypes = report.warnings.map((w) => w.type);
    // 描边空心字与低透明度水印被过滤
    expect(warningTypes).toContain('decorative-text-skipped');
    // 旋转小字被过滤
    expect(report.warnings.some((w) => w.type === 'decorative-text-skipped' && w.detail?.includes('rotated-small'))).toBe(true);
    // 图表区域内小字保留在截图中（canvas 区域）
    expect(warningTypes).toContain('chart-region-text-kept');
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
    const { buffer, report } = await exportDomToPptx({
      html,
      editableText: true,
      vectorizeShapes: true,
      extractImages: true,
      regionFallback: true,
    });
    const validation = await validatePptxOutput(buffer, { expectedSlideCount: 1 });
    expect(validation.valid).toBe(true);
    expect(buffer.length).toBeGreaterThan(4096);
    // canvas 区域被识别为 fallback 区域，fidelity 应低于 1
    expect(report.slideSummaries[0].fallbackRegions).toBe(1);
    expect(report.fidelity).toBeLessThan(1);
    expect(report.regionObjects).toBe(1);
  });
});

describe('P1-2 内容签名稳定检测', () => {
  function createDelayedContentHtml(script: string) {
    return `
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
      font-family: Arial, sans-serif;
    }
    .content {
      position: absolute;
      left: 100px;
      top: 100px;
      font-size: 24px;
    }
  </style>
</head>
<body>
  <div class="lp-slide-wrapper" data-slide-index="0">
    <div class="content" id="content">loading...</div>
  </div>
  <script>${script}</script>
</body>
</html>`;
  }

  it('瞬态变化后稳定：等待内容渲染完成再截图，无 content-unstable 警告', async () => {
    // 模拟异步数据加载：前 450ms 内内容持续变化，之后稳定
    const script = `
      (function () {
        var el = document.getElementById('content');
        var count = 0;
        var steps = ['加载中...', '加载中....', '加载中.....', 'FINAL'];
        var timer = setInterval(function () {
          count++;
          if (count >= steps.length) { clearInterval(timer); el.textContent = 'FINAL'; return; }
          el.textContent = steps[count];
        }, 150);
      })();
    `;
    const { buffer, report } = await exportDomToPptx({
      html: createDelayedContentHtml(script),
      editableText: true,
      vectorizeShapes: false,
      extractImages: false,
      stabilityCheck: true,
      stabilityPollMs: 100,
      stabilityMaxPolls: 30,
    });
    const validation = await validatePptxOutput(buffer, { expectedSlideCount: 1 });
    expect(validation.valid).toBe(true);
    // 签名最终稳定（变化停止后连续两次一致）
    expect(report.warnings.filter((w) => w.type === 'content-unstable')).toEqual([]);
  });

  it('持续变化内容：超时后记录 content-unstable 警告但不阻塞导出', async () => {
    // 模拟永不停止的动画/更新
    const script = `
      (function () {
        var el = document.getElementById('content');
        var n = 0;
        setInterval(function () { n++; el.textContent = 'tick-' + n; }, 60);
      })();
    `;
    const { buffer, report } = await exportDomToPptx({
      html: createDelayedContentHtml(script),
      editableText: true,
      vectorizeShapes: false,
      extractImages: false,
      stabilityCheck: true,
      stabilityPollMs: 80,
      stabilityMaxPolls: 5,
    });
    const validation = await validatePptxOutput(buffer, { expectedSlideCount: 1 });
    // 超时降级：导出仍成功
    expect(validation.valid).toBe(true);
    const unstableWarnings = report.warnings.filter((w) => w.type === 'content-unstable');
    expect(unstableWarnings.length).toBe(1);
    expect(unstableWarnings[0].slide).toBe(1);
  });

  it('可通过 stabilityCheck: false 跳过签名检测', async () => {
    const script = `
      (function () {
        var el = document.getElementById('content');
        var n = 0;
        setInterval(function () { n++; el.textContent = 'tick-' + n; }, 60);
      })();
    `;
    const { report } = await exportDomToPptx({
      html: createDelayedContentHtml(script),
      editableText: false,
      vectorizeShapes: false,
      extractImages: false,
      stabilityCheck: false,
    });
    // 跳过检测：即使内容持续变化也无警告
    expect(report.warnings.filter((w) => w.type === 'content-unstable')).toEqual([]);
  });
});

describe('P1-3 声明式 fallback 协议', () => {
  it('data-lp-fallback-region 声明优先：区域内置图表不再依赖启发式选择器', async () => {
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
      font-family: Arial, sans-serif;
    }
    /* 模拟 LpEChart：无任何启发式可识别的特征（无 canvas/svg/data-lp-echart-type），仅靠声明 */
    .declared-chart {
      position: absolute;
      left: 200px;
      top: 150px;
      width: 400px;
      height: 300px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    }
    .chart-title {
      position: absolute;
      left: 200px;
      top: 80px;
      font-size: 28px;
    }
  </style>
</head>
<body>
  <div class="lp-slide-wrapper" data-slide-index="0">
    <div class="chart-title">Chart Title</div>
    <div class="declared-chart" data-lp-fallback-region="chart"></div>
  </div>
</body>
</html>`;
    const { buffer, report } = await exportDomToPptx({
      html,
      editableText: true,
      vectorizeShapes: true,
      extractImages: true,
      regionFallback: true,
    });
    const validation = await validatePptxOutput(buffer, { expectedSlideCount: 1 });
    expect(validation.valid).toBe(true);
    // 声明区域被消费（无 canvas/svg，纯声明识别）
    expect(report.slideSummaries[0].fallbackRegions).toBe(1);
    expect(report.regionObjects).toBe(1);
    // 声明区域外的标题仍可编辑
    expect(report.slideSummaries[0].textBoxes).toBeGreaterThanOrEqual(1);
  });

  it('声明区域优先于外层启发式容器：不产生嵌套重复区域', async () => {
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
      font-family: Arial, sans-serif;
    }
    .lp-chart-body {
      position: absolute;
      left: 150px;
      top: 120px;
      width: 500px;
      height: 400px;
      background: #f8fafc;
      border-radius: 16px;
    }
    .lp-chart-body h3 {
      font-size: 20px;
      margin: 0 0 12px 0;
    }
    .echart-container {
      width: 460px;
      height: 330px;
      margin: 0 auto;
      background: #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="lp-slide-wrapper" data-slide-index="0">
    <div class="lp-chart-body">
      <h3>Chart Header</h3>
      <div class="echart-container" data-lp-fallback-region="chart"></div>
    </div>
  </div>
</body>
</html>`;
    const { buffer, report } = await exportDomToPptx({
      html,
      editableText: true,
      vectorizeShapes: true,
      extractImages: true,
      regionFallback: true,
    });
    const validation = await validatePptxOutput(buffer, { expectedSlideCount: 1 });
    expect(validation.valid).toBe(true);
    // 仅声明区域被截图：外层 .lp-chart-body（启发式选择器）不再产生第二个嵌套区域
    expect(report.slideSummaries[0].fallbackRegions).toBe(1);
    // 外层容器内的标题（声明区域之外）保持可编辑
    expect(report.slideSummaries[0].textBoxes).toBeGreaterThanOrEqual(1);
  });

  it('未声明的表格仍走启发式兜底', async () => {
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
      font-family: Arial, sans-serif;
    }
    table {
      position: absolute;
      left: 200px;
      top: 150px;
      width: 500px;
      border-collapse: collapse;
    }
    td {
      border: 1px solid #cbd5e1;
      padding: 10px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="lp-slide-wrapper" data-slide-index="0">
    <table>
      <tr><td>A1</td><td>B1</td></tr>
      <tr><td>A2</td><td>B2</td></tr>
    </table>
  </div>
</body>
</html>`;
    const { report } = await exportDomToPptx({
      html,
      editableText: true,
      vectorizeShapes: true,
      extractImages: true,
      regionFallback: true,
    });
    // 无声明时启发式 table 选择器兜底生效
    expect(report.slideSummaries[0].fallbackRegions).toBe(1);
  });
});

describe('P1-1 逐行文本拆分', () => {
  // lemonPPT 布局 1280px = 10in → 128px/in → EMU/px = 914400/128
  const PX_TO_EMU = 914400 / 128;

  function createWrappedTextHtml() {
    // 280px 容器 / 24px Arial / 40px 行高：较长单词折行成 4 行以上
    return `
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
      font-family: Arial, sans-serif;
    }
    .paragraph {
      position: absolute;
      left: 100px;
      top: 100px;
      width: 280px;
      font-size: 24px;
      line-height: 40px;
    }
  </style>
</head>
<body>
  <div class="lp-slide-wrapper" data-slide-index="0">
    <div class="paragraph">alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima mike november oscar</div>
  </div>
</body>
</html>`;
  }

  async function readSlideXml(buffer: Buffer): Promise<string> {
    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const { writeFile, mkdtemp, rm } = await import('node:fs/promises');
    const os = await import('node:os');
    const path = await import('node:path');
    const execFileAsync = promisify(execFile);
    const dir = await mkdtemp(path.join(os.tmpdir(), 'lemonppt-p11-'));
    const file = path.join(dir, 'deck.pptx');
    try {
      await writeFile(file, buffer);
      const { stdout } = await execFileAsync('unzip', ['-p', file, 'ppt/slides/slide1.xml'], {
        encoding: 'utf8',
        maxBuffer: 8 * 1024 * 1024,
      });
      return stdout;
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }

  function parseTextBoxesFromXml(xml: string): Array<{ x: number; y: number; w: number; h: number; text: string }> {
    const boxes: Array<{ x: number; y: number; w: number; h: number; text: string }> = [];
    const spRegex = /<p:sp>[\s\S]*?<\/p:sp>/g;
    let m: RegExpExecArray | null;
    while ((m = spRegex.exec(xml)) !== null) {
      const sp = m[0];
      const off = sp.match(/<a:off x="(-?\d+)" y="(-?\d+)"/);
      const ext = sp.match(/<a:ext cx="(\d+)" cy="(\d+)"/);
      const texts: string[] = [];
      const tRegex = /<a:t>([\s\S]*?)<\/a:t>/g;
      let t: RegExpExecArray | null;
      while ((t = tRegex.exec(sp)) !== null) texts.push(t[1]);
      if (off && ext && texts.join('').trim().length > 0) {
        boxes.push({
          x: parseInt(off[1], 10),
          y: parseInt(off[2], 10),
          w: parseInt(ext[1], 10),
          h: parseInt(ext[2], 10),
          text: texts.join('').trim(),
        });
      }
    }
    return boxes;
  }

  it(
    '折行文本拆分为行级文本框：y 单调递增、行距与 line-height 一致、左对齐、内容无丢失',
    async () => {
      const source = 'alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima mike november oscar';
      const { buffer, report } = await exportDomToPptx({
        html: createWrappedTextHtml(),
        editableText: true,
        vectorizeShapes: false,
        extractImages: false,
      });

      // 报告口径：折成 ≥3 个行级文本框
      expect(report.slideSummaries[0].textBoxes).toBeGreaterThanOrEqual(3);

      // PPTX 口径：解包 slide1.xml 验证行框坐标
      const xml = await readSlideXml(buffer);
      const boxes = parseTextBoxesFromXml(xml).sort((a, b) => a.y - b.y);
      expect(boxes.length).toBeGreaterThanOrEqual(3);

      // 行距 = line-height 40px（±3px 容差），y 严格递增
      const expectedStep = 40 * PX_TO_EMU;
      for (let i = 1; i < boxes.length; i++) {
        expect(boxes[i].y).toBeGreaterThan(boxes[i - 1].y);
        expect(Math.abs(boxes[i].y - boxes[i - 1].y - expectedStep)).toBeLessThan(3 * PX_TO_EMU);
      }

      // 左对齐：各行 x 起点一致（±2px）
      for (const b of boxes) {
        expect(Math.abs(b.x - boxes[0].x)).toBeLessThan(2 * PX_TO_EMU);
      }

      // 内容无丢失：行文本拼接后单词集合与原文一致
      const joined = boxes.map((b) => b.text).join(' ').replace(/\s+/g, ' ').trim();
      expect(joined.split(' ').sort().join(' ')).toBe(source.split(' ').sort().join(' '));
    },
    60000,
  );

  it('单行文本不拆分：仍输出单个整元素文本框', async () => {
    const { report } = await exportDomToPptx({
      html: createSimpleSlideHtml('Hello'),
      editableText: true,
      vectorizeShapes: false,
      extractImages: false,
    });
    expect(report.slideSummaries[0].textBoxes).toBe(1);
  });
});
