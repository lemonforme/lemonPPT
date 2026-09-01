// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 平行坐标图（chart_parallel_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema,  EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood  } from './shared.js';
import { T11EChart, t11ParallelOption } from './t11echart.js';

export interface Theme11ChartParallelV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  dimensions?: string[];
  series?: { name: string; values: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartParallelV1Meta: LayoutMeta = {
  id: 'theme11_chart_parallel_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 平行坐标图',
  description: '多维度平行坐标对比',
  needsMedia: false,
  tags: ['chart', 'parallel', 'light-stream'],
  contentShape: 'parallel',
};

export const theme11ChartParallelV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'PARALLEL' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '多维指标对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '不同方案在多个维度上的表现' },
    {
      key: 'dimensions',
      label: '维度',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: ['性价比', '性能', '稳定性', '易用性', '扩展性'],
      itemSchema: [{ key: 'item', label: '维度名', type: 'text' }],
    },
    {
      key: 'series',
      label: '数据系列',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { name: '方案 A', values: '85,90,78,88,82' },
        { name: '方案 B', values: '70,95,85,75,90' },
        { name: '方案 C', values: '92,72,90,85,70' },
      ],
      itemSchema: [
        { key: 'name', label: '系列名', type: 'text' },
        { key: 'values', label: '数值(逗号分隔)', type: 'text' },
      ],
    },
    ...chartInsightSchema({
      title: '维度极值 / EXTREMES',
      metricValue: '6',
      metricLabel: '维度数 / DIMS',
      items: [
        { label: '收入', value: '92', sub: 'MAX', tone: 'accent' },
        { label: '成本', value: '78', sub: 'MAX', tone: 'violet' },
        { label: '满意度', value: '88', sub: 'MAX', tone: 'cyan' }
      ],
      note: '→ 各维度分布差异显著，需分别制定策略。',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChartParallelV1(props: Theme11ChartParallelV1Props): ReactNode {
  const { eyebrow, title, subtitle, dimensions = [], series = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const dims = dimensions.map((d) => (typeof d === 'string' ? d : String((d as { item?: string })?.item ?? '')));
  const rows = series.map((ser) => {
    const raw = String((ser as { values?: string })?.values ?? '');
    return raw.split(',').map((v) => Number(v.trim()));
  });
  const option = t11ParallelOption({ dimensions: dims, data: rows });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-parallel">
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
                <T11EChart option={option} type="parallel" />
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
