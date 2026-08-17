// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 圆填充图（circlepack_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 按面积编码的圆形占比（echarts treemap 近似）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, circlepackOption } from './t10echart.js';

export interface Theme10CirclepackV1Item { label?: string; value?: number | string; }
export interface Theme10CirclepackV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: Theme10CirclepackV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10CirclepackV1Meta: LayoutMeta = {
  id: 'theme10_circlepack_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 圆填充图',
  description: '按面积编码的圆形占比',
  needsMedia: false,
  tags: ['circlepack', 'packing', 'area', 'gold-index', 'aurora', 'chart'],
  contentShape: 'circlepack',
};

export const theme10CirclepackV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '构成与占比' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Pack' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '大环套小环，面积说话' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '圆的面积是它的分量；谁最大，一眼便知。' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 1,
      maxItems: 7,
      defaultValue: [
        { label: '权益', value: 42 },
        { label: '固收', value: 33 },
        { label: '现金', value: 15 },
        { label: '另类', value: 10 },
        { label: '海外', value: 8 },
      ],
      itemSchema: [
        { key: 'label', label: '类目', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '构成与占比' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '69' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10CirclepackV1(props: Theme10CirclepackV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? [])
    .map((it, i) => ({ label: it.label ?? `项 ${i + 1}`, value: Number(it.value ?? 0) }))
    .sort((a, b) => b.value - a.value);
  const data = items.map((it, i) => ({ name: it.label, value: it.value, itemStyle: { color: `var(--lp-series-${(i % 6) + 1})` } }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-circlepack">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={circlepackOption({ items: data })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
