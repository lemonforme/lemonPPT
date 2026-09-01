// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 热力图（chart_heatmap_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema,  EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood  } from './shared.js';
import { T11EChart, t11HeatmapOption } from './t11echart.js';

export interface Theme11ChartHeatmapV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  xLabels?: string[];
  yLabels?: string[];
  values?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartHeatmapV1Meta: LayoutMeta = {
  id: 'theme11_chart_heatmap_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 热力图',
  description: '二维热力矩阵',
  needsMedia: false,
  tags: ['chart', 'heatmap', 'light-stream'],
  contentShape: 'heatmap',
};

export const theme11ChartHeatmapV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'HEATMAP' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '活跃度热力图' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '不同时间段的用户活跃分布' },
    {
      key: 'xLabels',
      label: 'X轴标签',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      defaultValue: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      itemSchema: [{ key: 'item', label: '标签', type: 'text' }],
    },
    {
      key: 'yLabels',
      label: 'Y轴标签',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: ['早', '中', '晚'],
      itemSchema: [{ key: 'item', label: '标签', type: 'text' }],
    },
    { key: 'values', label: '数值(逗号分隔, X*Y个)', type: 'text', defaultValue: '5,12,18,9,14,8,22,28,15,10,30,35,20,16,25' },
    ...chartInsightSchema({
      title: '热力峰值 / PEAK',
      metricValue: '35',
      metricLabel: '最高值 / MAX',
      items: [
        { label: '周五·晚', value: '35', sub: 'PEAK', tone: 'accent' },
        { label: '周三·中', value: '28', sub: 'HOT', tone: 'orange' },
        { label: '周一·早', value: '22', sub: 'WARM', tone: 'cyan' }
      ],
      note: '→ 周五晚间出现明显高峰，适合重点投放。',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChartHeatmapV1(props: Theme11ChartHeatmapV1Props): ReactNode {
  const { eyebrow, title, subtitle, xLabels = [], yLabels = [], values = '', mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const x = xLabels.map((c) => (typeof c === 'string' ? c : String((c as { item?: string })?.item ?? '')));
  const y = yLabels.map((c) => (typeof c === 'string' ? c : String((c as { item?: string })?.item ?? '')));
  const nums = values.split(',').map((v) => Number(v.trim())).filter((n) => isFinite(n));
  const data: [number, number, number][] = [];
  for (let i = 0; i < nums.length; i++) {
    const xi = i % Math.max(x.length, 1);
    const yi = Math.floor(i / Math.max(x.length, 1));
    data.push([xi, yi, nums[i]]);
  }
  const option = t11HeatmapOption({ x, y, data });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-heatmap">
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
                <T11EChart option={option} type="heatmap" />
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
