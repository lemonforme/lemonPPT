// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9AxisLabel, t9Grid, t9SplitLine, t9Rgba, t9DataLabel } from './chart-utils.js';

export interface Theme09MeterMetric {
  label?: string;
  value?: string | number;
}

export interface Theme09MeterV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  metrics?: Theme09MeterMetric[];
  unit?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09MeterV1Meta: LayoutMeta = {
  id: 'theme09_meter_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '计量条',
  description: '多行计量条 + 刻度尺，圆头专色条，首行朱砂高亮，纸底',
  needsMedia: false,
  tags: ['chart', 'meter', 'bar', 'score'],
  contentShape: 'meter',
};

export const theme09MeterV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '能力计量' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'METER' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '46' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '刻度' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '六项能力里，{{客户留存}} 已越过九成线' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '统一以 100 分制计量，底纹为满量程，刻度每 20 分一档。' },
    {
      key: 'metrics',
      label: '计量项',
      type: 'array',
      itemSchema: [
        { key: 'label', label: '指标名', type: 'text' },
        { key: 'value', label: '数值（0-100）', type: 'number' },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '分' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_METRICS: Theme09MeterMetric[] = [
  { label: '客户留存', value: 91 },
  { label: '品牌认知', value: 82 },
  { label: '交付效率', value: 74 },
  { label: '渠道覆盖', value: 68 },
  { label: '合规水位', value: 63 },
  { label: '成本控制', value: 56 },
];

function buildOption(metrics: Theme09MeterMetric[], unit: string): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const list = metrics.length ? metrics : DEFAULT_METRICS;
  const names = list.map((m) => m.label ?? '');
  const vals = list.map((m) => Math.max(0, Math.min(100, t9ParseNumber(m.value))));

  return {
    grid: t9Grid({ left: 12, right: 44, top: 16, bottom: 12 }),
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 20,
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
        name: '满量程',
        type: 'bar',
        silent: true,
        barWidth: 14,
        z: 1,
        itemStyle: { color: t9Rgba(c.ink3, 0.08), borderRadius: 7 },
        data: vals.map(() => 100),
      },
      {
        name: '实测值',
        type: 'bar',
        barWidth: 14,
        barGap: '-100%',
        z: 2,
        data: vals.map((v, i) => ({
          value: v,
          itemStyle: {
            color: i === 0 ? c.accent : c.series[(i + 1) % c.series.length],
            borderRadius: 7,
          },
          label: t9DataLabel(c, 'right', {
            distance: 8,
            color: i === 0 ? c.accent : c.ink,
            fontSize: 12,
            fontWeight: 700,
            formatter: `${v}${unit}`,
          }),
        })),
      },
    ],
  };
}

export function Theme09MeterV1(props: Theme09MeterV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    metrics = [],
    unit = '分',
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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-meter">
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
            className="lp-theme09-meter-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="bar" option={buildOption(metrics, unit)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
