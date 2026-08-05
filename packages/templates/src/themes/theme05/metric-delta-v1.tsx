// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05MetricDeltaV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  currentValue: string;
  currentUnit?: string;
  currentLabel?: string;
  previousValue?: string;
  previousUnit?: string;
  previousLabel?: string;
  delta: string;
  deltaLabel?: string;
  labels?: string[];
  data?: number[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05MetricDeltaV1Meta: LayoutMeta = {
  id: 'theme05_metric_delta_v1',
  theme: 'theme05',
  role: 'metric',
  displayName: 'Theme 05 增长 Delta 页',
  description: '当前值 vs 对比值 + 增长标签 + 趋势小图',
  needsMedia: false,
  tags: ['metric', 'delta', 'growth'],
  contentShape: 'metric',
};

export const theme05MetricDeltaV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'GROWTH' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '年度融资同比增长' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '2026 年相较 2025 年实现显著增长' },
    { key: 'currentValue', label: '当前值', type: 'text', inlineEditable: true, defaultValue: '970' },
    { key: 'currentUnit', label: '当前值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'currentLabel', label: '当前值标签', type: 'text', inlineEditable: true, defaultValue: '2026 年' },
    { key: 'previousValue', label: '对比值', type: 'text', inlineEditable: true, defaultValue: '703' },
    { key: 'previousUnit', label: '对比值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'previousLabel', label: '对比值标签', type: 'text', inlineEditable: true, defaultValue: '2025 年' },
    { key: 'delta', label: '增长值', type: 'text', inlineEditable: true, defaultValue: '+38%' },
    { key: 'deltaLabel', label: '增长说明', type: 'text', inlineEditable: true, defaultValue: '年度同比增长' },
    {
      key: 'labels',
      label: '趋势标签',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'data',
      label: '趋势数据',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      itemSchema: [{ key: 'item', label: '项', type: 'number', inlineEditable: true }],
    },
  ],
};

function buildSparklineOption(labels: string[], data: number[]): Record<string, unknown> {
  return {
    grid: { top: 8, right: 8, bottom: 8, left: 8 },
    xAxis: { type: 'category', data: labels.map((l) => l ?? ''), show: false },
    yAxis: { type: 'value', show: false },
    tooltip: { trigger: 'axis' },
    series: [
      {
        type: 'line',
        data,
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 3, color: 'var(--lp-accent)' },
        areaStyle: { opacity: 0.15, color: 'var(--lp-accent)' },
        animationDuration: 900,
      },
    ],
  };
}

export function Theme05MetricDeltaV1(props: Theme05MetricDeltaV1Props): ReactNode {
  const {
    kicker,
    title,
    subtitle,
    currentValue,
    currentUnit,
    currentLabel,
    previousValue,
    previousUnit,
    previousLabel,
    delta,
    deltaLabel,
    labels = [],
    data = [],
    _slideIdx,
    _editable,
  } = props;

  const validLabels = labels.slice(0, data.length);
  const validData = data.slice(0, labels.length);
  const hasSparkline = validLabels.length > 0 && validData.length > 0;

  return (
    <div className="lp-slide lp-theme05-metric-delta">
      {kicker && <div className="lp-theme05-kicker lp-rise">{kicker}</div>}
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title lp-rise">{title}</EditableField>
      {subtitle && (
        <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle lp-rise">{subtitle}</EditableField>
      )}
      <div className="lp-theme05-metric-delta-main">
        <div className="lp-theme05-metric-delta-current lp-rise">
          <div className="lp-theme05-metric-delta-label">{currentLabel}</div>
          <div className="lp-theme05-metric-delta-value">
            <EditableField prop="currentValue" slideIdx={_slideIdx} editable={_editable} as="span">{currentValue}</EditableField>
            {currentUnit && <EditableField prop="currentUnit" slideIdx={_slideIdx} editable={_editable} as="span">{currentUnit}</EditableField>}
          </div>
        </div>
        <div className="lp-theme05-metric-delta-divider lp-rise">
          <div className="lp-theme05-metric-delta-delta">
            <EditableField prop="delta" slideIdx={_slideIdx} editable={_editable} as="span">{delta}</EditableField>
          </div>
          {deltaLabel && <div className="lp-theme05-metric-delta-delta-label"><EditableField prop="deltaLabel" slideIdx={_slideIdx} editable={_editable} as="span">{deltaLabel}</EditableField></div>}
        </div>
        <div className="lp-theme05-metric-delta-previous lp-rise">
          <div className="lp-theme05-metric-delta-label">{previousLabel}</div>
          <div className="lp-theme05-metric-delta-value-previous">
            <EditableField prop="previousValue" slideIdx={_slideIdx} editable={_editable} as="span">{previousValue}</EditableField>
            {previousUnit && <EditableField prop="previousUnit" slideIdx={_slideIdx} editable={_editable} as="span">{previousUnit}</EditableField>}
          </div>
        </div>
      </div>
      {hasSparkline && (
        <div className="lp-theme05-metric-delta-sparkline lp-rise">
          <LpEChart type="line" option={buildSparklineOption(validLabels, validData)} />
        </div>
      )}
      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
