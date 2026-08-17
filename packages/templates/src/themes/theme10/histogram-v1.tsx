// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 直方图（histogram_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 已分箱频次分布（echarts bar）：圆角渐变柱 + 峰值高亮 + 数值标签。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, barOption } from './t10echart.js';

export interface Theme10HistogramV1Item { label?: string; value?: number | string; }
export interface Theme10HistogramV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: Theme10HistogramV1Item[];
  xLabel?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10HistogramV1Meta: LayoutMeta = {
  id: 'theme10_histogram_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 直方图',
  description: '已分箱频次分布',
  needsMedia: false,
  tags: ['histogram', 'distribution', 'gold-index', 'aurora', 'chart'],
  contentShape: 'histogram',
};

export const theme10HistogramV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '分布与关系' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Histogram' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '落在哪个区间，样本最多' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '柱宽即组距，柱高即频次。一眼看清分布的形状。' },
    { key: 'xLabel', label: '横轴名', type: 'text', inlineEditable: true, defaultValue: '区间' },
    {
      key: 'items',
      label: '箱体',
      type: 'array',
      minItems: 1,
      maxItems: 24,
      defaultValue: [
        { label: '0–10', value: 4 }, { label: '10–20', value: 9 }, { label: '20–30', value: 16 },
        { label: '30–40', value: 23 }, { label: '40–50', value: 31 }, { label: '50–60', value: 27 },
        { label: '60–70', value: 18 }, { label: '70–80', value: 11 }, { label: '80–90', value: 6 },
        { label: '90–100', value: 3 },
      ],
      itemSchema: [
        { key: 'label', label: '区间标签', type: 'text', inlineEditable: true },
        { key: 'value', label: '频次', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '分布与关系' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '53' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10HistogramV1(props: Theme10HistogramV1Props): ReactNode {
  const { section, title, lead, xLabel, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? [])
    .map((it, i) => ({ label: it.label ?? `箱 ${i + 1}`, value: Number(it.value ?? 0) }))
    .slice(0, 24);
  const labels = items.map((it) => it.label);
  const values = items.map((it) => it.value);

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-histogram">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={barOption({ labels, values, unit: xLabel ? ` · ${xLabel}` : '', showLabel: true })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
