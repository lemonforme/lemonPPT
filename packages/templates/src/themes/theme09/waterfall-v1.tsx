// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9FormatNumber, t9AxisLabel, t9Grid, t9SplitLine, t9Rgba, t9Tooltip, t9BarItemStyle, t9DataLabel, t9Emphasis } from './chart-utils.js';

export interface Theme09WaterfallStep {
  name?: string;
  value?: string | number;
}

export interface Theme09WaterfallV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  steps?: Theme09WaterfallStep[];
  unit?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09WaterfallV1Meta: LayoutMeta = {
  id: 'theme09_waterfall_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '资金瀑布',
  description: '瀑布图 + 增减双色 + 连接虚线，末列为合计，纸底',
  needsMedia: false,
  tags: ['chart', 'waterfall', 'bridge', 'finance'],
  contentShape: 'waterfall',
};

export const theme09WaterfallV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '资金瀑布' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'WATERFALL' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '28' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '桥接' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '从期初到期末的 {{资金桥接}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '石绿为增项、朱砂为减项，末列为期末结余，单位：万元。' },
    {
      key: 'steps',
      label: '瀑布步骤',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '步骤名称', type: 'text' },
        { key: 'value', label: '增减值（可为负，末项为合计）', type: 'text' },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '万元' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_STEPS: Theme09WaterfallStep[] = [
  { name: '期初结余', value: 3200 },
  { name: '本轮融资', value: 8600 },
  { name: '经营回款', value: 2400 },
  { name: '研发投入', value: -4200 },
  { name: '产能扩建', value: -3100 },
  { name: '市场推广', value: -1800 },
  { name: '期末结余', value: 0 },
];

function buildOption(steps: Theme09WaterfallStep[], unit: string): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const list = steps.length ? steps : DEFAULT_STEPS;
  const names = list.map((s) => s.name ?? '');
  const values = list.map((s) => t9ParseNumber(s.value));

  const lastIdx = list.length - 1;
  const base: number[] = [];
  const delta: Record<string, unknown>[] = [];
  const tops: number[] = [];

  const up = c.series[3];
  const down = c.accent;

  let cum = 0;
  for (let i = 0; i < list.length; i += 1) {
    const isTotal = i === lastIdx;
    if (isTotal) {
      base.push(0);
      const totalValue = values[i] !== 0 ? values[i] : cum;
      delta.push({
        value: Math.abs(totalValue),
        itemStyle: t9BarItemStyle(c.accent, 'paper', [3, 3, 0, 0]),
        label: {
          ...t9DataLabel(c, 'top', { formatter: t9FormatNumber(totalValue), color: c.accent, fontSize: 13, fontWeight: 700 }),
        },
        emphasis: t9Emphasis(c),
      });
      tops.push(Math.abs(totalValue));
    } else {
      const v = values[i];
      const start = v >= 0 ? cum : cum + v;
      base.push(start);
      delta.push({
        value: Math.abs(v),
        itemStyle: t9BarItemStyle(v >= 0 ? up : down, 'paper', [3, 3, 0, 0]),
        label: {
          ...t9DataLabel(c, v >= 0 ? 'top' : 'bottom', {
            formatter: `${v > 0 ? '+' : ''}${t9FormatNumber(v)}`,
            color: v >= 0 ? up : down,
            fontSize: 12,
            fontWeight: 700,
          }),
        },
        emphasis: t9Emphasis(c),
      });
      cum += v;
      tops.push(cum);
    }
  }

  const connectors: Array<Array<{ coord: number[] }>> = [];
  for (let i = 0; i < lastIdx; i += 1) {
    connectors.push([{ coord: [i, tops[i]] }, { coord: [i + 1, tops[i]] }]);
  }

  const maxTop = Math.max(...tops, 1);

  return {
    tooltip: { ...t9Tooltip(c), trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: t9Grid({ top: 34, right: 52, bottom: 34, left: 56 }),
    xAxis: {
      type: 'category',
      data: names,
      axisLine: { lineStyle: { color: c.rule } },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 12), interval: 0, color: c.ink2 },
    },
    yAxis: {
      type: 'value',
      max: Math.ceil((maxTop * 1.16) / 100) * 100,
      name: unit,
      nameTextStyle: { color: c.ink3, fontFamily: c.font, fontSize: 11, padding: [0, 0, 0, -34] },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: t9AxisLabel(c, 12),
      splitLine: t9SplitLine(c),
    },
    series: [
      {
        name: '基线',
        type: 'bar',
        stack: 'wf',
        silent: true,
        barWidth: '46%',
        itemStyle: { color: t9Rgba(c.ink, 0), borderColor: t9Rgba(c.ink, 0) },
        emphasis: { disabled: true },
        tooltip: { show: false },
        data: base,
      },
      {
        name: '增减',
        type: 'bar',
        stack: 'wf',
        barWidth: '46%',
        data: delta,
        emphasis: t9Emphasis(c),
        markLine: {
          symbol: 'none',
          silent: true,
          animation: false,
          label: { show: false },
          lineStyle: { type: 'dashed', color: c.ink3, width: 1, opacity: 0.55 },
          data: connectors,
        },
      },
    ],
  };
}

export function Theme09WaterfallV1(props: Theme09WaterfallV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    steps = [],
    unit = '万元',
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('paper');

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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-waterfall">
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
            className="lp-theme09-waterfall-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: c.font, fontSize: 12, color: c.ink3 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 12, height: 12, background: c.series[3] }} />增项
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 12, height: 12, background: c.accent }} />减项 / 合计
              </span>
            </div>
            <LpEChart type="bar" option={buildOption(steps, unit)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
