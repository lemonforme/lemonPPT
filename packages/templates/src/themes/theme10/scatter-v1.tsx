// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 散点图（scatter_v1）
 * 情绪：obsidian | 骨架：chart-canvas | 角色：chart
 * 双数值轴散点分布；echarts 渲染（冰蓝/香槟金序列点）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { parseXY } from './chartkit.js';
import { T10EChart, scatterOption } from './t10echart.js';

export interface Theme10ScatterV1Props {
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

export const theme10ScatterV1Meta: LayoutMeta = {
  id: 'theme10_scatter_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 散点图',
  description: '多序列散点分布（x/y 数值轴）',
  needsMedia: false,
  tags: ['scatter', 'dot', 'gold-index', 'obsidian', 'chart'],
  contentShape: 'scatter',
};

export const theme10ScatterV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '分布与关系' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Scatter' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '点在二维里，散成一片判断' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '每个点是一例观测；横轴与纵轴各代表一个维度，聚散之间看出结构。' },
    { key: 'xLabel', label: '横轴名', type: 'text', inlineEditable: true, defaultValue: '规模' },
    { key: 'yLabel', label: '纵轴名', type: 'text', inlineEditable: true, defaultValue: '收益' },
    {
      key: 'series',
      label: '序列',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { name: '组合 A', points: '12,30; 18,42; 25,38; 30,55; 22,48; 35,60; 28,52' },
        { name: '组合 B', points: '8,20; 14,28; 20,25; 16,33; 26,40; 12,24' },
      ],
      itemSchema: [
        { key: 'name', label: '序列名', type: 'text', inlineEditable: true },
        { key: 'points', label: '点(x,y 空格分隔)', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '分布与关系' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '48' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10ScatterV1(props: Theme10ScatterV1Props): ReactNode {
  const { section, title, lead, xLabel, yLabel, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const series = (props.series ?? []).map((sr, i) => ({ name: sr.name ?? `序列 ${i + 1}`, points: parseXY(sr?.points) }));
  const merged = series.flatMap((sr) => sr.points);

  const option = scatterOption({ points: merged, xName: xLabel, yName: yLabel });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-scatter">
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
