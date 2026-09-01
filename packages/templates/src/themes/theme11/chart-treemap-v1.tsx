// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 矩形树图（chart_treemap_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema,  EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood  } from './shared.js';
import { T11EChart, t11TreemapOption } from './t11echart.js';

export interface Theme11ChartTreemapV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items?: { name: string; value: number }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartTreemapV1Meta: LayoutMeta = {
  id: 'theme11_chart_treemap_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 矩形树图',
  description: '层级矩形面积图，适合占比展示',
  needsMedia: false,
  tags: ['chart', 'treemap', 'light-stream'],
  contentShape: 'treemap',
};

export const theme11ChartTreemapV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'TREEMAP' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '资源分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '按模块占比的矩形树图' },
    {
      key: 'items',
      label: '数据项',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      defaultValue: [
        { name: '研发', value: 420 },
        { name: '市场', value: 280 },
        { name: '运营', value: 190 },
        { name: '产品', value: 150 },
        { name: '设计', value: 110 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    ...chartInsightSchema({
      title: '占比概览 / SHARE',
      metricValue: '1,150',
      metricLabel: '总计 / TOTAL',
      items: [
        { label: '研发', value: '420', sub: '36.5%', tone: 'accent' },
        { label: '市场', value: '280', sub: '24.3%', tone: 'violet' },
        { label: '运营', value: '190', sub: '16.5%', tone: 'cyan' }
      ],
      note: '→ 研发投入占据最大份额，是资源分配的核心。',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChartTreemapV1(props: Theme11ChartTreemapV1Props): ReactNode {
  const { eyebrow, title, subtitle, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const data = items.map((it) => ({ name: it?.name ?? '', value: Number(it?.value ?? 0) }));
  const option = t11TreemapOption({ items: data });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-treemap">
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
                <T11EChart option={option} type="treemap" />
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
