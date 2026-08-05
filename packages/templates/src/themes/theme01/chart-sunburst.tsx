// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from './echart.js';
export interface Theme01ChartSunburstProps {
  title?: string;
  kicker?: string;
  data?: Array<{
    name: string;
    value: number;
    children?: Array<{
      name: string;
      value: number;
    }>;
  }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01ChartSunburstMeta: LayoutMeta = {
  id: 'theme01_chart_sunburst',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 旭日图',
  description: 'ECharts 旭日图，适合展示层级占比关系',
  needsMedia: false,
};
export const theme01ChartSunburstSchema: PropsSchema = {
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
          type: 'number'
        },
        {
          key: 'children',
          label: 'children',
          type: 'array',
          maxItems: 20,
          minItems: 1,
          itemSchema: []
        },
        {
          key: 'value',
          label: '数值',
          type: 'number'
        }
      ]
    }
  ]
};
export function Theme01ChartSunburst(props: Theme01ChartSunburstProps): ReactNode {
  const { title, kicker, data = [], _slideIdx, _editable } = props;
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [
      {
        type: 'sunburst',
        radius: [0, '90%'],
        data,
        label: { rotate: 'radial', fontSize: 11, fontWeight: 600 },
        itemStyle: { borderColor: 'var(--lp-white)', borderWidth: 2 },
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
          <LpEChart type="sunburst" option={option}/>
    </div>
      </div>
  </div>);
}
