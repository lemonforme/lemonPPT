// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 饼图（pie_v1）
 * 情绪：ember | 骨架：chart-canvas | 角色：chart
 * 单序列占比饼图（全扇区）；echarts 渲染。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { parseItems } from './chartkit.js';
import { T10EChart, pieOption } from './t10echart.js';

export interface Theme10PieV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: { name?: string; value?: unknown }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10PieV1Meta: LayoutMeta = {
  id: 'theme10_pie_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 饼图',
  description: '单序列占比饼图（全扇区）',
  needsMedia: false,
  tags: ['pie', 'part-of-whole', 'gold-index', 'ember', 'chart'],
  contentShape: 'pie',
};

export const theme10PieV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '份额分布' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Pie' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '整块，被划分出主次' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '每一扇区都是整体的一部分。最大的那一块，决定了叙事的重心。' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { name: '北美', value: 38 },
        { name: '欧洲', value: 26 },
        { name: '亚太', value: 24 },
        { name: '其他', value: 12 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '份额分布' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '44' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10PieV1(props: Theme10PieV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const items = parseItems(props.items);

  const option = pieOption({ items });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-pie">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={option} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
