// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 折线图（chart_line_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';
import { T11EChart, t11LineOption, t11ParseVals } from './t11echart.js';

export interface Theme11ChartLineV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  unit?: string;
  categories?: string[];
  values?: string;
  area?: boolean;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartLineV1Meta: LayoutMeta = {
  id: 'theme11_chart_line_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 折线图',
  description: '平滑折线图，可开启渐变面积',
  needsMedia: false,
  tags: ['chart', 'line', 'light-stream'],
  contentShape: 'line',
};

export const theme11ChartLineV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'LINE CHART' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '用户增长曲线' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '过去 6 个月活跃用户变化' },
    { key: 'unit', label: '单位', type: 'text', defaultValue: 'k' },
    {
      key: 'categories',
      label: '类目',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: [{ text: '1月' }, { text: '2月' }, { text: '3月' }, { text: '4月' }, { text: '5月' }, { text: '6月' }],
      itemSchema: [{ key: 'text', label: '类目名', type: 'text' }],
    },
    { key: 'values', label: '数值(逗号分隔)', type: 'text', defaultValue: '12,18,25,34,45,58' },
    { key: 'area', label: '显示面积', type: 'boolean', defaultValue: true },
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

export function Theme11ChartLineV1(props: Theme11ChartLineV1Props): ReactNode {
  const { eyebrow, title, subtitle, unit, categories = [], values = '', area = true, mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const hasInsight = !!(insightTitle || insightMetricValue || (insightItems && insightItems.length) || insightNote);
  const cats = categories.map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? '')));
  const vals = t11ParseVals(values);
  const option = t11LineOption({ labels: cats, values: vals, area, unit });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-line">
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
