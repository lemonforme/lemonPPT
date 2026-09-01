// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 关系图（graph_v1）
 * 情绪：aurora | 骨架：chart-canvas
 * 力导向关系网络 + 右侧洞察面板。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, chartInsightSchema, EditableField, Sheet, Tagline, type Theme11Mood } from './shared.js';
import { T11EChart, t11GraphOption } from './t11echart.js';

export interface Theme11ChartGraphV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  categories?: (string | { text?: string })[];
  nodes?: { name: string; category?: number; value?: string; symbolSize?: string }[];
  links?: { source: string; target: string }[];
  insightTitle?: string;
  insightMetricValue?: string;
  insightMetricLabel?: string;
  insightItems?: { label: string; value: string; sub?: string; tone?: string }[];
  insightNote?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartGraphV1Meta: LayoutMeta = {
  id: 'theme11_chart_graph_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 关系图',
  description: '力导向关系网络，支持多类目着色',
  needsMedia: false,
  tags: ['chart', 'graph', 'network', 'light-stream'],
  contentShape: 'graph',
};

export const theme11ChartGraphV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'NETWORK' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '核心关系网络' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '节点大小代表影响力，连线代表关联强度' },
    { key: 'categories', label: '类目', type: 'array', maxItems: 6, defaultValue: ['产品', '技术', '市场'], itemSchema: [{ key: 'item', label: '类目名', type: 'text' }] },
    {
      key: 'nodes',
      label: '节点',
      type: 'array',
      maxItems: 24,
      defaultValue: [
        { name: 'AI 引擎', category: 0, value: '80', symbolSize: '28' },
        { name: '编辑器', category: 0, value: '60', symbolSize: '22' },
        { name: '数据看板', category: 0, value: '55', symbolSize: '20' },
        { name: '模型训练', category: 1, value: '70', symbolSize: '24' },
        { name: '推理服务', category: 1, value: '65', symbolSize: '22' },
        { name: '品牌传播', category: 2, value: '50', symbolSize: '18' },
        { name: '销售线索', category: 2, value: '45', symbolSize: '16' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'category', label: '类目索引', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'symbolSize', label: '大小', type: 'text' },
      ],
    },
    {
      key: 'links',
      label: '连线',
      type: 'array',
      maxItems: 30,
      defaultValue: [
        { source: 'AI 引擎', target: '编辑器' },
        { source: 'AI 引擎', target: '数据看板' },
        { source: '模型训练', target: '推理服务' },
        { source: '编辑器', target: '推理服务' },
        { source: '数据看板', target: '销售线索' },
        { source: '品牌传播', target: '销售线索' },
        { source: 'AI 引擎', target: '模型训练' },
      ],
      itemSchema: [
        { key: 'source', label: '起点', type: 'text' },
        { key: 'target', label: '终点', type: 'text' },
      ],
    },
    ...chartInsightSchema({
      title: '网络指标 / METRICS',
      metricValue: '7',
      metricLabel: '关键节点 / NODES',
      items: [
        { label: '平均度数', value: '2.8', sub: 'AVG', tone: 'accent' },
        { label: '最大连通', value: '3', sub: 'MAX', tone: 'violet' },
      ],
      note: '→ 产品与技术节点高度耦合，需加强市场侧连接。',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11ChartGraphV1(props: Theme11ChartGraphV1Props): ReactNode {
  const { title, subtitle, eyebrow, categories = [], nodes = [], links = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const hasInsight = !!(insightTitle || insightMetricValue || (insightItems && insightItems.length) || insightNote);
  const cats = categories.map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? ''))).filter(Boolean);
  const safeNodes = nodes.map((n) => ({
    name: n.name ?? '',
    category: Math.max(0, Math.min(cats.length - 1, Number(n.category ?? 0) || 0)),
    value: Number(n.value ?? 0),
    symbolSize: Math.max(8, Number(n.symbolSize ?? 16) || 16),
  }));
  const safeLinks = links.map((l) => ({ source: l.source ?? '', target: l.target ?? '' }));
  const option = t11GraphOption({ categories: cats, nodes: safeNodes, links: safeLinks });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-graph">
      <div className="lp-theme11-chart-head">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-chart-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chart-subtitle">{subtitle}</EditableField>}
      </div>
      <div className={`lp-theme11-chart-body lp-rise ${hasInsight ? 'lp-theme11-chart-with-insight' : ''}`}>
        <div className="lp-theme11-chart-main">
          <T11EChart option={option} type="graph" />
        </div>
        {hasInsight && (
          <ChartInsightPanel
            title={insightTitle}
            metricValue={insightMetricValue}
            metricLabel={insightMetricLabel}
            items={insightItems}
            note={insightNote}
            slideIdx={s}
            editable={e}
          />
        )}
      </div>
    </Sheet>
  );
}
