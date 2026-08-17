// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 横向排名条（hbar_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 单序列降序排名；峰值香槟金 + 末端数值；echarts 渲染。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, hbarOption } from './t10echart.js';

export interface Theme10HBarV1Item {
  name?: string;
  value?: string | number;
}
export interface Theme10HBarV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: Theme10HBarV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const MAX = 8;

export const theme10HBarV1Meta: LayoutMeta = {
  id: 'theme10_hbar_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 排名条',
  description: '横向排名条形图（降序）',
  needsMedia: false,
  tags: ['hbar', 'rank', 'gold-index', 'aurora', 'chart'],
  contentShape: 'hbar',
};

export const theme10HBarV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '排行榜' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Ranking' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '谁在前面，谁在追赶' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '把数值拉成同一条金线，排名不再是表格里的数字。' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 1,
      maxItems: MAX,
      defaultValue: [
        { name: '沪深300', value: 4120 },
        { name: '标普500', value: 3780 },
        { name: '日经225', value: 3210 },
        { name: '恒生', value: 2640 },
        { name: '富时100', value: 1980 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '排行榜' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '42' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10HBarV1(props: Theme10HBarV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const rows = ((props.items ?? []) as Theme10HBarV1Item[])
    .map((it) => ({ name: it.name ?? '', value: Number(it.value ?? 0) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, MAX);

  const option = hbarOption({ labels: rows.map((r) => r.name), values: rows.map((r) => r.value), peakGold: true });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-hbar">
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
