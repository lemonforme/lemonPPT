// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme03ChartFunnelItem {
  name?: string;
  value?: string;
}

export interface Theme03ChartFunnelInsight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme03ChartFunnelProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  data?: Theme03ChartFunnelItem[];
  showInsight?: boolean;
  insight?: Theme03ChartFunnelInsight;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ChartFunnelMeta: LayoutMeta = {
  id: 'theme03_chart_funnel',
  theme: 'theme03',
  role: 'chart',
  displayName: 'Theme 03 编辑风漏斗图',
  description: '转化漏斗 + 可选右侧洞察面板',
  needsMedia: false,
  tags: ['chart', 'funnel', 'conversion'],
  contentShape: 'funnel-insight',
};

const NEUTRAL_COLORS = [
  'var(--lp-ink3)',
  'var(--lp-ink2)',
  'var(--lp-surface-strong)',
  'var(--lp-border)',
  'var(--lp-stroke)',
];

export const theme03ChartFunnelSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '转化漏斗' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '08' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '营销转化 · 单位：人' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{漏斗}}：从曝光到成交的关键转化' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'data',
      label: '漏斗数据',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        { key: 'name', label: '阶段', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
      ],
    },
    { key: 'showInsight', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        value: '68%',
        label: '总体转化率',
        description: '从曝光到最终成交的漏斗整体转化表现稳定，关键流失集中在第二步。',
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

function parseValue(v?: string): number {
  return parseFloat(String(v || '0').replace(/,/g, '')) || 0;
}

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-chart-funnel-title lp-rise">
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

function buildOption(data: Theme03ChartFunnelItem[], hasInsight: boolean): Record<string, unknown> {
  const values = data.map((d) => parseValue(d.value));
  const max = Math.max(...values, 1);
  const chartData = data.map((d, index) => ({
    value: parseValue(d.value),
    name: d.name ?? '',
    itemStyle: {
      color: index === 0 ? 'var(--lp-accent)' : NEUTRAL_COLORS[(index - 1) % NEUTRAL_COLORS.length],
      borderColor: 'var(--lp-bg)',
      borderWidth: 2,
    },
  }));

  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [
      {
        type: 'funnel',
        left: hasInsight ? '2%' : '8%',
        top: 16,
        bottom: 16,
        width: hasInsight ? '55%' : '84%',
        min: 0,
        max,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 3,
        label: {
          show: true,
          position: 'inside',
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--lp-text-inverse)',
          formatter: '{b}\n{c}',
        },
        itemStyle: { borderRadius: 4 },
        emphasis: { label: { fontSize: 15 } },
        data: chartData,
        animationDuration: 900,
      },
    ],
  };
}

export function Theme03ChartFunnel(props: Theme03ChartFunnelProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    data = [],
    showInsight = true,
    insight,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validData = (data || []).filter((d) => d != null && !!(d.name || d.value));
  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  return (
    <div className="lp-slide lp-theme03-chart-funnel">
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

      <div className="lp-theme03-chart-funnel-main">
        <div className="lp-theme03-chart-funnel-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-funnel-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-chart-funnel-body">
          <div className="lp-theme03-chart-funnel-chart-wrap lp-rise">
            {validData.length > 0 ? (
              <LpEChart type="funnel" option={buildOption(validData, hasInsight)} className="lp-theme03-chart-funnel-echart" />
            ) : (
              <div className="lp-theme03-chart-funnel-empty">请配置漏斗数据</div>
            )}
          </div>

          {hasInsight && (
            <div className="lp-theme03-chart-funnel-insight lp-rise">
              {(insight.value || insight.label) && (
                <div className="lp-theme03-chart-funnel-insight-headline">
                  {insight.value && (
                    <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-funnel-insight-value">{insight.value}</EditableField>
                  )}
                  {insight.label && (
                    <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-funnel-insight-sub">{insight.label}</EditableField>
                  )}
                </div>
              )}
              {insight.description && (
                <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-funnel-insight-desc">{insight.description}</EditableField>
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
