// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 图表引擎 · 统一 echarts 外观层。
 *
 * 全部颜色使用 CSS 变量字符串（如 var(--lp-series-1)），由浏览器端
 * resolveCssVarsInOption 解析为当前情绪基底（aurora/obsidian/ember）的真实色值，
 * 因此同一套 option 在三种情绪下自动换色，无需为情绪分支。
 *
 * 视觉语言（参考 theme06 金融编辑风抛光）：
 *   - 峰值高亮：最大值用 --lp-gold 强调，其余用主序列色；
 *   - 数值标签：mono 字体、克制显示；
 *   - 面积图：序列色 → 透明 垂直渐变；
 *   - 柱：圆角顶、序列色垂直渐变；
 *   - 轴/网格：--lp-rule 细线、虚线分隔、--lp-ink3 标签。
 */

import type { ReactNode } from 'react';
import { LpEChart } from '../../echarts/shared-chart.js';

/* ── 序列色 / 通用取色 ─────────────────────────────────────────── */
export const S = (i: number): string => `var(--lp-series-${(i % 6) + 1})`;
export const GOLD = 'var(--lp-gold)';
export const ACCENT = 'var(--lp-accent)';
export const INK = 'var(--lp-ink)';
export const INK2 = 'var(--lp-ink2)';
export const INK3 = 'var(--lp-ink3)';
export const RULE = 'var(--lp-rule)';
export const RULE_STRONG = 'var(--lp-rule-strong)';
export const MONO = 'var(--lp-font-mono)';
export const BODY = 'var(--lp-font)';

/* ── 通用轴/网格外观 ──────────────────────────────────────────── */
const axisLabel = (extra: Record<string, unknown> = {}) => ({
  color: INK3,
  fontFamily: MONO,
  fontSize: 12,
  ...extra,
});
const axisLine = { lineStyle: { color: RULE_STRONG, width: 1 } };
const splitLine = { lineStyle: { color: RULE, width: 1, type: 'dashed' as const } };
const baseGrid = { left: 64, right: 28, top: 36, bottom: 44, containLabel: true };

/* ── T10EChart 包装 ───────────────────────────────────────────── */
export interface T10EChartProps {
  option: Record<string, unknown>;
  type?: string;
  className?: string;
}
export function T10EChart({ option, type = 'custom', className = '' }: T10EChartProps): ReactNode {
  return <LpEChart type={type as never} option={option} className={`lp-t10-echart ${className}`} />;
}

/* ── 工具：渐变面积 / 圆角柱 ──────────────────────────────────── */
function areaGrad(color: string) {
  return {
    type: 'linear',
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: `color-mix(in srgb, ${color} 34%, transparent)` },
      { offset: 1, color: `color-mix(in srgb, ${color} 2%, transparent)` },
    ],
  };
}

/* ────────────────────────────────────────────────────────────────
 * 标准图表 builder
 * ──────────────────────────────────────────────────────────────── */

export function barOption(opts: {
  labels: string[];
  values: number[];
  unit?: string;
  showLabel?: boolean;
  peakGold?: boolean;
}): Record<string, unknown> {
  const { labels, values, unit, showLabel = true, peakGold = true } = opts;
  const maxIdx = values.indexOf(Math.max(...values));
  const data = values.map((v, i) => ({
    value: v,
    itemStyle: {
      borderRadius: [6, 6, 0, 0],
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: peakGold && i === maxIdx ? GOLD : S(i) },
          { offset: 1, color: `color-mix(in srgb, ${peakGold && i === maxIdx ? GOLD : S(i)} 55%, transparent)` },
        ],
      },
    },
  }));
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: labels, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: [{
      type: 'bar',
      data,
      barWidth: '52%',
      label: showLabel
        ? { show: true, position: 'top', color: INK2, fontFamily: MONO, fontSize: 12, formatter: `{c}${unit ?? ''}` }
        : { show: false },
    }],
  };
}

export function lineOption(opts: {
  labels: string[];
  values: number[];
  area?: boolean;
  unit?: string;
  showLabel?: boolean;
}): Record<string, unknown> {
  const { labels, values, area = true, unit, showLabel = true } = opts;
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: labels, boundaryGap: false, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: [{
      type: 'line',
      data: values,
      smooth: true,
      symbol: 'circle',
      symbolSize: 7,
      showSymbol: true,
      lineStyle: { width: 3, color: ACCENT },
      itemStyle: { color: ACCENT, borderColor: 'var(--lp-bg)', borderWidth: 2 },
      areaStyle: area ? areaGrad(ACCENT) : undefined,
      markPoint: { symbol: 'circle', symbolSize: 11, itemStyle: { color: GOLD, borderColor: 'var(--lp-bg)', borderWidth: 2 }, label: { show: false }, data: [{ type: 'max', name: '峰值' }] },
      label: showLabel
        ? { show: true, position: 'top', color: INK2, fontFamily: MONO, fontSize: 11, formatter: `{c}${unit ?? ''}` }
        : { show: false },
    }],
  };
}

export function groupedOption(opts: {
  labels: string[];
  series: { name: string; data: number[] }[];
  unit?: string;
  showLabel?: boolean;
}): Record<string, unknown> {
  const { labels, series, unit, showLabel = false } = opts;
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 4, textStyle: { color: INK2, fontFamily: BODY }, itemWidth: 12, itemHeight: 12 },
    xAxis: { type: 'category', data: labels, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: series.map((s, i) => ({
      name: s.name,
      type: 'bar',
      data: s.data,
      barGap: '12%',
      itemStyle: { borderRadius: [5, 5, 0, 0], color: S(i) },
      label: showLabel ? { show: true, position: 'top', color: INK2, fontFamily: MONO, fontSize: 10, formatter: `{c}${unit ?? ''}` } : { show: false },
    })),
  };
}

export function stackOption(opts: {
  labels: string[];
  series: { name: string; data: number[] }[];
  unit?: string;
}): Record<string, unknown> {
  const { labels, series, unit } = opts;
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 4, textStyle: { color: INK2, fontFamily: BODY }, itemWidth: 12, itemHeight: 12 },
    xAxis: { type: 'category', data: labels, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: series.map((s, i) => ({
      name: s.name,
      type: 'bar',
      stack: 'total',
      data: s.data,
      itemStyle: { color: S(i) },
      label: { show: true, color: 'var(--lp-bg)', fontFamily: MONO, fontSize: 10, formatter: `{c}${unit ?? ''}` },
    })),
  };
}

export function hbarOption(opts: {
  labels: string[];
  values: number[];
  unit?: string;
  showLabel?: boolean;
  peakGold?: boolean;
}): Record<string, unknown> {
  const { labels, values, unit, showLabel = true, peakGold = true } = opts;
  const maxIdx = values.indexOf(Math.max(...values));
  const data = values.map((v, i) => ({
    value: v,
    itemStyle: {
      borderRadius: [0, 6, 6, 0],
      color: {
        type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
        colorStops: [
          { offset: 0, color: `color-mix(in srgb, ${peakGold && i === maxIdx ? GOLD : S(i)} 55%, transparent)` },
          { offset: 1, color: peakGold && i === maxIdx ? GOLD : S(i) },
        ],
      },
    },
  }));
  return {
    grid: { ...baseGrid, left: 96 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    yAxis: { type: 'category', data: labels, inverse: true, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    series: [{
      type: 'bar',
      data,
      barWidth: '56%',
      label: showLabel ? { show: true, position: 'right', color: INK2, fontFamily: MONO, fontSize: 12, formatter: `{c}${unit ?? ''}` } : { show: false },
    }],
  };
}

export function donutOption(opts: {
  items: { name: string; value: number }[];
  centerLabel?: string;
  centerSub?: string;
}): Record<string, unknown> {
  const { items, centerLabel, centerSub } = opts;
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
    legend: { bottom: 0, textStyle: { color: INK2, fontFamily: BODY }, itemWidth: 12, itemHeight: 12 },
    graphic: centerLabel
      ? [
          { type: 'text', left: 'center', top: '42%', style: { text: centerLabel, fill: INK, fontFamily: MONO, fontSize: 26, fontWeight: 700, textAlign: 'center' } },
          { type: 'text', left: 'center', top: '53%', style: { text: centerSub ?? '', fill: INK3, fontFamily: BODY, fontSize: 12, textAlign: 'center' } },
        ]
      : undefined,
    series: [{
      type: 'pie',
      radius: ['52%', '74%'],
      center: ['50%', '46%'],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: 'var(--lp-bg)', borderWidth: 2, borderRadius: 4 },
      label: { show: true, color: INK2, fontFamily: MONO, fontSize: 11, formatter: '{b}\n{d}%' },
      labelLine: { lineStyle: { color: RULE_STRONG } },
      data: items.map((it, i) => ({ name: it.name, value: it.value, itemStyle: { color: i === 0 ? GOLD : S(i) } })),
    }],
  };
}

export function pieOption(opts: { items: { name: string; value: number }[] }): Record<string, unknown> {
  const { items } = opts;
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
    legend: { bottom: 0, textStyle: { color: INK2, fontFamily: BODY }, itemWidth: 12, itemHeight: 12 },
    series: [{
      type: 'pie',
      radius: '68%',
      center: ['50%', '46%'],
      itemStyle: { borderColor: 'var(--lp-bg)', borderWidth: 2, borderRadius: 4 },
      label: { show: true, color: INK2, fontFamily: MONO, fontSize: 11, formatter: '{b}\n{d}%' },
      labelLine: { lineStyle: { color: RULE_STRONG } },
      data: items.map((it, i) => ({ name: it.name, value: it.value, itemStyle: { color: i === 0 ? GOLD : S(i) } })),
    }],
  };
}

export function waterfallOption(opts: {
  labels: string[];
  values: number[];
  totalLabel?: string;
}): Record<string, unknown> {
  const { labels, values, totalLabel = '合计' } = opts;
  const base: number[] = [];
  const inc: (number | '-')[] = [];
  const dec: (number | '-')[] = [];
  let running = 0;
  values.forEach((v, i) => {
    const isTotal = i === values.length - 1 && labels[i] === totalLabel;
    if (isTotal) {
      base.push(0); inc.push('-'); dec.push(v);
    } else if (v >= 0) {
      base.push(running); inc.push(v); dec.push('-'); running += v;
    } else {
      running += v; base.push(running); inc.push('-'); dec.push(-v);
    }
  });
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: labels, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: [
      { name: 'base', type: 'bar', stack: 'w', itemStyle: { color: 'transparent' }, data: base, tooltip: { show: false }, emphasis: { itemStyle: { color: 'transparent' } } },
      { name: 'inc', type: 'bar', stack: 'w', data: inc, itemStyle: { color: ACCENT, borderRadius: [4, 4, 0, 0] }, label: { show: true, position: 'top', color: INK2, fontFamily: MONO, fontSize: 11 } },
      { name: 'dec', type: 'bar', stack: 'w', data: dec, itemStyle: { color: 'var(--lp-red)', borderRadius: [4, 4, 0, 0] }, label: { show: true, position: 'top', color: INK2, fontFamily: MONO, fontSize: 11 } },
    ],
  };
}

export function funnelOption(opts: { items: { name: string; value: number }[] }): Record<string, unknown> {
  const { items } = opts;
  const max = Math.max(...items.map((i) => i.value)) || 1;
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [{
      type: 'funnel',
      left: '8%', right: '8%', top: 24, bottom: 24,
      min: 0, max,
      gap: 3,
      label: { show: true, position: 'inside', color: 'var(--lp-bg)', fontFamily: MONO, fontSize: 12 },
      itemStyle: { borderColor: 'var(--lp-bg)', borderWidth: 2 },
      data: items.map((it, i) => ({ name: it.name, value: it.value, itemStyle: { color: i === 0 ? GOLD : S(i) } })),
    }],
  };
}

export function scatterOption(opts: {
  points: [number, number][];
  xName?: string;
  yName?: string;
  unit?: string;
}): Record<string, unknown> {
  const { points, xName, yName, unit } = opts;
  return {
    grid: baseGrid,
    tooltip: { trigger: 'item', formatter: (p: any) => `${p.value[0]}, ${p.value[1]}${unit ?? ''}` },
    xAxis: { type: 'value', name: xName, nameTextStyle: { color: INK3, fontFamily: BODY }, scale: true, axisLine, axisLabel: axisLabel() },
    yAxis: { type: 'value', name: yName, nameTextStyle: { color: INK3, fontFamily: BODY }, scale: true, axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: [{
      type: 'scatter',
      data: points,
      symbolSize: 14,
      itemStyle: { color: ACCENT, opacity: 0.82, borderColor: 'var(--lp-bg)', borderWidth: 1 },
    }],
  };
}

export function bubbleOption(opts: {
  points: { x: number; y: number; size: number; name?: string }[];
  xName?: string;
  yName?: string;
}): Record<string, unknown> {
  const { points, xName, yName } = opts;
  return {
    grid: baseGrid,
    tooltip: { trigger: 'item' },
    xAxis: { type: 'value', name: xName, nameTextStyle: { color: INK3, fontFamily: BODY }, scale: true, axisLine, axisLabel: axisLabel() },
    yAxis: { type: 'value', name: yName, nameTextStyle: { color: INK3, fontFamily: BODY }, scale: true, axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: [{
      type: 'scatter',
      data: points.map((p) => ({ value: [p.x, p.y, p.size], name: p.name })),
      symbolSize: (d: any) => Math.max(10, Math.sqrt(d[2]) * 3),
      itemStyle: { color: { type: 'radial', x: 0.4, y: 0.4, r: 0.6, colorStops: [{ offset: 0, color: `color-mix(in srgb, ${ACCENT} 70%, transparent)` }, { offset: 1, color: `color-mix(in srgb, ${ACCENT} 22%, transparent)` }] }, borderColor: ACCENT, borderWidth: 1 },
    }],
  };
}

export function radialOption(opts: {
  items: { name: string; value: number }[];
  max?: number;
}): Record<string, unknown> {
  const { items, max } = opts;
  return {
    tooltip: {},
    radar: {
      indicator: items.map((i) => ({ name: i.name, max: max ?? Math.max(...items.map((x) => x.value)) * 1.2 })),
      axisName: { color: INK2, fontFamily: BODY, fontSize: 12 },
      splitLine: { lineStyle: { color: RULE } },
      splitArea: { areaStyle: { color: ['transparent', `color-mix(in srgb, ${INK} 4%, transparent)`] } },
      axisLine: { lineStyle: { color: RULE } },
    },
    series: [{
      type: 'radar',
      data: [{ value: items.map((i) => i.value), name: '指标', itemStyle: { color: ACCENT }, areaStyle: areaGrad(ACCENT), lineStyle: { color: ACCENT, width: 2 } }],
      symbolSize: 5,
    }],
  };
}

export function boxOption(opts: {
  labels: string[];
  boxes: [number, number, number, number, number][];
}): Record<string, unknown> {
  const { labels, boxes } = opts;
  return {
    grid: baseGrid,
    tooltip: { trigger: 'item' },
    xAxis: { type: 'category', data: labels, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: [{ type: 'boxplot', data: boxes, itemStyle: { color: `color-mix(in srgb, ${ACCENT} 30%, transparent)`, borderColor: ACCENT, borderWidth: 2 } }],
  };
}

export function heatOption(opts: {
  x: string[];
  y: string[];
  data: [number, number, number][];
  max?: number;
}): Record<string, unknown> {
  const { x, y, data, max } = opts;
  return {
    grid: { ...baseGrid, left: 80 },
    tooltip: { position: 'top' },
    xAxis: { type: 'category', data: x, axisLine, axisTick: { show: false }, axisLabel: axisLabel(), splitArea: { show: true } },
    yAxis: { type: 'category', data: y, axisLine, axisTick: { show: false }, axisLabel: axisLabel(), splitArea: { show: true } },
    visualMap: { min: 0, max: max ?? Math.max(...data.map((d) => d[2])), calculable: true, orient: 'horizontal', left: 'center', bottom: 0, textStyle: { color: INK3, fontFamily: MONO }, inRange: { color: ['#0c121b', ACCENT, GOLD] } },
    series: [{ type: 'heatmap', data, label: { show: false }, itemStyle: { borderColor: 'var(--lp-bg)', borderWidth: 1 }, emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.4)' } } }],
  };
}

export function treemapOption(opts: { items: { name: string; value: number; children?: any[] }[] }): Record<string, unknown> {
  const { items } = opts;
  return {
    tooltip: { formatter: '{b}: {c}' },
    series: [{
      type: 'treemap',
      roam: false,
      nodeClick: false,
      breadcrumb: { show: false },
      data: items,
      label: { color: 'var(--lp-bg)', fontFamily: BODY, fontSize: 12 },
      upperLabel: { show: false },
      itemStyle: { borderColor: 'var(--lp-bg)', borderWidth: 2, gapWidth: 2 },
      levels: [
        { itemStyle: { color: ACCENT } },
        { itemStyle: { color: GOLD } },
        { itemStyle: { color: S(2) } },
      ],
    }],
  };
}

export function sankeyOption(opts: { nodes: { name: string }[]; links: { source: string; target: string; value: number }[] }): Record<string, unknown> {
  const { nodes, links } = opts;
  return {
    tooltip: { trigger: 'item', formatter: '{b}' },
    series: [{
      type: 'sankey',
      left: 24, right: 120, top: 16, bottom: 16,
      data: nodes,
      links,
      nodeWidth: 14,
      nodeGap: 10,
      draggable: false,
      label: { color: INK2, fontFamily: BODY, fontSize: 12 },
      lineStyle: { color: 'gradient', opacity: 0.4, curveness: 0.5 },
      itemStyle: { color: ACCENT, borderColor: 'var(--lp-bg)' },
    }],
  };
}

export function gaugeOption(opts: { value: number; max?: number; label?: string; unit?: string }): Record<string, unknown> {
  const { value, max = 100, label, unit = '' } = opts;
  return {
    series: [{
      type: 'gauge',
      center: ['50%', '58%'],
      radius: '82%',
      min: 0, max,
      progress: { show: true, width: 14, itemStyle: { color: GOLD } },
      axisLine: { lineStyle: { width: 14, color: [[1, RULE]] } },
      axisTick: { show: false },
      splitLine: { length: 10, lineStyle: { color: RULE_STRONG, width: 2 } },
      axisLabel: { color: INK3, fontFamily: MONO, fontSize: 10, distance: 16 },
      pointer: { itemStyle: { color: ACCENT } },
      anchor: { show: true, size: 10, itemStyle: { color: ACCENT } },
      detail: { valueAnimation: true, color: INK, fontFamily: MONO, fontSize: 30, offsetCenter: [0, '38%'], formatter: `{value}${unit}` },
      title: { show: !!label, color: INK3, fontFamily: BODY, fontSize: 12, offsetCenter: [0, '70%'] },
      data: [{ value, name: label ?? '' }],
    }],
  };
}

export function roseOption(opts: { items: { name: string; value: number }[] }): Record<string, unknown> {
  const { items } = opts;
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    legend: { bottom: 0, textStyle: { color: INK2, fontFamily: BODY } },
    series: [{
      type: 'pie',
      roseType: 'area',
      radius: ['28%', '72%'],
      center: ['50%', '46%'],
      itemStyle: { borderColor: 'var(--lp-bg)', borderWidth: 2, borderRadius: 4 },
      label: { show: true, color: INK2, fontFamily: MONO, fontSize: 11, formatter: '{b}\n{c}' },
      data: items.map((it, i) => ({ name: it.name, value: it.value, itemStyle: { color: i === 0 ? GOLD : S(i) } })),
    }],
  };
}

export function histogramOption(opts: { values: number[]; bins?: number; unit?: string }): Record<string, unknown> {
  const { values, bins = 12, unit } = opts;
  const min = Math.min(...values), max = Math.max(...values);
  const width = (max - min) / bins || 1;
  const counts = new Array(bins).fill(0);
  const labels: string[] = [];
  for (let i = 0; i < bins; i++) labels.push(`${(min + i * width).toFixed(0)}`);
  values.forEach((v) => {
    let idx = Math.floor((v - min) / width);
    if (idx >= bins) idx = bins - 1;
    if (idx < 0) idx = 0;
    counts[idx]++;
  });
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: labels, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    yAxis: { type: 'value', name: `频数${unit ?? ''}`, axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: [{
      type: 'bar',
      data: counts.map((c, i) => ({ value: c, itemStyle: { color: i === counts.indexOf(Math.max(...counts)) ? GOLD : ACCENT, borderRadius: [4, 4, 0, 0] } })),
      barWidth: '70%',
      label: { show: true, position: 'top', color: INK2, fontFamily: MONO, fontSize: 10 },
    }],
  };
}

/* ────────────────────────────────────────────────────────────────
 * 复杂 / 长尾图表 builder（echarts custom / graph / pictorial 近似）
 * ──────────────────────────────────────────────────────────────── */

export function slopeOption(opts: { labels: [string, string]; pairs: { name: string; a: number; b: number }[] }): Record<string, unknown> {
  const { labels, pairs } = opts;
  return {
    grid: { ...baseGrid, left: 80 },
    tooltip: { trigger: 'item' },
    xAxis: { type: 'value', min: 0, max: 1, axisLine: { show: false }, axisLabel: { show: false }, splitLine: { show: false } },
    yAxis: { type: 'category', data: pairs.map((p) => p.name), axisLine, axisLabel: axisLabel() },
    series: [
      { type: 'graph', coordinateSystem: 'cartesian2d', silent: true, data: pairs.flatMap((p) => [{ value: [0, p.name] }, { value: [1, p.name] }]), links: [], itemStyle: { color: 'transparent' } },
      { type: 'lines', coordinateSystem: 'cartesian2d', data: pairs.map((p, i) => ({ coords: [[0, i], [1, i]], value: p.b - p.a })), lineStyle: { width: 3, color: (p: any) => (p.value[2] >= 0 ? GOLD : 'var(--lp-red)'), curveness: 0 } },
    ],
    graphic: [
      { type: 'text', left: '12%', top: 30, style: { text: labels[0], fill: INK2, fontFamily: BODY, fontSize: 12 } },
      { type: 'text', left: '88%', top: 30, style: { text: labels[1], fill: INK2, fontFamily: BODY, fontSize: 12 } },
    ],
  };
}

export function dumbbellOption(opts: { labels: string[]; a: number[]; b: number[] }): Record<string, unknown> {
  const { labels, a, b } = opts;
  return {
    grid: { ...baseGrid, left: 90 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    yAxis: { type: 'category', data: labels, inverse: true, axisLine, axisLabel: axisLabel() },
    series: [
      { type: 'lines', coordinateSystem: 'cartesian2d', data: labels.map((_, i) => ({ coords: [[a[i], i], [b[i], i]] })), lineStyle: { width: 3, color: RULE_STRONG }, z: 1, silent: true },
      { type: 'scatter', data: a.map((v, i) => [v, i]), symbolSize: 14, itemStyle: { color: ACCENT }, z: 2 },
      { type: 'scatter', data: b.map((v, i) => [v, i]), symbolSize: 14, itemStyle: { color: GOLD }, z: 2 },
    ],
  };
}

export function bulletOption(opts: { labels: string[]; value: number[]; target: number[]; max?: number }): Record<string, unknown> {
  const { labels, value, target, max } = opts;
  return {
    grid: { ...baseGrid, left: 90 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value', max: max ?? Math.max(...target) * 1.2, axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    yAxis: { type: 'category', data: labels, inverse: true, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    series: [
      { type: 'bar', data: value.map((v) => ({ value: v, itemStyle: { color: `color-mix(in srgb, ${ACCENT} 50%, transparent)`, borderRadius: 6 } })), barWidth: 14, z: 1, label: { show: true, position: 'right', color: INK2, fontFamily: MONO, fontSize: 11 } },
      { type: 'scatter', data: target.map((v, i) => [v, i]), symbol: 'rect', symbolSize: [3, 22], itemStyle: { color: GOLD }, z: 3 },
    ],
  };
}

export function bumpOption(opts: { labels: string[]; series: { name: string; data: number[] }[] }): Record<string, unknown> {
  const { labels, series } = opts;
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: INK2, fontFamily: BODY } },
    xAxis: { type: 'category', data: labels, boundaryGap: false, axisLine, axisLabel: axisLabel() },
    yAxis: { type: 'value', inverse: true, axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: series.map((s, i) => ({ name: s.name, type: 'line', data: s.data, smooth: true, symbol: 'circle', symbolSize: 8, lineStyle: { width: 3, color: S(i) }, itemStyle: { color: S(i) } })),
  };
}

export function ridgelineOption(opts: { labels: string[]; series: { name: string; data: number[] }[] }): Record<string, unknown> {
  const { labels, series } = opts;
  return {
    grid: { left: 64, right: 24, top: 30, bottom: 36, containLabel: true },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: labels, boundaryGap: false, axisLine, axisLabel: axisLabel() },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { show: false }, splitLine: { show: false } },
    series: series.map((s, i) => ({
      name: s.name, type: 'line', data: s.data, smooth: true, symbol: 'none',
      lineStyle: { width: 1.5, color: S(i % 6) },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: `color-mix(in srgb, ${S(i % 6)} 30%, transparent)` }, { offset: 1, color: `color-mix(in srgb, ${S(i % 6)} 2%, transparent)` }] }, opacity: 0.9 },
      emphasis: { focus: 'series' },
    })),
    visualMap: undefined as never,
  };
}

export function rangeOption(opts: { labels: string[]; ranges: { start: number; end: number }[]; mids?: number[] }): Record<string, unknown> {
  const { labels, ranges, mids } = opts;
  return {
    grid: { ...baseGrid, left: 90, right: 60 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    yAxis: { type: 'category', data: labels, inverse: true, axisLine, axisLabel: axisLabel() },
    series: [
      { type: 'bar', stack: 'r', silent: true, itemStyle: { color: 'transparent' }, data: ranges.map((r) => r.start) },
      {
        type: 'bar', stack: 'r',
        data: ranges.map((r) => ({ value: r.end - r.start, itemStyle: { color: `color-mix(in srgb, ${ACCENT} 32%, transparent)`, borderColor: ACCENT, borderWidth: 1, borderRadius: 7 } })),
        barWidth: 16,
        label: { show: true, position: 'right', color: INK2, fontFamily: MONO, fontSize: 11 },
      },
      ...(mids ? [{ type: 'scatter' as const, data: mids.map((m, i) => [m, i]), symbol: 'rect' as const, symbolSize: [3, 22], itemStyle: { color: GOLD }, z: 3, silent: true as const }] : []),
    ],
  };
}

export function calendarOption(opts: { year: number; values: { date: string; value: number }[]; max?: number }): Record<string, unknown> {
  const { year, values, max } = opts;
  return {
    tooltip: { formatter: (p: any) => `${p.value[0]}<br/>${p.value[1]}` },
    visualMap: { min: 0, max: max ?? Math.max(...values.map((v) => v.value)), orient: 'horizontal', left: 'center', bottom: 0, textStyle: { color: INK3, fontFamily: MONO }, inRange: { color: ['#0c121b', ACCENT, GOLD] } },
    calendar: { top: 30, left: 30, right: 30, cellSize: ['auto', 22], range: String(year), itemStyle: { color: 'var(--lp-surface-solid)', borderColor: RULE, borderWidth: 1 }, yearLabel: { color: INK2, fontFamily: BODY }, dayLabel: { color: INK3, fontFamily: MONO, fontSize: 10 }, monthLabel: { color: INK3, fontFamily: MONO, fontSize: 10 } },
    series: [{ type: 'heatmap', coordinateSystem: 'calendar', data: values.map((v) => [v.date, v.value]) }],
  };
}

export function ganttOption(opts: { tasks: { name: string; start: number; end: number }[] }): Record<string, unknown> {
  const { tasks } = opts;
  return {
    grid: { ...baseGrid, left: 120 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    yAxis: { type: 'category', data: tasks.map((t) => t.name), inverse: true, axisLine, axisLabel: axisLabel() },
    series: [{
      type: 'custom',
      renderItem: (_params: any, api: any) => {
        const catIndex = api.value(0);
        const start = api.coord([api.value(1), catIndex]);
        const end = api.coord([api.value(2), catIndex]);
        const height = api.size([0, 1])[1] * 0.5;
        return {
          type: 'rect',
          shape: { x: start[0], y: start[1] - height / 2, width: end[0] - start[0], height },
          style: { fill: `color-mix(in srgb, ${ACCENT} 70%, transparent)`, stroke: ACCENT, lineWidth: 1, radius: 4 },
        };
      },
      encode: { x: [1, 2], y: 0 },
      data: tasks.map((t, i) => [i, t.start, t.end]),
      itemStyle: { color: ACCENT },
    }],
  };
}

export function parallelOption(opts: { dims: string[]; data: number[][] }): Record<string, unknown> {
  const { dims, data } = opts;
  return {
    tooltip: {},
    parallelAxis: dims.map((d, i) => ({ dim: i, name: d, nameTextStyle: { color: INK3, fontFamily: BODY }, axisLabel: { color: INK3, fontFamily: MONO, fontSize: 10 }, axisLine: { lineStyle: { color: RULE_STRONG } }, axisTick: { show: false } })),
    parallel: { left: 50, right: 50, top: 40, bottom: 30, parallelAxisDefault: { areaStyle: { color: `color-mix(in srgb, ${ACCENT} 6%, transparent)` } } },
    series: [{ type: 'parallel', data, lineStyle: { color: ACCENT, width: 1.6, opacity: 0.7 }, emphasis: { lineStyle: { width: 3, opacity: 1, color: GOLD } } }],
  };
}

export function circlepackOption(opts: { items: any[] }): Record<string, unknown> {
  return {
    tooltip: { formatter: (p: any) => `${p.name}: ${p.value ?? ''}` },
    series: [{ type: 'treemap', roam: false, nodeClick: false, breadcrumb: { show: false }, data: opts.items, label: { color: 'var(--lp-bg)', fontFamily: BODY, fontSize: 11 }, itemStyle: { borderColor: 'var(--lp-bg)', borderWidth: 2 }, levels: [{ itemStyle: { color: ACCENT } }, { itemStyle: { color: GOLD } }, { itemStyle: { color: S(2) } }, { itemStyle: { color: S(3) } }] }],
  };
}

export function cscatterOption(opts: { points: { x: number; y: number; cluster: number }[]; centers: { x: number; y: number }[] }): Record<string, unknown> {
  const { points, centers } = opts;
  const clusterColors = [ACCENT, GOLD, S(2), S(3), S(4), S(5)];
  return {
    grid: baseGrid,
    tooltip: { trigger: 'item' },
    xAxis: { type: 'value', scale: true, axisLine, axisLabel: axisLabel() },
    yAxis: { type: 'value', scale: true, axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: [
      { type: 'scatter', data: points.map((p) => ({ value: [p.x, p.y], itemStyle: { color: clusterColors[p.cluster % clusterColors.length], opacity: 0.8 } })), symbolSize: 9 },
      { type: 'scatter', data: centers, symbol: 'diamond', symbolSize: 18, itemStyle: { color: 'var(--lp-bg)', borderColor: INK, borderWidth: 2 }, z: 3 },
    ],
  };
}

export function orgchartOption(opts: { root: { name: string; role?: string }; children: { name: string; role?: string }[] }): Record<string, unknown> {
  const { root, children } = opts;
  const label = (n: { name: string; role?: string }) => (n.role ? `${n.name}\n${n.role}` : n.name);
  const rootNode = { name: label(root), children: children.map((c) => ({ name: label(c) })) };
  return {
    tooltip: { trigger: 'item', formatter: (p: any) => p.name?.replace('\n', ' · ') ?? '' },
    series: [{
      type: 'tree',
      data: [rootNode],
      top: 70, left: 50, right: 50, bottom: 60,
      orient: 'TB',
      symbol: 'roundRect',
      symbolSize: [130, 48],
      symbolBoundingData: 60,
      initialTreeDepth: -1,
      expandAndCollapse: false,
      label: { show: true, position: 'inside', color: INK, fontFamily: BODY, fontSize: 12, align: 'center', verticalAlign: 'middle' },
      leaves: { label: { position: 'inside' } },
      itemStyle: { color: `color-mix(in srgb, ${ACCENT} 22%, transparent)`, borderColor: ACCENT, borderWidth: 1.6, borderRadius: 6 },
      lineStyle: { color: RULE_STRONG, width: 1.6 },
      emphasis: { focus: 'none' },
    }],
  };
}

export function marimekkoOption(opts: { items: { name: string; value: number; growth: number }[] }): Record<string, unknown> {
  const { items } = opts;
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  let acc = 0;
  const data = items.map((it) => {
    const w = (it.value / total) * 100;
    const seg = { name: it.name, value: [acc, acc + w, 0, it.growth], itemStyle: { color: it.growth >= 0 ? ACCENT : 'var(--lp-red)' } };
    acc += w;
    return seg;
  });
  return {
    grid: { left: 60, right: 24, top: 30, bottom: 40, containLabel: true },
    tooltip: { trigger: 'item' },
    xAxis: { type: 'value', max: 100, axisLine: { show: false }, axisLabel: { show: false }, splitLine: { show: false } },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { show: false }, splitLine: { show: false } },
    series: [{ type: 'custom', renderItem: (_params: any, api: any) => {
      const v = api.value(0);
      const x0 = api.coord([v[0], 0])[0];
      const x1 = api.coord([v[1], 0])[0];
      const y0 = api.coord([0, 0])[1];
      const y1 = api.coord([0, v[3] >= 0 ? v[3] : 0])[1];
      const yb = api.coord([0, v[3] < 0 ? v[3] : 0])[1];
      return { type: 'rect', shape: { x: x0, y: Math.min(y0, y1, yb), width: x1 - x0, height: Math.abs(y1 - y0) + Math.abs(yb - y0) }, style: { fill: api.visual('color'), opacity: 0.85, stroke: 'var(--lp-bg)', lineWidth: 1 } };
    }, encode: { x: [0, 1], y: [2, 3] }, data }],
  };
}

export function waffleOption(opts: { items: { name: string; value: number }[] }): Record<string, unknown> {
  const { items } = opts;
  const total = items.reduce((a, it) => a + it.value, 0) || 1;
  let counts = items.map((it) => Math.round((it.value / total) * 100));
  const diff = 100 - counts.reduce((a, b) => a + b, 0);
  if (diff !== 0 && counts.length) { const mi = counts.indexOf(Math.max(...counts)); counts[mi] += diff; }
  const colors = items.map((_, i) => `var(--lp-series-${(i % 6) + 1})`);
  const cells: [number, number, number][] = [];
  let ci = 0, filled = 0;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      let col = 0;
      if (ci < items.length && filled < counts[ci]) { col = ci + 1; filled++; if (filled >= counts[ci]) { ci++; filled = 0; } }
      cells.push([c, 9 - r, col]);
    }
  }
  const inRange = ['var(--lp-ink3)', ...colors];
  return {
    grid: { left: 10, right: 10, top: 20, bottom: 10 },
    tooltip: { show: false },
    xAxis: { type: 'category', data: Array.from({ length: 10 }, (_, i) => i), show: false },
    yAxis: { type: 'category', data: Array.from({ length: 10 }, (_, i) => i), show: false },
    visualMap: { show: false, min: 0, max: items.length, inRange: { color: inRange } },
    series: [{ type: 'heatmap', data: cells, itemStyle: { borderColor: 'var(--lp-bg)', borderWidth: 3, borderRadius: 2 } }],
  };
}

export function quiltOption(opts: { items: { name: string; value: number }[] }): Record<string, unknown> {
  return treemapOption({ items: opts.items.map((i) => ({ name: i.name, value: i.value })) });
}

export function mosaicOption(opts: { rows: string[]; cols: string[]; data: number[][] }): Record<string, unknown> {
  const cells: { name: string; value: number }[] = [];
  opts.data.forEach((dr, ri) => dr.forEach((v, ci) => cells.push({ name: `${opts.rows[ri]}·${opts.cols[ci]}`, value: v })));
  return treemapOption({ items: cells });
}

export function medallionsOption(opts: { items: { name: string; value: number }[] }): Record<string, unknown> {
  return pieOption({ items: opts.items });
}

export function strataOption(opts: { layers: { name: string; value: number }[] }): Record<string, unknown> {
  return stackOption({ labels: ['结构'], series: opts.layers.map((l) => ({ name: l.name, data: [l.value] })) });
}

export function annotatedOption(opts: { labels: string[]; values: number[]; notes: (string | undefined)[]; unit?: string }): Record<string, unknown> {
  const { labels, values, notes, unit } = opts;
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: labels, axisLine, axisLabel: axisLabel() },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: [{
      type: 'bar',
      data: values.map((v, i) => ({ value: v, itemStyle: { color: i === values.indexOf(Math.max(...values)) ? GOLD : S(i), borderRadius: [5, 5, 0, 0] } })),
      barWidth: '46%',
      label: { show: true, position: 'top', color: INK2, fontFamily: MONO, fontSize: 11, formatter: `{c}${unit ?? ''}` },
      markPoint: {
        symbol: 'pin', symbolSize: 0,
        data: notes.map((n, i) => (n ? { coord: [i, values[i]], value: n } : null)).filter(Boolean) as any,
        label: { show: true, color: GOLD, fontFamily: BODY, fontSize: 10, formatter: (p: any) => p.value },
      },
    }],
  };
}

export function exhibitOption(opts: { labels: string[]; values: number[]; unit?: string }): Record<string, unknown> {
  return barOption({ labels: opts.labels, values: opts.values, unit: opts.unit });
}

export function kpisOption(_opts: { items: { label: string; value: string; delta?: string }[] }): Record<string, unknown> {
  return {};
}

export function sparkOption(opts: { values: number[] }): Record<string, unknown> {
  return {
    grid: { left: 4, right: 4, top: 8, bottom: 4 },
    xAxis: { type: 'category', show: false, data: opts.values.map((_, i) => i), boundaryGap: false },
    yAxis: { type: 'value', show: false, scale: true },
    series: [{ type: 'line', data: opts.values, smooth: true, symbol: 'none', lineStyle: { width: 2, color: ACCENT }, areaStyle: areaGrad(ACCENT) }],
  };
}

export function trendOption(opts: { labels: string[]; series: { name: string; data: number[] }[] }): Record<string, unknown> {
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis' },
    legend: { top: 0, textStyle: { color: INK2, fontFamily: BODY } },
    xAxis: { type: 'category', data: opts.labels, boundaryGap: false, axisLine, axisLabel: axisLabel() },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: opts.series.map((s, i) => ({ name: s.name, type: 'line', data: s.data, smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { width: 2.5, color: S(i) }, itemStyle: { color: S(i) }, areaStyle: i === 0 ? areaGrad(S(i)) : undefined, markPoint: { symbol: 'circle', symbolSize: 9, itemStyle: { color: GOLD, borderColor: 'var(--lp-bg)', borderWidth: 2 }, label: { show: false }, data: [{ type: 'max', name: '峰值' }] } })),
  };
}

/* ────────────────────────────────────────────────────────────────
 * 补充 builder（cscatter / dotplot / radar / candlestick / timeline）
 * ──────────────────────────────────────────────────────────────── */

export function pathScatterOption(opts: { points: { x: number; y: number; label?: string }[]; xName?: string; yName?: string }): Record<string, unknown> {
  const { points, xName, yName } = opts;
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  const minX = Math.min(...xs, 0), maxX = Math.max(...xs, 1);
  const minY = Math.min(...ys, 0), maxY = Math.max(...ys, 1);
  return {
    grid: baseGrid,
    tooltip: { trigger: 'item' },
    xAxis: { type: 'value', min: minX, max: maxX, name: xName, nameTextStyle: { color: INK3, fontFamily: BODY }, axisLine, axisLabel: axisLabel(), splitLine },
    yAxis: { type: 'value', min: minY, max: maxY, name: yName, nameTextStyle: { color: INK3, fontFamily: BODY }, axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: [
      { type: 'lines', coordinateSystem: 'cartesian2d', data: [{ coords: points.map((p) => [p.x, p.y]) }], lineStyle: { width: 2.2, color: ACCENT, opacity: 0.65, curveness: 0, type: 'dashed' }, z: 1, silent: true },
      {
        type: 'scatter',
        data: points.map((p, i) => ({ value: [p.x, p.y], name: p.label, itemStyle: { color: S(i), borderColor: INK, borderWidth: 1.2 } })),
        symbolSize: 12, z: 2,
        label: { show: true, position: 'right', color: INK2, fontFamily: BODY, fontSize: 11, formatter: (p: any) => p.name ?? '' },
      },
    ],
  };
}

export function dotplotOption(opts: { labels: string[]; values: number[] }): Record<string, unknown> {
  const { labels, values } = opts;
  return {
    grid: { ...baseGrid, left: 90, right: 60 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value', min: 0, axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    yAxis: { type: 'category', data: labels, inverse: true, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    series: [
      { type: 'lines', coordinateSystem: 'cartesian2d', data: labels.map((_, i) => ({ coords: [[0, i], [values[i], i]] })), lineStyle: { color: RULE, width: 1, type: 'dashed' }, z: 1, silent: true },
      {
        type: 'scatter',
        data: values.map((v, i) => [v, i]),
        symbolSize: 14,
        itemStyle: { color: ACCENT, borderColor: INK, borderWidth: 1.2 },
        z: 2,
        label: { show: true, position: 'right', color: INK2, fontFamily: MONO, fontSize: 11, formatter: (p: any) => p.value[0] },
      },
    ],
  };
}

export function radarOption(opts: { axes: string[]; series: { name: string; values: number[] }[]; max?: number }): Record<string, unknown> {
  const { axes, series, max } = opts;
  const allV = series.flatMap((s) => s.values);
  const mx = max ?? (allV.length ? Math.max(...allV, 1) : 100);
  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: INK2, fontFamily: BODY } },
    radar: {
      indicator: axes.map((a) => ({ name: a, max: mx })),
      axisName: { color: INK2, fontFamily: BODY, fontSize: 12 },
      splitLine: { lineStyle: { color: RULE } },
      splitArea: { areaStyle: { color: ['transparent', `color-mix(in srgb, ${INK} 4%, transparent)`] } },
      axisLine: { lineStyle: { color: RULE } },
    },
    series: [{
      type: 'radar',
      data: series.map((s, i) => ({
        name: s.name, value: s.values,
        itemStyle: { color: S(i) },
        lineStyle: { color: S(i), width: 2 },
        areaStyle: { color: `color-mix(in srgb, ${S(i)} 22%, transparent)` },
      })),
      symbolSize: 5,
    }],
  };
}

export function candlestickOption(opts: { categories: string[]; items: { open: number; high: number; low: number; close: number }[]; unit?: string }): Record<string, unknown> {
  const { categories, items, unit } = opts;
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    xAxis: { type: 'category', data: categories, boundaryGap: true, axisLine, axisLabel: axisLabel() },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel({ formatter: (v: any) => `${v}${unit ?? ''}` }), splitLine },
    series: [{
      type: 'candlestick',
      data: items.map((it) => [it.open, it.close, it.low, it.high]),
      itemStyle: { color: 'var(--lp-red)', color0: 'var(--lp-green)', borderColor: 'var(--lp-red)', borderColor0: 'var(--lp-green)' },
    }],
  };
}

export function timelineOption(opts: { events: { year: string; text: string }[] }): Record<string, unknown> {
  const { events } = opts;
  const n = Math.max(events.length, 1);
  return {
    grid: { left: 60, right: 60, top: 80, bottom: 80 },
    tooltip: { show: false },
    xAxis: { type: 'category', data: events.map((e) => e.year), boundaryGap: true, axisLine: { lineStyle: { color: RULE_STRONG, width: 2 } }, axisTick: { show: false }, axisLabel: { show: false } },
    yAxis: { type: 'value', min: 0, max: 1, show: false },
    series: [{
      type: 'custom',
      renderItem: (_params: any, api: any) => {
        const i = api.value(0) as number;
        const base = api.coord([i, 0.5]);
        const bx = base[0], by = base[1];
        const up = i % 2 === 0;
        const children: any[] = [];
        if (i === 0) {
          const last = api.coord([n - 1, 0.5]);
          children.push({ type: 'line', shape: { x1: bx, y1: by, x2: last[0], y2: by }, style: { stroke: ACCENT, lineWidth: 2.4 } });
        }
        children.push({ type: 'circle', shape: { cx: bx, cy: by, r: 9 }, style: { fill: GOLD, stroke: INK, lineWidth: 1.6 } });
        const ty = up ? by - 70 : by + 30;
        children.push({ type: 'text', style: { text: events[i].year, x: bx, y: ty - 16, textAlign: 'center', fill: GOLD, fontFamily: MONO, fontSize: 13 } });
        children.push({ type: 'text', style: { text: events[i].text, x: bx, y: ty, textAlign: 'center', fill: INK2, fontFamily: BODY, fontSize: 12 } });
        return { type: 'group', children };
      },
      data: events.map((_, i) => [i, 0.5]),
      encode: { x: 0, y: 1 },
    }],
  };
}
