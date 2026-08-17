// lemonPPT - theme07 数字 + 图表版式
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { CSSProperties, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07StatChartV1SeriesItem {
  label?: string;
  value?: number;
}

export interface Theme07StatChartV1Props {
  imageUrl?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  number?: string;
  unit?: string;
  label?: string;
  series?: Theme07StatChartV1SeriesItem[];
  chartCaption?: string;
  showTrend?: boolean;
  showValues?: boolean;
  showLens?: boolean;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07StatChartV1Meta: LayoutMeta = {
  id: 'theme07_stat_chart_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 数字 + 图表',
  description: '左侧巨号结论数字，右侧支撑该结论的柱状序列与趋势线，形成「论点 + 证据」结构',
  needsMedia: true,
  tags: ['stat', 'big-number', 'chart', 'bar'],
  contentShape: 'stat',
};

export const theme07StatChartV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'EVIDENCE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '推理需求四年翻五倍' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '结论数字由逐年推理调用量序列支撑' },
    { key: 'number', label: '核心数字', type: 'text', inlineEditable: true, defaultValue: '5.2' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '倍' },
    { key: 'label', label: '数字说明', type: 'textarea', inlineEditable: true, defaultValue: '2024—2027 年推理调用量复合放大倍数' },
    {
      key: 'series',
      label: '数据序列',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: [
        { label: '2024', value: 18 },
        { label: '2025', value: 34 },
        { label: '2026', value: 61 },
        { label: '2027', value: 94 },
      ],
      itemSchema: [
        { key: 'label', label: '分类', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    { key: 'chartCaption', label: '图表说明', type: 'text', inlineEditable: true, defaultValue: '单位：万亿 token / 年' },
    { key: 'showTrend', label: '显示趋势线', type: 'boolean', defaultValue: true },
    { key: 'showValues', label: '显示柱顶数值', type: 'boolean', defaultValue: true },
    { key: 'showLens', label: '数字聚焦镜头', type: 'boolean', defaultValue: true },
    { key: 'focusIndex', label: '高亮柱', type: 'slider', min: 0, max: 7, defaultValue: 3 },
  ],
};

export function Theme07StatChartV1(props: Theme07StatChartV1Props): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    number = '0',
    unit,
    label,
    series = [],
    chartCaption,
    showTrend = true,
    showValues = true,
    showLens = true,
    focusIndex = 0,
    _slideIdx,
    _editable,
  } = props;

  const validSeries = (series || [])
    .filter((s): s is Theme07StatChartV1SeriesItem => s != null && !!s.label)
    .slice(0, 8);

  const maxValue = Math.max(1, ...validSeries.map((s) => Number(s.value) || 0));
  const heights = validSeries.map((s) => Math.max(4, ((Number(s.value) || 0) / maxValue) * 100));
  // 趋势线取每根柱子的顶端中点，坐标系为 0-100 的百分比方格
  const trendPoints = heights
    .map((h, index) => {
      const step = 100 / Math.max(1, heights.length);
      const x = step * index + step / 2;
      return `${x.toFixed(2)},${(100 - h).toFixed(2)}`;
    })
    .join(' ');

  return (
    <div className="lp-slide lp-theme07 lp-theme07-stat-chart">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-stat-chart-header lp-rise">
        <Theme07IconChip name="trend" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        {title && <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>}
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme07-stat-chart-body lp-rise">
        <div className={`lp-theme07-stat-chart-figure ${showLens ? 'lp-focus' : ''}`}>
          {showLens && <span className="lp-focus-lens" aria-hidden="true" />}
          <div className="lp-theme07-stat-chart-number">
            <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme07-big-number-value">{number}</EditableField>
            {unit && <span className="lp-theme07-big-number-unit">{unit}</span>}
          </div>
          {label && (
            <EditableField prop="label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme07-big-number-label">{label}</EditableField>
          )}
        </div>
        {validSeries.length > 0 && (
          <div className="lp-theme07-stat-chart-plot">
            <div className="lp-theme07-stat-chart-grid" aria-hidden="true">
              {[0, 1, 2, 3].map((line) => (
                <span key={line} className="lp-theme07-stat-chart-grid-line" />
              ))}
            </div>
            <div className="lp-theme07-stat-chart-bars">
              {validSeries.map((item, index) => (
                <div
                  key={index}
                  className={`lp-theme07-stat-chart-bar-slot ${index === focusIndex ? 'is-focus' : ''}`}
                >
                  {showValues && (
                    <span className="lp-theme07-stat-chart-bar-value">
                      <EditableField prop={`series.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span" fieldType="number" chartData>{item.value ?? 0}</EditableField>
                    </span>
                  )}
                  <span
                    className="lp-theme07-stat-chart-bar"
                    style={{ height: `${heights[index] ?? 4}%`, animationDelay: `${index * 70}ms` } as CSSProperties}
                  />
                  <span className="lp-theme07-stat-chart-bar-label">
                    <EditableField prop={`series.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{item.label}</EditableField>
                  </span>
                </div>
              ))}
            </div>
            {showTrend && validSeries.length > 1 && (
              <svg className="lp-theme07-stat-chart-trend" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <polyline
                  points={trendPoints}
                  fill="none"
                  stroke="var(--lp-accent-2)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}
            {chartCaption && (
              <div className="lp-theme07-stat-chart-caption">
                <EditableField prop="chartCaption" slideIdx={_slideIdx} editable={_editable} as="span">{chartCaption}</EditableField>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
