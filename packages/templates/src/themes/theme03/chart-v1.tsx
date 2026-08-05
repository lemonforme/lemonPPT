// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme03ChartV1Insight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme03ChartV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  type?: 'bar' | 'line' | 'area' | 'pie';
  labels?: string[];
  data?: number[];
  unit?: string;
  showInsight?: boolean;
  insight?: Theme03ChartV1Insight;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ChartV1Meta: LayoutMeta = {
  id: 'theme03_chart_v1',
  theme: 'theme03',
  role: 'chart',
  displayName: 'Theme 03 编辑风通用图表',
  description: '可切换柱状/折线/面积/饼图的中性灰阶图表',
  needsMedia: false,
  tags: ['chart', 'bar', 'line', 'area', 'pie'],
  contentShape: 'generic-chart',
};

const NEUTRAL_COLORS = [
  'var(--lp-ink3)',
  'var(--lp-ink2)',
  'var(--lp-surface-strong)',
  'var(--lp-border)',
  'var(--lp-stroke)',
];

export const theme03ChartV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '数据概览' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '04' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '年度指标 · 单位：件' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{关键指标}}：全年核心数据回顾' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'type',
      label: '图表类型',
      type: 'select',
      defaultValue: 'bar',
      options: [
        { value: 'bar', label: '柱状图' },
        { value: 'line', label: '折线图' },
        { value: 'area', label: '面积图' },
        { value: 'pie', label: '饼图' },
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
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true },
    { key: 'showInsight', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        value: '+38%',
        label: '年度同比增长',
        description: '核心指标连续四个季度保持双位数增长，Q4 受节日营销推动创下新高。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-chart-v1-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

function buildOption(
  type: 'bar' | 'line' | 'area' | 'pie',
  labels: string[],
  data: number[]
): Record<string, unknown> {
  const max = Math.max(...data, 1);
  const topIndex = data.indexOf(max);

  if (type === 'pie') {
    const pieData = data.map((value, index) => ({
      value,
      name: labels[index] ?? '',
      itemStyle: {
        color: index === topIndex ? 'var(--lp-accent)' : NEUTRAL_COLORS[(index - 1 + NEUTRAL_COLORS.length) % NEUTRAL_COLORS.length],
        borderColor: 'var(--lp-bg)',
        borderWidth: 3,
        borderRadius: 4,
      },
    }));
    return {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, textStyle: { color: 'var(--lp-ink2)' } },
      series: [
        {
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['50%', '48%'],
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: { scale: false },
          data: pieData,
          animationDuration: 800,
        },
      ],
    };
  }

  const categoryData = labels.map((label) => label ?? '');
  const seriesData = data.map((value, index) => ({
    value,
    itemStyle: {
      color: index === topIndex ? 'var(--lp-accent)' : NEUTRAL_COLORS[index % NEUTRAL_COLORS.length],
      borderRadius: type === 'bar' ? [4, 4, 0, 0] : undefined,
    },
  }));

  const lineSeries: Record<string, unknown> = {
    type: 'line',
    data: seriesData,
    smooth: true,
    symbolSize: 8,
    lineStyle: { width: 3, color: 'var(--lp-accent)' },
    itemStyle: { color: 'var(--lp-accent)' },
    areaStyle: type === 'area' ? { opacity: 0.2, color: 'var(--lp-accent)' } : undefined,
    animationDuration: 900,
  };

  const barSeries: Record<string, unknown> = {
    type: 'bar',
    data: seriesData,
    barWidth: data.length <= 6 ? 48 : 28,
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

export function Theme03ChartV1(props: Theme03ChartV1Props): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    type = 'bar',
    labels = [],
    data = [],
    unit,
    showInsight = true,
    insight,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validLabels = labels.slice(0, data.length);
  const validData = data.slice(0, labels.length);
  const hasData = validLabels.length > 0 && validData.length > 0;
  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  return (
    <div className="lp-slide lp-theme03-chart-v1">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-chart-v1-main">
        <div className="lp-theme03-chart-v1-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-v1-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-chart-v1-body">
          <div className="lp-theme03-chart-v1-chart-wrap lp-rise">
            {hasData ? (
              <LpEChart type={type === 'pie' ? 'pie' : 'bar'} option={buildOption(type, validLabels, validData)} className="lp-theme03-chart-v1-echart" />
            ) : (
              <div className="lp-theme03-chart-v1-empty">请配置图表数据</div>
            )}
            {unit && (
              <div className="lp-theme03-chart-v1-unit">{unit}</div>
            )}
          </div>

          {hasInsight && (
            <div className="lp-theme03-chart-v1-insight lp-rise">
              {(insight.value || insight.label) && (
                <div className="lp-theme03-chart-v1-insight-headline">
                  {insight.value && (
                    <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-v1-insight-value">{insight.value}</EditableField>
                  )}
                  {insight.label && (
                    <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-v1-insight-sub">{insight.label}</EditableField>
                  )}
                </div>
              )}
              {insight.description && (
                <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-v1-insight-desc">{insight.description}</EditableField>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
