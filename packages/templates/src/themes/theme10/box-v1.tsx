// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 箱线图（box_v1）
 * 情绪：obsidian | 骨架：chart-canvas | 角色：chart
 * 横向箱线（echarts boxplot）：须线(min–max) + 箱体(q1–q3) + 中位线。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, boxOption } from './t10echart.js';

export interface Theme10BoxV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: { label?: string; min?: number; q1?: number; median?: number; q3?: number; max?: number }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10BoxV1Meta: LayoutMeta = {
  id: 'theme10_box_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 箱线图',
  description: '箱线图（最小/四分位/中位/最大）',
  needsMedia: false,
  tags: ['box', 'gold-index', 'obsidian', 'chart'],
  contentShape: 'box',
};

export const theme10BoxV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '分布结构' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Box' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '中位数说的是常态，须线说的是意外' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '一个箱体装得下大多数，两根须线才提醒你极端从未缺席。' },
    {
      key: 'items',
      label: '分组',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { label: 'A 组', min: 12, q1: 24, median: 38, q3: 52, max: 71 },
        { label: 'B 组', min: 18, q1: 30, median: 44, q3: 60, max: 82 },
        { label: 'C 组', min: 9, q1: 20, median: 33, q3: 47, max: 66 },
        { label: 'D 组', min: 22, q1: 35, median: 51, q3: 68, max: 90 },
      ],
      itemSchema: [
        { key: 'label', label: '组名', type: 'text', inlineEditable: true },
        { key: 'min', label: '最小', type: 'number', inlineEditable: true },
        { key: 'q1', label: '下四分位', type: 'number', inlineEditable: true },
        { key: 'median', label: '中位', type: 'number', inlineEditable: true },
        { key: 'q3', label: '上四分位', type: 'number', inlineEditable: true },
        { key: 'max', label: '最大', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '分布结构' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '44' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10BoxV1(props: Theme10BoxV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? []).map((it, i) => ({
    label: it?.label ?? `组 ${i + 1}`,
    min: Number(it?.min ?? 0), q1: Number(it?.q1 ?? 0), median: Number(it?.median ?? 0),
    q3: Number(it?.q3 ?? 0), max: Number(it?.max ?? 0),
  }));
  const labels = items.map((it) => it.label);
  const boxes = items.map((it) => [it.min, it.q1, it.median, it.q3, it.max] as [number, number, number, number, number]);

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-box">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={boxOption({ labels, boxes })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
