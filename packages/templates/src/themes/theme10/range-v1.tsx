// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 区间图（range_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 浮动 min/max 区间带 + 中枢线（echarts bar+scatter）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, rangeOption } from './t10echart.js';

export interface Theme10RangeV1Item {
  label?: string;
  low?: number | string;
  high?: number | string;
  mid?: number | string;
}
export interface Theme10RangeV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  categories?: string[];
  items?: Theme10RangeV1Item[];
  unit?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10RangeV1Meta: LayoutMeta = {
  id: 'theme10_range_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 区间',
  description: '浮动区间带（低-高-中）',
  needsMedia: false,
  tags: ['range', 'band', 'gold-index', 'aurora', 'chart'],
  contentShape: 'range',
};

export const theme10RangeV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '趋势与时间' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Range' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一道带，框住了上下边界' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '带是区间，线是中枢；宽窄即不确定性的呼吸。' },
    {
      key: 'categories',
      label: '类目',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
      itemSchema: [{ key: 'text', label: '类目名', type: 'text', inlineEditable: true }],
    },
    {
      key: 'items',
      label: '区间',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: [
        { label: 'Q1', low: 42, high: 68, mid: 55 },
        { label: 'Q2', low: 48, high: 72, mid: 60 },
        { label: 'Q3', low: 40, high: 65, mid: 52 },
        { label: 'Q4', low: 55, high: 80, mid: 67 },
        { label: 'Q5', low: 50, high: 78, mid: 64 },
        { label: 'Q6', low: 58, high: 85, mid: 71 },
      ],
      itemSchema: [
        { key: 'label', label: '名称', type: 'text', inlineEditable: true },
        { key: 'low', label: '下界', type: 'number', inlineEditable: true },
        { key: 'high', label: '上界', type: 'number', inlineEditable: true },
        { key: 'mid', label: '中枢', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '趋势与时间' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '54' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10RangeV1(props: Theme10RangeV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const cats = (props.categories ?? []).map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? '')));
  const items = (props.items ?? []).map((it, i) => ({
    label: it?.label ?? cats[i] ?? `项 ${i + 1}`,
    low: Number(it?.low ?? 0),
    high: Number(it?.high ?? 0),
    mid: it?.mid === undefined ? undefined : Number(it.mid),
  }));
  const labels = items.map((it) => it.label);
  const ranges = items.map((it) => ({ start: it.low, end: it.high }));
  const mids = items.map((it) => it.mid ?? (it.low + it.high) / 2);

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-range">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={rangeOption({ labels, ranges, mids })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
