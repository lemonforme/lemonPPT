// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9FormatNumber, t9AxisLabel, t9Grid, t9Legend, t9DataLabel, t9BarItemStyle } from './chart-utils.js';

export interface Theme09TornadoItem {
  name?: string;
  left?: string | number;
  right?: string | number;
}

export interface Theme09TornadoV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  items?: Theme09TornadoItem[];
  leftLabel?: string;
  rightLabel?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09TornadoV1Meta: LayoutMeta = {
  id: 'theme09_tornado_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '同比对望',
  description: '左右对称龙卷风条形，去年与今年在零轴两侧对望，纸底专色',
  needsMedia: false,
  tags: ['chart', 'tornado', 'compare', 'bar'],
  contentShape: 'tornado',
};

export const theme09TornadoV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '同比对望' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'TORNADO' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '41' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '对照' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '两年之间，重心已向 {{算力}} 倾斜' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '左侧为去年规模，右侧为今年规模，条长即体量，零轴居中对望。' },
    {
      key: 'items',
      label: '对照项',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'left', label: '左侧（去年）', type: 'number' },
        { key: 'right', label: '右侧（今年）', type: 'number' },
      ],
    },
    { key: 'leftLabel', label: '左侧图例名', type: 'text', inlineEditable: true, defaultValue: '去年' },
    { key: 'rightLabel', label: '右侧图例名', type: 'text', inlineEditable: true, defaultValue: '今年' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_ITEMS: Theme09TornadoItem[] = [
  { name: '大模型', left: 128, right: 232 },
  { name: '智能算力', left: 96, right: 184 },
  { name: '具身智能', left: 52, right: 120 },
  { name: 'AI 应用', left: 74, right: 98 },
  { name: '数据服务', left: 60, right: 72 },
  { name: '安全合规', left: 44, right: 38 },
];

function buildOption(items: Theme09TornadoItem[], leftLabel: string, rightLabel: string): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const list = items.length ? items : DEFAULT_ITEMS;
  const names = list.map((i) => i.name ?? '');
  const lv = list.map((i) => t9ParseNumber(i.left));
  const rv = list.map((i) => t9ParseNumber(i.right));
  const bound = Math.ceil(Math.max(...lv, ...rv, 1) * 1.18);

  const barLabel = (v: number): Record<string, unknown> =>
    t9DataLabel(c, 'inside', {
      show: v > 0,
      color: c.onAccent,
      fontSize: 12,
      fontWeight: 700,
      formatter: t9FormatNumber(v),
    });

  return {
    legend: t9Legend(c, { top: 0, right: 2, itemWidth: 12, itemHeight: 8, itemGap: 16, data: [leftLabel, rightLabel] }),
    grid: t9Grid({ left: 12, right: 20, top: 36, bottom: 8 }),
    xAxis: { type: 'value', min: -bound, max: bound, show: false },
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
        name: leftLabel,
        type: 'bar',
        stack: 'tornado',
        barWidth: 18,
        itemStyle: t9BarItemStyle(c.series[1], 'paper', [3, 0, 0, 3]),
        data: lv.map((v) => ({ value: -v, label: barLabel(v) })),
        markLine: {
          silent: true,
          symbol: 'none',
          label: { show: false },
          lineStyle: { color: c.rule, width: 1 },
          data: [{ xAxis: 0 }],
        },
      },
      {
        name: rightLabel,
        type: 'bar',
        stack: 'tornado',
        barWidth: 18,
        itemStyle: t9BarItemStyle(c.accent, 'paper', [0, 3, 3, 0]),
        data: rv.map((v) => ({ value: v, label: barLabel(v) })),
      },
    ],
  };
}

export function Theme09TornadoV1(props: Theme09TornadoV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    items = [],
    leftLabel = '去年',
    rightLabel = '今年',
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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-tornado">
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
            className="lp-theme09-tornado-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="bar" option={buildOption(items, leftLabel, rightLabel)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
