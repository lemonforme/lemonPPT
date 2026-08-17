// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9AxisLabel, t9Grid, t9BarItemStyle, t9DataLabel, t9Emphasis, t9Tooltip } from './chart-utils.js';

export interface Theme09RankItem {
  name?: string;
  value?: string | number;
  delta?: string;
}

export interface Theme09RankingV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  items?: Theme09RankItem[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09RankingV1Meta: LayoutMeta = {
  id: 'theme09_ranking_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '排行榜',
  description: '条形排行 + 名次徽章 + 涨跌箭头，纸底',
  needsMedia: false,
  tags: ['chart', 'ranking', 'bar'],
  contentShape: 'ranking',
};

export const theme09RankingV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '资本排行' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'RANKING' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '35' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '名次' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '大模型稳居 {{榜首}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按全年融资规模排序的赛道排行，箭头为同比变化。' },
    {
      key: 'items',
      label: '排行项',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'delta', label: '同比(↑/↓)', type: 'text' },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿$' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function buildOption(items: Theme09RankItem[]): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const sorted = [...items].sort((a, b) => t9ParseNumber(b.value) - t9ParseNumber(a.value));
  const names = sorted.map((s) => s.name ?? '');
  const vals = sorted.map((s) => t9ParseNumber(s.value));
  const deltas = sorted.map((s) => s.delta ?? '');
  const max = Math.max(...vals, 1);
  const barColor = (i: number) => i === 0 ? c.accent : c.series[(i + 1) % c.series.length];
  const data = vals.map((v, i) => ({
    value: v,
    itemStyle: t9BarItemStyle(barColor(i), 'paper', [0, 3, 3, 0]),
    label: { ...t9DataLabel(c, 'right', { formatter: `${v}${deltas[i] ?? ''}`, fontSize: 13, fontWeight: 700 }) },
    emphasis: t9Emphasis(c),
  }));
  return {
    tooltip: t9Tooltip(c),
    grid: t9Grid({ left: 96, right: 96, top: 16, bottom: 24 }),
    xAxis: { type: 'value', max: Math.ceil(max * 1.3), show: false },
    yAxis: {
      type: 'category',
      data: names,
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 14), fontWeight: 600 },
    },
    series: [
      {
        type: 'bar',
        data,
        barWidth: 26,
        emphasis: t9Emphasis(c),
      },
    ],
  };
}

export function Theme09RankingV1(props: Theme09RankingV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    items = [],
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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-ranking">
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
          <div className="lp-theme09-ranking-body">
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-ranking-sub">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div className="lp-theme09-ranking-chart">
              <LpEChart type="bar" option={buildOption(items)} className="lp-theme09-ranking-echart" />
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
