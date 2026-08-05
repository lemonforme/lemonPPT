// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06EcosystemGraphV1Node {
  id?: string;
  name: string;
  category?: number;
  value?: number;
  symbolSize?: number;
}

export interface Theme06EcosystemGraphV1Link {
  source?: string;
  target?: string;
  value?: number;
}

export interface Theme06EcosystemGraphV1Category {
  name?: string;
}

export interface Theme06EcosystemGraphV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  nodes?: Theme06EcosystemGraphV1Node[];
  links?: Theme06EcosystemGraphV1Link[];
  categories?: Theme06EcosystemGraphV1Category[];
  conclusion?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06EcosystemGraphV1Meta: LayoutMeta = {
  id: 'theme06_ecosystem_graph_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 生态图谱',
  description: '力导向网络图，展示生态或资本关系',
  needsMedia: true,
  tags: ['ecosystem', 'graph', 'network', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06EcosystemGraphV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'ECOSYSTEM' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '生成式 AI 生态图谱' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '基础设施、模型层、工具链与应用层的协作关系' },
    {
      key: 'categories',
      label: '分类',
      type: 'array',
      minItems: 2,
      maxItems: 5,
      defaultValue: [{ item: '基础设施' }, { item: '基础模型' }, { item: '工具链' }, { item: '应用' }],
      itemSchema: [{ key: 'item', label: '名称', type: 'text', inlineEditable: true }],
    },
    {
      key: 'nodes',
      label: '节点',
      type: 'array',
      minItems: 4,
      maxItems: 20,
      defaultValue: [
        { name: '云端算力', category: 0, value: 80 },
        { name: 'GPU 集群', category: 0, value: 60 },
        { name: '大模型 API', category: 1, value: 90 },
        { name: '开源模型', category: 1, value: 70 },
        { name: '向量数据库', category: 2, value: 55 },
        { name: 'Agent 框架', category: 2, value: 65 },
        { name: '代码助手', category: 3, value: 75 },
        { name: '搜索增强', category: 3, value: 68 },
        { name: '设计工具', category: 3, value: 50 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'category', label: '分类索引', type: 'number', inlineEditable: true },
        { key: 'value', label: '大小', type: 'number', inlineEditable: true },
      ],
    },
    {
      key: 'links',
      label: '连接',
      type: 'array',
      minItems: 2,
      maxItems: 30,
      defaultValue: [
        { source: '云端算力', target: '大模型 API', value: 5 },
        { source: 'GPU 集群', target: '开源模型', value: 4 },
        { source: '大模型 API', target: 'Agent 框架', value: 5 },
        { source: '开源模型', target: '代码助手', value: 4 },
        { source: '向量数据库', target: '搜索增强', value: 4 },
        { source: 'Agent 框架', target: '代码助手', value: 3 },
        { source: 'Agent 框架', target: '搜索增强', value: 3 },
        { source: '大模型 API', target: '设计工具', value: 3 },
      ],
      itemSchema: [
        { key: 'source', label: '源节点', type: 'text', inlineEditable: true },
        { key: 'target', label: '目标节点', type: 'text', inlineEditable: true },
        { key: 'value', label: '权重', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'conclusion', label: '结论', type: 'textarea', inlineEditable: true, defaultValue: '模型层是生态核心，工具链与应用层围绕其快速分化，基础设施层提供算力底座。' },
  ],
};

const CATEGORY_COLORS = [
  'var(--lp-accent)',
  'var(--lp-accent-2)',
  'var(--lp-accent-cool)',
  'var(--lp-blue)',
  'var(--lp-violet)',
];

function buildOption(
  nodes: Theme06EcosystemGraphV1Node[],
  links: Theme06EcosystemGraphV1Link[],
  categories: Theme06EcosystemGraphV1Category[]
): Record<string, unknown> {
  const normNodes = nodes.map((n) => ({
    id: n.name,
    name: n.name,
    value: n.value ?? 50,
    symbolSize: n.symbolSize ?? Math.max(24, Math.min(60, (n.value ?? 50) * 0.5)),
    category: Math.min(n.category ?? 0, categories.length - 1),
    label: { show: true, color: 'var(--lp-ink)', fontSize: 11, fontWeight: 600 },
  }));

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'var(--lp-surface-solid)',
      borderColor: 'var(--lp-border-strong)',
      textStyle: { color: 'var(--lp-ink)', fontFamily: 'var(--lp-font)' },
    },
    legend: { show: false },
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: normNodes.map((n, index) => ({ ...n, id: String(index) })),
        links: links.map((l) => ({
          source: String(normNodes.findIndex((n) => n.name === l.source)),
          target: String(normNodes.findIndex((n) => n.name === l.target)),
          value: l.value ?? 1,
        })).filter((l) => l.source !== '-1' && l.target !== '-1'),
        categories: categories.map((c) => ({ name: c.name || '' })),
        roam: false,
        label: { show: true, position: 'right', color: 'var(--lp-ink)' },
        force: {
          repulsion: 260,
          edgeLength: [60, 120],
          gravity: 0.1,
        },
        lineStyle: {
          color: 'var(--lp-edge)',
          curveness: 0.2,
          width: 1.5,
          opacity: 0.6,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 3, opacity: 1 },
        },
        itemStyle: {
          borderColor: 'var(--lp-surface-solid)',
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: 'var(--lp-focus-glow)',
        },
        color: CATEGORY_COLORS.slice(0, categories.length),
        animationDuration: 1200,
      },
    ],
  };
}

export function Theme06EcosystemGraphV1(props: Theme06EcosystemGraphV1Props): ReactNode {
  const { kicker, title, subtitle, nodes = [], links = [], categories = [], conclusion, _slideIdx, _editable } = props;
  const validNodes = (nodes || []).filter((n): n is Theme06EcosystemGraphV1Node => n != null && !!n.name).slice(0, 20);
  const validLinks = (links || []).filter((l): l is Theme06EcosystemGraphV1Link => l != null).slice(0, 30);
  const validCategories = (categories || [])
    .map((c) => ({ name: typeof c === 'string' ? c : (c as { name?: string; item?: string }).name ?? (c as { item?: string }).item ?? '' }))
    .filter((c) => c.name);

  return (
    <div className="lp-slide lp-theme06-ecosystem-graph">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-ecosystem-graph-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-ecosystem-graph-body lp-rise">
        <div className="lp-theme06-ecosystem-graph-main">
          <div className="lp-theme06-ecosystem-graph-canvas">
            <LpEChart type="graph" option={buildOption(validNodes, validLinks, validCategories)} />
          </div>
        </div>
        <div className="lp-theme06-ecosystem-graph-aside">
          <div className="lp-theme06-ecosystem-graph-legend">
            <div className="lp-theme06-ecosystem-graph-legend-title">分类</div>
            {validCategories.map((cat, index) => (
              <div key={index} className="lp-theme06-ecosystem-graph-legend-item">
                <span
                  className="lp-theme06-ecosystem-graph-legend-dot"
                  style={{ background: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                />
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
          {conclusion && (
            <div className="lp-theme06-ecosystem-graph-conclusion">
              <div className="lp-theme06-ecosystem-graph-conclusion-label">关键结论</div>
              <EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-ecosystem-graph-conclusion-text">{conclusion}</EditableField>
            </div>
          )}
        </div>
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
