// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 环形图（donut_v1）
 * 情绪：ember | 骨架：chart-canvas | 角色：chart
 * 单序列占比环形图，圆心标注合计；echarts 渲染。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { fmtNum, parseItems } from './chartkit.js';
import { T10EChart, donutOption } from './t10echart.js';

export interface Theme10DonutV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: { name?: string; value?: unknown }[];
  centerLabel?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10DonutV1Meta: LayoutMeta = {
  id: 'theme10_donut_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 环形图',
  description: '单序列占比环形图（圆心合计）',
  needsMedia: false,
  tags: ['donut', 'part-of-whole', 'gold-index', 'ember', 'chart'],
  contentShape: 'donut',
};

export const theme10DonutV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '占比结构' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Donut' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一块蛋糕，被切成几份' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '圆心是总和，环上是份额。先看谁占了最大的一角。' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { name: '权益', value: 42 },
        { name: '固收', value: 28 },
        { name: '另类', value: 18 },
        { name: '现金', value: 12 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'centerLabel', label: '圆心标注', type: 'text', inlineEditable: true, defaultValue: '总计' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '占比结构' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '43' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10DonutV1(props: Theme10DonutV1Props): ReactNode {
  const { section, title, lead, centerLabel, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const items = parseItems(props.items);
  const total = items.reduce((sum, it) => sum + Math.max(it.value, 0), 0) || 1;

  const option = donutOption({ items, centerLabel: fmtNum(total), centerSub: centerLabel });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-donut">
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
