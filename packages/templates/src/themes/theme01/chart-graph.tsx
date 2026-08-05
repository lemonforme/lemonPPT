// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from './echart.js';
export interface Theme01ChartGraphProps {
  title?: string;
  kicker?: string;
  nodes?: Array<{
    id?: string;
    name: string;
    value?: number;
    category?: number;
  }>;
  links?: Array<{
    source: string;
    target: string;
    value?: number;
  }>;
  categories?: Array<{
    name: string;
  }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01ChartGraphMeta: LayoutMeta = {
  id: 'theme01_chart_graph',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 关系图',
  description: 'ECharts 关系图，适合展示实体间的关联网络',
  needsMedia: false,
};
export const theme01ChartGraphSchema: PropsSchema = {
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
      key: 'nodes',
      label: 'nodes',
      type: 'array',
      maxItems: 20,
      minItems: 1,
      itemSchema: [
        {
          key: 'id',
          label: 'id',
          type: 'text',
          inlineEditable: true
        },
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
          key: 'category',
          label: 'category',
          type: 'number'
        }
      ]
    },
    {
      key: 'links',
      label: 'links',
      type: 'array',
      maxItems: 30,
      minItems: 1,
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
    },
    {
      key: 'categories',
      label: 'categories',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true
        }
      ]
    }
  ]
};
export function Theme01ChartGraph(props: Theme01ChartGraphProps): ReactNode {
  const { title, kicker, _slideIdx, _editable } = props;
  const categories = props.categories ?? [
    { name: '核心' },
    { name: '产品' },
    { name: '技术' },
  ];
  const nodes = props.nodes ?? [
    { name: '平台', value: 80, category: 0 },
    { name: '用户端', value: 50, category: 1 },
    { name: '管理端', value: 45, category: 1 },
    { name: '数据中台', value: 60, category: 2 },
    { name: 'AI 引擎', value: 70, category: 2 },
    { name: '渲染器', value: 55, category: 2 },
    { name: '模板库', value: 40, category: 1 },
  ];
  const links = props.links ?? [
    { source: '平台', target: '用户端', value: 5 },
    { source: '平台', target: '管理端', value: 5 },
    { source: '平台', target: '数据中台', value: 8 },
    { source: '数据中台', target: 'AI 引擎', value: 6 },
    { source: 'AI 引擎', target: '渲染器', value: 4 },
    { source: '管理端', target: '模板库', value: 3 },
    { source: '用户端', target: '渲染器', value: 4 },
  ];
  const option = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, data: categories.map((c) => c.name) },
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: nodes.map((n) => ({
          name: n.name,
          value: n.value ?? 40,
          category: n.category ?? 0,
          symbolSize: Math.sqrt(n.value ?? 40) * 6,
          draggable: true,
        })),
        links: links.map((l) => ({
          source: l.source,
          target: l.target,
          value: l.value ?? 1,
          lineStyle: { curveness: 0.1 },
        })),
        categories,
        roam: false,
        label: { show: true, position: 'right', fontSize: 11 },
        force: {
          repulsion: 400,
          edgeLength: [60, 120],
          gravity: 0.1,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 4 },
        },
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
          <LpEChart type="graph" option={option}/>
    </div>
      </div>
  </div>);
}
