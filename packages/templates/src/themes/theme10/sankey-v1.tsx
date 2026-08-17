// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 桑基流图（sankey_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 多阶段流向（echarts sankey）：节点高∝流量，流带带宽∝ value。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, sankeyOption } from './t10echart.js';

export interface Theme10SankeyV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  links?: { from?: string; to?: string; value?: number | string }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10SankeyV1Meta: LayoutMeta = {
  id: 'theme10_sankey_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 桑基流图',
  description: '多阶段流向与转化',
  needsMedia: false,
  tags: ['sankey', 'flow', 'funnel', 'gold-index', 'aurora', 'chart'],
  contentShape: 'sankey',
};

export const theme10SankeyV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '流向与转化' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Sankey' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '钱从哪来，又流向了哪里' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '带宽就是体量。一条流带，把转化路径讲得清清楚楚。' },
    {
      key: 'links',
      label: '流',
      type: 'array',
      minItems: 1,
      maxItems: 18,
      defaultValue: [
        { from: '机构', to: '权益', value: 58 },
        { from: '机构', to: '固收', value: 34 },
        { from: '个人', to: '权益', value: 41 },
        { from: '个人', to: '固收', value: 52 },
        { from: '个人', to: '现金', value: 23 },
        { from: '海外', to: '权益', value: 19 },
        { from: '海外', to: '另类', value: 14 },
      ],
      itemSchema: [
        { key: 'from', label: '源', type: 'text', inlineEditable: true },
        { key: 'to', label: '汇', type: 'text', inlineEditable: true },
        { key: 'value', label: '流量', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '流向与转化' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '57' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10SankeyV1(props: Theme10SankeyV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const links = (props.links ?? [])
    .map((l) => ({ source: String(l.from ?? ''), target: String(l.to ?? ''), value: Number(l.value ?? 0) }))
    .filter((l) => l.source && l.target);
  const nodeNames = [...new Set([...links.map((l) => l.source), ...links.map((l) => l.target)])];
  const nodes = nodeNames.map((name) => ({ name }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-sankey">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={sankeyOption({ nodes, links })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
