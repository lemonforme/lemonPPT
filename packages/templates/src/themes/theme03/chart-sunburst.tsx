// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme03ChartSunburstChild {
  name?: string;
  value?: number;
}

export interface Theme03ChartSunburstItem {
  name?: string;
  value?: number;
  children?: Theme03ChartSunburstChild[];
}

export interface Theme03ChartSunburstProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  data?: Theme03ChartSunburstItem[];
  unit?: string;
  showInsight?: boolean;
  insight?: {
    value?: string;
    label?: string;
    description?: string;
  };
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ChartSunburstMeta: LayoutMeta = {
  id: 'theme03_chart_sunburst',
  theme: 'theme03',
  role: 'chart',
  displayName: 'Theme 03 编辑风旭日图',
  description: '层级占比旭日图',
  needsMedia: false,
  tags: ['chart', 'sunburst', 'hierarchy'],
  contentShape: 'sunburst-chart',
};

const NEUTRAL_COLORS = [
  'var(--lp-ink3)',
  'var(--lp-ink2)',
  'var(--lp-surface-strong)',
  'var(--lp-border)',
  'var(--lp-stroke)',
];

export const theme03ChartSunburstSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '层级占比' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '16' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '组织架构 · 单位：人' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{旭日图}}：团队层级与人员分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'data',
      label: '层级数据',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
    { key: 'showInsight', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        value: '190',
        label: '团队总人数',
        description: '研发人员占比超过 60%，产品设计与运营团队规模相对精简，符合技术驱动型组织特征。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-chart-sunburst-title lp-rise">
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

function colorForIndex(index: number, depth = 0): string {
  if (index === 0 && depth === 0) return 'var(--lp-accent)';
  return NEUTRAL_COLORS[(index - 1 + depth) % NEUTRAL_COLORS.length];
}

function buildOption(data: Theme03ChartSunburstItem[]): Record<string, unknown> {
  const sunburstData = data
    .filter((d) => d != null && d.name != null)
    .map((d, index) => ({
      name: d.name,
      value: d.value ?? 0,
      itemStyle: { color: colorForIndex(index, 0) },
      children: Array.isArray(d.children)
        ? d.children
            .filter((c) => c != null && c.name != null)
            .map((c, childIdx) => ({
              name: c.name,
              value: c.value ?? 0,
              itemStyle: { color: colorForIndex(index, childIdx + 1), opacity: 0.7 + (childIdx % 3) * 0.1 },
            }))
        : undefined,
    }));

  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [
      {
        type: 'sunburst',
        radius: [0, '88%'],
        data: sunburstData,
        label: { rotate: 'radial', fontSize: 11, fontWeight: 600, color: 'var(--lp-text-inverse)' },
        itemStyle: { borderColor: 'var(--lp-bg)', borderWidth: 2, borderRadius: 4 },
        emphasis: { focus: 'ancestor' },
      },
    ],
  };
}

export function Theme03ChartSunburst(props: Theme03ChartSunburstProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    data = [],
    unit,
    showInsight = true,
    insight,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validData = (data || []).filter((d) => d != null && d.name != null);
  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  return (
    <div className="lp-slide lp-theme03-chart-sunburst">
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

      <div className="lp-theme03-chart-sunburst-main">
        <div className="lp-theme03-chart-sunburst-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-sunburst-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className={`lp-theme03-chart-sunburst-body ${hasInsight ? 'lp-theme03-chart-sunburst-body--insight' : ''} lp-rise`}>
          <div className="lp-theme03-chart-sunburst-chart-wrap">
            {validData.length > 0 ? (
              <LpEChart type="sunburst" option={buildOption(validData)} className="lp-theme03-chart-sunburst-echart" />
            ) : (
              <div className="lp-theme03-chart-sunburst-empty">请配置旭日图数据</div>
            )}
            {unit && (
              <div className="lp-theme03-chart-sunburst-unit">{unit}</div>
            )}
          </div>

          {hasInsight && (
            <div className="lp-theme03-chart-sunburst-insight lp-rise">
              {(insight.value || insight.label) && (
                <div className="lp-theme03-chart-sunburst-insight-headline">
                  {insight.value && (
                    <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-sunburst-insight-value">{insight.value}</EditableField>
                  )}
                  {insight.label && (
                    <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-sunburst-insight-sub">{insight.label}</EditableField>
                  )}
                </div>
              )}
              {insight.description && (
                <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-sunburst-insight-desc">{insight.description}</EditableField>
              )}
            </div>
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
