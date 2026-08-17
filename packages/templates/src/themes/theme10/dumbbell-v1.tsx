// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 哑铃对比图（dumbbell_v1）
 * 情绪：obsidian | 骨架：chart-canvas | 角色：chart
 * 两项指标的哑铃对照（echarts lines+scatter）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, dumbbellOption } from './t10echart.js';

export interface Theme10DumbbellV1Item { label?: string; start?: number | string; end?: number | string; }
export interface Theme10DumbbellV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: Theme10DumbbellV1Item[];
  startLabel?: string;
  endLabel?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10DumbbellV1Meta: LayoutMeta = {
  id: 'theme10_dumbbell_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 哑铃对比图',
  description: '两项指标的哑铃对照',
  needsMedia: false,
  tags: ['dumbbell', 'compare', 'gold-index', 'obsidian', 'chart'],
  contentShape: 'dumbbell',
};

export const theme10DumbbellV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '对比与构成' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Dumbbell' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '期初与期末，差的就是故事' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '一颗金、一颗蓝，两点之间的距离就是变化幅度。' },
    { key: 'startLabel', label: '起点名', type: 'text', inlineEditable: true, defaultValue: '期初' },
    { key: 'endLabel', label: '终点名', type: 'text', inlineEditable: true, defaultValue: '期末' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: [
        { label: '能源', start: 42, end: 58 },
        { label: '材料', start: 36, end: 33 },
        { label: '工业', start: 51, end: 64 },
        { label: '消费', start: 47, end: 55 },
        { label: '金融', start: 60, end: 71 },
        { label: '科技', start: 38, end: 49 },
      ],
      itemSchema: [
        { key: 'label', label: '类目', type: 'text', inlineEditable: true },
        { key: 'start', label: '起点值', type: 'number', inlineEditable: true },
        { key: 'end', label: '终点值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '对比与构成' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '51' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10DumbbellV1(props: Theme10DumbbellV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? []).map((it, i) => ({ label: it.label ?? `项 ${i + 1}`, start: Number(it.start ?? 0), end: Number(it.end ?? 0) }));
  const labels = items.map((it) => it.label);
  const a = items.map((it) => it.start);
  const b = items.map((it) => it.end);

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-dumbbell">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={dumbbellOption({ labels, a, b })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
