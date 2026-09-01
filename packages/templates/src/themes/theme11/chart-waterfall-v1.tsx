// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 瀑布图（chart_waterfall_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema,  EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood  } from './shared.js';
import { T11EChart, t11ParseVals, t11WaterfallOption } from './t11echart.js';

export interface Theme11ChartWaterfallV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  unit?: string;
  labels?: string[];
  values?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartWaterfallV1Meta: LayoutMeta = {
  id: 'theme11_chart_waterfall_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 瀑布图',
  description: '增减构成瀑布图',
  needsMedia: false,
  tags: ['chart', 'waterfall', 'light-stream'],
  contentShape: 'waterfall',
};

export const theme11ChartWaterfallV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'WATERFALL' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '利润拆解' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '从收入到净利润的增减构成' },
    { key: 'unit', label: '单位', type: 'text', defaultValue: '万' },
    {
      key: 'labels',
      label: '类目',
      type: 'array',
      minItems: 2,
      maxItems: 10,
      defaultValue: ['收入', '成本', '毛利', '研发', '市场', '净利'],
      itemSchema: [{ key: 'item', label: '类目名', type: 'text' }],
    },
    { key: 'values', label: '数值(逗号分隔，负数为减)', type: 'text', defaultValue: '100,-42,58,-18,-12,28' },
    ...chartInsightSchema({
      title: '累计变动 / CHANGE',
      metricValue: '+58',
      metricLabel: '净增长 / NET',
      items: [
        { label: '正向项', value: '+82', sub: 'POS', tone: 'green' },
        { label: '负向项', value: '-24', sub: 'NEG', tone: 'orange' },
        { label: '项目数', value: '6', sub: 'COUNT', tone: 'accent' }
      ],
      note: '→ 下半年增长主要来自 Q3 新品上线。',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChartWaterfallV1(props: Theme11ChartWaterfallV1Props): ReactNode {
  const { eyebrow, title, subtitle, unit, labels = [], values = '', mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const cats = labels.map((c) => (typeof c === 'string' ? c : String((c as { item?: string })?.item ?? '')));
  const vals = t11ParseVals(values);
  const option = t11WaterfallOption({ labels: cats, values: vals, unit });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-waterfall">
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
                <T11EChart option={option} type="waterfall" />
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
