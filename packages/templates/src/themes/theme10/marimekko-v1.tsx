// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 马赛克图（marimekko_v1）
 * 情绪：ember | 骨架：chart-canvas | 角色：chart
 * 宽度×高度的双变量马赛克（echarts custom）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, marimekkoOption } from './t10echart.js';

export interface Theme10MarimekkoV1Item { label?: string; share?: number | string; value?: number | string; }
export interface Theme10MarimekkoV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: Theme10MarimekkoV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10MarimekkoV1Meta: LayoutMeta = {
  id: 'theme10_marimekko_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 马赛克图',
  description: '宽度×高度的双变量马赛克',
  needsMedia: false,
  tags: ['marimekko', 'mosaic', 'variable-width', 'gold-index', 'ember', 'chart'],
  contentShape: 'marimekko',
};

export const theme10MarimekkoV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '结构与平面' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Marimekko' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '宽看份额，高看量级' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '一块的面积，同时装下了它占的多少、和它有多大。' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { label: '消费', share: 30, value: 60 },
        { label: '工业', share: 26, value: 45 },
        { label: '科技', share: 20, value: 80 },
        { label: '金融', share: 14, value: 52 },
        { label: '医药', share: 10, value: 38 },
      ],
      itemSchema: [
        { key: 'label', label: '类目', type: 'text', inlineEditable: true },
        { key: 'share', label: '占比%', type: 'number', inlineEditable: true },
        { key: 'value', label: '量级', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '结构与平面' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '71' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10MarimekkoV1(props: Theme10MarimekkoV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? []).map((it, i) => ({
    label: it.label ?? `项 ${i + 1}`,
    share: Number(it.share ?? 0),
    value: Number(it.value ?? 0),
  }));
  const mkItems = items.map((it) => ({ name: it.label, value: it.share, growth: it.value }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-marimekko">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={marimekkoOption({ items: mkItems })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
