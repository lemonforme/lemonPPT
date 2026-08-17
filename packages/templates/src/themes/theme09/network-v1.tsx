// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Rgba, t9Tooltip, t9DataLabel, t9Emphasis } from './chart-utils.js';

export interface Theme09NetworkNode {
  name?: string;
  category?: number;
  value?: string | number;
}

export interface Theme09NetworkLink {
  source?: string;
  target?: string;
}

export interface Theme09NetworkV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  nodes?: Theme09NetworkNode[];
  links?: Theme09NetworkLink[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09NetworkV1Meta: LayoutMeta = {
  id: 'theme09_network_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '关系网络',
  description: '力导向节点网络，核心节点朱砂放大，卫星节点专色分族，墨底',
  needsMedia: false,
  tags: ['chart', 'network', 'graph', 'ecosystem'],
  contentShape: 'force-network',
};

export const theme09NetworkV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '生态版图' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'NETWORK' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '31' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '网络' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一个{{核心}}，四组卫星' },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '节点大小代表合作强度，连线代表已落地的协同关系。',
    },
    {
      key: 'nodes',
      label: '节点',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'category', label: '分组序号', type: 'number' },
        { key: 'value', label: '权重', type: 'text' },
      ],
    },
    {
      key: 'links',
      label: '连接',
      type: 'array',
      itemSchema: [
        { key: 'source', label: '起点', type: 'text' },
        { key: 'target', label: '终点', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_NODES: Theme09NetworkNode[] = [
  { name: '中枢平台', category: 0, value: 100 },
  { name: '算力伙伴', category: 1, value: 62 },
  { name: '数据服务', category: 1, value: 48 },
  { name: '模型团队', category: 2, value: 70 },
  { name: '工具生态', category: 2, value: 40 },
  { name: '行业客户', category: 3, value: 58 },
  { name: '渠道商', category: 3, value: 36 },
  { name: '科研院所', category: 4, value: 44 },
  { name: '开源社区', category: 4, value: 52 },
];

const DEFAULT_LINKS: Theme09NetworkLink[] = [
  { source: '中枢平台', target: '算力伙伴' },
  { source: '中枢平台', target: '数据服务' },
  { source: '中枢平台', target: '模型团队' },
  { source: '中枢平台', target: '行业客户' },
  { source: '中枢平台', target: '科研院所' },
  { source: '中枢平台', target: '开源社区' },
  { source: '模型团队', target: '工具生态' },
  { source: '行业客户', target: '渠道商' },
  { source: '算力伙伴', target: '模型团队' },
  { source: '开源社区', target: '工具生态' },
  { source: '数据服务', target: '模型团队' },
];

function buildOption(nodes: Theme09NetworkNode[], links: Theme09NetworkLink[]): Record<string, unknown> {
  const c = t9ChartColors('ink');
  const ns = nodes.length ? nodes : DEFAULT_NODES;
  const ls = links.length ? links : DEFAULT_LINKS;

  const nodeData = ns.map((n, i) => {
    const cat = typeof n.category === 'number' ? n.category : 0;
    const hub = cat === 0;
    const v = t9ParseNumber(n.value) || 40;
    const color = hub ? c.accent : c.series[cat % c.series.length];
    return {
      name: n.name ?? `节点 ${i + 1}`,
      value: v,
      category: cat,
      symbolSize: hub ? 66 : 26 + Math.min(v, 100) * 0.22,
      itemStyle: {
        color,
        borderColor: c.surfaceSolid,
        borderWidth: 2,
        shadowBlur: hub ? 18 : 0,
        shadowColor: t9Rgba(c.accent, 0.45),
      },
      label: t9DataLabel(c, hub ? 'inside' : 'right', {
        distance: 8,
        color: hub ? c.onAccent : c.ink2,
        fontFamily: c.font,
        fontSize: hub ? 14 : 12,
        fontWeight: hub ? 700 : 400,
      }),
    };
  });

  const linkData = ls.map((l) => ({
    source: l.source ?? '',
    target: l.target ?? '',
    lineStyle: { color: t9Rgba(c.ink, 0.28), width: 1.4, curveness: 0.12 },
  }));

  return {
    tooltip: t9Tooltip(c),
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: false,
        draggable: false,
        top: '4%',
        left: '2%',
        right: '14%',
        bottom: '4%',
        data: nodeData,
        links: linkData,
        force: { repulsion: 240, edgeLength: [60, 130], gravity: 0.15, friction: 0.25 },
        emphasis: t9Emphasis(c, { focus: 'adjacency', lineStyle: { width: 3, color: t9Rgba(c.accent, 0.7) } }),
        labelLayout: { hideOverlap: true },
        lineStyle: { color: t9Rgba(c.ink, 0.24), curveness: 0.12 },
      },
    ],
  };
}

export function Theme09NetworkV1(props: Theme09NetworkV1Props): ReactNode {
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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-network">
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
            className="lp-theme09-network-body"
            style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, gap: '8px' }}
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
