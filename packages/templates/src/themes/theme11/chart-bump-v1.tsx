// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 凹凸图（chart_bump_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, EditableField, SectionTitle, Sheet, Tagline, chartInsightSchema, type Theme11Mood } from './shared.js';
import { T11EChart, t11BumpOption } from './t11echart.js';

export interface Theme11ChartBumpV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  labels?: string[];
  series?: { name: string; values: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartBumpV1Meta: LayoutMeta = {
  id: 'theme11_chart_bump_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 凹凸图',
  description: '排名随时间变化的 bump chart',
  needsMedia: false,
  tags: ['chart', 'bump', 'light-stream'],
  contentShape: 'bump',
};

export const theme11ChartBumpV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'BUMP' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '品牌排名变化' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '各品牌在不同季度的排名走势' },
    {
      key: 'labels',
      label: '时间/阶段',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: ['Q1', 'Q2', 'Q3', 'Q4'],
      itemSchema: [{ key: 'item', label: '标签', type: 'text' }],
    },
    {
      key: 'series',
      label: '排名系列',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { name: '品牌 A', values: '3,2,1,1' },
        { name: '品牌 B', values: '1,3,2,3' },
        { name: '品牌 C', values: '2,1,3,2' },
      ],
      itemSchema: [
        { key: 'name', label: '系列名', type: 'text' },
        { key: 'values', label: '排名(逗号分隔)', type: 'text' },
      ],
    },
    ...chartInsightSchema({
      title: '最终排名 / RANK',
      metricValue: '#1',
      metricLabel: '品牌 A 最终领先',
      items: [
        { label: '品牌 A', value: '#1', sub: 'Q4', tone: 'accent' },
        { label: '品牌 C', value: '#2', sub: 'Q4', tone: 'violet' },
        { label: '品牌 B', value: '#3', sub: 'Q4', tone: 'cyan' },
      ],
      note: '→ 品牌 A 在下半年实现反超并保持领先。',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChartBumpV1(props: Theme11ChartBumpV1Props): ReactNode {
  const { eyebrow, title, subtitle, labels = [], series = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const cats = labels.map((c) => (typeof c === 'string' ? c : String((c as { item?: string })?.item ?? '')));
  const rows = series.map((ser) => ({
    name: String((ser as { name?: string })?.name ?? ''),
    ranks: String((ser as { values?: string })?.values ?? '')
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((n) => isFinite(n)),
  }));
  const option = t11BumpOption({ labels: cats, series: rows });
  const hasInsight = !!(insightTitle || insightMetricValue || (insightItems && insightItems.length) || insightNote);

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-bump">
      <div className="lp-theme11-chart-head">
        {eyebrow && <Tagline className="lp-rise"><EditableField prop="eyebrow" slideIdx={s} editable={e} as="span">{eyebrow}</EditableField></Tagline>}
        <SectionTitle tone="accent" className="lp-rise"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chart-sub lp-rise">{subtitle}</EditableField>}
      </div>
      <div className={`lp-theme11-chart-body lp-rise ${hasInsight ? 'lp-theme11-chart-with-insight' : ''}`}>
        <div className="lp-theme11-chart-main">
          <T11EChart option={option} type="bump" />
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
    </Sheet>
  );
}
