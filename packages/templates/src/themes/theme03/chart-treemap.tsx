// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme03ChartTreemapChild {
  name?: string;
  value?: number;
}

export interface Theme03ChartTreemapItem {
  name?: string;
  value?: number;
  children?: Theme03ChartTreemapChild[];
}

export interface Theme03ChartTreemapProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  data?: Theme03ChartTreemapItem[];
  unit?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ChartTreemapMeta: LayoutMeta = {
  id: 'theme03_chart_treemap',
  theme: 'theme03',
  role: 'chart',
  displayName: 'Theme 03 编辑风矩形树图',
  description: '层级占比矩形树图',
  needsMedia: false,
  tags: ['chart', 'treemap', 'proportion'],
  contentShape: 'treemap-chart',
};

const NEUTRAL_COLORS = [
  'var(--lp-ink3)',
  'var(--lp-ink2)',
  'var(--lp-surface-strong)',
  'var(--lp-border)',
  'var(--lp-stroke)',
];

export const theme03ChartTreemapSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '占比分布' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '11' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '业务板块 · 单位：百万' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{板块占比}}：各业务线收入构成' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'data',
      label: '树图数据',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-chart-treemap-title lp-rise">
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

function buildOption(data: Theme03ChartTreemapItem[]): Record<string, unknown> {
  const sorted = [...data]
    .filter((d) => d != null && d.name != null)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  const treemapData = sorted.map((d, index) => ({
    name: d.name,
    value: d.value ?? 0,
    itemStyle: {
      color: index === 0 ? 'var(--lp-accent)' : NEUTRAL_COLORS[(index - 1) % NEUTRAL_COLORS.length],
      borderColor: 'var(--lp-bg)',
      borderWidth: 2,
      borderRadius: 4,
    },
    children: Array.isArray(d.children)
      ? d.children.map((child, childIdx) => ({
          name: child.name,
          value: child.value ?? 0,
          itemStyle: {
            color: index === 0 ? 'var(--lp-accent)' : NEUTRAL_COLORS[(index - 1) % NEUTRAL_COLORS.length],
            opacity: 0.5 + (childIdx % 3) * 0.2,
            borderColor: 'var(--lp-bg)',
            borderWidth: 1,
          },
        }))
      : undefined,
  }));

  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [
      {
        type: 'treemap',
        width: '100%',
        height: '100%',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: {
          show: true,
          formatter: '{b}\n{c}',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--lp-text-inverse)',
        },
        itemStyle: {
          borderColor: 'var(--lp-bg)',
          borderWidth: 2,
          gapWidth: 2,
          borderRadius: 4,
        },
        data: treemapData,
      },
    ],
  };
}

export function Theme03ChartTreemap(props: Theme03ChartTreemapProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    data = [],
    unit,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validData = (data || []).filter((d) => d != null && !!d.name);

  return (
    <div className="lp-slide lp-theme03-chart-treemap">
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

      <div className="lp-theme03-chart-treemap-main">
        <div className="lp-theme03-chart-treemap-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-treemap-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-chart-treemap-body lp-rise">
          {validData.length > 0 ? (
            <LpEChart type="treemap" option={buildOption(validData)} className="lp-theme03-chart-treemap-echart" />
          ) : (
            <div className="lp-theme03-chart-treemap-empty">请配置树图数据</div>
          )}
          {unit && (
            <div className="lp-theme03-chart-treemap-unit">{unit}</div>
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
