// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 分布直方（histogram_v1）
 * 基底：纸 | 骨架：chart-canvas | 图位：—
 *
 * 直方分布图（柱间无间隙）+ 均值 / 分位标线 + 可选正态参考曲线。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import {
  t9AxisLabel,
  t9BarItemStyle,
  t9ChartColors,
  t9Grid,
  t9ParseNumber,
  t9Rgba,
  t9SplitLine,
  t9Tooltip,
} from './chart-utils.js';

export interface Theme09HistogramBin {
  /** 区间标签，支持 40-50 / 40–50 / 40~50 */
  range?: string;
  count?: string | number;
}

export interface Theme09HistogramV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  bins?: Theme09HistogramBin[];
  mean?: string | number;
  quartiles?: Array<string | number | { item?: string }>;
  showCurve?: boolean;
  unit?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09HistogramV1Meta: LayoutMeta = {
  id: 'theme09_histogram_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '分布直方',
  description: '无间隙直方分布 + 均值/分位标线 + 正态参考曲线，纸底',
  needsMedia: false,
  tags: ['chart', 'histogram', 'distribution', 'quartile'],
  contentShape: 'histogram',
};

export const theme09HistogramV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '分布直方' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'HISTOGRAM' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '17' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '分布' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '估值倍数集中在 {{8–12 倍}} 区间' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '样本为 186 家已披露交易主体，横轴为区间，纵轴为落入该区间的样本数。' },
    {
      key: 'bins',
      label: '分箱',
      type: 'array',
      maxItems: 16,
      itemSchema: [
        { key: 'range', label: '区间', type: 'text' },
        { key: 'count', label: '频数', type: 'number' },
      ],
    },
    { key: 'mean', label: '均值', type: 'number', defaultValue: 11.4 },
    { key: 'quartiles', label: '分位标线（如 8.2 / 14.6）', type: 'array', itemSchema: [{ key: 'item', label: '分位值', type: 'text' }] },
    { key: 'showCurve', label: '显示正态参考曲线', type: 'boolean', defaultValue: true },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '家' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: '样本：186 家 · 剔除极端值后统计' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: 'HISTOGRAM / 17' },
  ],
};

const DEFAULT_BINS: Theme09HistogramBin[] = [
  { range: '0-2', count: 4 },
  { range: '2-4', count: 9 },
  { range: '4-6', count: 17 },
  { range: '6-8', count: 28 },
  { range: '8-10', count: 39 },
  { range: '10-12', count: 34 },
  { range: '12-14', count: 24 },
  { range: '14-16', count: 15 },
  { range: '16-18', count: 9 },
  { range: '18-20', count: 5 },
];

const DEFAULT_MEAN = 11.4;
const DEFAULT_QUARTILES = [8.2, 14.6];

/** 解析 40-50 / 40–50 / 40~50 为 [下界, 上界]。 */
function parseRange(range?: string): [number, number] | null {
  const s = String(range ?? '').trim();
  if (!s) return null;
  const parts = s.split(/[-–—~至]/).map((x) => x.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  const lo = t9ParseNumber(parts[0]);
  const hi = t9ParseNumber(parts[1]);
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return null;
  return [lo, hi];
}

/** 把真实数值映射到 category 轴的（可能带小数的）下标位置。 */
function valueToIndex(value: number, bins: Theme09HistogramBin[]): number | null {
  const ranges = bins.map((b) => parseRange(b.range));
  for (let i = 0; i < ranges.length; i += 1) {
    const r = ranges[i];
    if (!r) continue;
    const [lo, hi] = r;
    if (value >= lo && value <= hi) {
      const span = hi - lo || 1;
      // 柱心在 i，柱宽 1，故区间内线性插值为 i - 0.5 + 占比
      return i - 0.5 + (value - lo) / span;
    }
  }
  return null;
}

function toQuartileValues(input: Array<string | number | { item?: string }>): number[] {
  return input
    .map((x) => (typeof x === 'object' && x !== null ? ((x as { item?: string }).item ?? '') : x))
    .map((x) => t9ParseNumber(x as string | number))
    .filter((n) => Number.isFinite(n));
}

interface MarkLineItem {
  xAxis: number;
  lineStyle: Record<string, unknown>;
  label: Record<string, unknown>;
}

function buildOption(
  bins: Theme09HistogramBin[],
  mean: number | null,
  quartiles: number[],
  showCurve: boolean,
  unit: string,
): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const labels = bins.map((b) => b.range ?? '');
  const counts = bins.map((b) => t9ParseNumber(b.count));
  const maxCount = Math.max(...counts, 1);

  const marks: MarkLineItem[] = [];
  if (mean != null) {
    const x = valueToIndex(mean, bins);
    if (x != null) {
      marks.push({
        xAxis: x,
        lineStyle: { color: c.accent, width: 2, type: 'solid' },
        label: {
          show: true,
          position: 'end',
          formatter: `均值 ${mean}`,
          color: c.accent,
          fontFamily: c.fontMono,
          fontSize: 11.5,
          fontWeight: 700,
        },
      });
    }
  }
  quartiles.forEach((q, i) => {
    const x = valueToIndex(q, bins);
    if (x == null) return;
    marks.push({
      xAxis: x,
      lineStyle: { color: c.ink3, width: 1.5, type: 'dashed' },
      label: {
        show: true,
        position: i % 2 === 0 ? 'start' : 'end',
        formatter: `P${i === 0 ? 25 : 75} ${q}`,
        color: c.ink3,
        fontFamily: c.fontMono,
        fontSize: 11,
      },
    });
  });

  // 正态参考曲线：以分箱重心估计 μ / σ，再缩放到频数量级。
  let curve: number[] = [];
  if (showCurve) {
    const centers = bins.map((b) => {
      const r = parseRange(b.range);
      return r ? (r[0] + r[1]) / 2 : 0;
    });
    const total = counts.reduce((s, v) => s + v, 0) || 1;
    const mu = centers.reduce((s, x, i) => s + x * counts[i], 0) / total;
    const variance = centers.reduce((s, x, i) => s + counts[i] * (x - mu) ** 2, 0) / total;
    const sigma = Math.sqrt(variance) || 1;
    const peak = 1 / (sigma * Math.sqrt(2 * Math.PI));
    curve = centers.map((x) => {
      const density = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2));
      return Number(((density / peak) * maxCount).toFixed(2));
    });
  }

  return {
    grid: t9Grid({ left: 20, right: 28, top: 40, bottom: 36 }),
    tooltip: { ...t9Tooltip(c), trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: true,
      axisLine: { lineStyle: { color: c.rule } },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 11.5), fontFamily: c.fontMono },
    },
    yAxis: {
      type: 'value',
      name: unit ? `频数（${unit}）` : '频数',
      nameTextStyle: { color: c.ink3, fontFamily: c.font, fontSize: 11, align: 'left', padding: [0, 0, 6, -8] },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 12), fontFamily: c.fontMono },
      splitLine: t9SplitLine(c),
    },
    series: [
      {
        type: 'bar',
        name: '频数',
        data: counts,
        barCategoryGap: '0%',
        barGap: '0%',
        itemStyle: {
          ...t9BarItemStyle(c.accent, 'paper', [0, 0, 0, 0]),
          borderColor: c.surfaceSolid,
          borderWidth: 1,
        },
        emphasis: { itemStyle: { color: c.accent } },
        markLine: marks.length
          ? {
              symbol: 'none',
              silent: true,
              animation: false,
              data: marks,
            }
          : undefined,
        z: 2,
      },
      ...(curve.length
        ? [
            {
              type: 'line',
              name: '正态参考',
              data: curve,
              smooth: 0.4,
              symbol: 'none',
              lineStyle: { color: t9Rgba(c.ink, 0.55), width: 2, type: 'dashed' },
              z: 3,
            },
          ]
        : []),
    ],
  };
}

export function Theme09HistogramV1(props: Theme09HistogramV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    bins = [],
    mean,
    quartiles = [],
    showCurve = true,
    unit = '家',
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const binList = bins.length ? bins : DEFAULT_BINS;
  const meanValue = mean == null || mean === '' ? (bins.length ? null : DEFAULT_MEAN) : t9ParseNumber(mean);
  const quartileValues = quartiles.length ? toQuartileValues(quartiles) : bins.length ? [] : DEFAULT_QUARTILES;

  const renderTitle = (t: string): ReactNode => {
    const parts = t.split(/(\{\{[^}]+\}\})/g);
    return (
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme09-chart-title lp-t9-serif">
        {parts.map((part, idx) => {
          const m = part.match(/^\{\{(.+)\}\}$/);
          if (m) return <em key={idx} className="lp-theme09-accent-text">{m[1]}</em>;
          return <span key={idx}>{part}</span>;
        })}
      </EditableField>
    );
  };

  return (
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-histogram">
      <T9ChartShell
        slideIdx={_slideIdx}
        editable={_editable}
        footnoteLeft={footnoteLeft}
        footnoteRight={footnoteRight}
        head={
          <T9ChartHeader
            section={section}
            sectionEn={sectionEn}
            mark={mark}
            kicker={kicker}
            slideIdx={_slideIdx}
            editable={_editable}
          />
        }
        body={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto', minHeight: 0 }}>
            {title && renderTitle(title)}
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            <LpEChart
              type="bar"
              option={buildOption(binList, meanValue, quartileValues, showCurve !== false, unit)}
              className="lp-theme09-chart-area"
            />
          </div>
        }
      />
    </Sheet>
  );
}
