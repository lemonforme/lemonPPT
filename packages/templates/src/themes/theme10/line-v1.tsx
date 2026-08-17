// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 折线趋势图（line_v1）
 * 情绪：obsidian | 骨架：chart-canvas | 角色：chart
 * 多序列折线 + 渐变面积；echarts 渲染。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { parseVals } from './chartkit.js';
import { T10EChart, trendOption } from './t10echart.js';

export interface Theme10LineV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  categories?: string[];
  series?: { name?: string; values?: string; color?: string }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10LineV1Meta: LayoutMeta = {
  id: 'theme10_line_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 折线图',
  description: '多序列折线趋势图',
  needsMedia: false,
  tags: ['line', 'trend', 'gold-index', 'obsidian', 'chart'],
  contentShape: 'line',
};

export const theme10LineV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '趋势' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Trend' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一条线，两种情绪的来回' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '把时间拉成横轴，剩下的交给斜率。' },
    {
      key: 'categories',
      label: '类目',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      defaultValue: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
      itemSchema: [{ key: 'text', label: '类目名', type: 'text', inlineEditable: true }],
    },
    {
      key: 'series',
      label: '序列',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { name: '净值 A', values: '100,108,104,116,122,118,131' },
        { name: '净值 B', values: '100,102,99,107,111,109,115' },
      ],
      itemSchema: [
        { key: 'name', label: '序列名', type: 'text', inlineEditable: true },
        { key: 'values', label: '数值(逗号分隔)', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '趋势' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '44' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10LineV1(props: Theme10LineV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const cats = (props.categories ?? []).map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? '')));
  const series = (props.series ?? []).map((sr, i) => ({ name: sr.name ?? `序列 ${i + 1}`, data: parseVals(sr.values) }));

  const option = trendOption({ labels: cats, series });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-line">
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
