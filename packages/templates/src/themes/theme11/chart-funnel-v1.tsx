// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 漏斗图（chart_funnel_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema,  EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood  } from './shared.js';
import { T11EChart, t11FunnelOption, t11ParseItems } from './t11echart.js';

export interface Theme11ChartFunnelV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items?: { name: string; value: number }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartFunnelV1Meta: LayoutMeta = {
  id: 'theme11_chart_funnel_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 漏斗图',
  description: '阶段转化漏斗',
  needsMedia: false,
  tags: ['chart', 'funnel', 'light-stream'],
  contentShape: 'funnel',
};

export const theme11ChartFunnelV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'FUNNEL' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '转化漏斗' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '从曝光到成交的阶段转化' },
    {
      key: 'items',
      label: '漏斗阶段',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: [
        { name: '访问', value: 100 },
        { name: '注册', value: 72 },
        { name: '加购', value: 45 },
        { name: '下单', value: 28 },
        { name: '支付', value: 16 },
      ],
      itemSchema: [
        { key: 'name', label: '阶段名', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    ...chartInsightSchema({
      title: '转化概览 / CONVERSION',
      metricValue: '16%',
      metricLabel: '总体转化率 / RATE',
      items: [
        { label: '访问→注册', value: '72%', sub: 'STEP 1', tone: 'accent' },
        { label: '注册→下单', value: '39%', sub: 'STEP 2', tone: 'violet' },
        { label: '下单→支付', value: '57%', sub: 'STEP 3', tone: 'cyan' }
      ],
      note: '→ 支付环节流失明显，建议优化结账体验。',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChartFunnelV1(props: Theme11ChartFunnelV1Props): ReactNode {
  const { eyebrow, title, subtitle, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const data = t11ParseItems(items as { name?: string; value?: unknown }[]);
  const option = t11FunnelOption({ items: data });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-funnel">
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
                <T11EChart option={option} type="funnel" />
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
