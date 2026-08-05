// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06AvgTicketV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  intervals?: string[];
  values?: number[];
  unit?: string;
  conclusion?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06AvgTicketV1Meta: LayoutMeta = {
  id: 'theme06_avg_ticket_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 平均交易额',
  description: '区间直方图展示交易规模/客单价分布',
  needsMedia: true,
  tags: ['chart', 'bar', 'histogram', 'ticket', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06AvgTicketV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'DEAL SIZE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '平均交易额分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '不同规模区间的交易数量与金额占比' },
    {
      key: 'intervals',
      label: '区间标签',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: ['<$1M', '$1–5M', '$5–15M', '$15–50M', '$50–100M', '>$100M'],
      itemSchema: [{ key: 'item', label: '区间', type: 'text', inlineEditable: true }],
    },
    {
      key: 'values',
      label: '交易数量',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: [18, 32, 28, 16, 5, 1],
      itemSchema: [{ key: 'item', label: '数量', type: 'number', inlineEditable: true }],
    },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '笔' },
    { key: 'conclusion', label: '结论', type: 'textarea', inlineEditable: true, defaultValue: '中小型交易仍是市场主力，超过九成交易集中在 5,000 万美元以下。' },
  ],
};

function normalizeStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => (typeof item === 'string' ? item : (item as { item?: string }).item ?? ''))
    .filter((item) => item !== '');
}

function normalizeNumberArray(input: unknown): number[] {
  if (!Array.isArray(input)) return [];
  return input.map((value) =>
    typeof value === 'number' ? value : Number((value as { item?: number }).item ?? 0) || 0
  );
}

function buildOption(labels: string[], values: number[]): Record<string, unknown> {
  const max = Math.max(...values, 1);
  const data = values.map((value) => ({
    value,
    itemStyle: {
      color: value === max ? 'var(--lp-accent)' : 'var(--lp-accent-2)',
      borderRadius: [4, 4, 0, 0],
    },
  }));
  return {
    grid: { top: 32, right: 24, bottom: 48, left: 56, containLabel: false },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)', interval: 0, fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    series: [
      {
        type: 'bar',
        data,
        barWidth: '54%',
        label: { show: true, position: 'top', color: 'var(--lp-ink)', fontFamily: 'var(--lp-font-mono)', fontSize: 12 },
        animationDuration: 900,
      },
    ],
  };
}

export function Theme06AvgTicketV1(props: Theme06AvgTicketV1Props): ReactNode {
  const { kicker, title, subtitle, intervals = [], values = [], unit, conclusion, _slideIdx, _editable } = props;
  const normLabels = normalizeStringArray(intervals).slice(0, 8);
  const normValues = normalizeNumberArray(values).slice(0, 8);
  const validLabels = normLabels.slice(0, normValues.length);
  const validValues = normValues.slice(0, normLabels.length);
  const hasData = validLabels.length > 0 && validValues.length > 0;

  return (
    <div className="lp-slide lp-theme06-avg-ticket">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-avg-ticket-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-avg-ticket-body lp-rise">
        <div className="lp-theme06-avg-ticket-canvas">
          {hasData ? (
            <LpEChart type="bar" option={buildOption(validLabels, validValues)} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-ink3)' }}>
              请在右侧属性面板输入数据
            </div>
          )}
        </div>
        {conclusion && (
          <div className="lp-theme06-avg-ticket-conclusion">
            <EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="p">{conclusion}</EditableField>
          </div>
        )}
        {unit && (
          <div className="lp-theme06-avg-ticket-unit">单位：{unit}</div>
        )}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
