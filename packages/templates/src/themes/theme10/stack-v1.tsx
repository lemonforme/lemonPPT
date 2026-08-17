// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 堆叠柱状图（stack_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 多序列堆叠，柱顶标注合计；echarts 渲染。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { parseVals } from './chartkit.js';
import { T10EChart, stackOption } from './t10echart.js';

export interface Theme10StackV1Props {
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

export const theme10StackV1Meta: LayoutMeta = {
  id: 'theme10_stack_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 堆叠柱状图',
  description: '多序列堆叠柱状图（柱顶合计）',
  needsMedia: false,
  tags: ['stack', 'bar', 'gold-index', 'aurora', 'chart'],
  contentShape: 'stack',
};

export const theme10StackV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '结构构成' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Stack' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '总量不变，内部却在重新排座次' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '把每一层的贡献叠起来，既看总和，也看各序列在其中的份量。' },
    {
      key: 'categories',
      label: '类目',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: ['产品', '渠道', '服务', '订阅'],
      itemSchema: [{ key: 'text', label: '类目名', type: 'text', inlineEditable: true }],
    },
    {
      key: 'series',
      label: '序列',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { name: '国内', values: '120,90,140,110' },
        { name: '海外', values: '80,110,70,95' },
        { name: '机构', values: '50,40,60,55' },
      ],
      itemSchema: [
        { key: 'name', label: '序列名', type: 'text', inlineEditable: true },
        { key: 'values', label: '数值(逗号分隔)', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '结构构成' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '42' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10StackV1(props: Theme10StackV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const cats = (props.categories ?? []).map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? '')));
  const series = (props.series ?? []).map((sr, i) => ({ name: sr.name ?? `序列 ${i + 1}`, values: parseVals(sr.values) }));

  const option = stackOption({ labels: cats, series: series.map((sr) => ({ name: sr.name, data: sr.values })) });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-stack">
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
