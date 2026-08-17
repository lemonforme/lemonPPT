// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 平行坐标图（parallel_v1）
 * 情绪：obsidian | 骨架：chart-canvas | 角色：chart
 * 多变量平行坐标（echarts parallel）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, parallelOption } from './t10echart.js';

export interface Theme10ParallelV1Item { name?: string; v1?: number | string; v2?: number | string; v3?: number | string; }
export interface Theme10ParallelV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  axes?: string[];
  items?: Theme10ParallelV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10ParallelV1Meta: LayoutMeta = {
  id: 'theme10_parallel_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 平行坐标图',
  description: '多变量平行坐标',
  needsMedia: false,
  tags: ['parallel', 'multivariate', 'coordinates', 'gold-index', 'obsidian', 'chart'],
  contentShape: 'parallel',
};

export const theme10ParallelV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '多维与特征' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Parallel' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '把维度摊开，看形态' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '每根轴一个维度，折线穿过去，轮廓就是它的性格。' },
    { key: 'axes', label: '轴名', type: 'array', maxItems: 4, defaultValue: ['规模', '增速', '盈利', '效率'], itemSchema: [{ key: 'item', label: '轴', type: 'text', inlineEditable: true }] },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { name: '甲', v1: 80, v2: 30, v3: 60 },
        { name: '乙', v1: 40, v2: 70, v3: 50 },
        { name: '丙', v1: 65, v2: 55, v3: 35 },
        { name: '丁', v1: 25, v2: 45, v3: 80 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'v1', label: '轴1值', type: 'number', inlineEditable: true },
        { key: 'v2', label: '轴2值', type: 'number', inlineEditable: true },
        { key: 'v3', label: '轴3值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '多维与特征' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '68' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10ParallelV1(props: Theme10ParallelV1Props): ReactNode {
  const { section, title, lead, axes, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const ax = (axes ?? []).map(String);
  const m = Math.max(ax.length, 1);
  const items = (props.items ?? []).map((it) => ({
    vals: [Number(it.v1 ?? 0), Number(it.v2 ?? 0), Number(it.v3 ?? 0)].slice(0, m),
  }));
  const dims = ax.length ? ax : Array.from({ length: m }, (_, i) => `轴${i + 1}`);
  const data = items.map((it) => it.vals);

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-parallel">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={parallelOption({ dims, data })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
