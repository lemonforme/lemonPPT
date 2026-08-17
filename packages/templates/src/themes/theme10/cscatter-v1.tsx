// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 连接散点图（cscatter_v1）
 * 情绪：obsidian | 骨架：chart-canvas | 角色：chart
 * 有序连接的散点路径（echarts lines+scatter）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, pathScatterOption } from './t10echart.js';

export interface Theme10CscatterV1Point { x?: number | string; y?: number | string; label?: string; }
export interface Theme10CscatterV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  points?: Theme10CscatterV1Point[];
  xLabel?: string;
  yLabel?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10CscatterV1Meta: LayoutMeta = {
  id: 'theme10_cscatter_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 连接散点图',
  description: '有序连接的散点路径',
  needsMedia: false,
  tags: ['cscatter', 'path', 'connected', 'gold-index', 'obsidian', 'chart'],
  contentShape: 'cscatter',
};

export const theme10CscatterV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '路径与过程' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Path' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '点连成线，就是轨迹' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '散点是状态，连线是转移；看它怎么走。' },
    { key: 'xLabel', label: 'X轴名', type: 'text', inlineEditable: true, defaultValue: '投入' },
    { key: 'yLabel', label: 'Y轴名', type: 'text', inlineEditable: true, defaultValue: '产出' },
    {
      key: 'points',
      label: '点',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { x: 12, y: 20, label: '起点' },
        { x: 35, y: 38, label: '试点' },
        { x: 58, y: 52, label: '扩张' },
        { x: 80, y: 70, label: '规模' },
      ],
      itemSchema: [
        { key: 'x', label: 'X', type: 'number', inlineEditable: true },
        { key: 'y', label: 'Y', type: 'number', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '路径与过程' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '70' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10CscatterV1(props: Theme10CscatterV1Props): ReactNode {
  const { section, title, lead, xLabel, yLabel, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const pts = (props.points ?? []).map((p, i) => ({ x: Number(p.x ?? 0), y: Number(p.y ?? 0), label: p.label ?? `点 ${i + 1}` }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-cscatter">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={pathScatterOption({ points: pts, xName: xLabel, yName: yLabel })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
