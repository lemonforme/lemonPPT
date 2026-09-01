// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 图表引擎 · 统一 echarts 外观层。
 *
 * 视觉语言（流光科技 · 浅色扁平）：
 *   - 柱：圆角顶、序列色垂直渐变、峰值高亮；
 *   - 线：平滑曲线、大圆点、渐变面积；
 *   - 环/饼：白边分隔、高饱和序列色、中心标签；
 *   - 雷达：渐变填充、圆润节点；
 *   - 仪表盘：渐变进度条、中心大数字；
 *   - 轴/网格：极淡实线网格、灰阶文字。
 *
 * 全部颜色使用 CSS 变量，由浏览器端解析为当前情绪基底的真实色值。
 */

import type { ReactNode } from 'react';
import { LpEChart } from '../../echarts/shared-chart.js';

/* ── 序列色 / 通用取色 ─────────────────────────────────────────── */
export const S = (i: number): string => `var(--lp-series-${(i % 6) + 1})`;
export const ACCENT = 'var(--lp-accent)';
export const VIOLET = 'var(--lp-violet)';
export const ORANGE = 'var(--lp-orange)';
export const GREEN = 'var(--lp-green)';
export const INK = 'var(--lp-ink)';
export const INK2 = 'var(--lp-ink2)';
export const INK3 = 'var(--lp-ink3)';
export const SURFACE = 'var(--lp-surface)';
export const BORDER = 'var(--lp-border)';
export const BORDER_STRONG = 'var(--lp-border-strong)';
export const MONO = 'var(--lp-font-mono)';
export const BODY = 'var(--lp-font)';

/* ── 通用轴/网格外观 ──────────────────────────────────────────── */
const axisLabel = (extra: Record<string, unknown> = {}) => ({
  color: INK3,
  fontFamily: BODY,
  fontSize: 12,
  ...extra,
});

const axisLine = { lineStyle: { color: BORDER_STRONG, width: 1 } };
const splitLine = { lineStyle: { color: BORDER, width: 1, type: 'dashed' as const } };
const baseGrid = { left: 56, right: 28, top: 40, bottom: 48, containLabel: true };

/* ── T11EChart 包装 ───────────────────────────────────────────── */
export interface T11EChartProps {
  option: Record<string, unknown>;
  type?: string;
  className?: string;
}

export function T11EChart({ option, type = 'custom', className = '' }: T11EChartProps): ReactNode {
  return <LpEChart type={type as never} option={option} className={`lp-theme11-echart ${className}`} />;
}

/* ── 工具：渐变 ───────────────────────────────────────────────── */
function barGrad(color: string) {
  return {
    type: 'linear' as const,
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color },
      { offset: 1, color: `color-mix(in srgb, ${color} 28%, transparent)` },
    ],
  };
}

function areaGrad(color: string) {
  return {
    type: 'linear' as const,
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: `color-mix(in srgb, ${color} 40%, transparent)` },
      { offset: 1, color: `color-mix(in srgb, ${color} 2%, transparent)` },
    ],
  };
}

function hbarGrad(color: string) {
  return {
    type: 'linear' as const,
    x: 0, y: 0, x2: 1, y2: 0,
    colorStops: [
      { offset: 0, color: `color-mix(in srgb, ${color} 32%, transparent)` },
      { offset: 1, color },
    ],
  };
}

/* ── 柱状图 ───────────────────────────────────────────────────── */
export function t11BarOption(opts: {
  labels: string[];
  values: number[];
  unit?: string;
  showLabel?: boolean;
  peakHighlight?: boolean;
}): Record<string, unknown> {
  const { labels, values, unit, showLabel = true, peakHighlight = true } = opts;
  const maxIdx = values.indexOf(Math.max(...values));
  const data = values.map((v, i) => ({
    value: v,
    itemStyle: {
      borderRadius: [8, 8, 0, 0],
      color: barGrad(peakHighlight && i === maxIdx ? ORANGE : S(i)),
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
      barWidth: '46%',
      label: showLabel
        ? { show: true, position: 'top', color: INK2, fontFamily: MONO, fontSize: 12, formatter: `{c}${unit ?? ''}` }
        : { show: false },
    }],
  };
}

/* ── 分组柱状图 ───────────────────────────────────────────────── */
export function t11GroupedOption(opts: {
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
      barGap: '14%',
      itemStyle: { borderRadius: [6, 6, 0, 0], color: barGrad(S(i)) },
      label: showLabel ? { show: true, position: 'top', color: INK2, fontFamily: MONO, fontSize: 10, formatter: `{c}${unit ?? ''}` } : { show: false },
    })),
  };
}

/* ── 堆叠柱状图 ───────────────────────────────────────────────── */
export function t11StackOption(opts: {
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
      itemStyle: { color: barGrad(S(i)) },
      label: { show: true, color: SURFACE, fontFamily: MONO, fontSize: 10, formatter: `{c}${unit ?? ''}` },
    })),
  };
}

/* ── 横向柱状图 ───────────────────────────────────────────────── */
export function t11HbarOption(opts: {
  labels: string[];
  values: number[];
  unit?: string;
  showLabel?: boolean;
  peakHighlight?: boolean;
}): Record<string, unknown> {
  const { labels, values, unit, showLabel = true, peakHighlight = true } = opts;
  const maxIdx = values.indexOf(Math.max(...values));
  const data = values.map((v, i) => ({
    value: v,
    itemStyle: {
      borderRadius: [0, 8, 8, 0],
      color: hbarGrad(peakHighlight && i === maxIdx ? ORANGE : S(i)),
    },
  }));
  return {
    grid: { ...baseGrid, left: 88 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    yAxis: { type: 'category', data: labels, inverse: true, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    series: [{
      type: 'bar',
      data,
      barWidth: '52%',
      label: showLabel ? { show: true, position: 'right', color: INK2, fontFamily: MONO, fontSize: 12, formatter: `{c}${unit ?? ''}` } : { show: false },
    }],
  };
}

/* ── 折线图 ───────────────────────────────────────────────────── */
export function t11LineOption(opts: {
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
      symbolSize: 8,
      showSymbol: true,
      lineStyle: { width: 3, color: ACCENT },
      itemStyle: { color: ACCENT, borderColor: SURFACE, borderWidth: 2 },
      areaStyle: area ? areaGrad(ACCENT) : undefined,
      label: showLabel
        ? { show: true, position: 'top', color: INK2, fontFamily: MONO, fontSize: 11, formatter: `{c}${unit ?? ''}` }
        : { show: false },
    }],
  };
}

/* ── 面积图 ───────────────────────────────────────────────────── */
export function t11AreaOption(opts: {
  labels: string[];
  series: { name: string; data: number[] }[];
  unit?: string;
}): Record<string, unknown> {
  const { labels, series, unit } = opts;
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v}${unit ?? ''}` },
    legend: { top: 4, textStyle: { color: INK2, fontFamily: BODY }, itemWidth: 12, itemHeight: 12 },
    xAxis: { type: 'category', data: labels, boundaryGap: false, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: series.map((s, i) => ({
      name: s.name,
      type: 'line',
      data: s.data,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2.5, color: S(i) },
      itemStyle: { color: S(i), borderColor: SURFACE, borderWidth: 2 },
      areaStyle: areaGrad(S(i)),
      label: { show: false },
      emphasis: { focus: 'series' },
    })),
  };
}

/* ── 环形图 ───────────────────────────────────────────────────── */
export function t11DonutOption(opts: {
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
          { type: 'text', left: 'center', top: '42%', style: { text: centerLabel, fill: INK, fontFamily: MONO, fontSize: 28, fontWeight: 700, textAlign: 'center' } },
          { type: 'text', left: 'center', top: '53%', style: { text: centerSub ?? '', fill: INK3, fontFamily: BODY, fontSize: 12, textAlign: 'center' } },
        ]
      : undefined,
    series: [{
      type: 'pie',
      radius: ['50%', '72%'],
      center: ['50%', '46%'],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: SURFACE, borderWidth: 3, borderRadius: 6 },
      label: { show: true, color: INK2, fontFamily: MONO, fontSize: 11, formatter: '{b}\n{d}%' },
      labelLine: { lineStyle: { color: BORDER_STRONG } },
      data: items.map((it, i) => ({ name: it.name, value: it.value, itemStyle: { color: S(i) } })),
    }],
  };
}

/* ── 饼图 ─────────────────────────────────────────────────────── */
export function t11PieOption(opts: { items: { name: string; value: number }[] }): Record<string, unknown> {
  const { items } = opts;
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
    legend: { bottom: 0, textStyle: { color: INK2, fontFamily: BODY }, itemWidth: 12, itemHeight: 12 },
    series: [{
      type: 'pie',
      radius: '66%',
      center: ['50%', '46%'],
      itemStyle: { borderColor: SURFACE, borderWidth: 3, borderRadius: 6 },
      label: { show: true, color: INK2, fontFamily: MONO, fontSize: 11, formatter: '{b}\n{d}%' },
      labelLine: { lineStyle: { color: BORDER_STRONG } },
      data: items.map((it, i) => ({ name: it.name, value: it.value, itemStyle: { color: S(i) } })),
    }],
  };
}

/* ── 雷达图 ───────────────────────────────────────────────────── */
export function t11RadarOption(opts: {
  items: { name: string; value: number }[];
  max?: number;
}): Record<string, unknown> {
  const { items, max } = opts;
  return {
    tooltip: {},
    radar: {
      indicator: items.map((i) => ({ name: i.name, max: max ?? Math.max(...items.map((x) => x.value)) * 1.2 })),
      axisName: { color: INK2, fontFamily: BODY, fontSize: 12 },
      splitLine: { lineStyle: { color: BORDER } },
      splitArea: { areaStyle: { color: ['transparent', `color-mix(in srgb, ${INK} 3%, transparent)`] } },
      axisLine: { lineStyle: { color: BORDER_STRONG } },
    },
    series: [{
      type: 'radar',
      data: [{ value: items.map((i) => i.value), name: '指标', itemStyle: { color: ACCENT }, areaStyle: areaGrad(ACCENT), lineStyle: { color: ACCENT, width: 2.5 } }],
      symbolSize: 6,
    }],
  };
}

/* ── 仪表盘 ───────────────────────────────────────────────────── */
export function t11GaugeOption(opts: { value: number; max?: number; label?: string; unit?: string }): Record<string, unknown> {
  const { value, max = 100, label, unit = '' } = opts;
  return {
    series: [{
      type: 'gauge',
      center: ['50%', '58%'],
      radius: '82%',
      min: 0, max,
      startAngle: 210,
      endAngle: -30,
      progress: { show: true, width: 16, itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: ACCENT }, { offset: 1, color: VIOLET }] } } },
      axisLine: { lineStyle: { width: 16, color: [[1, BORDER]] } },
      axisTick: { show: false },
      splitLine: { length: 10, lineStyle: { color: BORDER_STRONG, width: 2 } },
      axisLabel: { color: INK3, fontFamily: MONO, fontSize: 10, distance: 18 },
      pointer: { itemStyle: { color: ACCENT }, width: 6 },
      anchor: { show: true, size: 12, itemStyle: { color: VIOLET, borderColor: SURFACE, borderWidth: 2 } },
      detail: { valueAnimation: true, color: INK, fontFamily: MONO, fontSize: 32, fontWeight: 700, offsetCenter: [0, '36%'], formatter: `{value}${unit}` },
      title: { show: !!label, color: INK2, fontFamily: BODY, fontSize: 12, offsetCenter: [0, '68%'] },
      data: [{ value, name: label ?? '' }],
    }],
  };
}

/* ── 漏斗图 ───────────────────────────────────────────────────── */
export function t11FunnelOption(opts: { items: { name: string; value: number }[] }): Record<string, unknown> {
  const { items } = opts;
  const max = Math.max(...items.map((i) => i.value)) || 1;
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [{
      type: 'funnel',
      left: '10%', right: '10%', top: 24, bottom: 24,
      min: 0, max,
      gap: 4,
      label: { show: true, position: 'inside', color: SURFACE, fontFamily: MONO, fontSize: 12, formatter: '{b}\n{c}' },
      itemStyle: { borderColor: SURFACE, borderWidth: 2, borderRadius: 4 },
      data: items.map((it, i) => ({ name: it.name, value: it.value, itemStyle: { color: S(i) } })),
    }],
  };
}

/* ── 散点图 ───────────────────────────────────────────────────── */
export function t11ScatterOption(opts: {
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
      symbolSize: 16,
      itemStyle: { color: ACCENT, opacity: 0.8, borderColor: SURFACE, borderWidth: 2 },
    }],
  };
}

/* ── 热力图 ───────────────────────────────────────────────────── */
export function t11HeatmapOption(opts: {
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
    visualMap: {
      min: 0,
      max: max ?? Math.max(...data.map((d) => d[2])),
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      textStyle: { color: INK3, fontFamily: MONO },
      inRange: { color: ['#E0F7FA', ACCENT, VIOLET] },
    },
    series: [{
      type: 'heatmap',
      data,
      label: { show: false },
      itemStyle: { borderColor: SURFACE, borderWidth: 1 },
      emphasis: { itemStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.15)' } },
    }],
  };
}

/* ── 矩形树图 ─────────────────────────────────────────────────── */
export function t11TreemapOption(opts: { items: { name: string; value: number; children?: unknown[] }[] }): Record<string, unknown> {
  const { items } = opts;
  return {
    tooltip: { formatter: '{b}: {c}' },
    series: [{
      type: 'treemap',
      roam: false,
      nodeClick: false,
      breadcrumb: { show: false },
      data: items,
      label: { color: SURFACE, fontFamily: BODY, fontSize: 12 },
      upperLabel: { show: false },
      itemStyle: { borderColor: SURFACE, borderWidth: 2, gapWidth: 2, borderRadius: 6 },
      levels: [
        { itemStyle: { color: ACCENT } },
        { itemStyle: { color: VIOLET } },
        { itemStyle: { color: ORANGE } },
      ],
    }],
  };
}

/* ── 桑基图 ───────────────────────────────────────────────────── */
export function t11SankeyOption(opts: { nodes: { name: string }[]; links: { source: string; target: string; value: number }[] }): Record<string, unknown> {
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
      lineStyle: { color: 'gradient', opacity: 0.45, curveness: 0.5 },
      itemStyle: { color: ACCENT, borderColor: SURFACE },
    }],
  };
}

/* ── 旭日图 ───────────────────────────────────────────────────── */
export function t11SunburstOption(opts: {
  items: { name: string; value: number; children?: { name: string; value: number }[] }[];
}): Record<string, unknown> {
  const { items } = opts;
  return {
    tooltip: { formatter: '{b}: {c}' },
    series: [{
      type: 'sunburst',
      radius: ['24%', '72%'],
      data: items.map((it, i) => ({
        ...it,
        itemStyle: { color: S(i), borderColor: SURFACE, borderWidth: 2 },
        children: it.children?.map((c, j) => ({ ...c, itemStyle: { color: S(i + j + 1), borderColor: SURFACE, borderWidth: 2 } })),
      })),
      label: { color: INK2, fontFamily: MONO, fontSize: 10, rotate: 'radial' },
      itemStyle: { borderRadius: 6, borderColor: SURFACE, borderWidth: 2 },
      levels: [
        {},
        { r0: '24%', r: '52%', label: { rotate: 'tangential' } },
        { r0: '52%', r: '72%', label: { position: 'outside', padding: 3, color: INK3 } },
      ],
    }],
  };
}

/* ── 气泡图 ───────────────────────────────────────────────────── */
export function t11BubbleOption(opts: {
  points: [number, number, number][];
  xName?: string;
  yName?: string;
  unit?: string;
}): Record<string, unknown> {
  const { points, xName, yName, unit } = opts;
  const maxSize = Math.max(...points.map((p) => p[2] ?? 0), 1);
  return {
    grid: baseGrid,
    tooltip: { trigger: 'item', valueFormatter: (v: number) => `${v}${unit ?? ''}` },
    xAxis: { type: 'value', name: xName, nameTextStyle: { color: INK3, fontFamily: BODY }, scale: true, axisLine, axisLabel: axisLabel() },
    yAxis: { type: 'value', name: yName, nameTextStyle: { color: INK3, fontFamily: BODY }, scale: true, axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    visualMap: {
      min: 0,
      max: maxSize,
      dimension: 2,
      show: false,
      inRange: { symbolSize: [10, 38], color: [ACCENT, VIOLET] },
    },
    series: [{
      type: 'scatter',
      data: points,
      itemStyle: { opacity: 0.75, borderColor: SURFACE, borderWidth: 2 },
    }],
  };
}

/* ── 瀑布图 ───────────────────────────────────────────────────── */
export function t11WaterfallOption(opts: {
  labels: string[];
  values: number[];
  unit?: string;
}): Record<string, unknown> {
  const { labels, values, unit } = opts;
  const base: number[] = [];
  const deltas: number[] = [];
  const colors: string[] = [];
  let acc = 0;
  for (const v of values) {
    if (v >= 0) {
      base.push(acc);
      deltas.push(v);
      colors.push(GREEN);
      acc += v;
    } else {
      acc += v;
      base.push(acc);
      deltas.push(Math.abs(v));
      colors.push(ORANGE);
    }
  }
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (p: any[]) => `${p[1]?.name}<br/>${p[1]?.value}${unit ?? ''}` },
    xAxis: { type: 'category', data: labels, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: [
      {
        name: 'base',
        type: 'bar',
        stack: 'waterfall',
        itemStyle: { color: 'transparent' },
        emphasis: { itemStyle: { color: 'transparent' } },
        data: base,
      },
      {
        name: '变动',
        type: 'bar',
        stack: 'waterfall',
        barWidth: '46%',
        label: { show: true, position: 'top', color: INK2, fontFamily: MONO, fontSize: 11, formatter: `{c}${unit ?? ''}` },
        itemStyle: { borderRadius: [6, 6, 0, 0], color: (p: any) => colors[p.dataIndex] },
        data: deltas,
      },
    ],
  };
}

/* ── K 线图 ───────────────────────────────────────────────────── */
export function t11CandlestickOption(opts: {
  labels: string[];
  data: [number, number, number, number][];
}): Record<string, unknown> {
  const { labels, data } = opts;
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis', formatter: (p: any[]) => {
      const d = p[0]?.data;
      if (!d) return '';
      return `开盘 ${d[1]}<br/>收盘 ${d[2]}<br/>最低 ${d[3]}<br/>最高 ${d[4]}`;
    } },
    xAxis: { type: 'category', data: labels, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: [{
      type: 'candlestick',
      data,
      itemStyle: { color: ORANGE, color0: GREEN, borderColor: ORANGE, borderColor0: GREEN },
    }],
  };
}

/* ── 平行坐标图 ───────────────────────────────────────────────── */
export function t11ParallelOption(opts: {
  dimensions: string[];
  data: number[][];
}): Record<string, unknown> {
  const { dimensions, data } = opts;
  return {
    parallelAxis: dimensions.map((d, i) => ({ dim: i, name: d, nameTextStyle: { color: INK2, fontFamily: BODY }, axisLine: { lineStyle: { color: BORDER_STRONG } }, axisLabel: { color: INK3, fontFamily: MONO, fontSize: 10 }, splitLine: { lineStyle: { color: BORDER } } })),
    parallel: { left: 80, right: 80, top: 60, bottom: 40, parallelAxisDefault: { axisLine: { lineStyle: { color: BORDER_STRONG } }, axisLabel: { color: INK3 } } },
    series: [{
      type: 'parallel',
      lineStyle: { width: 2, opacity: 0.7 },
      data: data.map((row, i) => ({ value: row, lineStyle: { color: S(i) } })),
    }],
  };
}

/* ── 径向柱状图 ───────────────────────────────────────────────── */
export function t11RadianOption(opts: {
  labels: string[];
  values: number[];
  unit?: string;
}): Record<string, unknown> {
  const { labels, values, unit } = opts;
  const max = Math.max(...values, 1);
  return {
    polar: { radius: ['28%', '72%'] },
    angleAxis: { max, startAngle: 90, axisLabel: { show: false }, axisLine: { show: false }, splitLine: { lineStyle: { color: BORDER } } },
    radiusAxis: { type: 'category', data: labels, axisLine: { show: false }, axisLabel: { color: INK2, fontFamily: BODY, fontSize: 11 }, axisTick: { show: false } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' }, valueFormatter: (v: number) => `${v}${unit ?? ''}` },
    series: [{
      type: 'bar',
      coordinateSystem: 'polar',
      data: values.map((v, i) => ({ value: v, itemStyle: { color: barGrad(S(i)), borderRadius: 4 } })),
      barWidth: '55%',
      label: { show: true, position: 'middle', color: SURFACE, fontFamily: MONO, fontSize: 10, formatter: `{c}${unit ?? ''}` },
    }],
  };
}

/* ── 凹凸图（排名变化） ───────────────────────────────────────── */
export function t11BumpOption(opts: {
  labels: string[];
  series: { name: string; ranks: number[] }[];
}): Record<string, unknown> {
  const { labels, series } = opts;
  const maxRank = Math.max(...series.flatMap((s) => s.ranks), 1);
  return {
    grid: baseGrid,
    tooltip: { trigger: 'axis' },
    legend: { top: 4, textStyle: { color: INK2, fontFamily: BODY }, itemWidth: 12, itemHeight: 12 },
    xAxis: { type: 'category', data: labels, boundaryGap: false, axisLine, axisTick: { show: false }, axisLabel: axisLabel() },
    yAxis: { type: 'value', min: 1, max: maxRank, inverse: true, axisLine: { show: false }, axisLabel: { ...axisLabel(), formatter: `Rank {value}` }, splitLine },
    series: series.map((s, i) => ({
      name: s.name,
      type: 'line',
      data: s.ranks,
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 3, color: S(i) },
      itemStyle: { color: S(i), borderColor: SURFACE, borderWidth: 2 },
      label: { show: true, position: 'top', color: INK2, fontFamily: MONO, fontSize: 10, formatter: '{c}' },
    })),
  };
}

/* ── 关系图 ───────────────────────────────────────────────────── */
export function t11GraphOption(opts: {
  categories: string[];
  nodes: { name: string; category?: number; value?: number; symbolSize?: number }[];
  links: { source: string; target: string }[];
}): Record<string, unknown> {
  const { categories, nodes, links } = opts;
  return {
    tooltip: {},
    legend: { bottom: 0, data: categories, textStyle: { color: INK2, fontFamily: BODY }, itemWidth: 12, itemHeight: 12 },
    series: [{
      type: 'graph',
      layout: 'force',
      data: nodes.map((n) => ({ ...n, itemStyle: { color: S(n.category ?? 0) } })),
      links,
      categories: categories.map((name, i) => ({ name, itemStyle: { color: S(i) } })),
      roam: false,
      draggable: false,
      label: { show: true, color: INK, fontFamily: BODY, fontSize: 11 },
      force: { repulsion: 260, edgeLength: 70, gravity: 0.12 },
      lineStyle: { color: 'source', curveness: 0.15, opacity: 0.45 },
      emphasis: { focus: 'adjacency', lineStyle: { width: 3 } },
    }],
  };
}

/* ── 迷你面积图（small multiples） ─────────────────────────────── */
export function t11MiniAreaOption(opts: {
  labels: string[];
  values: number[];
  color?: string;
}): Record<string, unknown> {
  const { labels, values, color = ACCENT } = opts;
  return {
    grid: { left: 0, right: 0, top: 6, bottom: 0 },
    xAxis: { type: 'category', data: labels, show: false },
    yAxis: { type: 'value', show: false, min: Math.min(...values, 0) * 0.9 },
    tooltip: { show: false },
    series: [{
      type: 'line',
      data: values,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, color },
      areaStyle: {
        color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: `color-mix(in srgb, ${color} 35%, transparent)` }, { offset: 1, color: `color-mix(in srgb, ${color} 0%, transparent)` }] },
      },
    }],
  };
}

/* ── 日历热力图 ───────────────────────────────────────────────── */
export function t11CalendarOption(opts: {
  year: number;
  data: [string, number][];
  max?: number;
}): Record<string, unknown> {
  const { year, data, max } = opts;
  return {
    tooltip: { formatter: (p: any) => `${p.value[0]}: ${p.value[1]}` },
    visualMap: {
      min: 0,
      max: max ?? Math.max(...data.map((d) => d[1]), 1),
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      show: false,
      inRange: { color: ['#E0F7FA', ACCENT, VIOLET] },
    },
    calendar: {
      top: 24,
      left: 40,
      right: 24,
      bottom: 24,
      range: `${year}`,
      cellSize: ['auto', 'auto'],
      itemStyle: { borderColor: SURFACE, borderWidth: 2, borderRadius: 4 },
      splitLine: { show: false },
      yearLabel: { show: false },
      monthLabel: { color: INK2, fontFamily: BODY, fontSize: 12 },
      dayLabel: { color: INK3, fontFamily: MONO, fontSize: 10, firstDay: 1 },
    },
    series: [{
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data,
    }],
  };
}

/* ── 四象限散点图 ─────────────────────────────────────────────── */
export function t11QuadrantOption(opts: {
  points: { name: string; x: number; y: number; tone?: string }[];
  xName?: string;
  yName?: string;
  qLabels?: [string, string, string, string];
}): Record<string, unknown> {
  const { points, xName = 'X', yName = 'Y', qLabels = ['高影响\n高投入', '高影响\n低投入', '低影响\n高投入', '低影响\n低投入'] } = opts;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMid = (Math.max(...xs) + Math.min(...xs)) / 2 || 1;
  const yMid = (Math.max(...ys) + Math.min(...ys)) / 2 || 1;
  const xMax = Math.max(...xs, xMid * 2);
  const yMax = Math.max(...ys, yMid * 2);
  const toneMap: Record<string, string> = { accent: ACCENT, violet: VIOLET, orange: ORANGE, green: GREEN, cyan: ACCENT };
  return {
    grid: { left: 56, right: 28, top: 32, bottom: 56, containLabel: true },
    tooltip: { trigger: 'item', formatter: (p: any) => `${p.name}<br/>${xName}: ${p.value[0]}<br/>${yName}: ${p.value[1]}` },
    xAxis: { type: 'value', name: xName, nameTextStyle: { color: INK2, fontFamily: BODY }, min: 0, max: xMax, axisLine, axisLabel: axisLabel(), splitLine },
    yAxis: { type: 'value', name: yName, nameTextStyle: { color: INK2, fontFamily: BODY }, min: 0, max: yMax, axisLine: { show: false }, axisLabel: axisLabel(), splitLine },
    series: [{
      type: 'scatter',
      data: points.map((p) => ({ name: p.name, value: [p.x, p.y], itemStyle: { color: toneMap[p.tone ?? 'accent'], opacity: 0.85, borderColor: SURFACE, borderWidth: 2 }, symbolSize: 22 })),
      markArea: {
        silent: true,
        itemStyle: { color: 'transparent', borderWidth: 0 },
        label: { color: INK3, fontFamily: BODY, fontSize: 11, position: 'insideTop', distance: 8 },
        data: [
          [{ name: qLabels[0], xAxis: xMid, yAxis: yMax }, { xAxis: xMax, yAxis: yMid }],
          [{ name: qLabels[1], xAxis: 0, yAxis: yMax }, { xAxis: xMid, yAxis: yMid }],
          [{ name: qLabels[2], xAxis: xMid, yAxis: yMid }, { xAxis: xMax, yAxis: 0 }],
          [{ name: qLabels[3], xAxis: 0, yAxis: yMid }, { xAxis: xMid, yAxis: 0 }],
        ],
      },
    }],
  };
}

/* ── 树图 / 组织架构图 ─────────────────────────────────────────── */
export function t11TreeOption(opts: {
  data: { name: string; children?: unknown[]; value?: number }[];
  orient?: 'TB' | 'LR';
}): Record<string, unknown> {
  const { data, orient = 'TB' } = opts;
  return {
    tooltip: { trigger: 'item', formatter: '{b}' },
    series: [{
      type: 'tree',
      data,
      top: 16, bottom: 16, left: 24, right: 24,
      symbolSize: 12,
      orient,
      label: { show: true, position: orient === 'TB' ? 'top' : 'left', color: INK, fontFamily: BODY, fontSize: 12, fontWeight: 700 },
      leaves: { label: { position: orient === 'TB' ? 'bottom' : 'right', color: INK2, fontFamily: BODY, fontSize: 11 } },
      itemStyle: { color: ACCENT, borderColor: SURFACE, borderWidth: 2 },
      lineStyle: { color: BORDER_STRONG, width: 2, curveness: 0.5 },
      emphasis: { focus: 'descendant' },
      expandAndCollapse: false,
      animationDuration: 0,
    }],
  };
}

/* ── 数值解析 ─────────────────────────────────────────────────── */
export function t11ParseVals(v?: string): number[] {
  if (!v) return [];
  return v
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((n) => isFinite(n));
}

export function t11ParseItems(v?: { name?: string; value?: unknown }[]): { name: string; value: number }[] {
  if (!Array.isArray(v)) return [];
  return v.map((it, i) => ({
    name: it?.name ?? `项 ${i + 1}`,
    value: Number(it?.value ?? 0),
  }));
}
