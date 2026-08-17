// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9FormatNumber, t9AxisLabel, t9Grid, t9SplitLine, t9DataLabel, t9Emphasis } from './chart-utils.js';

export interface Theme09SlopeEntity {
  name?: string;
  from?: string | number;
  to?: string | number;
}

export interface Theme09SlopeV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  periods?: string[];
  entities?: Theme09SlopeEntity[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09SlopeV1Meta: LayoutMeta = {
  id: 'theme09_slope_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '斜率对比',
  description: '两期斜率图 + 端点标签，涨幅最大者朱砂加粗，纸底',
  needsMedia: false,
  tags: ['chart', 'slope', 'compare', 'line'],
  contentShape: 'slope',
};

export const theme09SlopeV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '两期斜率' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'SLOPE' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '49' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '位移' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '两年之间，{{大模型}} 的坡度最陡' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '左端为期初值、右端为期末值，线的斜率即两期之间的位移速度。' },
    { key: 'periods', label: '两期名称', type: 'array', inlineEditable: true, defaultValue: ['2024', '2026'] },
    {
      key: 'entities',
      label: '对比对象',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'from', label: '期初值', type: 'number' },
        { key: 'to', label: '期末值', type: 'number' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_PERIODS = ['2024', '2026'];

const DEFAULT_ENTITIES: Theme09SlopeEntity[] = [
  { name: '大模型', from: 128, to: 232 },
  { name: '智能算力', from: 96, to: 172 },
  { name: '具身智能', from: 52, to: 118 },
  { name: 'AI 应用', from: 74, to: 98 },
  { name: '数据服务', from: 60, to: 72 },
  { name: '安全合规', from: 46, to: 38 },
];

function buildOption(periods: string[], entities: Theme09SlopeEntity[]): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const list = entities.length ? entities : DEFAULT_ENTITIES;
  const axis = periods.length >= 2 ? periods.slice(0, 2) : DEFAULT_PERIODS;

  const deltas = list.map((e) => Math.abs(t9ParseNumber(e.to) - t9ParseNumber(e.from)));
  const topIdx = deltas.indexOf(Math.max(...deltas, 0));
  const maxVal = Math.max(...list.map((e) => Math.max(t9ParseNumber(e.from), t9ParseNumber(e.to))), 1);

  return {
    grid: t9Grid({ left: 104, right: 84, top: 22, bottom: 26 }),
    xAxis: {
      type: 'category',
      data: axis,
      boundaryGap: false,
      axisLine: { lineStyle: { color: c.rule } },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 13), fontWeight: 600 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: Math.ceil((maxVal * 1.12) / 10) * 10,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: t9SplitLine(c),
    },
    series: list.map((e, i) => {
      const hi = i === topIdx;
      const from = t9ParseNumber(e.from);
      const to = t9ParseNumber(e.to);
      const color = hi ? c.accent : c.series[(i + 1) % c.series.length];
      const name = e.name ?? '';
      return {
        name,
        type: 'line',
        symbol: 'circle',
        symbolSize: hi ? 11 : 8,
        z: hi ? 8 : 3,
        itemStyle: { color },
        lineStyle: { color, width: hi ? 3 : 1.6, opacity: hi ? 1 : 0.6 },
        label: { show: true },
        emphasis: t9Emphasis(c),
        data: [
          {
            value: from,
            label: t9DataLabel(c, 'left', {
              distance: 10,
              color: hi ? c.ink : c.ink2,
              fontFamily: c.font,
              fontSize: 12,
              fontWeight: hi ? 700 : 500,
              formatter: `${name} ${t9FormatNumber(from)}`,
            }),
          },
          {
            value: to,
            label: t9DataLabel(c, 'right', {
              distance: 10,
              color: hi ? c.accent : c.ink2,
              fontSize: 12,
              fontWeight: 700,
              formatter: `${t9FormatNumber(to)}`,
            }),
          },
        ],
      };
    }),
  };
}

export function Theme09SlopeV1(props: Theme09SlopeV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    periods = [],
    entities = [],
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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-slope">
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
            className="lp-theme09-slope-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="line" option={buildOption(periods, entities)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
