// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme03ChartHeatmapDataItem {
  x?: string;
  y?: string;
  value?: number;
}

export interface Theme03ChartHeatmapProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  xAxis?: string[];
  yAxis?: string[];
  data?: Theme03ChartHeatmapDataItem[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ChartHeatmapMeta: LayoutMeta = {
  id: 'theme03_chart_heatmap',
  theme: 'theme03',
  role: 'chart',
  displayName: 'Theme 03 编辑风热力图',
  description: '矩阵密度或相关性热力图',
  needsMedia: false,
  tags: ['chart', 'heatmap', 'matrix'],
  contentShape: 'heatmap-chart',
};

export const theme03ChartHeatmapSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '相关性' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '10' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '模块依赖 · 密度得分' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{依赖密度}}：核心模块调用热力分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'xAxis',
      label: 'X 轴',
      type: 'array',
      minItems: 2,
      maxItems: 10,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'yAxis',
      label: 'Y 轴',
      type: 'array',
      minItems: 2,
      maxItems: 10,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 1,
      maxItems: 100,
      itemSchema: [
        { key: 'x', label: 'X 项', type: 'text' },
        { key: 'y', label: 'Y 项', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-chart-heatmap-title lp-rise">
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

function buildOption(xAxis: string[], yAxis: string[], data: Theme03ChartHeatmapDataItem[]): Record<string, unknown> {
  const max = Math.max(...data.map((d) => d.value ?? 0), 1);
  const heatmapData = data
    .filter((d) => d && d.x != null && d.y != null)
    .map((d) => [d.x, d.y, d.value ?? 0]);

  return {
    tooltip: { position: 'top' },
    grid: { top: 8, bottom: 56, left: 72, right: 16 },
    xAxis: {
      type: 'category',
      data: xAxis,
      splitArea: { show: true, areaStyle: { color: ['transparent', 'var(--lp-surface)'] } },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisLabel: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)' },
    },
    yAxis: {
      type: 'category',
      data: yAxis,
      splitArea: { show: true, areaStyle: { color: ['transparent', 'var(--lp-surface)'] } },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisLabel: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)' },
    },
    visualMap: {
      min: 0,
      max,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: {
        color: ['var(--lp-surface-strong)', 'var(--lp-accent)'],
      },
      textStyle: { color: 'var(--lp-ink2)' },
    },
    series: [
      {
        type: 'heatmap',
        data: heatmapData,
        label: { show: true, fontSize: 12, color: 'var(--lp-ink)' },
        itemStyle: {
          borderColor: 'var(--lp-bg)',
          borderWidth: 2,
          borderRadius: 4,
        },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'var(--lp-accent)' } },
      },
    ],
  };
}

export function Theme03ChartHeatmap(props: Theme03ChartHeatmapProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    xAxis = [],
    yAxis = [],
    data = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validX = (xAxis || []).filter(Boolean);
  const validY = (yAxis || []).filter(Boolean);
  const validData = (data || []).filter((d) => d != null && d.x != null && d.y != null);
  const hasData = validX.length > 0 && validY.length > 0 && validData.length > 0;

  return (
    <div className="lp-slide lp-theme03-chart-heatmap">
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

      <div className="lp-theme03-chart-heatmap-main">
        <div className="lp-theme03-chart-heatmap-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-heatmap-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-chart-heatmap-body lp-rise">
          {hasData ? (
            <LpEChart type="heatmap" option={buildOption(validX, validY, validData)} className="lp-theme03-chart-heatmap-echart" />
          ) : (
            <div className="lp-theme03-chart-heatmap-empty">请配置热力图坐标轴与数据</div>
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
