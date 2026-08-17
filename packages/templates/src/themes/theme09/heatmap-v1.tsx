// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9AxisLabel, t9Grid, t9Rgba, t9Tooltip, t9DataLabel } from './chart-utils.js';

export interface Theme09HeatmapRow {
  name?: string;
  values?: string | Array<string | number>;
}

export interface Theme09HeatmapV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  months?: string[];
  rows?: Theme09HeatmapRow[];
  unit?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09HeatmapV1Meta: LayoutMeta = {
  id: 'theme09_heatmap_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '月度热力',
  description: '12×N 热力网格，网点浓度映射强弱，纸底',
  needsMedia: false,
  tags: ['chart', 'heatmap', 'calendar', 'matrix'],
  contentShape: 'heatmap',
};

export const theme09HeatmapV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '月度热力' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'HEATMAP' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '29' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '节奏' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '融资节奏集中在 {{下半年}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '每格为该赛道当月的融资事件数，网点越浓代表越活跃。' },
    {
      key: 'rows',
      label: '行（赛道）',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '行名称', type: 'text' },
        { key: 'values', label: '12 个月数值（逗号分隔）', type: 'text' },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '起' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_MONTHS: string[] = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const DEFAULT_ROWS: Theme09HeatmapRow[] = [
  { name: '大模型', values: [12, 9, 14, 18, 16, 21, 26, 24, 31, 34, 29, 38] },
  { name: '智能算力', values: [8, 11, 10, 13, 17, 15, 19, 22, 25, 27, 24, 30] },
  { name: '具身智能', values: [4, 6, 5, 9, 12, 14, 11, 16, 19, 21, 18, 23] },
  { name: 'AI 应用', values: [10, 8, 12, 11, 15, 13, 18, 17, 20, 22, 19, 26] },
  { name: '数据服务', values: [3, 5, 4, 7, 6, 9, 8, 12, 10, 14, 13, 16] },
];

function toValues(v?: string | Array<string | number>): Array<string | number> {
  if (Array.isArray(v)) return v;
  const s = String(v ?? '').trim();
  if (!s) return [];
  return (s.includes('|') ? s.split('|') : s.split(/[,，]/)).map((x) => x.trim());
}

function buildOption(months: string[], rows: Theme09HeatmapRow[], unit: string): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const rowNames = rows.map((r) => r.name ?? '');
  const cells: Array<[number, number, number]> = [];
  let min = Number.POSITIVE_INFINITY;
  let max = 0;

  rows.forEach((row, y) => {
    const vals = toValues(row.values);
    months.forEach((_, x) => {
      const n = t9ParseNumber(vals[x]);
      cells.push([x, y, n]);
      if (n < min) min = n;
      if (n > max) max = n;
    });
  });
  if (!Number.isFinite(min)) min = 0;
  if (max <= min) max = min + 1;

  return {
    tooltip: { ...t9Tooltip(c), position: 'top', formatter: `{b}　{c} ${unit}` },
    grid: t9Grid({ top: 18, right: 16, bottom: 72, left: 72 }),
    xAxis: {
      type: 'category',
      data: months,
      splitArea: { show: false },
      axisLine: { lineStyle: { color: c.rule } },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 12), interval: 0 },
    },
    yAxis: {
      type: 'category',
      data: rowNames,
      inverse: true,
      splitArea: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 13), fontWeight: 600, color: c.ink2 },
    },
    visualMap: {
      type: 'continuous',
      min,
      max,
      calculable: false,
      show: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 4,
      itemWidth: 12,
      itemHeight: 150,
      text: ['高', '低'],
      textStyle: { color: c.ink3, fontFamily: c.font, fontSize: 11 },
      inRange: {
        color: [t9Rgba(c.accent, 0.06), t9Rgba(c.accent, 0.28), t9Rgba(c.accent, 0.58), c.accent],
      },
    },
    series: [
      {
        type: 'heatmap',
        data: cells,
        label: t9DataLabel(c, 'inside', { color: c.ink, formatter: '{@[2]}' }),
        itemStyle: { borderColor: c.surfaceSolid, borderWidth: 2 },
        emphasis: { itemStyle: { borderColor: c.ink, borderWidth: 2 } },
      },
    ],
  };
}

export function Theme09HeatmapV1(props: Theme09HeatmapV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    months = [],
    rows = [],
    unit = '起',
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const monthList = months.length ? months : DEFAULT_MONTHS;
  const rowList = rows.length ? rows : DEFAULT_ROWS;

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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-heatmap">
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
          <div
            className="lp-theme09-heatmap-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="heatmap" option={buildOption(monthList, rowList, unit)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
