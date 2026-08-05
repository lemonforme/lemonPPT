// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme03ChartWordcloudItem {
  name?: string;
  value?: string;
}

export interface Theme03ChartWordcloudProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  words?: Theme03ChartWordcloudItem[];
  unit?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ChartWordcloudMeta: LayoutMeta = {
  id: 'theme03_chart_wordcloud',
  theme: 'theme03',
  role: 'chart',
  displayName: 'Theme 03 编辑风词云',
  description: '关键词权重分布（使用水平柱状图回退渲染）',
  needsMedia: false,
  tags: ['chart', 'wordcloud', 'keywords'],
  contentShape: 'wordcloud-chart',
};

const NEUTRAL_COLORS = [
  'var(--lp-ink3)',
  'var(--lp-ink2)',
  'var(--lp-surface-strong)',
  'var(--lp-border)',
  'var(--lp-stroke)',
];

export const theme03ChartWordcloudSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '关键词' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '12' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '搜索热词 · 单位：频次' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{热词云}}：开发者最关注的技术话题' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'words',
      label: '词云数据',
      type: 'array',
      minItems: 3,
      maxItems: 30,
      itemSchema: [
        { key: 'name', label: '关键词', type: 'text' },
        { key: 'value', label: '权重', type: 'text' },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function parseValue(v?: string): number {
  return parseFloat(String(v || '0').replace(/,/g, '')) || 0;
}

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-chart-wordcloud-title lp-rise">
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

function buildOption(words: Theme03ChartWordcloudItem[]): Record<string, unknown> {
  const sorted = [...words]
    .filter((w) => w != null && w.name != null)
    .sort((a, b) => parseValue(b.value) - parseValue(a.value))
    .slice(0, 15);

  const data = sorted.map((w, index) => ({
    value: parseValue(w.value),
    name: w.name ?? '',
    itemStyle: {
      color: index === 0 ? 'var(--lp-accent)' : NEUTRAL_COLORS[(index - 1) % NEUTRAL_COLORS.length],
      borderRadius: [0, 4, 4, 0],
    },
  }));

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 16, right: 80, bottom: 16, left: 120, containLabel: false },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    yAxis: {
      type: 'category',
      data: data.map((d) => d.name).reverse(),
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)', fontWeight: 600 },
    },
    series: [
      {
        type: 'bar',
        data: data.map((d) => d.value).reverse(),
        barWidth: 18,
        label: {
          show: true,
          position: 'right',
          color: 'var(--lp-ink)',
          fontFamily: 'var(--lp-font-mono)',
          fontWeight: 700,
        },
        itemStyle: {
          color: (params: any) => {
            const idx = data.length - 1 - params.dataIndex;
            return idx === 0 ? 'var(--lp-accent)' : NEUTRAL_COLORS[(idx - 1) % NEUTRAL_COLORS.length];
          },
          borderRadius: [0, 4, 4, 0],
        },
        animationDuration: 700,
      },
    ],
  };
}

export function Theme03ChartWordcloud(props: Theme03ChartWordcloudProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    words = [],
    unit,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validWords = (words || []).filter((w) => w != null && !!(w.name || w.value));

  return (
    <div className="lp-slide lp-theme03-chart-wordcloud">
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

      <div className="lp-theme03-chart-wordcloud-main">
        <div className="lp-theme03-chart-wordcloud-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-wordcloud-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-chart-wordcloud-body lp-rise">
          {validWords.length > 0 ? (
            <LpEChart type="bar" option={buildOption(validWords)} className="lp-theme03-chart-wordcloud-echart" />
          ) : (
            <div className="lp-theme03-chart-wordcloud-empty">请配置词云数据</div>
          )}
          {unit && (
            <div className="lp-theme03-chart-wordcloud-unit">{unit}</div>
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
