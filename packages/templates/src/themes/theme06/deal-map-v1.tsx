// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06DealMapV1Node {
  name: string;
  category?: number;
  value?: number;
  symbolSize?: number;
}

export interface Theme06DealMapV1Link {
  source?: string;
  target?: string;
  value?: number;
}

export interface Theme06DealMapV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  nodes?: Theme06DealMapV1Node[];
  links?: Theme06DealMapV1Link[];
  conclusion?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06DealMapV1Meta: LayoutMeta = {
  id: 'theme06_deal_map_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 交易地图',
  description: '网络图展示交易关系或资本连接',
  needsMedia: true,
  tags: ['deal', 'map', 'network', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06DealMapV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'DEAL MAP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心交易关系网络' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '投资方、标的公司与战略伙伴的关键连接' },
    {
      key: 'nodes',
      label: '节点',
      type: 'array',
      minItems: 4,
      maxItems: 16,
      defaultValue: [
        { name: '领投基金 A', category: 0, value: 90 },
        { name: '领投基金 B', category: 0, value: 75 },
        { name: '战略 C', category: 1, value: 65 },
        { name: '标的公司 X', category: 2, value: 100 },
        { name: '标的公司 Y', category: 2, value: 80 },
        { name: '标的公司 Z', category: 2, value: 55 },
        { name: '投行 M', category: 3, value: 50 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'category', label: '类别', type: 'number' },
        { key: 'value', label: '大小', type: 'number' },
      ],
    },
    {
      key: 'links',
      label: '连接',
      type: 'array',
      minItems: 3,
      maxItems: 24,
      defaultValue: [
        { source: '领投基金 A', target: '标的公司 X', value: 5 },
        { source: '领投基金 B', target: '标的公司 Y', value: 4 },
        { source: '战略 C', target: '标的公司 X', value: 3 },
        { source: '标的公司 X', target: '标的公司 Y', value: 2 },
        { source: '投行 M', target: '标的公司 Z', value: 2 },
      ],
      itemSchema: [
        { key: 'source', label: '源节点', type: 'text' },
        { key: 'target', label: '目标节点', type: 'text' },
        { key: 'value', label: '权重', type: 'number' },
      ],
    },
    { key: 'conclusion', label: '结论', type: 'textarea', inlineEditable: true, defaultValue: '头部标的公司同时被多家基金与战略方覆盖，交易网络高度集中。' },
  ],
};

function buildOption(nodes: Theme06DealMapV1Node[], links: Theme06DealMapV1Link[]): Record<string, unknown> {
  const categories = ['投资方', '战略方', '标的公司', '中介'];
  return {
    tooltip: {
      backgroundColor: 'var(--lp-surface-solid)',
      borderColor: 'var(--lp-border-strong)',
      textStyle: { color: 'var(--lp-ink)' },
    },
    legend: {
      data: categories,
      top: 0,
      right: 0,
      textStyle: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)' },
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        data: nodes.map((n, index) => ({
          id: String(index),
          name: n.name,
          value: n.value ?? 50,
          symbolSize: n.symbolSize ?? Math.max(30, (n.value ?? 50) * 0.6),
          category: n.category ?? 0,
          label: { show: true, color: 'var(--lp-ink)', fontFamily: 'var(--lp-font)', fontSize: 12 },
          itemStyle: { color: `var(--lp-series-${((n.category ?? 0) % 6) + 1})` },
        })),
        links: links.map((l) => ({
          source: l.source,
          target: l.target,
          value: l.value ?? 1,
          lineStyle: { color: 'var(--lp-edge)', curveness: 0.2, width: Math.max(1, (l.value ?? 1)) },
        })),
        categories: categories.map((name) => ({ name })),
        roam: false,
        force: { repulsion: 280, edgeLength: [60, 120] },
        emphasis: {
          focus: 'adjacency',
          lineStyle: { width: 4, color: 'var(--lp-accent)' },
        },
      },
    ],
  };
}

export function Theme06DealMapV1(props: Theme06DealMapV1Props): ReactNode {
  const { kicker, title, subtitle, nodes = [], links = [], conclusion, _slideIdx, _editable } = props;
  const validNodes = (nodes || []).filter((n): n is Theme06DealMapV1Node => n != null && !!n.name).slice(0, 16);
  const validLinks = (links || []).filter((l): l is Theme06DealMapV1Link => l != null && !!l.source && !!l.target).slice(0, 24);

  return (
    <div className="lp-slide lp-theme06-deal-map">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-deal-map-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-deal-map-body lp-rise">
        <div className="lp-theme06-deal-map-canvas">
          {validNodes.length > 0 && <LpEChart type="graph" option={buildOption(validNodes, validLinks)} />}
        </div>
        {conclusion && (
          <div className="lp-theme06-deal-map-conclusion">
            <EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="p">{conclusion}</EditableField>
          </div>
        )}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
