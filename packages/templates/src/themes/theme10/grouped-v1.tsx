// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 分组柱状图（grouped_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 多序列簇状柱，柱顶标注数值；echarts 渲染。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { parseVals } from './chartkit.js';
import { T10EChart, groupedOption } from './t10echart.js';

export interface Theme10GroupedV1Props {
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

export const theme10GroupedV1Meta: LayoutMeta = {
  id: 'theme10_grouped_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 分组柱状图',
  description: '多序列簇状柱状图（柱顶数值）',
  needsMedia: false,
  tags: ['grouped', 'bar', 'gold-index', 'aurora', 'chart'],
  contentShape: 'grouped',
};

export const theme10GroupedV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '对比分析' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Grouped' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三组策略，被同一把尺子量出差距' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '柱顶的数字即权重。我们把序列并排，让每一组的此消彼长一目了然。' },
    {
      key: 'categories',
      label: '类目',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: ['一月', '二月', '三月', '四月'],
      itemSchema: [{ key: 'text', label: '类目名', type: 'text', inlineEditable: true }],
    },
    {
      key: 'series',
      label: '序列',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { name: '稳健', values: '120,180,150,210' },
        { name: '平衡', values: '90,140,160,130' },
        { name: '进取', values: '60,110,95,175' },
      ],
      itemSchema: [
        { key: 'name', label: '序列名', type: 'text', inlineEditable: true },
        { key: 'values', label: '数值(逗号分隔)', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '对比分析' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '41' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10GroupedV1(props: Theme10GroupedV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const cats = (props.categories ?? []).map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? '')));
  const series = (props.series ?? []).map((sr, i) => ({ name: sr.name ?? `序列 ${i + 1}`, values: parseVals(sr.values) }));

  const option = groupedOption({ labels: cats, series: series.map((sr) => ({ name: sr.name, data: sr.values })), showLabel: true });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-grouped">
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
