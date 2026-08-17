// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 热力图（heat_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 矩阵热力（行×列）；专色→香槟金色阶（echarts heatmap）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, heatOption } from './t10echart.js';

export interface Theme10HeatV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  rows?: string[];
  cols?: string[];
  /** 矩阵：行以 ';' 分隔，行内单元格以 ',' 分隔（行优先） */
  values?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10HeatV1Meta: LayoutMeta = {
  id: 'theme10_heat_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 热力图',
  description: '行×列矩阵热力',
  needsMedia: false,
  tags: ['heat', 'matrix', 'gold-index', 'aurora', 'chart'],
  contentShape: 'heat',
};

export const theme10HeatV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '分布与关系' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Heatmap' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一张网格，把强度铺成了颜色' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '行是类目，列是时段；颜色越暖，强度越高。' },
    {
      key: 'rows',
      label: '行标签',
      type: 'array',
      minItems: 1,
      maxItems: 10,
      defaultValue: ['权益', '固收', '另类', '现金'],
      itemSchema: [{ key: 'text', label: '行名', type: 'text', inlineEditable: true }],
    },
    {
      key: 'cols',
      label: '列标签',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: ['Q1', 'Q2', 'Q3', 'Q4'],
      itemSchema: [{ key: 'text', label: '列名', type: 'text', inlineEditable: true }],
    },
    {
      key: 'values',
      label: '矩阵(行;行…，单元格逗号分隔)',
      type: 'text',
      inlineEditable: true,
      defaultValue: '12,18,15,20; 8,9,11,10; 6,7,5,9; 14,16,13,18',
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '分布与关系' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '52' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10HeatV1(props: Theme10HeatV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const rows = (props.rows ?? []).map((r) => (typeof r === 'string' ? r : String((r as { text?: string })?.text ?? ''))).filter(Boolean);
  const cols = (props.cols ?? []).map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? ''))).filter(Boolean);
  const matrix: number[][] = (props.values ?? '')
    .split(';')
    .map((row) => row.split(',').map((x) => Number(x.trim())).filter((n) => isFinite(n)));
  const data: [number, number, number][] = [];
  matrix.forEach((rowVals, i) => rowVals.forEach((v, j) => data.push([j, i, v])));
  const maxV = data.length ? Math.max(...data.map((d) => d[2]), 1) : 1;

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-heat">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={heatOption({ x: cols, y: rows, data, max: maxV })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
