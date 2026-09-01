// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 雷达图（chart_radar_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';
import { T11EChart, t11RadarOption, t11ParseItems } from './t11echart.js';

export interface Theme11ChartRadarV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  max?: number;
  items?: { name?: string; value?: number }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartRadarV1Meta: LayoutMeta = {
  id: 'theme11_chart_radar_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 雷达图',
  description: '多维度能力雷达图',
  needsMedia: false,
  tags: ['chart', 'radar', 'light-stream'],
  contentShape: 'radar',
};

export const theme11ChartRadarV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'RADAR' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '产品能力模型' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '六维核心能力评估' },
    { key: 'max', label: '最大值', type: 'number', defaultValue: 100 },
    {
      key: 'items',
      label: '维度',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: [
        { name: '性能', value: 88 },
        { name: '体验', value: 76 },
        { name: '安全', value: 92 },
        { name: '扩展', value: 80 },
        { name: '成本', value: 72 },
        { name: '稳定', value: 85 },
      ],
      itemSchema: [
        { key: 'name', label: '维度名', type: 'text' },
        { key: 'value', label: '分值', type: 'number' },
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

export function Theme11ChartRadarV1(props: Theme11ChartRadarV1Props): ReactNode {
  const { eyebrow, title, subtitle, max, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const hasInsight = !!(insightTitle || insightMetricValue || (insightItems && insightItems.length) || insightNote);
  const safeItems = t11ParseItems(items);
  const option = t11RadarOption({ items: safeItems, max });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-radar">
      <div className="lp-theme11-chart-head">
        {eyebrow && <Tagline className="lp-rise">{eyebrow}</Tagline>}
        <SectionTitle tone="accent" className="lp-rise"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chart-sub lp-rise">{subtitle}</EditableField>}
      </div>
      <div className={`lp-theme11-chart-body lp-rise ${hasInsight ? 'lp-theme11-chart-with-insight' : ''}`}>
        {hasInsight ? (
          <>
            <div className="lp-theme11-chart-main">
              <T11EChart option={option} type="radar" />
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
          <T11EChart option={option} type="radar" />
        )}
      </div>
    </Sheet>
  );
}
