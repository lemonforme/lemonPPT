// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from './echart.js';

export interface Theme01ChartSankeyProps {
  title?: string;
  kicker?: string;
  data?: Array<{ source: string; target: string; value: number }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ChartSankeyMeta: LayoutMeta = {
  id: 'theme01_chart_sankey',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 桑基图',
  description: 'ECharts 桑基图，适合展示流量、资金或转化路径',
  needsMedia: false,
};

export const theme01ChartSankeySchema: PropsSchema = {
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
          key: 'source',
          label: 'source',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'target',
          label: 'target',
          type: 'text',
          inlineEditable: true
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


export function Theme01ChartSankey(props: Theme01ChartSankeyProps): ReactNode {
  const { title, kicker, data = [], _slideIdx, _editable } = props;

  const nodeNames = Array.from(new Set(data.flatMap((d) => [d.source, d.target])));
  const nodes = nodeNames.map((name) => ({ name }));
  const links = data.map((d) => ({ source: d.source, target: d.target, value: d.value }));

  const option = {
  tooltip: { trigger: 'item', triggerOn: 'mousemove' },
  series: [
      {
    type: 'sankey',
    layout: 'none',
    emphasis: { focus: 'adjacency' },
    data: nodes,
    links,
    lineStyle: { color: 'gradient', curveness: 0.5 },
    label: { fontSize: 12, fontWeight: 600 },
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
          <LpEChart type="sankey" option={option} />
    </div>
      </div>
  </div>
  );
}
