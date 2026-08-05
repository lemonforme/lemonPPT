// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme03ChartGraphNode {
  id?: string;
  name?: string;
  value?: number;
  category?: number;
}

export interface Theme03ChartGraphLink {
  source?: string;
  target?: string;
  value?: number;
}

export interface Theme03ChartGraphCategory {
  name?: string;
}

export interface Theme03ChartGraphProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  nodes?: Theme03ChartGraphNode[];
  links?: Theme03ChartGraphLink[];
  categories?: Theme03ChartGraphCategory[];
  showInsight?: boolean;
  insight?: {
    value?: string;
    label?: string;
    description?: string;
  };
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ChartGraphMeta: LayoutMeta = {
  id: 'theme03_chart_graph',
  theme: 'theme03',
  role: 'chart',
  displayName: 'Theme 03 编辑风关系图',
  description: '实体关联网络关系图',
  needsMedia: false,
  tags: ['chart', 'graph', 'network'],
  contentShape: 'graph-chart',
};

const NEUTRAL_COLORS = [
  'var(--lp-ink3)',
  'var(--lp-ink2)',
  'var(--lp-surface-strong)',
  'var(--lp-border)',
  'var(--lp-stroke)',
];

export const theme03ChartGraphSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '关系网络' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '14' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '系统架构 · 节点关联' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{关系图}}：核心模块调用关系' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'nodes',
      label: '节点',
      type: 'array',
      minItems: 2,
      maxItems: 30,
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
      maxItems: 6,
      itemSchema: [{ key: 'name', label: '名称', type: 'text' }],
    },
    { key: 'showInsight', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
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
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-chart-graph-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

function buildOption(
  nodes: Theme03ChartGraphNode[],
  links: Theme03ChartGraphLink[],
  categories: Theme03ChartGraphCategory[]
): Record<string, unknown> {
  const validCategories = categories.filter((c) => c != null && c.name != null).map((c) => ({ name: c.name }));

  const nodeData = nodes
    .filter((n) => n != null && n.name != null)
    .map((n, index) => ({
      name: n.name ?? '',
      value: n.value ?? 40,
      category: n.category ?? 0,
      symbolSize: Math.max(20, Math.sqrt(n.value ?? 40) * 5),
      draggable: false,
      itemStyle: {
        color: n.category === 0 ? 'var(--lp-accent)' : NEUTRAL_COLORS[(n.category ?? index) % NEUTRAL_COLORS.length],
      },
    }));

  const linkData = links
    .filter((l) => l != null && l.source != null && l.target != null)
    .map((l) => ({
      source: l.source,
      target: l.target,
      value: l.value ?? 1,
      lineStyle: { curveness: 0.1, color: 'var(--lp-ink3)' },
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
        label: { show: true, position: 'right', fontSize: 11, color: 'var(--lp-ink2)' },
        force: { repulsion: 400, edgeLength: [60, 120], gravity: 0.1 },
        emphasis: { focus: 'adjacency', lineStyle: { width: 3, color: 'var(--lp-accent)' } },
        lineStyle: { color: 'var(--lp-ink3)', curveness: 0.1 },
      },
    ],
  };
}

export function Theme03ChartGraph(props: Theme03ChartGraphProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    nodes = [],
    links = [],
    categories = [],
    showInsight = true,
    insight,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validNodes = (nodes || []).filter((n) => n != null && n.name != null);
  const validLinks = (links || []).filter((l) => l != null && l.source != null && l.target != null);
  const validCategories = (categories || []).filter((c) => c != null && c.name != null);
  const hasData = validNodes.length > 0 && validLinks.length > 0;
  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  return (
    <div className="lp-slide lp-theme03-chart-graph">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-chart-graph-main">
        <div className="lp-theme03-chart-graph-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-graph-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className={`lp-theme03-chart-graph-body ${hasInsight ? 'lp-theme03-chart-graph-body--insight' : ''} lp-rise`}>
          <div className="lp-theme03-chart-graph-chart-wrap">
            {hasData ? (
              <LpEChart type="graph" option={buildOption(validNodes, validLinks, validCategories)} className="lp-theme03-chart-graph-echart" />
            ) : (
              <div className="lp-theme03-chart-graph-empty">请配置节点与关系数据</div>
            )}
          </div>

          {hasInsight && (
            <div className="lp-theme03-chart-graph-insight lp-rise">
              {(insight.value || insight.label) && (
                <div className="lp-theme03-chart-graph-insight-headline">
                  {insight.value && (
                    <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-graph-insight-value">{insight.value}</EditableField>
                  )}
                  {insight.label && (
                    <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-graph-insight-sub">{insight.label}</EditableField>
                  )}
                </div>
              )}
              {insight.description && (
                <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-graph-insight-desc">{insight.description}</EditableField>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
