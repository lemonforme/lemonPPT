// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ChartDonutSegment {
  label?: string;
  labelEn?: string;
  value?: string;
  percent?: string;
  color?: string;
}

export interface Theme02ChartDonutTotal {
  value?: string;
  label?: string;
}

export interface Theme02ChartDonutInsight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme02ChartDonutProps {
  title?: string;
  kicker?: string;
  subtitle?: string;
  total?: Theme02ChartDonutTotal;
  segments?: Theme02ChartDonutSegment[];
  showInsight?: boolean;
  insight?: Theme02ChartDonutInsight;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChartDonutMeta: LayoutMeta = {
  id: 'theme02_chart_donut',
  theme: 'theme02',
  role: 'chart',
  displayName: 'Theme 02 环形图拆解',
  description: '霓虹环形图 + 中心合计 + 右侧分类解读',
  needsMedia: false,
};

const DEFAULT_COLORS = [
  'var(--lp-accent)',
  'var(--lp-accent-cool)',
  'var(--lp-accent-2)',
  'var(--lp-violet)',
  'var(--lp-cyan)',
  'var(--lp-pink)',
];

export const theme02ChartDonutSchema: PropsSchema = {
  fields: [
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'total',
      label: '合计',
      type: 'object',
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '说明', type: 'text' },
      ],
    },
    {
      key: 'segments',
      label: '分类数据',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'labelEn', label: '英文名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'percent', label: '百分比', type: 'text' },
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
        value: '35%',
        label: '自然搜索占比最高',
        description: '自然搜索与社交媒体合计贡献 60% 客户来源，内容营销ROI显著。',
      },
      itemSchema: [
        {
          key: 'value',
          label: '主数值',
          type: 'text',
        },
        {
          key: 'label',
          label: '主数值说明',
          type: 'text',
        },
        {
          key: 'description',
          label: '解读文字',
          type: 'textarea',
        },
      ],
    },
    {
      key: 'footnote',
      label: '脚注',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

const CHART_SIZE = 360;
const STROKE_WIDTH = 48;
const CENTER = CHART_SIZE / 2;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function donutChart(segments: Theme02ChartDonutSegment[]): ReactElement {
  const total = segments.reduce((sum, s) => {
    const n = parseFloat(String(s.value || '0').replace(/,/g, ''));
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0) || 1;
  let offset = 0;

  return (
    <svg viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`} className="lp-theme02-chart-donut-svg">
      <defs>
        <filter id="lp-theme02-donut-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="var(--lp-glow-accent)" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter="url(#lp-theme02-donut-glow)">
        {segments.map((segment, index) => {
          const n = parseFloat(String(segment.value || '0').replace(/,/g, ''));
          const ratio = n / total;
          const dash = ratio * CIRCUMFERENCE;
          const gap = CIRCUMFERENCE - dash;
          const color = segment.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
          const ring = (
            <circle
              key={`ring-${index}`}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={color}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="lp-theme02-chart-donut-ring"
              style={{ animationDelay: `${index * 90}ms` }}
            />
          );
          offset += dash;
          return ring;
        })}
      </g>
    </svg>
  );
}

export function Theme02ChartDonut(props: Theme02ChartDonutProps): ReactNode {
  const {
    title,
    kicker,
    subtitle,
    total = { value: '0', label: '合计' },
    segments = [],
    showInsight = true,
    insight,
    footnote,
    _slideIdx,
    _editable,
  } = props;

  const validSegments = (segments || [])
    .filter((s): s is Theme02ChartDonutSegment => s != null && !!(s.label || s.value))
    .map((s) => ({ ...s }))
    .sort((a, b) => {
      const na = parseFloat(String(a.value || '0').replace(/,/g, ''));
      const nb = parseFloat(String(b.value || '0').replace(/,/g, ''));
      return nb - na;
    });

  const totalValue = validSegments.reduce((sum, s) => {
    return sum + parseFloat(String(s.value || '0').replace(/,/g, ''));
  }, 0);

  validSegments.forEach((s) => {
    if (!s.percent) {
      const n = parseFloat(String(s.value || '0').replace(/,/g, ''));
      const pct = totalValue > 0 ? Math.round((n / totalValue) * 1000) / 10 : 0;
      s.percent = `${pct}%`;
    }
  });

  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  return (
    <div className="lp-slide lp-theme02-chart-donut">
      <div className="lp-theme02-chart-layout">
        <div className="lp-theme02-chart-main lp-rise">
          <div className="lp-theme02-chart-header">
            {kicker && (
              <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
                {kicker}
              </EditableField>
            )}
            <div>
              <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-chart-title">
                {title}
              </EditableField>
              {subtitle && (
                <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-chart-subtitle">
                  {subtitle}
                </EditableField>
              )}
            </div>
          </div>

          <div className="lp-theme02-chart-donut-body">
            <div className="lp-theme02-chart-donut-chart">
              {donutChart(validSegments)}
              <div className="lp-theme02-chart-donut-center">
                <EditableField prop="total.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-donut-total-value">
                  {total.value}
                </EditableField>
                <EditableField prop="total.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-donut-total-label">
                  {total.label}
                </EditableField>
              </div>
            </div>
          </div>

          {footnote && (
            <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-footnote">
              {footnote}
            </EditableField>
          )}
        </div>

        <div className="lp-theme02-chart-donut-side lp-rise">
          <div className="lp-theme02-chart-donut-legend">
            {validSegments.map((segment, index) => (
              <div key={index} className="lp-theme02-chart-donut-legend-item lp-rise" style={{ animationDelay: `${index * 60}ms` }}>
                <span
                  className="lp-theme02-chart-donut-legend-dot"
                  style={{ backgroundColor: segment.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length] }}
                />
                <div className="lp-theme02-chart-donut-legend-text">
                  <EditableField prop={`segments.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-donut-legend-label">
                    {segment.label}
                  </EditableField>
                  {segment.labelEn && (
                    <EditableField prop={`segments.${index}.labelEn`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-donut-legend-en">
                      {segment.labelEn}
                    </EditableField>
                  )}
                </div>
                <div className="lp-theme02-chart-donut-legend-numbers">
                  <EditableField prop={`segments.${index}.percent`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-donut-legend-percent">
                    {segment.percent}
                  </EditableField>
                  <EditableField prop={`segments.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-donut-legend-value">
                    {segment.value}
                  </EditableField>
                </div>
              </div>
            ))}
          </div>

          {hasInsight && (
            <div className="lp-theme02-chart-insight lp-theme02-chart-donut-insight">
              {(insight.value || insight.label) && (
                <div className="lp-theme02-chart-insight-headline">
                  {insight.value && (
                    <EditableField
                      prop="insight.value"
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="div"
                      className="lp-theme02-chart-insight-value"
                    >
                      {insight.value}
                    </EditableField>
                  )}
                  {insight.label && (
                    <EditableField
                      prop="insight.label"
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="div"
                      className="lp-theme02-chart-insight-sub"
                    >
                      {insight.label}
                    </EditableField>
                  )}
                </div>
              )}
              {insight.description && (
                <EditableField
                  prop="insight.description"
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="p"
                  className="lp-theme02-chart-funnel-description"
                >
                  {insight.description}
                </EditableField>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
