// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 矩形树图（treemap_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * squarified 矩形树图：面积 ∝ 数值（echarts treemap）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, treemapOption } from './t10echart.js';

export interface Theme10TreemapV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: { label?: string; value?: number }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10TreemapV1Meta: LayoutMeta = {
  id: 'theme10_treemap_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 矩形树图',
  description: '矩形树图（面积 ∝ 数值）',
  needsMedia: false,
  tags: ['treemap', 'gold-index', 'aurora', 'chart'],
  contentShape: 'treemap',
};

export const theme10TreemapV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '结构占比' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Treemap' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '把盘子切成块，哪一块先吃饱一目了然' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '面积不讲比例，它直接讲份量——最大的那块，往往也最该被讨论。' },
    {
      key: 'items',
      label: '区块',
      type: 'array',
      minItems: 3,
      maxItems: 12,
      defaultValue: [
        { label: '权益', value: 38 },
        { label: '固收', value: 27 },
        { label: '现金', value: 14 },
        { label: '另类', value: 11 },
        { label: '海外', value: 7 },
        { label: '商品', value: 3 },
      ],
      itemSchema: [
        { key: 'label', label: '区块名', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '结构占比' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '45' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10TreemapV1(props: Theme10TreemapV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? [])
    .map((it, i) => ({ name: it?.label ?? `区块 ${i + 1}`, value: Number(it?.value ?? 0) }))
    .slice(0, 12);
  const data = items.map((it, i) => ({ name: it.name, value: it.value, itemStyle: { color: `var(--lp-series-${(i % 6) + 1})` } }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-treemap">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={treemapOption({ items: data })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
