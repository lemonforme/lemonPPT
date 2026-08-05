// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05ChartV1Insight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme05ChartV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  type?: 'bar' | 'line';
  labels?: string[];
  data?: number[];
  unit?: string;
  showConclusion?: boolean;
  conclusion?: Theme05ChartV1Insight;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ChartV1Meta: LayoutMeta = {
  id: 'theme05_chart_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 光谱图表页',
  description: '柱状/折线趋势图 + 右侧结论区',
  needsMedia: false,
  tags: ['chart', 'bar', 'line', 'spectrum'],
  contentShape: 'generic-chart',
};

export const theme05ChartV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'TREND' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '季度融资额趋势' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '全年四个季度持续上扬' },
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
      label: '分类标签',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      itemSchema: [{ key: 'item', label: '项', type: 'number', inlineEditable: true }],
    },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'showConclusion', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'conclusion',
      label: '结论区',
      type: 'object',
      visibleWhen: { key: 'showConclusion', value: true },
      defaultValue: { value: '+38%', label: '年度同比增长', description: '核心指标连续四个季度保持双位数增长，Q4 受节日营销推动创下新高。' },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

function buildOption(type: 'bar' | 'line', labels: string[], data: number[]): Record<string, unknown> {
  const categoryData = labels.map((label) => label ?? '');
  const max = Math.max(...data, 1);
  const topIndex = data.indexOf(max);

  const seriesData = data.map((value, index) => ({
    value,
    itemStyle: {
      color: index === topIndex ? 'var(--lp-accent)' : 'var(--lp-accent-cool)',
      borderRadius: type === 'bar' ? [4, 4, 0, 0] : undefined,
    },
  }));

  const barSeries: Record<string, unknown> = {
    type: 'bar',
    data: seriesData,
    barWidth: data.length <= 6 ? 44 : 26,
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
    areaStyle: { opacity: 0.12, color: 'var(--lp-accent)' },
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

export function Theme05ChartV1(props: Theme05ChartV1Props): ReactNode {
  const { kicker, title, subtitle, type = 'bar', labels = [], data = [], unit, showConclusion = true, conclusion, _slideIdx, _editable } = props;

  const validLabels = labels.slice(0, data.length);
  const validData = data.slice(0, labels.length);
  const hasData = validLabels.length > 0 && validData.length > 0;
  const hasConclusion = showConclusion !== false && !!conclusion && (!!conclusion.value || !!conclusion.label || !!conclusion.description);

  return (
    <div className="lp-slide lp-theme05-chart">
      <div className="lp-theme05-chart-main lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-chart-canvas">
          {hasData ? (
            <LpEChart
              type={type}
              option={buildOption(type, validLabels, validData)}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-ink3)' }}>
              请在右侧属性面板输入数据
            </div>
          )}
        </div>
      </div>
      <div className="lp-theme05-chart-aside lp-rise">
        {unit && (
          <div className="lp-theme05-card">
            <div className="lp-theme05-card-label">单位</div>
            <div className="lp-theme05-card-value" style={{ fontSize: 'var(--lp-font-size-h3)' }}>{unit}</div>
          </div>
        )}
        {hasConclusion && (
          <div className="lp-theme05-conclusion">
            {conclusion!.value && <div className="lp-theme05-conclusion-value"><EditableField prop="conclusion.value" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.value}</EditableField></div>}
            {conclusion!.label && <div className="lp-theme05-conclusion-label"><EditableField prop="conclusion.label" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.label}</EditableField></div>}
            {conclusion!.description && <div className="lp-theme05-conclusion-description"><EditableField prop="conclusion.description" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.description}</EditableField></div>}
          </div>
        )}
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
