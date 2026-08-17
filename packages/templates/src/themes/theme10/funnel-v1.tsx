// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 漏斗图（funnel_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 逐层收窄的梯形漏斗；echarts 渲染（层内标签 + 数值）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, funnelOption } from './t10echart.js';

export interface Theme10FunnelV1Props {
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

export const theme10FunnelV1Meta: LayoutMeta = {
  id: 'theme10_funnel_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 漏斗图',
  description: '逐层收窄的转化漏斗（层宽 ∝ 数值）',
  needsMedia: false,
  tags: ['funnel', 'gold-index', 'aurora', 'chart'],
  contentShape: 'funnel',
};

export const theme10FunnelV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '转化漏斗' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Funnel' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '每一层的收窄，都是一次被说服或被劝退' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '漏斗不负责解释流失，它只把流失量成可见的坡度。' },
    {
      key: 'items',
      label: '层级',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { label: '访问', value: 100 },
        { label: '留资', value: 64 },
        { label: '加购', value: 38 },
        { label: '下单', value: 21 },
        { label: '复购', value: 9 },
      ],
      itemSchema: [
        { key: 'label', label: '层级名', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '转化漏斗' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '41' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10FunnelV1(props: Theme10FunnelV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? []).map((it, i) => ({ name: it?.label ?? `层 ${i + 1}`, value: Number(it?.value ?? 0) }));

  const option = funnelOption({ items });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-funnel">
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
