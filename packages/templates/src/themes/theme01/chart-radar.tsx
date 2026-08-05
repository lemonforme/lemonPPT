// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from './echart.js';
export interface Theme01ChartRadarProps {
  title?: string;
  kicker?: string;
  indicators?: Array<{
    name: string;
    max: number;
  }>;
  data?: Array<{
    name: string;
    value: number[];
  }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01ChartRadarMeta: LayoutMeta = {
  id: 'theme01_chart_radar',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 雷达图',
  description: 'ECharts 雷达图，适合展示多维度能力对比',
  needsMedia: false,
};
export const theme01ChartRadarSchema: PropsSchema = {
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
      key: 'indicators',
      label: 'indicators',
      type: 'array',
      maxItems: 10,
      minItems: 1,
      itemSchema: [
        {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true
        },
        {
          key: 'max',
          label: 'max',
          type: 'number'
        }
      ]
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      itemSchema: [
        {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true
        },
        {
          key: 'value',
          label: '数值',
          type: 'array',
          maxItems: 10,
          minItems: 1,
          itemSchema: [
            {
              key: 'item',
              label: '项',
              type: 'number'
            }
          ]
        }
      ]
    }
  ]
};
export function Theme01ChartRadar(props: Theme01ChartRadarProps): ReactNode {
  const { title, kicker, _slideIdx, _editable } = props;
  const indicators = props.indicators ?? [
    { name: '性能', max: 100 },
    { name: '稳定性', max: 100 },
    { name: '易用性', max: 100 },
    { name: '扩展性', max: 100 },
    { name: '安全性', max: 100 },
  ];
  const data = props.data ?? [
    { name: '当前', value: [85, 90, 78, 88, 82] },
    { name: '目标', value: [95, 95, 90, 92, 95] },
  ];
  const option = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, data: data.map((d) => d.name) },
    radar: {
      indicator: indicators,
      radius: '65%',
      splitNumber: 4,
      axisName: { fontSize: 12, fontWeight: 600 },
    },
    series: [
      {
        type: 'radar',
        data: data.map((d, i) => ({
          value: d.value,
          name: d.name,
          areaStyle: i === 0 ? { opacity: 0.2 } : undefined,
        })),
      },
    ],
  };
  return (<div className="lp-slide lp-chart-v2 lp-echart-slide">
      <div className="lp-card lp-chart-card lp-rise">
    <div className="lp-chart-header">
          {kicker && (<EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
      </EditableField>)}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-chart-title">
      {title}
          </EditableField>
    </div>
    <div className="lp-chart-wrapper lp-echart-wrapper">
          <LpEChart type="radar" option={option}/>
    </div>
      </div>
  </div>);
}
