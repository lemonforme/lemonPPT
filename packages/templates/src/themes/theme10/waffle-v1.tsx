// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 华夫百分比图（waffle_v1）
 * 情绪：ember | 骨架：chart-canvas | 角色：chart
 * 占比的方块网格（一格=1%）（echarts heatmap）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, waffleOption } from './t10echart.js';

export interface Theme10WaffleV1Item { label?: string; value?: number | string; }
export interface Theme10WaffleV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: Theme10WaffleV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10WaffleV1Meta: LayoutMeta = {
  id: 'theme10_waffle_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 华夫百分比图',
  description: '占比的方块网格（一格=1%）',
  needsMedia: false,
  tags: ['waffle', 'percent', 'composition', 'gold-index', 'ember', 'chart'],
  contentShape: 'waffle',
};

export const theme10WaffleV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '对比与构成' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Waffle' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '每一个方块，都是 1%' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '把比例摊成 100 个格子，谁多谁少一眼数得清。' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { label: '权益', value: 38 },
        { label: '固收', value: 41 },
        { label: '现金', value: 13 },
        { label: '另类', value: 8 },
      ],
      itemSchema: [
        { key: 'label', label: '类目', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '对比与构成' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '52' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10WaffleV1(props: Theme10WaffleV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? []).map((it, i) => ({ label: it.label ?? `项 ${i + 1}`, value: Number(it.value ?? 0) }));
  const total = items.reduce((a, it) => a + it.value, 0) || 1;

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-waffle">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={waffleOption({ items: items.map((it) => ({ name: it.label, value: it.value })) })} />
        <div className="lp-theme10-waffle-legend">
          {items.map((it, i) => (
            <div className="lp-t10-legend-item" key={i}>
              <i className="lp-t10-legend-chip" style={{ background: `var(--lp-series-${(i % 6) + 1})` }} />
              <span>{it.label}</span>
              <b>{Math.round((it.value / total) * 100)}%</b>
            </div>
          ))}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
