// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 饼图（chart_pie_v1）
 * 情绪：sunset | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';
import { T11EChart, t11PieOption, t11ParseItems } from './t11echart.js';

export interface Theme11ChartPieV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items?: { name?: string; value?: number }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartPieV1Meta: LayoutMeta = {
  id: 'theme11_chart_pie_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 饼图',
  description: '彩色饼图',
  needsMedia: false,
  tags: ['chart', 'pie', 'light-stream'],
  contentShape: 'pie',
};

export const theme11ChartPieV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'PIE CHART' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '预算分配' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '年度预算按部门划分' },
    {
      key: 'items',
      label: '数据项',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { name: '研发', value: 40 },
        { name: '市场', value: 25 },
        { name: '销售', value: 20 },
        { name: '运营', value: 15 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    ...chartInsightSchema({
      title: '数据洞察 / INSIGHT',
      metricValue: '—',
      metricLabel: '核心指标 / METRIC',
      items: [],
      note: '',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'sunset' },
  ],
};

export function Theme11ChartPieV1(props: Theme11ChartPieV1Props): ReactNode {
  const { eyebrow, title, subtitle, items = [], mood = 'sunset', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const hasInsight = !!(insightTitle || insightMetricValue || (insightItems && insightItems.length) || insightNote);
  const safeItems = t11ParseItems(items);
  const option = t11PieOption({ items: safeItems });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-pie">
      <div className="lp-theme11-chart-head">
        {eyebrow && <Tagline className="lp-rise">{eyebrow}</Tagline>}
        <SectionTitle tone="accent" className="lp-rise"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chart-sub lp-rise">{subtitle}</EditableField>}
      </div>
      <div className={`lp-theme11-chart-body lp-rise ${hasInsight ? 'lp-theme11-chart-with-insight' : ''}`}>
        {hasInsight ? (
          <>
            <div className="lp-theme11-chart-main">
              <T11EChart option={option} type="pie" />
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
          <T11EChart option={option} type="pie" />
        )}
      </div>
    </Sheet>
  );
}
