// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9FormatNumber, t9AxisLabel, t9Grid, t9SplitLine, t9Rgba, t9Legend, t9DataLabel } from './chart-utils.js';

export interface Theme09DumbbellRow {
  name?: string;
  start?: string | number;
  end?: string | number;
}

export interface Theme09DumbbellV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  rows?: Theme09DumbbellRow[];
  startLabel?: string;
  endLabel?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09DumbbellV1Meta: LayoutMeta = {
  id: 'theme09_dumbbell_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '区间哑铃',
  description: '哑铃图区间对比：期初期末双点 + 连杆 + 差值标注，纸底专色',
  needsMedia: false,
  tags: ['chart', 'dumbbell', 'range', 'compare'],
  contentShape: 'dumbbell',
};

export const theme09DumbbellV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '区间哑铃' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'DUMBBELL' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '50' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '区间' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '除海外外，各区间的 {{下限}} 都被抬高' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '左点为期初、右点为期末，连杆长度即两期差值，正负标注在右侧。' },
    {
      key: 'rows',
      label: '区间行',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'start', label: '期初值', type: 'number' },
        { key: 'end', label: '期末值', type: 'number' },
      ],
    },
    { key: 'startLabel', label: '期初图例名', type: 'text', inlineEditable: true, defaultValue: '期初' },
    { key: 'endLabel', label: '期末图例名', type: 'text', inlineEditable: true, defaultValue: '期末' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_ROWS: Theme09DumbbellRow[] = [
  { name: '华东', start: 58, end: 86 },
  { name: '华北', start: 64, end: 79 },
  { name: '华南', start: 47, end: 72 },
  { name: '西部', start: 39, end: 61 },
  { name: '海外', start: 52, end: 44 },
  { name: '全国均值', start: 52, end: 70 },
];

function buildOption(rows: Theme09DumbbellRow[], startLabel: string, endLabel: string): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const list = rows.length ? rows : DEFAULT_ROWS;
  const names = list.map((r) => r.name ?? '');
  const starts = list.map((r) => t9ParseNumber(r.start));
  const ends = list.map((r) => t9ParseNumber(r.end));
  const maxVal = Math.max(...starts, ...ends, 1);
  const axisMax = Math.ceil((maxVal * 1.16) / 10) * 10;

  return {
    legend: t9Legend(c, { top: 0, right: 2, icon: 'circle', itemWidth: 10, itemHeight: 10, itemGap: 16, data: [startLabel, endLabel] }),
    grid: t9Grid({ left: 12, right: 56, top: 36, bottom: 14 }),
    xAxis: {
      type: 'value',
      min: 0,
      max: axisMax,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: t9AxisLabel(c, 11),
      splitLine: t9SplitLine(c),
    },
    yAxis: {
      type: 'category',
      data: names,
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 13), fontWeight: 600 },
    },
    series: [
      {
        name: '连杆底座',
        type: 'bar',
        stack: 'dumbbell',
        silent: true,
        barWidth: 3,
        z: 1,
        itemStyle: { color: 'transparent' },
        data: list.map((_r, i) => Math.min(starts[i], ends[i])),
      },
      {
        name: '连杆',
        type: 'bar',
        stack: 'dumbbell',
        silent: true,
        barWidth: 3,
        z: 2,
        itemStyle: { color: t9Rgba(c.ink3, 0.42) },
        data: list.map((_r, i) => Math.abs(ends[i] - starts[i])),
      },
      {
        name: startLabel,
        type: 'scatter',
        symbol: 'circle',
        symbolSize: 13,
        z: 5,
        itemStyle: { color: c.series[1], borderColor: c.surfaceSolid, borderWidth: 1.5 },
        data: list.map((_r, i) => [starts[i], i]),
      },
      {
        name: endLabel,
        type: 'scatter',
        symbol: 'circle',
        symbolSize: 13,
        z: 6,
        itemStyle: { color: c.accent, borderColor: c.surfaceSolid, borderWidth: 1.5 },
        data: list.map((_r, i) => {
          const delta = ends[i] - starts[i];
          const sign = delta >= 0 ? '+' : '−';
          return {
            value: [ends[i], i],
            label: t9DataLabel(c, 'right', {
              distance: 10,
              color: delta >= 0 ? c.accent : c.ink3,
              fontSize: 12,
              fontWeight: 700,
              formatter: `${sign}${t9FormatNumber(Math.abs(delta))}`,
            }),
          };
        }),
      },
    ],
  };
}

export function Theme09DumbbellV1(props: Theme09DumbbellV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    rows = [],
    startLabel = '期初',
    endLabel = '期末',
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-dumbbell">
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
            className="lp-theme09-dumbbell-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="custom" option={buildOption(rows, startLabel, endLabel)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
