// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from './echart.js';
export interface Theme01ChartHeatmapProps {
  title?: string;
  kicker?: string;
  xAxis?: string[];
  yAxis?: string[];
  data?: Array<[
    string,
    string,
    number
  ]>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01ChartHeatmapMeta: LayoutMeta = {
  id: 'theme01_chart_heatmap',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 热力图',
  description: 'ECharts 热力图，适合展示矩阵密度或相关性',
  needsMedia: false,
};
export const theme01ChartHeatmapSchema: PropsSchema = {
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
      key: 'xAxis',
      label: 'xAxis',
      type: 'array',
      maxItems: 10,
      minItems: 1,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true
        }
      ]
    },
    {
      key: 'yAxis',
      label: 'yAxis',
      type: 'array',
      maxItems: 10,
      minItems: 1,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true
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
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true
        }
      ]
    }
  ]
};
export function Theme01ChartHeatmap(props: Theme01ChartHeatmapProps): ReactNode {
  const { title, kicker, _slideIdx, _editable } = props;
  const xAxis = props.xAxis ?? ['A', 'B', 'C', 'D'];
  const yAxis = props.yAxis ?? ['W1', 'W2', 'W3'];
  const data = props.data ?? xAxis.flatMap((x) => yAxis.map((y) => [x, y, Math.round(Math.random() * 100)] as [
    string,
    string,
    number
  ]));
  const option = {
    tooltip: { position: 'top' },
    grid: { top: 10, bottom: 40, left: 60, right: 20 },
    xAxis: { type: 'category', data: xAxis, splitArea: { show: true } },
    yAxis: { type: 'category', data: yAxis, splitArea: { show: true } },
    visualMap: {
      min: 0,
      max: Math.max(...data.map((d) => d[2])),
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: { color: ['var(--lp-blue-100)', 'var(--lp-blue)'] },
    },
    series: [
      {
        type: 'heatmap',
        data,
        label: { show: true, fontSize: 12 },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
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
          <LpEChart type="heatmap" option={option}/>
    </div>
      </div>
  </div>);
}
