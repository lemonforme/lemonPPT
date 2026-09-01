// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 旭日图（chart_sunburst_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema,  EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood  } from './shared.js';
import { T11EChart, t11SunburstOption } from './t11echart.js';

export interface Theme11ChartSunburstV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items?: { name: string; value: number; children?: { name: string; value: number }[] }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartSunburstV1Meta: LayoutMeta = {
  id: 'theme11_chart_sunburst_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 旭日图',
  description: '多层环形占比图',
  needsMedia: false,
  tags: ['chart', 'sunburst', 'light-stream'],
  contentShape: 'sunburst',
};

export const theme11ChartSunburstV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'SUNBURST' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '层级构成' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '多层占比的旭日图' },
    {
      key: 'items',
      label: '层级数据',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { name: '云', value: 50, children: [{ name: 'IaaS', value: 30 }, { name: 'PaaS', value: 20 }] },
        { name: '端', value: 30, children: [{ name: 'iOS', value: 18 }, { name: 'Android', value: 12 }] },
        { name: '网', value: 20, children: [{ name: '5G', value: 12 }, { name: 'WiFi', value: 8 }] },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    ...chartInsightSchema({
      title: '层级构成 / COMPOSITION',
      metricValue: '100%',
      metricLabel: '总占比 / TOTAL',
      items: [
        { label: '线上', value: '62%', sub: 'L1', tone: 'accent' },
        { label: '线下', value: '38%', sub: 'L1', tone: 'violet' }
      ],
      note: '→ 线上渠道在整体结构中占主导地位。',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChartSunburstV1(props: Theme11ChartSunburstV1Props): ReactNode {
  const { eyebrow, title, subtitle, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const option = t11SunburstOption({ items });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-sunburst">
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
                <T11EChart option={option} type="sunburst" />
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
