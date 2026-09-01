// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 仪表盘（chart_gauge_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';
import { T11EChart, t11GaugeOption } from './t11echart.js';

export interface Theme11ChartGaugeV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  value?: number;
  max?: number;
  unit?: string;
  label?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartGaugeV1Meta: LayoutMeta = {
  id: 'theme11_chart_gauge_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 仪表盘',
  description: '单指标仪表盘，渐变进度条',
  needsMedia: false,
  tags: ['chart', 'gauge', 'light-stream'],
  contentShape: 'gauge',
};

export const theme11ChartGaugeV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'GAUGE' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '系统健康度' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '实时可用性指标' },
    { key: 'value', label: '当前值', type: 'number', defaultValue: 94 },
    { key: 'max', label: '最大值', type: 'number', defaultValue: 100 },
    { key: 'unit', label: '单位', type: 'text', defaultValue: '%' },
    { key: 'label', label: '中心标签', type: 'text', defaultValue: '可用性' },
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

export function Theme11ChartGaugeV1(props: Theme11ChartGaugeV1Props): ReactNode {
  const { eyebrow, title, subtitle, value = 0, max = 100, unit, label, mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const hasInsight = !!(insightTitle || insightMetricValue || (insightItems && insightItems.length) || insightNote);
  const option = t11GaugeOption({ value: Number(value), max: Number(max), unit, label });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-gauge">
      <div className="lp-theme11-chart-head">
        {eyebrow && <Tagline className="lp-rise">{eyebrow}</Tagline>}
        <SectionTitle tone="accent" className="lp-rise"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chart-sub lp-rise">{subtitle}</EditableField>}
      </div>
      <div className={`lp-theme11-chart-body lp-rise ${hasInsight ? 'lp-theme11-chart-with-insight' : ''}`}>
        {hasInsight ? (
          <>
            <div className="lp-theme11-chart-main">
              <T11EChart option={option} type="gauge" />
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
          <T11EChart option={option} type="gauge" />
        )}
      </div>
    </Sheet>
  );
}
