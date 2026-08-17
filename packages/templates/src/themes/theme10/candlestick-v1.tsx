// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · K线图（candlestick_v1）
 * 情绪：obsidian | 骨架：chart-canvas | 角色：chart
 * OHLC 蜡烛（echarts candlestick，A股惯例红涨绿跌）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, candlestickOption } from './t10echart.js';

export interface Theme10CandleItem {
  open?: number | string;
  high?: number | string;
  low?: number | string;
  close?: number | string;
}
export interface Theme10CandlestickV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  categories?: string[];
  items?: Theme10CandleItem[];
  unit?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10CandlestickV1Meta: LayoutMeta = {
  id: 'theme10_candlestick_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 K线',
  description: 'OHLC 蜡烛图',
  needsMedia: false,
  tags: ['candlestick', 'ohlc', 'gold-index', 'obsidian', 'chart'],
  contentShape: 'candlestick',
};

export const theme10CandlestickV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '趋势与时间' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Candlestick' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一根蜡烛，把开收高低封进了同一格' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '红为涨，绿为跌（A股惯例）；影线丈量当日的贪婪与恐慌。' },
    {
      key: 'categories',
      label: '交易日',
      type: 'array',
      minItems: 1,
      maxItems: 16,
      defaultValue: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一'],
      itemSchema: [{ key: 'text', label: '日', type: 'text', inlineEditable: true }],
    },
    {
      key: 'items',
      label: 'K线',
      type: 'array',
      minItems: 1,
      maxItems: 16,
      defaultValue: [
        { open: 100, high: 108, low: 98, close: 105 },
        { open: 105, high: 112, low: 103, close: 109 },
        { open: 109, high: 110, low: 102, close: 103 },
        { open: 103, high: 107, low: 99, close: 101 },
        { open: 101, high: 115, low: 100, close: 113 },
        { open: 113, high: 118, low: 111, close: 116 },
        { open: 116, high: 117, low: 108, close: 109 },
        { open: 109, high: 114, low: 106, close: 112 },
      ],
      itemSchema: [
        { key: 'open', label: '开', type: 'number', inlineEditable: true },
        { key: 'high', label: '高', type: 'number', inlineEditable: true },
        { key: 'low', label: '低', type: 'number', inlineEditable: true },
        { key: 'close', label: '收', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '趋势与时间' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '55' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10CandlestickV1(props: Theme10CandlestickV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const categories = (props.categories ?? []).map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? '')));
  const items = (props.items ?? []).map((it) => ({
    open: Number(it?.open ?? 0),
    high: Number(it?.high ?? 0),
    low: Number(it?.low ?? 0),
    close: Number(it?.close ?? 0),
  }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-candle">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={candlestickOption({ categories, items, unit: props.unit })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
