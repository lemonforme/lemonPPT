// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Rgba, t9Tooltip, t9Emphasis } from './chart-utils.js';

export interface Theme09TreemapNode {
  name?: string;
  value?: string | number;
  children?: Theme09TreemapNode[];
}

export interface Theme09TreemapV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  data?: Theme09TreemapNode[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09TreemapV1Meta: LayoutMeta = {
  id: 'theme09_treemap_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '版图矩形树',
  description: '矩形树图，面积映射规模，专色分区，纸底',
  needsMedia: false,
  tags: ['chart', 'treemap', 'hierarchy', 'part-to-whole'],
  contentShape: 'treemap',
};

export const theme09TreemapV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '版图矩形树' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'TREEMAP' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '26' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '版图' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '算力与模型撑起 {{七成版图}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '面积代表该细分方向的年度融资规模，单位：亿元。' },
    {
      key: 'data',
      label: '层级数据',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '分类名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_DATA: Theme09TreemapNode[] = [
  {
    name: '模型层',
    children: [
      { name: '通用大模型', value: 246 },
      { name: '多模态', value: 132 },
      { name: '垂类小模型', value: 78 },
    ],
  },
  {
    name: '算力层',
    children: [
      { name: '智算中心', value: 171 },
      { name: '推理芯片', value: 118 },
      { name: '云调度', value: 64 },
    ],
  },
  {
    name: '应用层',
    children: [
      { name: '企业智能体', value: 104 },
      { name: '具身智能', value: 86 },
      { name: '数据服务', value: 52 },
      { name: '开发工具', value: 38 },
    ],
  },
];

function buildOption(data: Theme09TreemapNode[]): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const tree = data.length ? data : DEFAULT_DATA;

  const decorate = (nodes: Theme09TreemapNode[], depth: number, rootIdx: number): Record<string, unknown>[] =>
    nodes.map((n, i) => {
      const idx = depth === 0 ? i : rootIdx;
      const base = c.series[idx % c.series.length];
      const color = depth === 0 ? base : t9Rgba(base, 0.9 - Math.min(i, 4) * 0.14);
      const node: Record<string, unknown> = {
        name: n.name ?? '',
        itemStyle: { color, borderColor: c.surfaceSolid, borderWidth: depth === 0 ? 3 : 1.5, gapWidth: depth === 0 ? 3 : 1.5 },
      };
      if (n.children && n.children.length) {
        node.children = decorate(n.children, depth + 1, idx);
      } else {
        node.value = t9ParseNumber(n.value);
      }
      return node;
    });

  return {
    tooltip: { ...t9Tooltip(c), formatter: '{b}：{c}' },
    series: [
      {
        type: 'treemap',
        data: decorate(tree, 0, 0),
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        roam: false,
        nodeClick: false,
        leafDepth: 2,
        breadcrumb: { show: false },
        squareRatio: 1.4,
        emphasis: t9Emphasis(c),
        label: {
          show: true,
          position: 'insideTopLeft',
          formatter: '{b}\n{c}',
          color: c.onAccent,
          fontFamily: c.font,
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 20,
          padding: [8, 10, 0, 2],
          overflow: 'break',
        },
        upperLabel: {
          show: true,
          height: 30,
          color: c.onAccent,
          fontFamily: c.fontHeading,
          fontSize: 15,
          fontWeight: 700,
          formatter: '{b}',
        },
        levels: [
          {
            itemStyle: { borderColor: c.surfaceSolid, borderWidth: 3, gapWidth: 3 },
            upperLabel: { show: true },
          },
          {
            itemStyle: { borderColor: c.surfaceSolid, borderWidth: 1.5, gapWidth: 1.5 },
          },
        ],
      },
    ],
  };
}

export function Theme09TreemapV1(props: Theme09TreemapV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    data = [],
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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-treemap">
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
            className="lp-theme09-treemap-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="treemap" option={buildOption(data)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
