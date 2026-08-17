// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 南丁格尔玫瑰图（rose_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 等角变半径的极坐标面积图（echarts pie roseType:area）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, roseOption } from './t10echart.js';

export interface Theme10RoseV1Item { label?: string; value?: number | string; }
export interface Theme10RoseV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: Theme10RoseV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10RoseV1Meta: LayoutMeta = {
  id: 'theme10_rose_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 南丁格尔玫瑰图',
  description: '等角变半径的极坐标面积图',
  needsMedia: false,
  tags: ['rose', 'polar', 'nightingale', 'gold-index', 'aurora', 'chart'],
  contentShape: 'rose',
};

export const theme10RoseV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '构成与占比' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Rose' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一瓣一世界，半径见轻重' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '面积越大，分量越重；这一圈玫瑰，是结构的可视化。' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { label: '权益', value: 42 },
        { label: '固收', value: 33 },
        { label: '现金', value: 15 },
        { label: '另类', value: 10 },
      ],
      itemSchema: [
        { key: 'label', label: '类目', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '构成与占比' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '64' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10RoseV1(props: Theme10RoseV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? [])
    .map((it, i) => ({ name: it.label ?? `项 ${i + 1}`, value: Number(it.value ?? 0) }))
    .slice(0, 8);

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-rose">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={roseOption({ items })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
