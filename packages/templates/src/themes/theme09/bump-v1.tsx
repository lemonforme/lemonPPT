// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9AxisLabel, t9Grid, t9SplitLine, t9Tooltip, t9Legend, t9DataLabel, t9Emphasis } from './chart-utils.js';

export interface Theme09BumpLine {
  name?: string;
  ranks?: (string | number)[];
}

export interface Theme09BumpV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  periods?: string[];
  lines?: Theme09BumpLine[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09BumpV1Meta: LayoutMeta = {
  id: 'theme09_bump_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '名次变迁',
  description: '名次连线图，逐年名次穿插交错，首位用朱砂高亮，墨底',
  needsMedia: false,
  tags: ['chart', 'bump', 'ranking', 'trend'],
  contentShape: 'bump',
};

export const theme09BumpV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '赛道位次' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'BUMP' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '41' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '变迁' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '五年之间，位次{{三度易主}}' },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '按年度融资总额排定名次，线条越靠上表示位次越高。',
    },
    {
      key: 'periods',
      label: '时间刻度',
      type: 'array',
      inlineEditable: true,
      defaultValue: ['2019', '2020', '2021', '2022', '2023'],
    },
    {
      key: 'lines',
      label: '名次序列',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'ranks', label: '历年名次', type: 'array' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_PERIODS = ['2019', '2020', '2021', '2022', '2023'];

const DEFAULT_LINES: Theme09BumpLine[] = [
  { name: '大模型', ranks: [3, 2, 1, 1, 1] },
  { name: '算力芯片', ranks: [1, 1, 2, 2, 2] },
  { name: '智能驾驶', ranks: [2, 3, 3, 4, 4] },
  { name: '生物医药', ranks: [4, 4, 5, 3, 3] },
  { name: '新能源', ranks: [5, 5, 4, 5, 5] },
];

function buildOption(periods: string[], lines: Theme09BumpLine[]): Record<string, unknown> {
  const c = t9ChartColors('ink');
  const ps = periods.length ? periods : DEFAULT_PERIODS;
  const ls = lines.length ? lines : DEFAULT_LINES;
  const n = ls.length;
  const names = ls.map((l, i) => l.name ?? `序列 ${i + 1}`);

  const series = ls.map((l, i) => {
    const lead = i === 0;
    const color = lead ? c.accent : c.series[(i + 1) % c.series.length];
    return {
      type: 'line',
      name: names[i],
      smooth: 0.35,
      symbol: 'circle',
      symbolSize: lead ? 14 : 10,
      z: lead ? 6 : 2,
      lineStyle: { color, width: lead ? 4 : 2, opacity: lead ? 1 : 0.72 },
      itemStyle: { color, borderColor: c.surfaceSolid, borderWidth: 2 },
      emphasis: t9Emphasis(c),
      label: t9DataLabel(c, 'top', {
        distance: 8,
        formatter: '{c}',
        color: lead ? c.accent : c.ink3,
        fontSize: 12,
        fontWeight: lead ? 700 : 500,
      }),
      data: (l.ranks ?? []).map((r) => t9ParseNumber(r)),
    };
  });

  return {
    grid: t9Grid({ left: 62, right: 40, top: 30, bottom: 54 }),
    tooltip: { ...t9Tooltip(c), trigger: 'axis' },
    legend: t9Legend(c, { top: 'auto', right: 'auto', bottom: 0, itemGap: 20, data: names }),
    xAxis: {
      type: 'category',
      data: ps,
      boundaryGap: false,
      axisLine: { lineStyle: { color: c.rule } },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 13), fontFamily: c.fontMono },
    },
    yAxis: {
      type: 'value',
      inverse: true,
      min: 0,
      max: n,
      interval: 1,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 12), fontFamily: c.fontMono },
      splitLine: t9SplitLine(c),
    },
    series,
  };
}

export function Theme09BumpV1(props: Theme09BumpV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    periods = [],
    lines = [],
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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-bump">
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
            className="lp-theme09-bump-body"
            style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, gap: '8px' }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="line" option={buildOption(periods, lines)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
