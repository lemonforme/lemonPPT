// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme03ChartGaugeProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  value?: number;
  min?: number;
  max?: number;
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

export const theme03ChartGaugeMeta: LayoutMeta = {
  id: 'theme03_chart_gauge',
  theme: 'theme03',
  role: 'chart',
  displayName: 'Theme 03 编辑风仪表盘',
  description: '单一指标完成率/健康度仪表盘',
  needsMedia: false,
  tags: ['chart', 'gauge', 'metric'],
  contentShape: 'gauge-chart',
};

export const theme03ChartGaugeSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '完成率' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '09' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '季度目标 · 单位：%' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{目标达成}}：Q3 核心 KPI 完成度' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'value', label: '数值', type: 'number', defaultValue: 78 },
    { key: 'min', label: '最小值', type: 'number', defaultValue: 0 },
    { key: 'max', label: '最大值', type: 'number', defaultValue: 100 },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '%' },
    { key: 'showInsight', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        value: '78%',
        label: '目标达成率',
        description: 'Q3 核心 KPI 完成度良好，超出预期 3 个百分点。',
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
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-chart-gauge-title lp-rise">
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

function buildOption(value: number, min: number, max: number, unit: string): Record<string, unknown> {
  return {
    tooltip: { formatter: `{b}: {c}${unit}` },
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min,
        max,
        splitNumber: 10,
        itemStyle: { color: 'var(--lp-accent)' },
        progress: { show: true, width: 20 },
        pointer: { show: true, length: '70%', width: 5 },
        axisLine: { lineStyle: { width: 20, color: [[1, 'var(--lp-surface-strong)']] } },
        axisTick: { distance: -26, length: 6, lineStyle: { width: 1, color: 'var(--lp-ink3)' } },
        splitLine: { distance: -26, length: 12, lineStyle: { width: 2, color: 'var(--lp-ink3)' } },
        axisLabel: { distance: -16, fontSize: 11, color: 'var(--lp-ink2)' },
        detail: {
          valueAnimation: true,
          formatter: `{value}${unit}`,
          fontSize: 44,
          fontWeight: 900,
          fontFamily: 'var(--lp-font-mono)',
          color: 'var(--lp-ink)',
          offsetCenter: [0, '60%'],
        },
        data: [{ value, name: '' }],
      },
    ],
  };
}

export function Theme03ChartGauge(props: Theme03ChartGaugeProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    value = 0,
    min = 0,
    max = 100,
    unit = '',
    showInsight = true,
    insight,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  return (
    <div className="lp-slide lp-theme03-chart-gauge">
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

      <div className="lp-theme03-chart-gauge-main">
        <div className="lp-theme03-chart-gauge-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-gauge-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className={`lp-theme03-chart-gauge-body ${hasInsight ? 'lp-theme03-chart-gauge-body--insight' : ''} lp-rise`}>
          <div className="lp-theme03-chart-gauge-chart-wrap">
            <LpEChart type="gauge" option={buildOption(value, min, max, unit)} className="lp-theme03-chart-gauge-echart" />
          </div>

          {hasInsight && (
            <div className="lp-theme03-chart-gauge-insight lp-rise">
              {(insight.value || insight.label) && (
                <div className="lp-theme03-chart-gauge-insight-headline">
                  {insight.value && (
                    <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-gauge-insight-value">{insight.value}</EditableField>
                  )}
                  {insight.label && (
                    <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-gauge-insight-sub">{insight.label}</EditableField>
                  )}
                </div>
              )}
              {insight.description && (
                <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-gauge-insight-desc">{insight.description}</EditableField>
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
