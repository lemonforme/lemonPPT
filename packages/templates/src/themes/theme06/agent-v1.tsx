// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06AgentV1Node {
  id?: string;
  name?: string;
  category?: number;
  value?: number;
}

export interface Theme06AgentV1Link {
  source?: string;
  target?: string;
}

export interface Theme06AgentV1Conclusion {
  label?: string;
  text?: string;
}

export interface Theme06AgentV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  nodes?: Theme06AgentV1Node[];
  links?: Theme06AgentV1Link[];
  categories?: string[];
  conclusion?: Theme06AgentV1Conclusion;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06AgentV1Meta: LayoutMeta = {
  id: 'theme06_agent_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 Agent 能力图谱',
  description: '关系网络图 + 右侧图例与结论',
  needsMedia: true,
  tags: ['chart', 'graph', 'agent', 'atlas'],
  contentShape: 'network',
};

export const theme06AgentV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'AGENT MAP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'Agent 能力与应用图谱' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '抽象网络呈现核心能力节点与应用场景连接' },
    {
      key: 'categories',
      label: '节点分类',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: ['核心能力', '感知层', '执行层', '应用场景'],
      itemSchema: [{ key: 'item', label: '分类', type: 'text', inlineEditable: true }],
    },
    {
      key: 'nodes',
      label: '节点',
      type: 'array',
      minItems: 2,
      maxItems: 24,
      defaultValue: [
        { id: 'reasoning', name: '推理规划', category: 0, value: 48 },
        { id: 'memory', name: '记忆管理', category: 0, value: 40 },
        { id: 'tool', name: '工具调用', category: 0, value: 44 },
        { id: 'vision', name: '多模态感知', category: 1, value: 32 },
        { id: 'text', name: '文本理解', category: 1, value: 36 },
        { id: 'code', name: '代码执行', category: 2, value: 38 },
        { id: 'search', name: '检索增强', category: 2, value: 34 },
        { id: 'service', name: '智能客服', category: 3, value: 30 },
        { id: 'analyst', name: '数据分析', category: 3, value: 28 },
        { id: 'coder', name: '编程助手', category: 3, value: 32 },
      ],
      itemSchema: [
        { key: 'id', label: 'ID', type: 'text' },
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'category', label: '分类索引', type: 'number' },
        { key: 'value', label: '大小', type: 'number' },
      ],
    },
    {
      key: 'links',
      label: '连线',
      type: 'array',
      minItems: 1,
      maxItems: 40,
      defaultValue: [
        { source: 'reasoning', target: 'tool' },
        { source: 'reasoning', target: 'memory' },
        { source: 'vision', target: 'reasoning' },
        { source: 'text', target: 'reasoning' },
        { source: 'tool', target: 'code' },
        { source: 'tool', target: 'search' },
        { source: 'code', target: 'coder' },
        { source: 'search', target: 'analyst' },
        { source: 'memory', target: 'service' },
      ],
      itemSchema: [
        { key: 'source', label: '起点 ID', type: 'text' },
        { key: 'target', label: '终点 ID', type: 'text' },
      ],
    },
    {
      key: 'conclusion',
      label: '结论区',
      type: 'object',
      defaultValue: { label: '核心洞察', text: 'Agent 的核心竞争力来自推理规划、工具调用与记忆管理的协同，垂直场景落地决定商业化天花板。' },
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'text', label: '文字', type: 'textarea' },
      ],
    },
  ],
};

const AGENT_COLORS = ['var(--lp-accent)', 'var(--lp-accent-2)', 'var(--lp-accent-cool)', 'var(--lp-blue)'];

function buildOption(nodes: Theme06AgentV1Node[], links: Theme06AgentV1Link[], categories: string[]): Record<string, unknown> {
  const validNodes = nodes.filter((n) => n != null && typeof n.id === 'string');
  const nodeMap = new Map(validNodes.map((n) => [n.id!, n]));
  const validLinks = links.filter((l) => l != null && nodeMap.has(l.source ?? '') && nodeMap.has(l.target ?? ''));

  return {
    tooltip: {},
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: false,
        symbolSize: (value: number) => Math.max(20, (value || 30) * 0.6),
        data: validNodes.map((n) => ({
          id: n.id,
          name: n.name ?? n.id,
          value: n.value ?? 30,
          category: Math.min(Math.max(0, n.category ?? 0), categories.length - 1),
          itemStyle: { color: AGENT_COLORS[(n.category ?? 0) % AGENT_COLORS.length] },
          label: { show: true, color: 'var(--lp-ink)', fontSize: 11, fontWeight: 600 },
        })),
        links: validLinks.map((l) => ({ source: l.source, target: l.target })),
        categories: categories.map((name, index) => ({ name, itemStyle: { color: AGENT_COLORS[index % AGENT_COLORS.length] } })),
        force: { repulsion: 280, edgeLength: 80 },
        lineStyle: { color: 'var(--lp-edge)', width: 1, curveness: 0.1 },
        emphasis: { focus: 'adjacency', lineStyle: { width: 2, color: 'var(--lp-accent)' } },
        animationDuration: 900,
      },
    ],
  };
}

function normalizeArray<T>(input: unknown, defaultValue: T[]): T[] {
  if (!Array.isArray(input)) return defaultValue;
  return input as T[];
}

export function Theme06AgentV1(props: Theme06AgentV1Props): ReactNode {
  const { kicker, title, subtitle, nodes = [], links = [], categories = [], conclusion, _slideIdx, _editable } = props;
  const validCategories = normalizeArray<string>(categories, [])
    .map((c) => (typeof c === 'string' ? c : (c as { item?: string }).item ?? ''))
    .filter((c) => c !== '')
    .slice(0, 4);
  const validNodes = (nodes || []).filter((n): n is Theme06AgentV1Node => n != null && typeof n.id === 'string').slice(0, 24);
  const validLinks = (links || []).filter((l): l is Theme06AgentV1Link => l != null).slice(0, 40);
  const hasData = validNodes.length > 0;
  const hasConclusion = !!conclusion && (!!conclusion.label || !!conclusion.text);

  return (
    <div className="lp-slide lp-theme06-agent">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-agent-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-agent-body lp-rise">
        <div className="lp-theme06-agent-main">
          <div className="lp-theme06-agent-canvas">
            {hasData ? (
              <LpEChart
                type="graph"
                option={buildOption(validNodes, validLinks, validCategories)}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-ink3)' }}>
                请在右侧属性面板输入数据
              </div>
            )}
          </div>
        </div>

        <div className="lp-theme06-agent-aside">
          {validCategories.length > 0 && (
            <div className="lp-theme06-agent-legend">
              <div className="lp-theme06-agent-legend-title">分类图例</div>
              {validCategories.map((category, index) => (
                <div key={index} className="lp-theme06-agent-legend-item">
                  <span className="lp-theme06-agent-legend-dot" style={{ background: AGENT_COLORS[index % AGENT_COLORS.length] }} />
                  <span>{category}</span>
                </div>
              ))}
            </div>
          )}
          {hasConclusion && (
            <div className="lp-theme06-agent-conclusion">
              {conclusion!.label && <div className="lp-theme06-agent-conclusion-label">{conclusion!.label}</div>}
              {conclusion!.text && <div className="lp-theme06-agent-conclusion-text"><EditableField prop="conclusion.text" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.text}</EditableField></div>}
            </div>
          )}
        </div>
      </div>

      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
