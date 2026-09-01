// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 径向柱状图（chart_radian_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema,  EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood  } from './shared.js';
import { T11EChart, t11ParseVals, t11RadianOption } from './t11echart.js';

export interface Theme11ChartRadianV1Props extends ChartInsightProps {
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

export const theme11ChartRadianV1Meta: LayoutMeta = {
  id: 'theme11_chart_radian_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 径向柱状图',
  description: '极坐标下的环形柱状图',
  needsMedia: false,
  tags: ['chart', 'radian', 'light-stream'],
  contentShape: 'radian',
};

export const theme11ChartRadianV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'RADIAN' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '渠道占比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '各渠道指标的径向对比' },
    { key: 'unit', label: '单位', type: 'text', defaultValue: '%' },
    {
      key: 'labels',
      label: '类目',
      type: 'array',
      minItems: 2,
      maxItems: 10,
      defaultValue: ['搜索', '社媒', '邮件', '直访', '推荐'],
      itemSchema: [{ key: 'item', label: '类目名', type: 'text' }],
    },
    { key: 'values', label: '数值(逗号分隔)', type: 'text', defaultValue: '78,65,42,88,56' },
    ...chartInsightSchema({
      title: '头部类目 / TOP',
      metricValue: '28%',
      metricLabel: '最大占比 / MAX',
      items: [
        { label: '消费电子', value: '28%', sub: 'TOP 1', tone: 'accent' },
        { label: '家居生活', value: '22%', sub: 'TOP 2', tone: 'violet' },
        { label: '运动户外', value: '19%', sub: 'TOP 3', tone: 'cyan' }
      ],
      note: '→ 前三大类目贡献超过六成份额。',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChartRadianV1(props: Theme11ChartRadianV1Props): ReactNode {
  const { eyebrow, title, subtitle, unit, labels = [], values = '', mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const cats = labels.map((c) => (typeof c === 'string' ? c : String((c as { item?: string })?.item ?? '')));
  const vals = t11ParseVals(values);
  const option = t11RadianOption({ labels: cats, values: vals, unit });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-radian">
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
                <T11EChart option={option} type="radian" />
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
