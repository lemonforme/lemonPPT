// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 面积图（chart_area_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';
import { T11EChart, t11AreaOption, t11ParseVals } from './t11echart.js';

export interface Theme11ChartAreaV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  unit?: string;
  categories?: string[];
  series?: { name?: string; values?: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartAreaV1Meta: LayoutMeta = {
  id: 'theme11_chart_area_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 面积图',
  description: '多系列堆叠面积图',
  needsMedia: false,
  tags: ['chart', 'area', 'light-stream'],
  contentShape: 'area',
};

export const theme11ChartAreaV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'AREA CHART' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '多产品线收入趋势' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '三条核心产品线的月度表现' },
    { key: 'unit', label: '单位', type: 'text', defaultValue: '万' },
    {
      key: 'categories',
      label: '类目',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: [{ text: '1月' }, { text: '2月' }, { text: '3月' }, { text: '4月' }, { text: '5月' }, { text: '6月' }],
      itemSchema: [{ key: 'text', label: '类目名', type: 'text' }],
    },
    {
      key: 'series',
      label: '序列',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { name: 'SaaS', values: '30,45,55,70,85,100' },
        { name: '服务', values: '20,25,30,35,40,48' },
        { name: '许可', values: '15,22,28,36,42,50' },
      ],
      itemSchema: [
        { key: 'name', label: '序列名', type: 'text' },
        { key: 'values', label: '数值(逗号分隔)', type: 'text' },
      ],
    },
    ...chartInsightSchema({
      title: '数据洞察 / INSIGHT',
      metricValue: '—',
      metricLabel: '核心指标 / METRIC',
      items: [],
      note: '',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChartAreaV1(props: Theme11ChartAreaV1Props): ReactNode {
  const { eyebrow, title, subtitle, unit, categories = [], series = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const hasInsight = !!(insightTitle || insightMetricValue || (insightItems && insightItems.length) || insightNote);
  const cats = categories.map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? '')));
  const safeSeries = (series ?? []).map((sr, i) => ({ name: sr.name ?? `序列 ${i + 1}`, data: t11ParseVals(sr.values) }));
  const option = t11AreaOption({ labels: cats, series: safeSeries, unit });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-area">
      <div className="lp-theme11-chart-head">
        {eyebrow && <Tagline className="lp-rise">{eyebrow}</Tagline>}
        <SectionTitle tone="accent" className="lp-rise"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chart-sub lp-rise">{subtitle}</EditableField>}
      </div>
      <div className={`lp-theme11-chart-body lp-rise ${hasInsight ? 'lp-theme11-chart-with-insight' : ''}`}>
        {hasInsight ? (
          <>
            <div className="lp-theme11-chart-main">
              <T11EChart option={option} type="line" />
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
          </>
        ) : (
          <T11EChart option={option} type="line" />
        )}
      </div>
    </Sheet>
  );
}
