// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 堆叠柱状图（chart_stack_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';
import { T11EChart, t11StackOption, t11ParseVals } from './t11echart.js';

export interface Theme11ChartStackV1Props extends ChartInsightProps {
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

export const theme11ChartStackV1Meta: LayoutMeta = {
  id: 'theme11_chart_stack_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 堆叠柱状图',
  description: '多系列堆叠柱状图',
  needsMedia: false,
  tags: ['chart', 'stack', 'light-stream'],
  contentShape: 'stack',
};

export const theme11ChartStackV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'STACK CHART' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '成本结构拆解' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '研发、市场与运营支出占比' },
    { key: 'unit', label: '单位', type: 'text', defaultValue: '万' },
    {
      key: 'categories',
      label: '类目',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [{ text: 'Q1' }, { text: 'Q2' }, { text: 'Q3' }, { text: 'Q4' }],
      itemSchema: [{ key: 'text', label: '类目名', type: 'text' }],
    },
    {
      key: 'series',
      label: '序列',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { name: '研发', values: '40,45,55,60' },
        { name: '市场', values: '30,35,40,45' },
        { name: '运营', values: '20,22,25,28' },
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

export function Theme11ChartStackV1(props: Theme11ChartStackV1Props): ReactNode {
  const { eyebrow, title, subtitle, unit, categories = [], series = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const hasInsight = !!(insightTitle || insightMetricValue || (insightItems && insightItems.length) || insightNote);
  const cats = categories.map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? '')));
  const safeSeries = (series ?? []).map((sr, i) => ({ name: sr.name ?? `序列 ${i + 1}`, data: t11ParseVals(sr.values) }));
  const option = t11StackOption({ labels: cats, series: safeSeries, unit });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-stack">
      <div className="lp-theme11-chart-head">
        {eyebrow && <Tagline className="lp-rise">{eyebrow}</Tagline>}
        <SectionTitle tone="accent" className="lp-rise"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chart-sub lp-rise">{subtitle}</EditableField>}
      </div>
      <div className={`lp-theme11-chart-body lp-rise ${hasInsight ? 'lp-theme11-chart-with-insight' : ''}`}>
        {hasInsight ? (
          <>
            <div className="lp-theme11-chart-main">
              <T11EChart option={option} type="bar" />
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
          <T11EChart option={option} type="bar" />
        )}
      </div>
    </Sheet>
  );
}
