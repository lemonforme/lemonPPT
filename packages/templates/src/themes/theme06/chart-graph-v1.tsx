// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06ChartGraphV1Node {
  id?: string;
  name?: string;
  value?: number;
  category?: number;
}

export interface Theme06ChartGraphV1Link {
  source?: string;
  target?: string;
  value?: number;
}

export interface Theme06ChartGraphV1Category {
  name?: string;
}

export interface Theme06ChartGraphV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  nodes?: Theme06ChartGraphV1Node[];
  links?: Theme06ChartGraphV1Link[];
  categories?: Theme06ChartGraphV1Category[];
  unit?: string;
  showConclusion?: boolean;
  conclusionValue?: string;
  conclusionLabel?: string;
  conclusionDescription?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ChartGraphV1Meta: LayoutMeta = {
  id: 'theme06_chart_graph_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 关系图谱',
  description: '力导向关系网络，展示节点与连接',
  needsMedia: true,
  tags: ['chart', 'graph', 'network', 'atlas'],
  contentShape: 'graph-chart',
};

export const theme06ChartGraphV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'GRAPH' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心模块调用关系' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '节点大小代表模块重要性，连线代表调用依赖。' },
    {
      key: 'nodes',
      label: '节点',
      type: 'array',
      minItems: 2,
      maxItems: 30,
      defaultValue: [
        { id: 'A', name: '数据中台', value: 80, category: 0 },
        { id: 'B', name: '用户端', value: 60, category: 1 },
        { id: 'C', name: '管理端', value: 50, category: 1 },
        { id: 'D', name: 'AI 引擎', value: 90, category: 0 },
        { id: 'E', name: '知识库', value: 55, category: 2 },
        { id: 'F', name: '审计服务', value: 40, category: 2 },
      ],
      itemSchema: [
        { key: 'id', label: 'ID', type: 'text' },
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
        { key: 'category', label: '分类', type: 'number' },
      ],
    },
    {
      key: 'links',
      label: '关系',
      type: 'array',
      minItems: 1,
      maxItems: 50,
      defaultValue: [
        { source: 'A', target: 'B', value: 3 },
        { source: 'A', target: 'C', value: 3 },
        { source: 'D', target: 'A', value: 5 },
        { source: 'D', target: 'E', value: 4 },
        { source: 'E', target: 'F', value: 2 },
        { source: 'B', target: 'D', value: 3 },
      ],
      itemSchema: [
        { key: 'source', label: '源节点', type: 'text' },
        { key: 'target', label: '目标节点', type: 'text' },
        { key: 'value', label: '权重', type: 'number' },
      ],
    },
    {
      key: 'categories',
      label: '分类',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [{ name: '核心' }, { name: '入口' }, { name: '支撑' }],
      itemSchema: [{ key: 'name', label: '名称', type: 'text' }],
    },
    { key: 'showConclusion', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'conclusion',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showConclusion', value: true },
      defaultValue: {
        value: '4',
        label: '核心模块数',
        description: '平台通过数据中台串联用户端、管理端与 AI 引擎，形成完整能力闭环。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

const NODE_COLORS = [
  'var(--lp-accent)',
  'var(--lp-accent-2)',
  'var(--lp-accent-cool)',
  'var(--lp-red)',
];

function buildOption(
  nodes: Theme06ChartGraphV1Node[],
  links: Theme06ChartGraphV1Link[],
  categories: Theme06ChartGraphV1Category[]
): Record<string, unknown> {
  const validCategories = categories.filter((c) => c != null && c.name != null).map((c) => ({ name: c.name }));
  const nodeData = nodes
    .filter((n) => n != null && n.name != null)
    .map((n, index) => ({
      name: n.name ?? '',
      value: n.value ?? 40,
      category: n.category ?? 0,
      symbolSize: Math.max(18, Math.sqrt(n.value ?? 40) * 5),
      draggable: false,
      itemStyle: {
        color: NODE_COLORS[(n.category ?? index) % NODE_COLORS.length],
        shadowBlur: 12,
        shadowColor: 'var(--lp-focus-glow)',
      },
      label: { show: true, color: 'var(--lp-ink)', fontSize: 12, fontWeight: 600 },
    }));

  const linkData = links
    .filter((l) => l != null && l.source != null && l.target != null)
    .map((l) => ({
      source: l.source,
      target: l.target,
      value: l.value ?? 1,
      lineStyle: { curveness: 0.1, color: 'var(--lp-edge)', width: 1.5 },
    }));

  return {
    tooltip: { trigger: 'item' },
    legend: validCategories.length > 0 ? {
      bottom: 0,
      data: validCategories.map((c) => c.name),
      textStyle: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)' },
    } : undefined,
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: nodeData,
        links: linkData,
        categories: validCategories,
        roam: false,
        center: ['50%', '50%'],
        zoom: 1,
        force: { repulsion: 320, edgeLength: [90, 160], gravity: 0.2 },
        emphasis: { focus: 'adjacency', lineStyle: { width: 3, color: 'var(--lp-accent)' } },
        lineStyle: { color: 'var(--lp-edge)', curveness: 0.1 },
      },
    ],
  };
}

export function Theme06ChartGraphV1(props: Theme06ChartGraphV1Props): ReactNode {
  const { kicker, title, subtitle, nodes = [], links = [], categories = [], showConclusion = true, _slideIdx, _editable } = props;
  const conclusion = (props as any).conclusion;
  const validNodes = (nodes || []).filter((n) => n != null && n.name != null);
  const validLinks = (links || []).filter((l) => l != null && l.source != null && l.target != null);
  const validCategories = (categories || []).filter((c) => c != null && c.name != null);
  const hasData = validNodes.length > 0 && validLinks.length > 0;
  const hasConclusion = showConclusion !== false && !!conclusion && (conclusion.value || conclusion.label || conclusion.description);

  return (
    <div className="lp-slide lp-theme06-chart lp-theme06-graph">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-chart-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme06-chart-canvas lp-theme06-graph-canvas">
          {hasData ? (
            <LpEChart type="graph" option={buildOption(validNodes, validLinks, validCategories)} className="lp-theme06-graph-svg" />
          ) : (
            <div className="lp-theme06-chart-empty">请配置节点与关系数据</div>
          )}
        </div>
      </div>

      {hasConclusion && (
        <div className="lp-theme06-chart-aside lp-rise">
          <div className="lp-theme06-conclusion">
            {conclusion.value && (
              <EditableField prop="conclusion.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-conclusion-value">{conclusion.value}</EditableField>
            )}
            {conclusion.label && (
              <EditableField prop="conclusion.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-conclusion-label">{conclusion.label}</EditableField>
            )}
            {conclusion.description && (
              <EditableField prop="conclusion.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-conclusion-description">{conclusion.description}</EditableField>
            )}
          </div>
        </div>
      )}

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
