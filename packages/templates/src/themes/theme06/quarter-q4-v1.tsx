// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06QuarterQ4V1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  data?: number[];
  highlight?: string;
  conclusion?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06QuarterQ4V1Meta: LayoutMeta = {
  id: 'theme06_quarter_q4_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 Q4 季度分析',
  description: 'Q4 数据图表 + 关键事件与结论',
  needsMedia: true,
  tags: ['chart', 'quarter', 'q4', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06QuarterQ4V1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'Q4 2026' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '四季度市场表现' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '年末冲刺收官，全年目标超额完成' },
    {
      key: 'labels',
      label: '分类标签',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: ['10月', '11月', '12月'],
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: [{ item: 112 }, { item: 128 }, { item: 145 }],
      itemSchema: [{ key: 'item', label: '项', type: 'number', inlineEditable: true }],
    },
    { key: 'highlight', label: '关键事件', type: 'text', inlineEditable: true, defaultValue: '12 月年终大促创下单月新高，全年目标达成 118%' },
    { key: 'conclusion', label: '结论', type: 'textarea', inlineEditable: true, defaultValue: 'Q4 强势收官，全年呈现逐季加速态势。' },
  ],
};

function buildOption(labels: string[], data: number[]): Record<string, unknown> {
  const categoryData = labels.map((label) => label ?? '');
  const seriesData = data.map((value) => ({
    value,
    itemStyle: { color: 'var(--lp-accent)' },
  }));

  return {
    grid: { top: 32, right: 24, bottom: 40, left: 48, containLabel: false },
    xAxis: {
      type: 'category',
      data: categoryData,
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink2)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--lp-font)', interval: 0 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    series: [{
      type: 'bar',
      data: seriesData,
      barWidth: 40,
      label: { show: true, position: 'top', color: 'var(--lp-ink)', fontSize: 12, fontWeight: 700, fontFamily: 'var(--lp-font-mono)' },
      animationDuration: 700,
    }],
  };
}

export function Theme06QuarterQ4V1(props: Theme06QuarterQ4V1Props): ReactNode {
  const { kicker, title, subtitle, labels = [], data = [], highlight, conclusion, _slideIdx, _editable } = props;
  const normLabels = labels.map((label) => (typeof label === 'string' ? label : (label as { item?: string }).item ?? ''));
  const normData = data.map((value) => (typeof value === 'number' ? value : Number((value as { item?: number }).item ?? 0) || 0));
  const validLabels = normLabels.slice(0, normData.length);
  const validData = normData.slice(0, normLabels.length);
  const hasData = validLabels.length > 0 && validData.length > 0;

  return (
    <div className="lp-slide lp-theme06-quarter-q4">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-quarter-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme06-quarter-canvas">
          {hasData ? (
            <LpEChart type="bar" option={buildOption(validLabels, validData)} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-ink3)' }}>
              请在右侧属性面板输入数据
            </div>
          )}
        </div>
      </div>

      <div className="lp-theme06-quarter-aside lp-rise">
        {highlight && (
          <div className="lp-theme06-quarter-highlight">
            <div className="lp-theme06-quarter-highlight-label">关键事件</div>
            <EditableField prop="highlight" slideIdx={_slideIdx} editable={_editable} as="p">{highlight}</EditableField>
          </div>
        )}
        {conclusion && (
          <div className="lp-theme06-quarter-conclusion">
            <div className="lp-theme06-quarter-conclusion-label">季度结论</div>
            <EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="p">{conclusion}</EditableField>
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
