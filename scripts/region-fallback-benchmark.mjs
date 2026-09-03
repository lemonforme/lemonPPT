import { exportDomToPptx } from '../packages/dom-to-pptx/dist/index.js';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const outDir = '/tmp/region-fallback-benchmark';
if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f5f5f5; }
    .lp-slide-wrapper {
      width: 1280px;
      height: 720px;
      position: relative;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      overflow: hidden;
      font-family: 'Inter', 'Noto Sans SC', sans-serif;
    }
    .title {
      position: absolute;
      top: 48px;
      left: 64px;
      font-size: 48px;
      font-weight: 700;
      color: #ffffff;
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .subtitle {
      position: absolute;
      top: 120px;
      left: 64px;
      font-size: 24px;
      color: rgba(255,255,255,0.9);
    }
    .complex-chart {
      position: absolute;
      right: 64px;
      top: 180px;
      width: 520px;
      height: 360px;
      filter: drop-shadow(0 12px 24px rgba(0,0,0,0.25));
    }
    .footer {
      position: absolute;
      bottom: 40px;
      left: 64px;
      font-size: 18px;
      color: rgba(255,255,255,0.8);
    }
  </style>
</head>
<body>
  <div class="lp-slide-wrapper" data-slide-index="0">
    <div class="title">区域级 alpha-matte 截图验证</div>
    <div class="subtitle">复杂 SVG 区域单独截图 + 矢量文字叠加</div>
    <svg class="complex-chart" viewBox="0 0 520 360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#feca57;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#48dbfb;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#1dd1a1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#5f27cd;stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="520" height="360" rx="24" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <circle cx="140" cy="120" r="80" fill="url(#grad1)" filter="url(#glow)"/>
      <circle cx="380" cy="120" r="80" fill="url(#grad2)" filter="url(#glow)"/>
      <path d="M 140 240 Q 260 160 380 240 T 260 320" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="4" stroke-linecap="round"/>
      <polygon points="260,60 280,110 330,110 290,140 305,190 260,160 215,190 230,140 190,110 240,110" fill="#ff9ff3" filter="url(#glow)"/>
      <text x="260" y="280" text-anchor="middle" fill="white" font-size="28" font-weight="bold" font-family="Inter, Noto Sans SC, sans-serif">复杂渐变图形</text>
    </svg>
    <div class="footer">Footer text rendered as editable vector</div>
  </div>
</body>
</html>`;

async function run(label, options) {
  console.log(`\nRunning ${label}...`);
  const start = Date.now();
  const buffer = await exportDomToPptx({
    html,
    width: 1280,
    height: 720,
    title: 'Region Fallback Benchmark',
    ...options,
  });
  const outFile = path.join(outDir, `${label}.pptx`);
  await writeFile(outFile, buffer);
  const sizeMB = buffer.length / (1024 * 1024);
  console.log(`${label}: ${buffer.length} bytes (${sizeMB.toFixed(2)} MB) in ${Date.now() - start}ms`);
  return { label, bytes: buffer.length, mb: sizeMB, file: outFile };
}

const baseline = await run('without-region-fallback', { regionFallback: false });
const optimized = await run('with-region-fallback', { regionFallback: true });

const reduction = (1 - optimized.bytes / baseline.bytes) * 100;
console.log(`\n体积下降: ${reduction.toFixed(2)}%`);
console.log(reduction >= 10 ? '✅ 达到 ≥10% 目标' : '❌ 未达到 ≥10% 目标');
