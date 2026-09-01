// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 横向柱状图（chart_hbar_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';
import { T11EChart, t11HbarOption, t11ParseVals } from './t11echart.js';

export interface Theme11ChartHbarV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  unit?: string;
  categories?: string[];
  values?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartHbarV1Meta: LayoutMeta = {
  id: 'theme11_chart_hbar_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 横向柱状图',
  description: '横向柱状图，适合排名展示',
  needsMedia: false,
  tags: ['chart', 'hbar', 'light-stream'],
  contentShape: 'hbar',
};

export const theme11ChartHbarV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'RANKING' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '功能使用热度' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '按用户活跃度排序的核心功能' },
    { key: 'unit', label: '单位', type: 'text', defaultValue: 'k' },
    {
      key: 'categories',
      label: '类目',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [{ text: 'AI 生成' }, { text: '协同编辑' }, { text: '版本管理' }, { text: '数据看板' }, { text: '导出分享' }],
      itemSchema: [{ key: 'text', label: '类目名', type: 'text' }],
    },
    { key: 'values', label: '数值(逗号分隔)', type: 'text', defaultValue: '85,72,58,45,33' },
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

export function Theme11ChartHbarV1(props: Theme11ChartHbarV1Props): ReactNode {
  const { eyebrow, title, subtitle, unit, categories = [], values = '', mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const hasInsight = !!(insightTitle || insightMetricValue || (insightItems && insightItems.length) || insightNote);
  const cats = categories.map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? '')));
  const vals = t11ParseVals(values);
  const option = t11HbarOption({ labels: cats, values: vals, unit });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-hbar">
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
