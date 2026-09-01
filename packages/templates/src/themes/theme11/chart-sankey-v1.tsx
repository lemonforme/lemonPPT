// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 桑基图（chart_sankey_v1）
 * 情绪：daylight | 骨架：chart-canvas | 角色：chart
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ChartInsightPanel, ChartInsightProps, chartInsightSchema,  EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood  } from './shared.js';
import { T11EChart, t11SankeyOption } from './t11echart.js';

export interface Theme11ChartSankeyV1Props extends ChartInsightProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  nodes?: { name: string }[];
  links?: { source: string; target: string; value: number }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChartSankeyV1Meta: LayoutMeta = {
  id: 'theme11_chart_sankey_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 桑基图',
  description: '流量来源去向桑基图',
  needsMedia: false,
  tags: ['chart', 'sankey', 'light-stream'],
  contentShape: 'sankey',
};

export const theme11ChartSankeyV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'SANKEY' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '流量来源与转化' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '用户从来源到成交的流向' },
    {
      key: 'nodes',
      label: '节点',
      type: 'array',
      minItems: 3,
      maxItems: 16,
      defaultValue: [
        { name: '搜索' },
        { name: '社媒' },
        { name: '直接' },
        { name: '首页' },
        { name: '商品页' },
        { name: '加购' },
        { name: '支付' },
      ],
      itemSchema: [{ key: 'name', label: '节点名', type: 'text' }],
    },
    {
      key: 'links',
      label: '连接',
      type: 'array',
      minItems: 2,
      maxItems: 24,
      defaultValue: [
        { source: '搜索', target: '首页', value: 40 },
        { source: '社媒', target: '商品页', value: 30 },
        { source: '直接', target: '首页', value: 20 },
        { source: '首页', target: '商品页', value: 35 },
        { source: '商品页', target: '加购', value: 45 },
        { source: '加购', target: '支付', value: 25 },
      ],
      itemSchema: [
        { key: 'source', label: '来源', type: 'text' },
        { key: 'target', label: '目标', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    ...chartInsightSchema({
      title: '流量分配 / FLOW',
      metricValue: '1,000',
      metricLabel: '总流量 / TOTAL',
      items: [
        { label: '搜索', value: '420', sub: 'SOURCE', tone: 'accent' },
        { label: '社媒', value: '310', sub: 'SOURCE', tone: 'violet' },
        { label: '直接访问', value: '270', sub: 'SOURCE', tone: 'cyan' }
      ],
      note: '→ 搜索渠道是主要流量入口，值得加大投入。',
    }),
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChartSankeyV1(props: Theme11ChartSankeyV1Props): ReactNode {
  const { eyebrow, title, subtitle, nodes = [], links = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const { insightTitle, insightMetricValue, insightMetricLabel, insightItems, insightNote } = props;
  const option = t11SankeyOption({ nodes, links });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-chart-sankey">
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
                <T11EChart option={option} type="sankey" />
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
