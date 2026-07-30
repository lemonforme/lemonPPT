// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04StackedV1Series {
  name: string;
  data: number[];
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04StackedV1Insight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme04StackedV1Props {
  kicker?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  series?: Theme04StackedV1Series[];
  unit?: string;
  showInsight?: boolean;
  insight?: Theme04StackedV1Insight;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04StackedV1Meta: LayoutMeta = {
  id: 'theme04_stacked_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 季度资本构成堆叠图',
  description: '多系列堆叠柱状图，展示季度资本构成变化',
  needsMedia: false,
  tags: ['chart', 'bar', 'stacked', 'quarterly', 'candy'],
  contentShape: 'generic-chart',
};

export const theme04StackedV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '资本构成' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '单位：亿美元' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{季度资本}}构成变化' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '基础设施层占比逐季扩大，应用层稳步增长' },
    {
      key: 'labels',
      label: '季度标签',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [{ item: 'Q1' }, { item: 'Q2' }, { item: 'Q3' }, { item: 'Q4' }],
      itemSchema: [{ key: 'item', label: '季度', type: 'text', inlineEditable: true }],
    },
    {
      key: 'series',
      label: '数据系列',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { name: '基础模型', data: [120, 150, 200, 280], tone: 'green' },
        { name: '基础设施', data: [80, 110, 160, 220], tone: 'blue' },
        { name: '应用层', data: [40, 60, 85, 120], tone: 'pink' },
      ],
      itemSchema: [
        { key: 'name', label: '系列名', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
        {
          key: 'data',
          label: '数据',
          type: 'array',
          maxItems: 8,
          itemSchema: [{ key: 'item', label: '值', type: 'number', inlineEditable: true }],
        },
      ],
    },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'showInsight', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        value: '68%',
        label: '基础设施层 Q4 占比',
        description: '算力与云服务等基建投资在年末占比接近七成，成为资本最密集赛道。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

const toneMap: Record<string, string> = {
  green: 'var(--lp-green)',
  pink: 'var(--lp-pink)',
  blue: 'var(--lp-blue)',
  yellow: 'var(--lp-yellow)',
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-stacked-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

function normalizeSeriesData(series: Theme04StackedV1Series[], labelCount: number): Theme04StackedV1Series[] {
  return series.map((s) => ({
    ...s,
    data: (s.data || []).slice(0, labelCount).concat(Array(Math.max(0, labelCount - (s.data || []).length)).fill(0)),
  }));
}

function buildOption(labels: any[], series: Theme04StackedV1Series[], unit?: string): Record<string, unknown> {
  const categoryData = labels.map((label) => (typeof label === 'string' ? label : label?.item) ?? '');
  const normalized = normalizeSeriesData(series, categoryData.length);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => {
        const lines = params.map((p) => `${p.marker} ${p.seriesName}: ${p.value} ${unit || ''}`);
        return `<div style="font-weight:700;margin-bottom:4px">${params[0]?.name}</div>${lines.join('<br>')}`;
      },
    },
    legend: {
      data: normalized.map((s) => s.name),
      bottom: 0,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: 'var(--lp-ink2)', fontSize: 12, fontWeight: 600 },
    },
    grid: { top: 32, right: 24, bottom: 52, left: 56, containLabel: false },
    xAxis: {
      type: 'category',
      data: categoryData,
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: {
        color: 'var(--lp-ink2)',
        fontSize: 12,
        fontWeight: 600,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', type: 'dashed' } },
      axisLabel: {
        color: 'var(--lp-ink3)',
        fontSize: 11,
        formatter: `{value} ${unit || ''}`,
      },
    },
    series: normalized.map((s) => ({
      name: s.name,
      type: 'bar',
      stack: 'total',
      color: toneMap[s.tone || 'green'],
      data: s.data.map((value) => ({ value, itemStyle: { borderRadius: [0, 0, 0, 0] } })),
      barWidth: 40,
      label: { show: false },
      animationDuration: 700,
    })),
  };
}

export function Theme04StackedV1(props: Theme04StackedV1Props): ReactNode {
  const { kicker, topRightMeta, title, subtitle, labels = [], series = [], unit, showInsight = true, insight, _slideIdx, _editable } = props;
  const validLabels = (labels || []).slice(0, 8);
  const validSeries = (series || []).slice(0, 4);
  const hasData = validLabels.length > 0 && validSeries.length > 0;
  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  return (
    <div className="lp-slide lp-theme04-stacked">
      <div className="lp-theme04-stacked-top lp-rise">
        {(kicker || topRightMeta) && (
          <div className="lp-theme04-tag">
            {kicker && <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>}
            {kicker && topRightMeta && <span>·</span>}
            {topRightMeta && <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="span">{topRightMeta}</EditableField>}
          </div>
        )}
      </div>

      <div className="lp-theme04-stacked-head lp-rise">
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-stacked-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-stacked-body">
        <div className="lp-theme04-stacked-wrap lp-rise">
          {hasData ? (
            <LpEChart type="bar" option={buildOption(validLabels, validSeries, unit)} className="lp-theme04-stacked-echart" />
          ) : (
            <div className="lp-theme04-stacked-empty">请配置图表数据</div>
          )}
        </div>

        {hasInsight && (
          <div className="lp-theme04-stacked-insight lp-theme04-card lp-rise">
            {insight.value && (
              <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-stacked-insight-value">{insight.value}</EditableField>
            )}
            {insight.label && (
              <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-stacked-insight-sub">{insight.label}</EditableField>
            )}
            {insight.description && (
              <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-stacked-insight-desc">{insight.description}</EditableField>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
