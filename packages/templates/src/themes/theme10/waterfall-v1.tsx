// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 瀑布图（waterfall_v1）
 * 情绪：obsidian | 骨架：chart-canvas | 角色：chart
 * 浮动柱：每根柱表示一个增减量，柱顶标注数值；echarts 渲染。
 * 上涨=冰蓝，下跌=红（与 PPTX 一致）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { parseItems } from './chartkit.js';
import { T10EChart, waterfallOption } from './t10echart.js';

export interface Theme10WaterfallV1Props {
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

export const theme10WaterfallV1Meta: LayoutMeta = {
  id: 'theme10_waterfall_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 瀑布图',
  description: '浮动柱瀑布图（增减累积）',
  needsMedia: false,
  tags: ['waterfall', 'bridge', 'gold-index', 'obsidian', 'chart'],
  contentShape: 'waterfall',
};

export const theme10WaterfallV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '变动归因' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Waterfall' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '从起点到终点，钱是怎么流动的' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '每一级是一笔增减。连接线把累计串起来，终点落在何处一目了然。' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: [
        { name: '期初', value: 100 },
        { name: '营收', value: 58 },
        { name: '成本', value: -34 },
        { name: '税费', value: -12 },
        { name: '期末', value: 76 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '变动归因' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '45' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10WaterfallV1(props: Theme10WaterfallV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const items = parseItems(props.items);
  const labels = items.map((it) => it.name);
  const values = items.map((it) => it.value);

  const option = waterfallOption({ labels, values });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-waterfall">
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
