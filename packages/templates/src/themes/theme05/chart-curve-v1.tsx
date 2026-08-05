// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05ChartCurveV1Conclusion {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme05ChartCurveV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  data?: number[];
  unit?: string;
  smooth?: boolean;
  showArea?: boolean;
  showConclusion?: boolean;
  conclusion?: Theme05ChartCurveV1Conclusion;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ChartCurveV1Meta: LayoutMeta = {
  id: 'theme05_chart_curve_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 曲线图',
  description: '平滑曲线图 + 面积填充 + 结论区',
  needsMedia: false,
  tags: ['chart', 'curve', 'line', 'trend'],
  contentShape: 'curve-chart',
};

export const theme05ChartCurveV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CURVE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '融资额走势曲线' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '全年融资额呈现明显的波动上升趋势' },
    {
      key: 'labels',
      label: '分类标签',
      type: 'array',
      minItems: 1,
      maxItems: 24,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 1,
      maxItems: 24,
      itemSchema: [{ key: 'item', label: '项', type: 'number', inlineEditable: true }],
    },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'smooth', label: '平滑曲线', type: 'boolean', defaultValue: true },
    { key: 'showArea', label: '面积填充', type: 'boolean', defaultValue: true },
    { key: 'showConclusion', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'conclusion',
      label: '结论区',
      type: 'object',
      visibleWhen: { key: 'showConclusion', value: true },
      defaultValue: {
        value: 'Q4 峰值',
        label: '单季融资额创新高',
        description: '年末融资额达到全年最高点，受大型并购和 IPO 前融资推动。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

function buildOption(labels: string[], data: number[], smooth: boolean, showArea: boolean): Record<string, unknown> {
  const categoryData = labels.map((label) => label ?? '');
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);

  return {
    grid: { top: 32, right: 24, bottom: 52, left: 56, containLabel: false },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params;
        return `<div style="font-weight:700;margin-bottom:4px">${p.name}</div>${p.value}`;
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: categoryData,
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: {
        color: 'var(--lp-ink2)',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'var(--lp-font)',
        interval: Math.floor(categoryData.length / 6),
      },
    },
    yAxis: {
      type: 'value',
      min: Math.floor(min * 0.9),
      max: Math.ceil(max * 1.1),
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    series: [
      {
        type: 'line',
        data,
        smooth,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 4, color: 'var(--lp-accent)' },
        itemStyle: { color: 'var(--lp-accent)' },
        areaStyle: showArea ? { opacity: 0.15, color: 'var(--lp-accent)' } : undefined,
        animationDuration: 900,
      },
    ],
  };
}

export function Theme05ChartCurveV1(props: Theme05ChartCurveV1Props): ReactNode {
  const { kicker, title, subtitle, labels = [], data = [], unit, smooth = true, showArea = true, showConclusion = true, conclusion, _slideIdx, _editable } = props;

  const validLabels = labels.slice(0, data.length);
  const validData = data.slice(0, labels.length);
  const hasData = validLabels.length > 0 && validData.length > 0;
  const hasConclusion = showConclusion !== false && !!conclusion && (!!conclusion.value || !!conclusion.label || !!conclusion.description);

  return (
    <div className="lp-slide lp-theme05-chart-curve">
      <div className="lp-theme05-chart-curve-main lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-chart-curve-canvas lp-rise">
          {hasData ? (
            <LpEChart type="line" option={buildOption(validLabels, validData, smooth, showArea)} className="lp-theme05-chart-curve-echart" />
          ) : (
            <div className="lp-theme05-chart-curve-empty">请配置分类与数据</div>
          )}
        </div>
      </div>
      <div className="lp-theme05-chart-curve-aside lp-rise">
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
