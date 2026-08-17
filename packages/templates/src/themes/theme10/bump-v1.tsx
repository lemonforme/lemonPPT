// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 排名变迁图（bump_v1）
 * 情绪：obsidian | 骨架：chart-canvas | 角色：chart
 * 名次随时间变化的凹凸图（echarts line）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, bumpOption } from './t10echart.js';

export interface Theme10BumpV1Item { name?: string; r1?: number | string; r2?: number | string; r3?: number | string; r4?: number | string; }
export interface Theme10BumpV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  periodLabels?: string[];
  items?: Theme10BumpV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10BumpV1Meta: LayoutMeta = {
  id: 'theme10_bump_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 排名变迁图',
  description: '名次随时间变化的凹凸图',
  needsMedia: false,
  tags: ['bump', 'ranking', 'line', 'gold-index', 'obsidian', 'chart'],
  contentShape: 'bump',
};

export const theme10BumpV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '排名与格局' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Bump' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '谁在往上爬，谁在往下掉' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '每个点是一个时点，连线是它走过的名次之路。' },
    { key: 'periodLabels', label: '时点名', type: 'array', maxItems: 4, defaultValue: ['Q1', 'Q2', 'Q3', 'Q4'], itemSchema: [{ key: 'item', label: '时点', type: 'text', inlineEditable: true }] },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 1,
      maxItems: 10,
      defaultValue: [
        { name: '甲', r1: 3, r2: 2, r3: 1, r4: 1 },
        { name: '乙', r1: 1, r2: 1, r3: 2, r4: 2 },
        { name: '丙', r1: 2, r3: 3, r2: 3, r4: 3 },
        { name: '丁', r1: 4, r2: 4, r3: 4, r4: 4 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'r1', label: '时点1名次', type: 'number', inlineEditable: true },
        { key: 'r2', label: '时点2名次', type: 'number', inlineEditable: true },
        { key: 'r3', label: '时点3名次', type: 'number', inlineEditable: true },
        { key: 'r4', label: '时点4名次', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '排名与格局' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '63' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10BumpV1(props: Theme10BumpV1Props): ReactNode {
  const { section, title, lead, periodLabels, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const labels = (periodLabels ?? []).map(String);
  const items = (props.items ?? []).map((it, i) => ({
    name: it.name ?? `项 ${i + 1}`,
    ranks: [Number(it.r1 ?? 0), Number(it.r2 ?? 0), Number(it.r3 ?? 0), Number(it.r4 ?? 0)],
  }));
  const series = items.map((it) => ({ name: it.name, data: it.ranks }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-bump">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={bumpOption({ labels, series })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
