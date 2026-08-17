// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 斜率图（slope_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 两时点变化的斜率对照（echarts graph+lines）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, slopeOption } from './t10echart.js';

export interface Theme10SlopeV1Item { label?: string; before?: number | string; after?: number | string; }
export interface Theme10SlopeV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: Theme10SlopeV1Item[];
  beforeLabel?: string;
  afterLabel?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10SlopeV1Meta: LayoutMeta = {
  id: 'theme10_slope_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 斜率图',
  description: '两时点变化的斜率对照',
  needsMedia: false,
  tags: ['slope', 'change', 'gold-index', 'aurora', 'chart'],
  contentShape: 'slope',
};

export const theme10SlopeV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '趋势与时间' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Slope' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '谁在爬坡，谁在溜坡' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '一条斜线就是一段变化。斜率越陡，故事越响。' },
    { key: 'beforeLabel', label: '左列名', type: 'text', inlineEditable: true, defaultValue: '去年' },
    { key: 'afterLabel', label: '右列名', type: 'text', inlineEditable: true, defaultValue: '今年' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: [
        { label: '营收', before: 120, after: 168 },
        { label: '利润', before: 22, after: 41 },
        { label: '用户', before: 3.1, after: 5.4 },
        { label: '留存', before: 61, after: 58 },
        { label: '毛利', before: 38, after: 44 },
        { label: '费效', before: 12, after: 9 },
      ],
      itemSchema: [
        { key: 'label', label: '类目', type: 'text', inlineEditable: true },
        { key: 'before', label: '左值', type: 'number', inlineEditable: true },
        { key: 'after', label: '右值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '趋势与时间' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '55' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10SlopeV1(props: Theme10SlopeV1Props): ReactNode {
  const { section, title, lead, beforeLabel, afterLabel, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? []).map((it, i) => ({ label: it.label ?? `项 ${i + 1}`, before: Number(it.before ?? 0), after: Number(it.after ?? 0) }));
  const labels: [string, string] = [beforeLabel ?? '前', afterLabel ?? '后'];
  const pairs = items.map((it) => ({ name: it.label, a: it.before, b: it.after }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-slope">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={slopeOption({ labels, pairs })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
