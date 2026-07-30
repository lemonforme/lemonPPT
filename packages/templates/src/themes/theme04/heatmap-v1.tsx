// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04HeatmapV1Cell {
  x?: number;
  y?: number;
  value?: number;
}

export interface Theme04HeatmapV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  xLabels?: string[];
  yLabels?: string[];
  cells?: Theme04HeatmapV1Cell[];
  colorTone?: 'green' | 'pink' | 'blue' | 'yellow';
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04HeatmapV1Meta: LayoutMeta = {
  id: 'theme04_heatmap_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 资金热力矩阵',
  description: '糖果色热力矩阵，适合资金强度/关注度矩阵展示',
  needsMedia: false,
  tags: ['heatmap', 'matrix', 'chart', 'candy'],
  contentShape: 'heatmap',
};

export const theme04HeatmapV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '资金热力 · HEATMAP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{季度}} × {{赛道}}资金热力' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '颜色越深代表该季度该赛道的大额融资越集中' },
    {
      key: 'xLabels',
      label: 'X 轴标签',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: ['Q1', 'Q2', 'Q3', 'Q4'],
      itemSchema: [{ key: 'item', label: '标签', type: 'text', inlineEditable: true }],
    },
    {
      key: 'yLabels',
      label: 'Y 轴标签',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: ['通用模型', '垂直应用', 'AI 基础设施', '芯片硬件'],
      itemSchema: [{ key: 'item', label: '标签', type: 'text', inlineEditable: true }],
    },
    {
      key: 'cells',
      label: '热力数据',
      type: 'array',
      minItems: 1,
      maxItems: 64,
      defaultValue: [
        { x: 0, y: 0, value: 85 }, { x: 1, y: 0, value: 62 }, { x: 2, y: 0, value: 90 }, { x: 3, y: 0, value: 78 },
        { x: 0, y: 1, value: 45 }, { x: 1, y: 1, value: 55 }, { x: 2, y: 1, value: 70 }, { x: 3, y: 1, value: 82 },
        { x: 0, y: 2, value: 70 }, { x: 1, y: 2, value: 88 }, { x: 2, y: 2, value: 95 }, { x: 3, y: 2, value: 91 },
        { x: 0, y: 3, value: 30 }, { x: 1, y: 3, value: 42 }, { x: 2, y: 3, value: 58 }, { x: 3, y: 3, value: 65 },
      ],
      itemSchema: [
        { key: 'x', label: 'X 索引', type: 'number' },
        { key: 'y', label: 'Y 索引', type: 'number' },
        { key: 'value', label: '值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'colorTone', label: '热力色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
    { key: 'footnote', label: '页脚', type: 'text', inlineEditable: true, defaultValue: '颜色深浅 = 相对资金热度 · 满分 100' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-heatmap-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

const toneMap: Record<string, string> = {
  green: 'var(--lp-green)',
  pink: 'var(--lp-pink)',
  blue: 'var(--lp-blue)',
  yellow: 'var(--lp-yellow)',
};

function buildOption(xLabels: string[], yLabels: string[], cells: Theme04HeatmapV1Cell[], colorTone: string): Record<string, unknown> {
  const maxValue = Math.max(...cells.map((c) => c.value || 0), 1);
  const mainColor = toneMap[colorTone] || 'var(--lp-green)';

  const data = cells.map((c) => [c.x ?? 0, c.y ?? 0, c.value ?? 0]);

  return {
    tooltip: { position: 'top' },
    grid: { top: 24, right: 24, bottom: 56, left: 96, containLabel: false },
    xAxis: {
      type: 'category',
      data: xLabels,
      splitArea: { show: true, areaStyle: { color: ['transparent'] } },
      axisLabel: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)', fontSize: 12, fontWeight: 600 },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      inverse: true,
      splitArea: { show: true, areaStyle: { color: ['transparent'] } },
      axisLabel: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)', fontSize: 12, fontWeight: 600 },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
    },
    visualMap: {
      min: 0,
      max: maxValue,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: {
        color: ['var(--lp-overlay)', mainColor],
      },
      textStyle: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)', fontSize: 10 },
    },
    series: [{
      type: 'heatmap',
      data,
      label: {
        show: true,
        color: 'var(--lp-ink)',
        fontFamily: 'var(--lp-font-mono)',
        fontSize: 11,
        fontWeight: 700,
      },
      itemStyle: {
        borderColor: 'var(--lp-divider)',
        borderWidth: 1,
        borderRadius: 6,
      },
      emphasis: {
        itemStyle: { shadowBlur: 12, shadowColor: mainColor },
      },
      animationDuration: 800,
    }],
  };
}

export function Theme04HeatmapV1(props: Theme04HeatmapV1Props): ReactNode {
  const { kicker, title, subtitle, xLabels = [], yLabels = [], cells = [], colorTone = 'green', footnote, _slideIdx, _editable } = props;
  const safeX = xLabels.slice(0, 8);
  const safeY = yLabels.slice(0, 8);
  const safeCells = cells.filter((c) => c != null).slice(0, 64);
  const hasData = safeX.length >= 2 && safeY.length >= 2 && safeCells.length > 0;

  return (
    <div className="lp-slide lp-theme04-heatmap">
      <div className="lp-theme04-heatmap-top lp-rise">
        {kicker && (
          <div className="lp-theme04-tag">
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
          </div>
        )}
      </div>

      <div className="lp-theme04-heatmap-head lp-rise">
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-heatmap-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-heatmap-body lp-rise">
        {hasData ? (
          <LpEChart type="heatmap" option={buildOption(safeX, safeY, safeCells, colorTone)} className="lp-theme04-heatmap-echart" />
        ) : (
          <div className="lp-theme04-heatmap-empty">请配置 X/Y 轴标签与热力数据</div>
        )}
      </div>

      {footnote && (
        <div className="lp-theme04-heatmap-footnote lp-rise">
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnote}</EditableField>
        </div>
      )}
    </div>
  );
}
