// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 散点图（chart_scatter_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema,  EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood  } from './shared.js';
import { T11EChart, t11ScatterOption } from './t11echart.js';

export interface Theme11ChartScatterV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  xName?: string;
  yName?: string;
  unit?: string;
  points?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartScatterV1Meta: LayoutMeta = {
  id: 'theme11_chart_scatter_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 散点图',
  description: '二维散点分布',
  needsMedia: false,
  tags: ['chart', 'scatter', 'light-stream'],
  contentShape: 'scatter',
};

export const theme11ChartScatterV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'SCATTER' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '投入产出分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '各项目的投入与收益散点' },
    { key: 'xName', label: 'X轴名', type: 'text', defaultValue: '投入' },
    { key: 'yName', label: 'Y轴名', type: 'text', defaultValue: '产出' },
    { key: 'unit', label: '单位', type: 'text', defaultValue: 'k' },
    { key: 'points', label: '坐标(x,y 用逗号分隔，点多用|分隔)', type: 'text', defaultValue: '12,18|24,36|18,22|30,48|42,55|36,40|50,62|28,30' },
    ...chartInsightSchema({
      title: '分布特征 / DISTRIBUTION',
      metricValue: 'R²=0.82',
      metricLabel: '拟合度 / FIT',
      items: [
        { label: '样本量', value: '24', sub: 'N', tone: 'accent' },
        { label: 'X 均值', value: '58.4', sub: 'AVG', tone: 'violet' },
        { label: 'Y 均值', value: '72.1', sub: 'AVG', tone: 'cyan' }
      ],
      note: '→ X 与 Y 呈现强正相关，趋势稳定。',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChartScatterV1(props: Theme11ChartScatterV1Props): ReactNode {
  const { eyebrow, title, subtitle, xName, yName, unit, points = '', mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const data: [number, number][] = [];
  for (const pt of points.split('|')) {
    const [x, y] = pt.split(',').map((v) => Number(v.trim()));
    if (isFinite(x) && isFinite(y)) data.push([x, y]);
  }
  const option = t11ScatterOption({ points: data, xName, yName, unit });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-scatter">
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
                <T11EChart option={option} type="scatter" />
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
