// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from './echart.js';

export interface Theme01ChartGaugeProps {
  title?: string;
  kicker?: string;
  value?: number;
  min?: number;
  max?: number;
  unit?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ChartGaugeMeta: LayoutMeta = {
  id: 'theme01_chart_gauge',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 仪表盘',
  description: 'ECharts 仪表盘，适合展示完成率、健康度等单一指标',
  needsMedia: false,
};

export const theme01ChartGaugeSchema: PropsSchema = {
  fields: [
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'value',
      label: '数值',
      type: 'number'
  },
  {
      key: 'min',
      label: 'min',
      type: 'number'
  },
  {
      key: 'max',
      label: 'max',
      type: 'number'
  },
  {
      key: 'unit',
      label: '单位',
      type: 'text',
      inlineEditable: true
  }
  ]
};


export function Theme01ChartGauge(props: Theme01ChartGaugeProps): ReactNode {
  const { title, kicker, value = 0, min = 0, max = 100, unit = '', _slideIdx, _editable } = props;

  const option = {
  tooltip: { formatter: '{b}: {c}' + unit },
  series: [
      {
    type: 'gauge',
    startAngle: 200,
    endAngle: -20,
    min,
    max,
    splitNumber: 10,
    itemStyle: { color: 'var(--lp-blue)' },
    progress: { show: true, width: 24 },
    pointer: { show: true, length: '70%', width: 6 },
    axisLine: { lineStyle: { width: 24 } },
    axisTick: { distance: -30, length: 8, lineStyle: { width: 1 } },
    splitLine: { distance: -30, length: 16, lineStyle: { width: 2 } },
    axisLabel: { distance: -18, fontSize: 12 },
    detail: {
          valueAnimation: true,
          formatter: '{value}' + unit,
          fontSize: 40,
          fontWeight: 700,
          offsetCenter: [0, '60%'],
    },
    data: [{ value, name: title || '' }],
      },
  ],
  };

  return (
  <div className="lp-slide lp-chart-v2 lp-echart-slide">
      <div className="lp-card lp-chart-card lp-rise">
    <div className="lp-chart-header">
          {kicker && (
      <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
      </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-chart-title">
      {title}
          </EditableField>
    </div>
    <div className="lp-chart-wrapper lp-echart-wrapper">
          <LpEChart type="gauge" option={option} />
    </div>
      </div>
  </div>
  );
}
