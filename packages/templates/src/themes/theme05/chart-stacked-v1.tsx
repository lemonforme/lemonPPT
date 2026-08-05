// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05ChartStackedV1Series {
  name: string;
  data: number[];
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05ChartStackedV1Conclusion {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme05ChartStackedV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  type?: 'bar' | 'area';
  labels?: string[];
  series?: Theme05ChartStackedV1Series[];
  unit?: string;
  showConclusion?: boolean;
  conclusion?: Theme05ChartStackedV1Conclusion;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ChartStackedV1Meta: LayoutMeta = {
  id: 'theme05_chart_stacked_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 堆叠图',
  description: '堆叠柱状/面积图 + 右侧结论区',
  needsMedia: false,
  tags: ['chart', 'stacked', 'composition'],
  contentShape: 'stacked-chart',
};

const schemeMap: Record<string, string> = {
  coral: '#E85D4E',
  amber: '#F5A623',
  teal: '#0FA3B1',
  indigo: '#4A58D9',
  violet: '#7C3AED',
};

function schemeColor(scheme?: string): string {
  return schemeMap[scheme || 'coral'] || schemeMap.coral;
}

function seriesColors(): string[] {
  return ['var(--lp-accent)', 'var(--lp-accent-2)', 'var(--lp-accent-cool)', '#E85D4E', '#0FA3B1'];
}

export const theme05ChartStackedV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'COMPOSITION' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '季度资本构成' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '各阶段融资额在不同季度的堆叠分布' },
    {
      key: 'type',
      label: '图表类型',
      type: 'select',
      defaultValue: 'bar',
      options: [
        { value: 'bar', label: '堆叠柱状' },
        { value: 'area', label: '堆叠面积' },
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
      key: 'series',
      label: '数据系列',
      type: 'array',
      minItems: 1,
      maxItems: 5,
      defaultValue: [
        { name: '种子 / 天使', data: [12, 14, 16, 18], scheme: 'coral' },
        { name: 'A 轮', data: [18, 22, 25, 28], scheme: 'amber' },
        { name: 'B 轮', data: [14, 16, 18, 22], scheme: 'teal' },
        { name: 'C 轮及以上', data: [10, 12, 14, 16], scheme: 'indigo' },
      ],
      itemSchema: [
        { key: 'name', label: '系列名', type: 'text', inlineEditable: true },
        {
          key: 'scheme',
          label: '强调色',
          type: 'select',
          defaultValue: 'coral',
          options: [
            { value: 'coral', label: '珊瑚' },
            { value: 'amber', label: '琥珀' },
            { value: 'teal', label: '青绿' },
            { value: 'indigo', label: '靛蓝' },
            { value: 'violet', label: '紫罗兰' },
          ],
        },
        {
          key: 'data',
          label: '数据',
          type: 'array',
          minItems: 1,
          maxItems: 12,
          itemSchema: [{ key: 'item', label: '值', type: 'number', inlineEditable: true }],
        },
      ],
    },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'showConclusion', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'conclusion',
      label: '结论区',
      type: 'object',
      visibleWhen: { key: 'showConclusion', value: true },
      defaultValue: {
        value: '+38%',
        label: 'Q4 环比增长',
        description: '四季度各阶段融资额全面上升，成长期项目贡献最大增量。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

function buildOption(type: 'bar' | 'area', labels: string[], series: Theme05ChartStackedV1Series[]): Record<string, unknown> {
  const categoryData = labels.map((label) => label ?? '');
  const colors = seriesColors();
  const seriesData = series.map((s) => {
    const color = schemeColor(s.scheme);
    const base: Record<string, unknown> = {
      name: s.name,
      type: type === 'bar' ? 'bar' : 'line',
      stack: 'total',
      data: (s.data || []).map((v) => v ?? 0),
      itemStyle: { color },
      emphasis: { focus: 'series' },
      animationDuration: 700,
    };
    if (type === 'area') {
      base.areaStyle = { opacity: 0.25, color };
      base.lineStyle = { width: 2, color };
      base.symbol = 'circle';
      base.symbolSize = 6;
      base.smooth = true;
    } else {
      base.barWidth = labels.length <= 6 ? 36 : 22;
      base.itemStyle = { color, borderRadius: [0, 0, 0, 0] };
    }
    return base;
  });

  return {
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      top: 0,
      right: 0,
      icon: 'roundRect',
      itemWidth: 14,
      itemHeight: 8,
      textStyle: {
        color: 'var(--lp-ink2)',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'var(--lp-font)',
      },
    },
    grid: { top: 44, right: 24, bottom: 52, left: 56, containLabel: false },
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
    series: seriesData,
  };
}

export function Theme05ChartStackedV1(props: Theme05ChartStackedV1Props): ReactNode {
  const { kicker, title, subtitle, type = 'bar', labels = [], series = [], unit, showConclusion = true, conclusion, _slideIdx, _editable } = props;

  const validLabels = labels.slice(0, Math.max(...series.map((s) => (s.data || []).length), 1));
  const validSeries = series
    .filter((s) => s != null && !!s.name)
    .map((s) => ({ ...s, data: (s.data || []).slice(0, validLabels.length) }));
  const hasData = validLabels.length > 0 && validSeries.length > 0;
  const hasConclusion = showConclusion !== false && !!conclusion && (!!conclusion.value || !!conclusion.label || !!conclusion.description);
  const chartType = type === 'area' ? 'line' : type;

  return (
    <div className="lp-slide lp-theme05-chart-stacked">
      <div className="lp-theme05-chart-stacked-main lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-chart-stacked-canvas lp-rise">
          {hasData ? (
            <LpEChart type={chartType} option={buildOption(type, validLabels, validSeries)} className="lp-theme05-chart-stacked-echart" />
          ) : (
            <div className="lp-theme05-chart-stacked-empty">请配置分类与系列数据</div>
          )}
        </div>
      </div>
      <div className="lp-theme05-chart-stacked-aside lp-rise">
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
