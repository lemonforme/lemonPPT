// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04MonthchartV1Insight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme04MonthchartV1LabelItem {
  item?: string;
}

export interface Theme04MonthchartV1DataItem {
  item?: number;
}

export interface Theme04MonthchartV1Props {
  kicker?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  type?: 'bar' | 'line';
  labels?: Theme04MonthchartV1LabelItem[];
  data?: Theme04MonthchartV1DataItem[];
  unit?: string;
  showInsight?: boolean;
  insight?: Theme04MonthchartV1Insight;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04MonthchartV1Meta: LayoutMeta = {
  id: 'theme04_monthchart_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 月度趋势图',
  description: '月度柱状/折线趋势图，适合展示全年走势',
  needsMedia: false,
  tags: ['chart', 'bar', 'line', 'monthly', 'candy'],
  contentShape: 'generic-chart',
};

export const theme04MonthchartV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '月度趋势' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '单位：亿元' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{全年融资}}月度走势' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '下半年显著加速，年末达到峰值' },
    {
      key: 'type',
      label: '图表类型',
      type: 'select',
      defaultValue: 'bar',
      options: [
        { value: 'bar', label: '柱状图' },
        { value: 'line', label: '折线图' },
      ],
    },
    {
      key: 'labels',
      label: '月份标签',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: [
        { item: '1月' }, { item: '2月' }, { item: '3月' }, { item: '4月' },
        { item: '5月' }, { item: '6月' }, { item: '7月' }, { item: '8月' },
        { item: '9月' }, { item: '10月' }, { item: '11月' }, { item: '12月' },
      ],
      itemSchema: [{ key: 'item', label: '月份', type: 'text', inlineEditable: true }],
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: [
        { item: 42 }, { item: 48 }, { item: 56 }, { item: 61 },
        { item: 58 }, { item: 72 }, { item: 85 }, { item: 91 },
        { item: 88 }, { item: 105 }, { item: 132 }, { item: 148 },
      ],
      itemSchema: [{ key: 'item', label: '值', type: 'number', inlineEditable: true }],
    },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿元' },
    { key: 'showInsight', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        value: '+252%',
        label: '年末较年初增长',
        description: 'Q4 连续三月突破百亿，全年呈现前低后高的爆发态势。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-monthchart-title lp-rise">
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

function buildOption(type: 'bar' | 'line', labels: Theme04MonthchartV1LabelItem[], data: Theme04MonthchartV1DataItem[]): Record<string, unknown> {
  const categoryData = labels.map((label) => (typeof label === 'string' ? label : label?.item) ?? '');
  const numericData = data.map((d) => (typeof d === 'number' ? d : d?.item) ?? 0);
  const max = Math.max(...numericData, 1);
  const topIndex = numericData.indexOf(max);

  const seriesData = numericData.map((value, index) => ({
    value,
    itemStyle: {
      color: index === topIndex ? 'var(--lp-accent)' : 'var(--lp-accent-cool)',
      borderRadius: type === 'bar' ? [6, 6, 0, 0] : undefined,
    },
  }));

  const barSeries: Record<string, unknown> = {
    type: 'bar',
    data: seriesData,
    barWidth: data.length <= 6 ? 48 : 24,
    label: {
      show: true,
      position: 'top',
      color: 'var(--lp-ink)',
      fontSize: 12,
      fontWeight: 700,
      fontFamily: 'var(--lp-font-mono)',
    },
    animationDuration: 700,
  };

  const lineSeries: Record<string, unknown> = {
    type: 'line',
    data: seriesData,
    smooth: true,
    symbolSize: 10,
    lineStyle: { width: 4, color: 'var(--lp-accent)' },
    itemStyle: { color: 'var(--lp-accent)' },
    areaStyle: { opacity: 0.15, color: 'var(--lp-accent)' },
    animationDuration: 900,
  };

  return {
    grid: { top: 40, right: 24, bottom: 52, left: 56, containLabel: false },
    xAxis: {
      type: 'category',
      data: categoryData,
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: {
        color: 'var(--lp-ink2)',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'var(--lp-font)',
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    series: [type === 'bar' ? barSeries : lineSeries],
  };
}

export function Theme04MonthchartV1(props: Theme04MonthchartV1Props): ReactNode {
  const { kicker, topRightMeta, title, subtitle, type = 'bar', labels = [], data = [], showInsight = true, insight, _slideIdx, _editable } = props;

  const validLabels = (labels || []).slice(0, data.length);
  const validData = (data || []).slice(0, labels.length);
  const hasData = validLabels.length > 0 && validData.length > 0;
  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  return (
    <div className="lp-slide lp-theme04-monthchart">
      <div className="lp-theme04-monthchart-top lp-rise">
        {(kicker || topRightMeta) && (
          <div className="lp-theme04-tag">
            {kicker && <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>}
            {kicker && topRightMeta && <span>·</span>}
            {topRightMeta && <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="span">{topRightMeta}</EditableField>}
          </div>
        )}
      </div>

      <div className="lp-theme04-monthchart-head lp-rise">
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-monthchart-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-monthchart-body">
        <div className="lp-theme04-monthchart-wrap lp-rise">
          {hasData ? (
            <LpEChart type={type === 'bar' ? 'bar' : 'line'} option={buildOption(type, validLabels, validData)} className="lp-theme04-monthchart-echart" />
          ) : (
            <div className="lp-theme04-monthchart-empty">请配置图表数据</div>
          )}
        </div>

        {hasInsight && (
          <div className="lp-theme04-monthchart-insight lp-theme04-card lp-rise">
            {insight.value && (
              <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-monthchart-insight-value">{insight.value}</EditableField>
            )}
            {insight.label && (
              <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-monthchart-insight-sub">{insight.label}</EditableField>
            )}
            {insight.description && (
              <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-monthchart-insight-desc">{insight.description}</EditableField>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
