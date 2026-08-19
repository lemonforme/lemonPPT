// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 图表共享工具（chartkit）
 * 手绘 SVG 图表辅助：比例尺 / 数值格式化 / 网格 / 图例 / 路径生成。
 * 全部使用 theme10 自有 CSS 变量（--lp-t10-* / --lp-series-* / --lp-ink*），
 * 不引入任何 theme08/09/third-party 色值与骨架名。
 */

import type { ReactNode } from 'react';

export interface T10Series {
  name: string;
  values: number[];
  /** 颜色：CSS 变量名或 hex；缺省按序列序号取 --lp-series-* */
  color?: string;
}

export interface T10ChartModel {
  categories: string[];
  series: T10Series[];
}

/** 序列默认色（与 tokens.ts 的 SERIES 同源，但通过 CSS 变量引用，零硬编码色值） */
export function seriesColor(i: number): string {
  const vars = [
    'var(--lp-t10-blue)',
    'var(--lp-t10-gold)',
    'var(--lp-t10-gold-amber)',
    'var(--lp-t10-copper)',
    'var(--lp-violet)',
    'var(--lp-accent-2)',
  ];
  return vars[i % vars.length];
}

/** 友好数值格式化（k / M / B） */
export function fmtNum(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(abs >= 1e10 ? 0 : 1) + 'B';
  if (abs >= 1e6) return (n / 1e6).toFixed(abs >= 1e7 ? 0 : 1) + 'M';
  if (abs >= 1e3) return (n / 1e3).toFixed(abs >= 1e4 ? 0 : 1) + 'k';
  return String(Math.round(n * 100) / 100);
}

/** 计算「漂亮」的刻度范围（向上取整到 1/2/2.5/5/10 的幂） */
export function niceScale(min: number, max: number, ticks = 4): {
  min: number;
  max: number;
  step: number;
  ticks: number[];
} {
  if (!isFinite(min) || !isFinite(max)) return { min: 0, max: 1, step: 1, ticks: [0, 1] };
  if (min === max) {
    max = min + 1;
  }
  // 允许负值（例如盈亏）
  const lo = Math.min(min, 0);
  const hi = Math.max(max, 0);
  const range = hi - lo;
  const rawStep = range / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
  const norm = rawStep / mag;
  let niceNorm: number;
  if (norm <= 1) niceNorm = 1;
  else if (norm <= 2) niceNorm = 2;
  else if (norm <= 2.5) niceNorm = 2.5;
  else if (norm <= 5) niceNorm = 5;
  else niceNorm = 10;
  const step = niceNorm * mag;
  const niceMin = Math.floor(lo / step) * step;
  const niceMax = Math.ceil(hi / step) * step;
  const arr: number[] = [];
  for (let v = niceMin; v <= niceMax + step * 1e-6; v += step) {
    arr.push(Number(v.toFixed(6)));
  }
  return { min: niceMin, max: niceMax, step, ticks: arr };
}

/** 线性映射：值域 → 像素 */
export function linear(min: number, max: number, p0: number, p1: number): (v: number) => number {
  const span = max - min || 1;
  return (v: number) => p0 + ((v - min) / span) * (p1 - p0);
}

/** 折线点集（用于 <polyline>/<path>） */
export function linePoints(xs: number[], ys: number[]): string {
  return xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
}

/** 面积路径（折线 + 基线闭合） */
export function areaPath(xs: number[], ys: number[], baseY: number): string {
  if (xs.length === 0) return '';
  const top = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' L ');
  return `M ${xs[0].toFixed(1)},${baseY.toFixed(1)} L ${top} L ${xs[xs.length - 1].toFixed(1)},${baseY.toFixed(1)} Z`;
}

/* ────────────────────────────────────────────────────────────────
 * SVG 呈现原语（被各图表版式复用）
 * 标准 plot 视窗：viewBox 0 0 1000 560
 *   plotX0=64 plotX1=976 plotY0=22 plotY1=512
 * ──────────────────────────────────────────────────────────────── */
export const T10_PLOT = { x0: 64, x1: 976, y0: 22, y1: 512 } as const;

/** 横向网格线 + 左轴刻度标签 */
export function ChartGridY(props: {
  scale: (v: number) => number;
  ticks: number[];
  fmt?: (v: number) => string;
}): ReactNode {
  const { scale, ticks, fmt = fmtNum } = props;
  const { x0, x1, y0, y1 } = T10_PLOT;
  return (
    <g className="lp-t10-grid-y">
      {ticks.map((t, i) => {
        const y = scale(t);
        const zero = t === 0 || Math.abs(t) < 1e-9;
        return (
          <g key={i}>
            <line
              x1={x0}
              x2={x1}
              y1={y}
              y2={y}
              stroke={zero ? 'var(--lp-rule-strong)' : 'var(--lp-rule)'}
              strokeWidth={zero ? 1.4 : 1}
            />
            <text x={x0 - 10} y={y + 4} textAnchor="end" className="lp-t10-axis-label">
              {fmt(t)}
            </text>
          </g>
        );
      })}
      {/* 基线 / 画框右缘 */}
      <line x1={x1} x2={x1} y1={y0} y2={y1} stroke="var(--lp-rule)" strokeWidth={1} />
    </g>
  );
}

/** 类目轴（底部标签） */
export function ChartCatAxis(props: {
  labels: string[];
  band: (i: number) => { x: number; w: number };
}): ReactNode {
  const { labels, band } = props;
  const { y1 } = T10_PLOT;
  return (
    <g className="lp-t10-axis-cat">
      {labels.map((lab, i) => {
        const b = band(i);
        return (
          <text key={i} x={b.x + b.w / 2} y={y1 + 22} textAnchor="middle" className="lp-t10-axis-label">
            {lab}
          </text>
        );
      })}
    </g>
  );
}

/** 图例 */
export function ChartLegend(props: { items: { name: string; color: string }[] }): ReactNode {
  const { items } = props;
  return (
    <div className="lp-t10-legend">
      {items.map((it, i) => (
        <span className="lp-t10-legend-item" key={i}>
          <i className="lp-t10-legend-chip" style={{ background: it.color }} />
          {it.name}
        </span>
      ))}
    </div>
  );
}

/** 序列取色（优先用自带 color，否则按序号） */
export function colorOf(s: T10Series, i: number): string {
  return s.color ?? seriesColor(i);
}

/** 逗号分隔数值串 → number[]（容错过滤非数） */
export function parseVals(s?: string): number[] {
  if (!s) return [];
  return s
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((n) => isFinite(n));
}

/** 条目序列（{name,value}）→ 规整对象数组（value 转 number） */
export function parseItems(v?: { name?: string; value?: unknown }[]): { name: string; value: number }[] {
  if (!Array.isArray(v)) return [];
  return v.map((it, i) => ({
    name: it?.name ?? `项 ${i + 1}`,
    value: Number(it?.value ?? 0),
  }));
}

/** "x,y x,y" → 二维点序列（散点图） */
export function parseXY(s?: string): [number, number][] {
  if (!s) return [];
  return s
    .split(/[\s;]+/)
    .map((pair) => pair.split(',').map(Number))
    .filter((p) => p.length >= 2 && isFinite(p[0]) && isFinite(p[1])) as [number, number][];
}

/** "x,y,size x,y,size" → 三维点序列（气泡图，第三维为尺寸） */
export function parseXYS(s?: string): [number, number, number][] {
  if (!s) return [];
  return s
    .split(/[\s;]+/)
    .map((tri) => tri.split(',').map(Number))
    .filter((p) => p.length >= 3 && p.every((n) => isFinite(n))) as [number, number, number][];
}

/** 两个十六进制色之间的线性插值（热力图顺色阶用，仅取 theme10 自有 token 参与） */
export function mixHex(a: string, b: string, t: number): string {
  const pa = hexToRgb(a), pb = hexToRgb(b);
  if (!pa || !pb) return a;
  const k = Math.max(0, Math.min(1, t));
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * k);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * k);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * k);
  return '#' + [r, g, bl].map((x) => x.toString(16).padStart(2, '0')).join('');
}
function hexToRgb(h: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(h).trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* ────────────────────────────────────────────────────────────────
 * 环形 / 饼图 / 扇形路径生成（viewBox 0 0 1000 560）
 * 角度约定：0° = 正东(3 点钟)，顺时针为正（与 PPTX angleRange 一致）。
 * ──────────────────────────────────────────────────────────────── */

/** 环形扇区（annular sector）路径 */
export function donutSeg(cx: number, cy: number, rOut: number, rIn: number, a0: number, a1: number): string {
  const rad = (a: number) => (a * Math.PI) / 180;
  const px = (r: number, a: number) => cx + r * Math.cos(rad(a));
  const py = (r: number, a: number) => cy + r * Math.sin(rad(a));
  const large = a1 - a0 > 180 ? 1 : 0;
  const x0 = px(rOut, a0), y0 = py(rOut, a0);
  const x1 = px(rOut, a1), y1 = py(rOut, a1);
  const x2 = px(rIn, a1), y2 = py(rIn, a1);
  const x3 = px(rIn, a0), y3 = py(rIn, a0);
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${rOut} ${rOut} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} A ${rIn} ${rIn} 0 ${large} 0 ${x3.toFixed(1)} ${y3.toFixed(1)} Z`;
}

/** 全扇形（wedge）路径（rIn=0） */
export function wedge(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const rad = (a: number) => (a * Math.PI) / 180;
  const px = (a: number) => cx + r * Math.cos(rad(a));
  const py = (a: number) => cy + r * Math.sin(rad(a));
  const large = a1 - a0 > 180 ? 1 : 0;
  const x0 = px(a0), y0 = py(a0);
  const x1 = px(a1), y1 = py(a1);
  return `M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`;
}
