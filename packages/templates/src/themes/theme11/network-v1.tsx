// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 网络关系图页（network_v1）
 * 情绪：aurora | 骨架：chart-canvas
 * ECharts 关系图 + 标题 + 图例说明面板。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { T11EChart, t11GraphOption } from './t11echart.js';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11NetworkV1Node {
  name: string;
  category?: number;
  symbolSize?: number;
}

export interface Theme11NetworkV1Link {
  source: string;
  target: string;
}

export interface Theme11NetworkV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  categories?: string[];
  nodes?: Theme11NetworkV1Node[];
  links?: Theme11NetworkV1Link[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11NetworkV1Meta: LayoutMeta = {
  id: 'theme11_network_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 网络关系图页',
  description: '力导向网络关系与节点分组',
  needsMedia: false,
  tags: ['network', 'graph', 'chart-canvas', 'light-stream'],
  contentShape: 'diagram',
};

export const theme11NetworkV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '生态协作网络' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '核心系统与周边模块的连接关系' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'NETWORK' },
    {
      key: 'categories',
      label: '分组',
      type: 'array',
      maxItems: 4,
      defaultValue: ['核心平台', '业务应用', '数据服务', '第三方'],
      itemSchema: [{ key: 'name', label: '名称', type: 'text' }],
    },
    {
      key: 'nodes',
      label: '节点',
      type: 'array',
      maxItems: 20,
      defaultValue: [
        { name: '数据中台', category: 0, symbolSize: 34 },
        { name: 'AI 引擎', category: 0, symbolSize: 30 },
        { name: '用户中心', category: 1, symbolSize: 22 },
        { name: '订单系统', category: 1, symbolSize: 22 },
        { name: '报表平台', category: 2, symbolSize: 20 },
        { name: 'BI 工具', category: 2, symbolSize: 20 },
        { name: '支付网关', category: 3, symbolSize: 18 },
        { name: '短信服务', category: 3, symbolSize: 16 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'category', label: '分组索引', type: 'number' },
        { key: 'symbolSize', label: '大小', type: 'number' },
      ],
    },
    {
      key: 'links',
      label: '连接',
      type: 'array',
      maxItems: 24,
      defaultValue: [
        { source: '数据中台', target: 'AI 引擎' },
        { source: '数据中台', target: '报表平台' },
        { source: 'AI 引擎', target: '用户中心' },
        { source: '用户中心', target: '订单系统' },
        { source: '订单系统', target: '支付网关' },
        { source: 'BI 工具', target: '数据中台' },
        { source: '短信服务', target: '用户中心' },
      ],
      itemSchema: [
        { key: 'source', label: '源节点', type: 'text' },
        { key: 'target', label: '目标节点', type: 'text' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11NetworkV1(props: Theme11NetworkV1Props): ReactNode {
  const { title, subtitle, eyebrow, categories = [], nodes = [], links = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const validCategories = (categories || []).filter((c): c is string => typeof c === 'string').slice(0, 4);
  const validNodes = (nodes || []).slice(0, 20);
  const validLinks = (links || []).slice(0, 24);

  const option = t11GraphOption({
    categories: validCategories,
    nodes: validNodes,
    links: validLinks,
  });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-network lp-theme11-chart-with-insight">
      <div className="lp-theme11-network-main lp-theme11-chart-main">
        <div className="lp-theme11-network-head">
          {eyebrow && <Tagline>{eyebrow}</Tagline>}
          <SectionTitle tone="violet"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
          {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-network-sub">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme11-network-body lp-theme11-chart-body lp-rise">
          <T11EChart option={option} type="graph" />
        </div>
      </div>
      <div className="lp-theme11-network-side lp-theme11-chart-side lp-rise">
        <div className="lp-theme11-chart-side-title">节点分组</div>
        <div className="lp-theme11-network-list">
          {validCategories.map((cat, i) => (
            <Card key={i} className="lp-theme11-network-legend" padding="medium">
              <span className="lp-theme11-network-dot" style={{ background: `var(--lp-series-${(i % 6) + 1})` }} />
              <EditableField prop={`categories.${i}`} slideIdx={s} editable={e} as="span">{cat}</EditableField>
            </Card>
          ))}
        </div>
        <div className="lp-theme11-chart-side-title" style={{ marginTop: 18 }}>连接数</div>
        <div className="lp-theme11-network-stat">{validLinks.length}</div>
      </div>
    </Sheet>
  );
}
