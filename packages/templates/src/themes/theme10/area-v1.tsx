// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 面积图（area_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 单序列面积填充（冰蓝→透明渐变）+ 顶部折线；echarts 渲染。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { parseVals } from './chartkit.js';
import { T10EChart, lineOption } from './t10echart.js';

export interface Theme10AreaV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  categories?: string[];
  series?: { name?: string; values?: string; color?: string }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10AreaV1Meta: LayoutMeta = {
  id: 'theme10_area_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 面积图',
  description: '单序列面积图（渐变填充）',
  needsMedia: false,
  tags: ['area', 'gold-index', 'aurora', 'chart'],
  contentShape: 'area',
};

export const theme10AreaV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '累积' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Area' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '面积之下，是被时间托住的总量' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '把折线下方的空间填上色，总量感就立起来了。' },
    {
      key: 'categories',
      label: '类目',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      defaultValue: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      itemSchema: [{ key: 'text', label: '类目名', type: 'text', inlineEditable: true }],
    },
    {
      key: 'series',
      label: '序列',
      type: 'array',
      minItems: 1,
      maxItems: 1,
      defaultValue: [{ name: '资金流入', values: '30,52,48,71,66,88,95' }],
      itemSchema: [
        { key: 'name', label: '序列名', type: 'text', inlineEditable: true },
        { key: 'values', label: '数值(逗号分隔)', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '累积' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '46' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10AreaV1(props: Theme10AreaV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const cats = (props.categories ?? []).map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? '')));
  const vals = parseVals(props.series?.[0]?.values);

  const option = lineOption({ labels: cats, values: vals, area: true });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-area">
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
