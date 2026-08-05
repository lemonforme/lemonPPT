// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme03ChartBarItem {
  label?: string;
  labelEn?: string;
  value?: string;
}

export interface Theme03ChartBarInsight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme03ChartBarProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  bars?: Theme03ChartBarItem[];
  showInsight?: boolean;
  insight?: Theme03ChartBarInsight;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ChartBarMeta: LayoutMeta = {
  id: 'theme03_chart_bar',
  theme: 'theme03',
  role: 'chart',
  displayName: 'Theme 03 编辑风柱状图',
  description: '中性灰阶柱状图 + 强调色峰值 + 坐标轴标签 + 右侧洞察',
  needsMedia: false,
  tags: ['chart', 'comparison', 'trend', 'insight'],
  contentShape: 'bar-chart-insight',
};

const NEUTRAL_COLORS = [
  'var(--lp-ink3)',
  'var(--lp-ink2)',
  'var(--lp-surface-strong)',
  'var(--lp-border)',
  'var(--lp-stroke)',
];

export const theme03ChartBarSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '季度趋势' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '06' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'AI 编码助手收入 · 单位：百万美元' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{季度增长}}：AI 助手商业化加速' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: 'M' },
    {
      key: 'bars',
      label: '柱状数据',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'labelEn', label: '英文名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
      ],
    },
    {
      key: 'showInsight',
      label: '重点强调',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        value: '+127%',
        label: 'Q4 环比增长',
        description: '下半年企业客户采购推动收入连续两个季度翻倍，付费坐席渗透率达到 34%。',
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

function buildBarOption(bars: Theme03ChartBarItem[]): Record<string, unknown> {
  const values = bars.map((b) => parseValue(b.value));
  const max = Math.max(...values, 1);
  const topIndex = values.indexOf(max);

  const data = bars.map((bar, index) => ({
    value: parseValue(bar.value),
    itemStyle: {
      color: index === topIndex ? 'var(--lp-accent)' : NEUTRAL_COLORS[index % NEUTRAL_COLORS.length],
      borderRadius: [4, 4, 0, 0],
    },
  }));

  return {
    grid: { top: 40, right: 24, bottom: 52, left: 56, containLabel: false },
    xAxis: {
      type: 'category',
      data: bars.map((b) => b.label ?? ''),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: 'var(--lp-ink2)',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: 'var(--lp-font)',
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: 'var(--lp-divider)',
          opacity: 0.6,
        },
      },
      axisLabel: { show: false },
    },
    series: [
      {
        type: 'bar',
        data,
        barWidth: bars.length <= 5 ? 64 : 40,
        barGap: '30%',
        label: {
          show: true,
          position: 'top',
          color: 'var(--lp-ink)',
          fontSize: 13,
          fontWeight: 700,
          fontFamily: 'var(--lp-font-mono)',
        },
        animationDuration: 700,
        animationEasing: 'cubicOut',
      },
    ],
  };
}

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-chart-bar-title lp-rise">
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

export function Theme03ChartBar(props: Theme03ChartBarProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    unit,
    bars = [],
    showInsight = true,
    insight,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validBars = (bars || [])
    .filter((b): b is Theme03ChartBarItem => b != null && !!(b.label || b.value))
    .map((b) => ({ ...b }));

  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  return (
    <div className="lp-slide lp-theme03-chart-bar">
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

      <div className="lp-theme03-chart-bar-main">
        <div className="lp-theme03-chart-bar-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-bar-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-chart-bar-body">
          <div className="lp-theme03-chart-bar-chart-wrap lp-rise">
            {validBars.length > 0 ? (
              <LpEChart type="bar" option={buildBarOption(validBars)} className="lp-theme03-chart-bar-echart" />
            ) : (
              <div className="lp-theme03-chart-bar-empty">请配置柱状数据</div>
            )}
            {unit && (
              <div className="lp-theme03-chart-bar-unit">{unit}</div>
            )}
          </div>

          {hasInsight && (
            <div className="lp-theme03-chart-bar-insight lp-rise">
              {(insight.value || insight.label) && (
                <div className="lp-theme03-chart-bar-insight-headline">
                  {insight.value && (
                    <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-bar-insight-value">{insight.value}</EditableField>
                  )}
                  {insight.label && (
                    <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-bar-insight-sub">{insight.label}</EditableField>
                  )}
                </div>
              )}
              {insight.description && (
                <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-bar-insight-desc">{insight.description}</EditableField>
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
