// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 山脊线图（ridgeline_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 叠加密度曲线（joyplot）（echarts line+area）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, ridgelineOption } from './t10echart.js';

export interface Theme10RidgelineV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  axis?: string[];
  series?: { name?: string; values?: string }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10RidgelineV1Meta: LayoutMeta = {
  id: 'theme10_ridgeline_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 山脊线',
  description: '叠加密度曲线（joyplot）',
  needsMedia: false,
  tags: ['ridgeline', 'joyplot', 'density', 'gold-index', 'aurora', 'chart'],
  contentShape: 'ridgeline',
};

export const theme10RidgelineV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '趋势与时间' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Ridgeline' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一条条起伏，叠成了山脊' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '每条曲线是一个序列的分布；错落之间，读得出谁更集中、谁更分散。' },
    {
      key: 'axis',
      label: '横轴',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: ['低', '中低', '中', '中高', '高'],
      itemSchema: [{ key: 'text', label: '刻度', type: 'text', inlineEditable: true }],
    },
    {
      key: 'series',
      label: '序列',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { name: '2021', values: '2,5,9,6,3' },
        { name: '2022', values: '3,6,10,7,4' },
        { name: '2023', values: '1,4,7,9,5' },
        { name: '2024', values: '4,7,8,6,2' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'values', label: '密度(逗号分隔)', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '趋势与时间' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '56' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10RidgelineV1(props: Theme10RidgelineV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const axis = (props.axis ?? []).map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? '')));
  const sers = (props.series ?? []).map((sr, i) => ({
    name: sr?.name ?? `序列 ${i + 1}`,
    values: (sr?.values ?? '')
      .split(',')
      .map((x) => Number(x.trim()))
      .filter((n) => isFinite(n)),
  }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-ridge">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={ridgelineOption({ labels: axis, series: sers.map((sr) => ({ name: sr.name, data: sr.values })) })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
