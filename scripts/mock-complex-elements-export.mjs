#!/usr/bin/env node
// 本地验证：复杂表格、对比表、clip-path / filter 元素的区域截图与文字可编辑性

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportDomToPptx } from '../packages/dom-to-pptx/dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'output');
const scale = Number(process.argv.find((a) => a.startsWith('--scale='))?.split('=')[1] || '2');
const suffix = scale === 1 ? '1x' : '2x';
const outFile = path.join(outDir, `mock-complex-elements-${suffix}.pptx`);

const SLIDE_W = 1280;
const SLIDE_H = 720;

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Noto Sans SC", "Microsoft YaHei", Arial, sans-serif; background: #111; }

    .lp-slide-wrapper {
      position: relative;
      width: ${SLIDE_W}px;
      height: ${SLIDE_H}px;
      overflow: hidden;
      background: linear-gradient(145deg, #f7f9fc 0%, #e9eef5 100%);
      color: #1a1a2e;
    }

    .slide-title {
      position: absolute;
      left: 48px;
      top: 36px;
      font-size: 36px;
      font-weight: 700;
      color: #16213e;
    }

    /* 复杂数据表格 */
    .lp-table-data-wrap {
      position: absolute;
      left: 48px;
      top: 104px;
      width: 596px;
      height: 340px;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      background: #fff;
    }
    .lp-table-data-wrap table {
      width: 100%;
      height: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    .lp-table-data-wrap th,
    .lp-table-data-wrap td {
      padding: 10px 12px;
      border: 1px solid #e1e4e8;
      text-align: center;
    }
    .lp-table-data-wrap th {
      background: #16213e;
      color: #fff;
      font-weight: 600;
    }
    .lp-table-data-wrap tr:nth-child(even) td { background: #f6f8fa; }
    .lp-table-data-wrap tr.highlight td { background: #e6fffa; color: #0f3460; font-weight: 600; }
    .lp-table-data-wrap .right { text-align: right; }
    .lp-table-data-wrap .left { text-align: left; }

    /* 对比表 */
    .lp-comparison-v3-table {
      position: absolute;
      left: 676px;
      top: 104px;
      width: 556px;
      height: 340px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      background: #fff;
      display: flex;
      flex-direction: column;
    }
    .lp-comparison-v3-table .cmp-header {
      display: flex;
      background: #16213e;
      color: #fff;
      font-weight: 600;
    }
    .lp-comparison-v3-table .cmp-row {
      display: flex;
      border-bottom: 1px solid #e1e4e8;
      flex: 1;
    }
    .lp-comparison-v3-table .cmp-cell {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      font-size: 14px;
      text-align: center;
    }
    .lp-comparison-v3-table .cmp-cell.feature {
      flex: 1.1;
      background: #f6f8fa;
      font-weight: 600;
      color: #16213e;
    }
    .lp-comparison-v3-table .cmp-cell.left { color: #0f3460; }
    .lp-comparison-v3-table .cmp-cell.right { color: #e94560; }

    /* clip-path 装饰元素 */
    .clip-container {
      position: absolute;
      left: 48px;
      top: 472px;
      width: 360px;
      height: 180px;
      clip-path: polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%);
      background: linear-gradient(120deg, #0f3460 0%, #e94560 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 22px;
      font-weight: 700;
      text-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }

    /* 滤镜装饰元素，应被自动识别为复杂区域 */
    .filter-badge {
      position: absolute;
      left: 460px;
      top: 540px;
      width: 180px;
      height: 80px;
      background: #16213e;
      border-radius: 16px;
      filter: blur(1px) brightness(1.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
    }

    /* 普通矢量化形状（用于对照） */
    .vector-shape {
      position: absolute;
      left: 720px;
      top: 500px;
      width: 200px;
      height: 120px;
      background: #e94560;
      border-radius: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }

    .note {
      position: absolute;
      left: 956px;
      top: 640px;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="lp-slide-wrapper" data-slide-index="0">
    <div class="slide-title">复杂元素导出验证</div>

    <div class="lp-table-data-wrap">
      <table>
        <thead>
          <tr>
            <th>排名</th>
            <th class="left">公司</th>
            <th class="left">赛道</th>
            <th class="right">融资额</th>
            <th>轮次</th>
          </tr>
        </thead>
        <tbody>
          <tr class="highlight">
            <td>1</td>
            <td class="left">星辰科技</td>
            <td class="left">企业级 AI</td>
            <td class="right">$3.2B</td>
            <td>E 轮</td>
          </tr>
          <tr>
            <td>2</td>
            <td class="left">青云智算</td>
            <td class="left">云原生</td>
            <td class="right">$2.1B</td>
            <td>D 轮</td>
          </tr>
          <tr>
            <td>3</td>
            <td class="left">蓝湖数据</td>
            <td class="left">数据平台</td>
            <td class="right">$1.8B</td>
            <td>C 轮</td>
          </tr>
          <tr>
            <td>4</td>
            <td class="left">墨染设计</td>
            <td class="left">AIGC 设计</td>
            <td class="right">$1.5B</td>
            <td>C 轮</td>
          </tr>
          <tr>
            <td>5</td>
            <td class="left">极光安全</td>
            <td class="left">零信任</td>
            <td class="right">$980M</td>
            <td>B 轮</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="lp-comparison-v3-table">
      <div class="cmp-header">
        <div class="cmp-cell feature">维度</div>
        <div class="cmp-cell left">自研方案</div>
        <div class="cmp-cell right">第三方方案</div>
      </div>
      <div class="cmp-row">
        <div class="cmp-cell feature">数据隐私</div>
        <div class="cmp-cell left">完全可控</div>
        <div class="cmp-cell right">依赖服务商</div>
      </div>
      <div class="cmp-row">
        <div class="cmp-cell feature">定制化</div>
        <div class="cmp-cell left">深度定制</div>
        <div class="cmp-cell right">受限于模板</div>
      </div>
      <div class="cmp-row">
        <div class="cmp-cell feature">集成成本</div>
        <div class="cmp-cell left">一次性投入高</div>
        <div class="cmp-cell right">按量付费</div>
      </div>
      <div class="cmp-row">
        <div class="cmp-cell feature">长期运维</div>
        <div class="cmp-cell left">需自建团队</div>
        <div class="cmp-cell right">托管运维</div>
      </div>
    </div>

    <div class="clip-container">clip-path 多边形</div>
    <div class="filter-badge">blur 滤镜</div>
    <div class="vector-shape">矢量形状</div>
    <div class="note">表格、对比表、clip-path、filter 均应走区域截图，文字仍可编辑</div>
  </div>
</body>
</html>
`;

await mkdir(outDir, { recursive: true });

const buffer = await exportDomToPptx({
  html,
  width: SLIDE_W,
  height: SLIDE_H,
  title: '复杂元素导出验证',
  subject: '复杂表格 / 对比表 / clip-path / filter',
  author: 'lemonPPT',
  editableText: true,
  vectorizeShapes: true,
  extractImages: true,
  regionFallback: true,
  deviceScaleFactor: scale,
  initECharts: false,
  echartsWaitMs: 0,
  logger: {
    debug: (...args) => console.log('[debug]', ...args),
    info: (...args) => console.log('[info]', ...args),
    warn: (...args) => console.warn('[warn]', ...args),
    error: (...args) => console.error('[error]', ...args),
  },
  onProgress: (p) => console.log(`[${p.phase}] ${p.message}${p.current !== undefined ? ` (${p.current}/${p.total})` : ''}`),
});

await writeFile(outFile, buffer);
console.log(`\n✅ PPTX 已导出: ${outFile} (${(buffer.length / 1024).toFixed(1)} KB)`);
