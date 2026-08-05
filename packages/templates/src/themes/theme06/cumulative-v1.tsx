// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06CumulativeV1Conclusion {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme06CumulativeV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  data?: number[];
  unit?: string;
  conclusion?: Theme06CumulativeV1Conclusion;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CumulativeV1Meta: LayoutMeta = {
  id: 'theme06_cumulative_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 累积面积图页',
  description: '累积面积图 + 右侧结论卡片',
  needsMedia: true,
  tags: ['chart', 'area', 'cumulative', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06CumulativeV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CUMULATIVE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '年度累计收入构成' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '各业务线逐季叠加，整体规模持续扩大' },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '百万元' },
    {
      key: 'labels',
      label: '分类标签',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: ['Q1', 'Q2', 'Q3', 'Q4'],
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: [120, 280, 520, 860],
      itemSchema: [{ key: 'item', label: '项', type: 'number', inlineEditable: true }],
    },
    {
      key: 'conclusion',
      label: '结论区',
      type: 'object',
      defaultValue: { value: '860M', label: '年度累计', description: '四季度受企业客户续约推动，收入环比提升 65%，全年目标超额完成。' },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

function buildOption(labels: string[], data: number[]): Record<string, unknown> {
  const categoryData = labels.map((label) => label ?? '');

  const seriesData = data.map((value, index) => ({
    value,
    itemStyle: {
      color: index === data.length - 1 ? 'var(--lp-accent)' : 'var(--lp-accent-2)',
    },
  }));

  return {
    grid: { top: 40, right: 24, bottom: 52, left: 56, containLabel: false },
    xAxis: {
      type: 'category',
      data: categoryData,
      boundaryGap: false,
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
    tooltip: { trigger: 'axis' },
    series: [
      {
        type: 'line',
        data: seriesData,
        smooth: false,
        symbolSize: 8,
        lineStyle: { width: 0 },
        areaStyle: {
          opacity: 0.85,
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'var(--lp-accent)' },
              { offset: 1, color: 'var(--lp-accent-2)' },
            ],
          },
        },
        stack: 'total',
        animationDuration: 900,
      },
    ],
  };
}

export function Theme06CumulativeV1(props: Theme06CumulativeV1Props): ReactNode {
  const { kicker, title, subtitle, labels = [], data = [], unit, conclusion, _slideIdx, _editable } = props;

  const normLabels = labels.map((label) => (typeof label === 'string' ? label : (label as { item?: string }).item ?? ''));
  const normData = data.map((value) => (typeof value === 'number' ? value : Number((value as { item?: number }).item ?? 0) || 0));
  const validLabels = normLabels.slice(0, normData.length);
  const validData = normData.slice(0, normLabels.length);
  const hasData = validLabels.length > 0 && validData.length > 0;
  const hasConclusion = !!conclusion && (!!conclusion.value || !!conclusion.label || !!conclusion.description);

  return (
    <div className="lp-slide lp-theme06-cumulative">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-cumulative-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme06-cumulative-canvas">
          {hasData ? (
            <LpEChart
              type="line"
              option={buildOption(validLabels, validData)}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-ink3)' }}>
              请在右侧属性面板输入数据
            </div>
          )}
        </div>
        {unit && (
          <div style={{ textAlign: 'right', fontSize: 'var(--lp-font-size-caption)', color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)', marginTop: 8 }}>
            单位：{unit}
          </div>
        )}
      </div>

      <div className="lp-theme06-cumulative-aside lp-rise">
        {hasConclusion && (
          <div className="lp-theme06-cumulative-conclusion">
            {conclusion!.value && <div className="lp-theme06-cumulative-conclusion-value"><EditableField prop="conclusion.value" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.value}</EditableField></div>}
            {conclusion!.label && <div className="lp-theme06-cumulative-conclusion-label"><EditableField prop="conclusion.label" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.label}</EditableField></div>}
            {conclusion!.description && <div className="lp-theme06-cumulative-conclusion-text"><EditableField prop="conclusion.description" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.description}</EditableField></div>}
          </div>
        )}
      </div>

      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
