// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 趋势图（trend_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 时间序列：渐变面积 + 折线 + 端点圆点 + 末值标签（区别于 line_v1 的纯折线）。
 * 使用 echarts 渲染（与 theme01–07 统一）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, trendOption } from './t10echart.js';

export interface Theme10TrendV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  kicker?: string;
  categories?: string[];
  /** 序列：逗号分隔数值串 */
  series?: { name?: string; values?: string; color?: string }[];
  unit?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10TrendV1Meta: LayoutMeta = {
  id: 'theme10_trend_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 趋势',
  description: '时间序列趋势（面积+折线）',
  needsMedia: false,
  tags: ['trend', 'timeseries', 'gold-index', 'aurora', 'chart'],
  contentShape: 'timeline',
};

export const theme10TrendV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '趋势与时间' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Trend' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一条曲线，把时间拉成了一道弧' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '面积托住走势，末值点出当下。' },
    {
      key: 'categories',
      label: '时间轴',
      type: 'array',
      minItems: 1,
      maxItems: 16,
      defaultValue: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
      itemSchema: [{ key: 'text', label: '时点', type: 'text', inlineEditable: true }],
    },
    {
      key: 'series',
      label: '序列',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { name: '净值', values: '100,103,101,108,112,109,117,124' },
        { name: '基准', values: '100,101,102,104,105,106,108,110' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'values', label: '数值(逗号分隔)', type: 'text', inlineEditable: true },
        { key: 'color', label: '颜色', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '趋势与时间' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '53' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10TrendV1(props: Theme10TrendV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const cats = (props.categories ?? []).map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? '')));
  const sers = (props.series ?? []).map((sr, i) => ({
    name: sr?.name ?? `序列 ${i + 1}`,
    values: (sr?.values ?? '')
      .split(',')
      .map((x) => Number(x.trim()))
      .filter((n) => isFinite(n)),
    color: sr?.color,
  }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-trend">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={trendOption({ labels: cats, series: sers.map((sr) => ({ name: sr.name, data: sr.values })) })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
