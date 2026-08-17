// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Rgba, t9Legend, t9DataLabel, t9Emphasis } from './chart-utils.js';

export interface Theme09BubbleNode {
  name?: string;
  value?: string | number;
  category?: string;
}

export interface Theme09BubbleLink {
  source?: string;
  target?: string;
}

export interface Theme09BubbleV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  nodes?: Theme09BubbleNode[];
  links?: Theme09BubbleLink[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09BubbleV1Meta: LayoutMeta = {
  id: 'theme09_bubble_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '体量聚类',
  description: '力导向气泡聚类，尺寸映射体量，专色分组，纸底',
  needsMedia: false,
  tags: ['chart', 'bubble', 'cluster', 'force'],
  contentShape: 'bubble-cluster',
};

export const theme09BubbleV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '体量聚类' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'CLUSTER' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '44' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '聚类' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资本重心仍聚拢在 {{基础层}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '气泡面积代表赛道体量，连线代表上下游依赖，同色为同一层级。' },
    {
      key: 'nodes',
      label: '气泡节点',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '体量', type: 'number' },
        { key: 'category', label: '分组', type: 'text' },
      ],
    },
    {
      key: 'links',
      label: '连线',
      type: 'array',
      itemSchema: [
        { key: 'source', label: '起点名称', type: 'text' },
        { key: 'target', label: '终点名称', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_NODES: Theme09BubbleNode[] = [
  { name: '大模型', value: 232, category: '基础层' },
  { name: '智能算力', value: 184, category: '基础层' },
  { name: 'Agent 框架', value: 120, category: '工具层' },
  { name: '向量数据库', value: 96, category: '工具层' },
  { name: '行业助手', value: 142, category: '应用层' },
  { name: 'AI 硬件', value: 88, category: '应用层' },
  { name: '安全合规', value: 64, category: '治理层' },
  { name: '评测基准', value: 52, category: '治理层' },
];

const DEFAULT_LINKS: Theme09BubbleLink[] = [
  { source: '大模型', target: '智能算力' },
  { source: '大模型', target: 'Agent 框架' },
  { source: '大模型', target: '向量数据库' },
  { source: 'Agent 框架', target: '行业助手' },
  { source: '向量数据库', target: '行业助手' },
  { source: '行业助手', target: 'AI 硬件' },
  { source: '大模型', target: '安全合规' },
  { source: '安全合规', target: '评测基准' },
];

function buildOption(nodes: Theme09BubbleNode[], links: Theme09BubbleLink[]): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const list = nodes.length ? nodes : DEFAULT_NODES;
  const edges = links.length ? links : DEFAULT_LINKS;

  const cats: string[] = [];
  list.forEach((n) => {
    const k = n.category ?? '其他';
    if (!cats.includes(k)) cats.push(k);
  });

  const maxVal = Math.max(...list.map((n) => t9ParseNumber(n.value)), 1);

  const data = list.map((n) => {
    const v = t9ParseNumber(n.value);
    const ci = Math.max(0, cats.indexOf(n.category ?? '其他'));
    return {
      name: n.name ?? '',
      value: v,
      category: ci,
      symbolSize: 30 + Math.sqrt(v / maxVal) * 56,
    };
  });

  const names = list.map((n) => n.name ?? '');
  const validEdges = edges
    .filter((e) => names.includes(e.source ?? '') && names.includes(e.target ?? ''))
    .map((e) => ({ source: e.source ?? '', target: e.target ?? '' }));

  return {
    legend: [
      t9Legend(c, {
        top: 0,
        left: 0,
        right: 'auto',
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        data: cats,
      }),
    ],
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: false,
        draggable: false,
        top: 42,
        left: 16,
        right: 16,
        bottom: 12,
        categories: cats.map((n, i) => ({
          name: n,
          itemStyle: {
            color: t9Rgba(i === 0 ? c.accent : c.series[(i + 1) % c.series.length], 0.85),
            borderColor: i === 0 ? c.accent : c.series[(i + 1) % c.series.length],
            borderWidth: 1,
          },
        })),
        force: { repulsion: 340, gravity: 0.08, edgeLength: [70, 150], friction: 0.2 },
        data,
        links: validEdges,
        lineStyle: { color: t9Rgba(c.ink3, 0.35), width: 1, curveness: 0.12 },
        label: t9DataLabel(c, 'inside', { color: c.onAccent, fontFamily: c.font, fontWeight: 600 }),
        emphasis: t9Emphasis(c, { focus: 'adjacency', scale: 1.05, lineStyle: { width: 2 } }),
      },
    ],
  };
}

export function Theme09BubbleV1(props: Theme09BubbleV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    nodes = [],
    links = [],
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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-bubble">
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
            className="lp-theme09-bubble-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="graph" option={buildOption(nodes, links)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
