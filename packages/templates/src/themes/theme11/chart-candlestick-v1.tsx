// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · K 线图（chart_candlestick_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema,  EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood  } from './shared.js';
import { T11EChart, t11CandlestickOption } from './t11echart.js';

export interface Theme11ChartCandlestickV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  labels?: string[];
  values?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartCandlestickV1Meta: LayoutMeta = {
  id: 'theme11_chart_candlestick_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 K 线图',
  description: '开盘收盘高低价的蜡烛图',
  needsMedia: false,
  tags: ['chart', 'candlestick', 'light-stream'],
  contentShape: 'candlestick',
};

export const theme11ChartCandlestickV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'CANDLESTICK' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '价格走势' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '最近 7 个交易日的 OHLC 数据' },
    {
      key: 'labels',
      label: '日期',
      type: 'array',
      minItems: 2,
      maxItems: 14,
      defaultValue: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      itemSchema: [{ key: 'item', label: '标签', type: 'text' }],
    },
    { key: 'values', label: 'OHLC(开盘,收盘,最低,最高 用逗号分隔，日用|分隔)', type: 'text', defaultValue: '20,34,10,38|40,35,20,45|33,38,30,48|38,15,10,42|52,48,40,58|48,52,42,62|55,60,48,65' },
    ...chartInsightSchema({
      title: '波动区间 / RANGE',
      metricValue: '+12.5%',
      metricLabel: '区间涨幅 / CHANGE',
      items: [
        { label: '最高', value: '158', sub: 'HIGH', tone: 'green' },
        { label: '最低', value: '124', sub: 'LOW', tone: 'orange' },
        { label: '成交量', value: '2.4M', sub: 'VOL', tone: 'accent' }
      ],
      note: '→ 近期波动率放大，关注突破方向。',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChartCandlestickV1(props: Theme11ChartCandlestickV1Props): ReactNode {
  const { eyebrow, title, subtitle, labels = [], values = '', mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const cats = labels.map((c) => (typeof c === 'string' ? c : String((c as { item?: string })?.item ?? '')));
  const data: [number, number, number, number][] = [];
  for (const day of values.split('|')) {
    const nums = day.split(',').map((v) => Number(v.trim()));
    if (nums.length >= 4) data.push([nums[0], nums[1], nums[2], nums[3]]);
  }
  const option = t11CandlestickOption({ labels: cats, data });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-candlestick">
      <div className="lp-theme11-chart-head">
        {eyebrow && <Tagline className="lp-rise"><EditableField prop="eyebrow" slideIdx={s} editable={e} as="span">{eyebrow}</EditableField></Tagline>}
        <SectionTitle tone="accent" className="lp-rise"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chart-sub lp-rise">{subtitle}</EditableField>}
      </div>
      {(() => {
        const hasInsight = !!(insightTitle || insightMetricValue || (insightItems && insightItems.length) || insightNote);
        return (
          <>
            <div className={`lp-theme11-chart-body lp-rise ${hasInsight ? 'lp-theme11-chart-with-insight' : ''}`}>
              <div className="lp-theme11-chart-main">
                <T11EChart option={option} type="candlestick" />
              </div>
              <ChartInsightPanel
                title={insightTitle}
                metricValue={insightMetricValue}
                metricLabel={insightMetricLabel}
                items={insightItems}
                note={insightNote}
                slideIdx={s}
                editable={e}
              />
            </div>
            {insightNote && !hasInsight && (
              <div className="lp-theme11-chart-note lp-rise">
                <EditableField prop="insightNote" slideIdx={s} editable={e} as="span">{insightNote}</EditableField>
              </div>
            )}
          </>
        );
      })()}
    </Sheet>
  );
}
