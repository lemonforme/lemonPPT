// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9Rgba, t9ParseNumber, t9Tooltip, t9Emphasis } from './chart-utils.js';

export interface Theme09ChordLink {
  source?: string;
  target?: string;
  value?: string | number;
}

export interface Theme09ChordV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  nodes?: string[];
  links?: Theme09ChordLink[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ChordV1Meta: LayoutMeta = {
  id: 'theme09_chord_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '板块联投弦图',
  description: '圆周弦图，弦用专色半透明叠印，墨底',
  needsMedia: false,
  tags: ['chart', 'network', 'relationship'],
  contentShape: 'chord',
};

export const theme09ChordV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '板块联投' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'SYNDICATION' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '17' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '联动' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资本在板块间{{编织}}成网' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '弦的粗细代表两板块间的联投强度，朱砂为主轴。' },
    { key: 'nodes', label: '板块名称', type: 'array', inlineEditable: true, defaultValue: ['大模型', '算力', '应用', '数据', '芯片'] },
    {
      key: 'links',
      label: '联投关系（source/target/value）',
      type: 'array',
      itemSchema: [
        { key: 'source', label: '源', type: 'text' },
        { key: 'target', label: '目标', type: 'text' },
        { key: 'value', label: '强度', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_LINKS: Theme09ChordLink[] = [
  { source: '大模型', target: '算力', value: 38 },
  { source: '大模型', target: '数据', value: 22 },
  { source: '大模型', target: '芯片', value: 18 },
  { source: '算力', target: '芯片', value: 30 },
  { source: '应用', target: '大模型', value: 26 },
  { source: '应用', target: '数据', value: 20 },
  { source: '数据', target: '芯片', value: 14 },
  { source: '应用', target: '算力', value: 16 },
];

function buildOption(nodes: string[], links: Theme09ChordLink[]): Record<string, unknown> {
  const c = t9ChartColors('ink');
  const ns = nodes.length ? nodes : ['大模型', '算力', '应用', '数据', '芯片'];
  const ls = links.length ? links : DEFAULT_LINKS;
  const nodeData = ns.map((n, i) => ({
    name: n,
    symbolSize: 36 + (i % 3) * 10,
    itemStyle: { color: i === 0 ? c.accent : c.series[i % c.series.length] },
  }));
  const linkData = ls.map((l) => {
    const v = t9ParseNumber(l.value);
    return {
      source: l.source,
      target: l.target,
      value: v,
      lineStyle: { color: t9Rgba(c.accent, 0.5), width: Math.max(2, v / 5), curveness: 0.3 },
    };
  });

  return {
    tooltip: t9Tooltip(c),
    series: [
      {
        type: 'graph',
        layout: 'circular',
        circular: { rotateLabel: true },
        data: nodeData,
        links: linkData,
        lineStyle: { color: 'source', curveness: 0.25 },
        label: { show: true, color: c.ink2, fontFamily: c.font, fontSize: 13 },
        emphasis: t9Emphasis(c, { focus: 'adjacency', lineStyle: { width: 6 } }),
        roam: false,
      },
    ],
  };
}

export function Theme09ChordV1(props: Theme09ChordV1Props): ReactNode {
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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-chord">
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
          <div className="lp-theme09-chord-body">
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chord-sub">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div className="lp-theme09-chord-chart">
              <LpEChart type="graph" option={buildOption(nodes, links)} className="lp-theme09-chord-echart" />
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
