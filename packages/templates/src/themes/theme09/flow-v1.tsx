// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 资金流向（flow_v1）
 * 基底：墨 | 骨架：chart-canvas | 图位：—
 *
 * Sankey 流向图：左右端节点标签，流带宽度映射金额，专色渐变流带。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Rgba, t9Tooltip } from './chart-utils.js';

export interface Theme09FlowNode {
  name?: string;
}

export interface Theme09FlowLink {
  source?: string;
  target?: string;
  value?: string | number;
}

export interface Theme09FlowV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  nodes?: Array<Theme09FlowNode | string>;
  links?: Theme09FlowLink[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09FlowV1Meta: LayoutMeta = {
  id: 'theme09_flow_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '资金流向',
  description: 'Sankey 流向图 + 左右端标签 + 专色渐变流带，墨底',
  needsMedia: false,
  tags: ['chart', 'sankey', 'flow', 'finance'],
  contentShape: 'sankey',
};

export const theme09FlowV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '资金流向' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'CAPITAL FLOW' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '10' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '流向' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资金从哪里来，又流向 {{哪些环节}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '流带宽度对应金额规模，单位：亿元。' },
    {
      key: 'nodes',
      label: '节点',
      type: 'array',
      maxItems: 16,
      itemSchema: [{ key: 'name', label: '节点名称', type: 'text' }],
    },
    {
      key: 'links',
      label: '流向',
      type: 'array',
      maxItems: 24,
      itemSchema: [
        { key: 'source', label: '起点节点', type: 'text' },
        { key: 'target', label: '终点节点', type: 'text' },
        { key: 'value', label: '金额', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: '口径：公开披露交易 · 全年累计' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: 'CAPITAL FLOW / 10' },
  ],
};

const DEFAULT_LINKS: Theme09FlowLink[] = [
  { source: '产业资本', target: '基础模型', value: 168 },
  { source: '产业资本', target: '应用中台', value: 96 },
  { source: '政府引导基金', target: '智算中心', value: 132 },
  { source: '政府引导基金', target: '基础模型', value: 54 },
  { source: '市场化基金', target: '应用中台', value: 118 },
  { source: '市场化基金', target: '行业方案', value: 86 },
  { source: '基础模型', target: '算力采购', value: 152 },
  { source: '基础模型', target: '研发投入', value: 70 },
  { source: '智算中心', target: '算力采购', value: 132 },
  { source: '应用中台', target: '交付实施', value: 124 },
  { source: '应用中台', target: '研发投入', value: 90 },
  { source: '行业方案', target: '交付实施', value: 86 },
];

function toNodeNames(nodes: Array<Theme09FlowNode | string>): string[] {
  return nodes
    .map((n) => (typeof n === 'string' ? n : (n?.name ?? '')))
    .map((n) => n.trim())
    .filter(Boolean);
}

function buildOption(links: Theme09FlowLink[], nodeNames: string[]): Record<string, unknown> {
  const c = t9ChartColors('ink');
  const valid = links.filter((l) => !!l.source && !!l.target);
  const derived = Array.from(new Set(valid.flatMap((l) => [String(l.source), String(l.target)])));
  const names = nodeNames.length ? Array.from(new Set([...nodeNames, ...derived])) : derived;

  const data = names.map((name, i) => ({
    name,
    itemStyle: {
      color: c.series[i % c.series.length],
      borderColor: t9Rgba(c.ink, 0.18),
      borderWidth: 1,
    },
  }));

  const linkData = valid.map((l) => ({
    source: String(l.source),
    target: String(l.target),
    value: t9ParseNumber(l.value),
  }));

  return {
    tooltip: t9Tooltip(c, { trigger: 'item', triggerOn: 'mousemove' }),
    series: [
      {
        type: 'sankey',
        layout: 'none',
        left: 8,
        right: 96,
        top: 10,
        bottom: 10,
        nodeWidth: 14,
        nodeGap: 12,
        draggable: false,
        data,
        links: linkData,
        emphasis: { focus: 'adjacency' },
        lineStyle: { color: 'gradient', curveness: 0.52, opacity: 0.42 },
        itemStyle: { borderRadius: 0 },
        label: {
          color: c.ink,
          fontFamily: c.font,
          fontSize: 12.5,
          fontWeight: 600,
          distance: 8,
        },
      },
    ],
  };
}

export function Theme09FlowV1(props: Theme09FlowV1Props): ReactNode {
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

  const linkList = links.length ? links : DEFAULT_LINKS;
  const option = buildOption(linkList, toNodeNames(nodes));

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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-flow">
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto', minHeight: 0 }}>
            {title && renderTitle(title)}
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            <LpEChart type="sankey" option={option} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
