// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 点阵分布图（dotplot_v1）
 * 情绪：obsidian | 骨架：chart-canvas | 角色：chart
 * 单变量点分布对照（echarts lines+scatter）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, dotplotOption } from './t10echart.js';

export interface Theme10DotplotV1Item { label?: string; value?: number | string; }
export interface Theme10DotplotV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: Theme10DotplotV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10DotplotV1Meta: LayoutMeta = {
  id: 'theme10_dotplot_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 点阵分布图',
  description: '单变量点分布对照',
  needsMedia: false,
  tags: ['dotplot', 'distribution', 'lollipop', 'gold-index', 'obsidian', 'chart'],
  contentShape: 'dotplot',
};

export const theme10DotplotV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '分布与对照' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Dotplot' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '每个点，落在一个位置上' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '数值轴上一字排开，谁高谁低，一眼可辨。' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 1,
      maxItems: 10,
      defaultValue: [
        { label: '华东', value: 88 },
        { label: '华北', value: 72 },
        { label: '华南', value: 79 },
        { label: '西南', value: 54 },
        { label: '西北', value: 41 },
        { label: '东北', value: 63 },
      ],
      itemSchema: [
        { key: 'label', label: '类目', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '分布与对照' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '65' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10DotplotV1(props: Theme10DotplotV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? []).map((it, i) => ({ label: it.label ?? `项 ${i + 1}`, value: Number(it.value ?? 0) }));
  const labels = items.map((it) => it.label);
  const values = items.map((it) => it.value);

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-dotplot">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={dotplotOption({ labels, values })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
