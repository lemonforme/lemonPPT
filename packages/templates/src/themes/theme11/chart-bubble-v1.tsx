// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 气泡图（chart_bubble_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema,  EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood  } from './shared.js';
import { T11EChart, t11BubbleOption } from './t11echart.js';

export interface Theme11ChartBubbleV1Props extends ChartInsightProps {
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

export const theme11ChartBubbleV1Meta: LayoutMeta = {
  id: 'theme11_chart_bubble_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 气泡图',
  description: '三维气泡散点图',
  needsMedia: false,
  tags: ['chart', 'bubble', 'light-stream'],
  contentShape: 'bubble',
};

export const theme11ChartBubbleV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'BUBBLE' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '市场规模气泡图' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '横轴为增长率，纵轴为利润率，大小为市场规模' },
    { key: 'xName', label: 'X轴名', type: 'text', defaultValue: '增长率' },
    { key: 'yName', label: 'Y轴名', type: 'text', defaultValue: '利润率' },
    { key: 'unit', label: '单位', type: 'text', defaultValue: '%' },
    { key: 'points', label: '坐标(x,y,size 用逗号分隔，点多用|分隔)', type: 'text', defaultValue: '12,18,24|24,36,40|18,22,18|30,48,55|42,55,30|36,40,22|50,62,48|28,30,15' },
    ...chartInsightSchema({
      title: '规模对比 / SCALE',
      metricValue: '3.2x',
      metricLabel: '最大倍数 / MULTIPLE',
      items: [
        { label: '头部气泡', value: '120', sub: 'SIZE', tone: 'accent' },
        { label: '平均气泡', value: '38', sub: 'AVG', tone: 'violet' },
        { label: '中位数', value: '32', sub: 'MED', tone: 'cyan' }
      ],
      note: '→ 头部气泡体积显著高于均值，存在明显集中。',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChartBubbleV1(props: Theme11ChartBubbleV1Props): ReactNode {
  const { eyebrow, title, subtitle, xName, yName, unit, points = '', mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const data: [number, number, number][] = [];
  for (const pt of points.split('|')) {
    const [x, y, z] = pt.split(',').map((v) => Number(v.trim()));
    if (isFinite(x) && isFinite(y) && isFinite(z)) data.push([x, y, z]);
  }
  const option = t11BubbleOption({ points: data, xName, yName, unit });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-bubble">
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
                <T11EChart option={option} type="bubble" />
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
