// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 环形图（chart_donut_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';
import { T11EChart, t11DonutOption, t11ParseItems } from './t11echart.js';

export interface Theme11ChartDonutV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  centerLabel?: string;
  centerSub?: string;
  items?: { name?: string; value?: number }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartDonutV1Meta: LayoutMeta = {
  id: 'theme11_chart_donut_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 环形图',
  description: '彩色环形图，中心可显示汇总值',
  needsMedia: false,
  tags: ['chart', 'donut', 'light-stream'],
  contentShape: 'donut',
};

export const theme11ChartDonutV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'DONUT CHART' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '用户设备分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '访问来源占比分析' },
    { key: 'centerLabel', label: '中心数值', type: 'text', defaultValue: '100%' },
    { key: 'centerSub', label: '中心说明', type: 'text', defaultValue: 'Total' },
    {
      key: 'items',
      label: '数据项',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { name: '桌面端', value: 45 },
        { name: '移动端', value: 35 },
        { name: '平板', value: 12 },
        { name: '其他', value: 8 },
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
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11ChartDonutV1(props: Theme11ChartDonutV1Props): ReactNode {
  const { eyebrow, title, subtitle, centerLabel, centerSub, items = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const hasInsight = !!(insightTitle || insightMetricValue || (insightItems && insightItems.length) || insightNote);
  const safeItems = t11ParseItems(items);
  const option = t11DonutOption({ items: safeItems, centerLabel, centerSub });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-donut">
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
