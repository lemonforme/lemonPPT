// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 气泡图（bubble_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 三维气泡（x / y / 尺寸）；echarts 渲染（冰蓝径向渐变气泡）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { parseXYS } from './chartkit.js';
import { T10EChart, bubbleOption } from './t10echart.js';

export interface Theme10BubbleV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  xLabel?: string;
  yLabel?: string;
  series?: { name?: string; points?: string; color?: string }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10BubbleV1Meta: LayoutMeta = {
  id: 'theme10_bubble_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 气泡图',
  description: '三维气泡（x/y/尺寸）',
  needsMedia: false,
  tags: ['bubble', 'scatter', 'gold-index', 'aurora', 'chart'],
  contentShape: 'bubble',
};

export const theme10BubbleV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '分布与关系' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Bubble' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '第三个维度，被吹成了气泡的大小' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '位置看两维关系，面积看体量。一个气泡同时讲清三件事。' },
    { key: 'xLabel', label: '横轴名', type: 'text', inlineEditable: true, defaultValue: '规模' },
    { key: 'yLabel', label: '纵轴名', type: 'text', inlineEditable: true, defaultValue: '收益' },
    {
      key: 'series',
      label: '序列',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { name: '板块一', points: '12,30,40; 18,42,70; 25,38,55; 30,55,90; 22,48,60' },
        { name: '板块二', points: '8,20,30; 14,28,45; 20,25,38; 16,33,52' },
      ],
      itemSchema: [
        { key: 'name', label: '序列名', type: 'text', inlineEditable: true },
        { key: 'points', label: '点(x,y,size 空格分隔)', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '分布与关系' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '49' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10BubbleV1(props: Theme10BubbleV1Props): ReactNode {
  const { section, title, lead, xLabel, yLabel, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const series = (props.series ?? []).map((sr, i) => ({ name: sr.name ?? `序列 ${i + 1}`, points: parseXYS(sr?.points) }));
  const merged = series.flatMap((sr) => sr.points).map((p) => ({ x: p[0], y: p[1], size: p[2] }));

  const option = bubbleOption({ points: merged, xName: xLabel, yName: yLabel });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-bubble">
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
