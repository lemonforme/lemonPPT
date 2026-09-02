// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ChartV1InsightItem {
  label?: string;
  value?: string;
}

export interface Theme02ChartV1Insight {
  headline?: string;
  subheadline?: string;
  items?: Theme02ChartV1InsightItem[];
  badge?: {
    text?: string;
    tone?: 'accent' | 'cool' | 'accent2';
  };
}

export interface Theme02ChartV1Props {
  title?: string;
  kicker?: string;
  subtitle?: string;
  type?: 'bar' | 'line' | 'area' | 'pie';
  labels?: string[];
  data?: number[];
  unit?: string;
  showInsight?: boolean;
  insight?: Theme02ChartV1Insight;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChartV1Meta: LayoutMeta = {
  id: 'theme02_chart_v1',
  theme: 'theme02',
  role: 'chart',
  displayName: 'Theme 02 图表页',
  description: '霓虹图表 + 洞察面板',
  needsMedia: false,
};

export const theme02ChartV1Schema: PropsSchema = {
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
      key: 'type',
      label: '图表类型',
      type: 'select',
      options: [
        { value: 'bar', label: '柱状' },
        { value: 'line', label: '折线' },
        { value: 'area', label: '面积' },
        { value: 'pie', label: '饼图' },
      ],
    },
    {
      key: 'labels',
      label: '标签',
      type: 'array',
      maxItems: 12,
      minItems: 1,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      maxItems: 12,
      minItems: 1,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'number',
        },
      ],
    },
    {
      key: 'unit',
      label: '单位',
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
        headline: '11,500',
        subheadline: 'FULL-YEAR TOTAL',
        items: [
          { label: 'Q4 环比', value: '+41%' },
          { label: '平均季度', value: '2,875' },
        ],
        badge: { text: 'Q4 增长最快', tone: 'accent' },
      },
      itemSchema: [
        {
          key: 'headline',
          label: '主数值',
          type: 'text',
        },
        {
          key: 'subheadline',
          label: '主数值说明',
          type: 'text',
        },
        {
          key: 'items',
          label: '指标列表',
          type: 'array',
          minItems: 0,
          maxItems: 6,
          itemSchema: [
            {
              key: 'label',
              label: '标签',
              type: 'text',
            },
            {
              key: 'value',
              label: '数值',
              type: 'text',
            },
          ],
        },
        {
          key: 'badge',
          label: '高亮标签',
          type: 'object',
          itemSchema: [
            {
              key: 'text',
              label: '文字',
              type: 'text',
            },
            {
              key: 'tone',
              label: '色调',
              type: 'select',
              options: [
                { value: 'accent', label: '主题色' },
                { value: 'cool', label: '冷色' },
                { value: 'accent2', label: '次强调' },
              ],
            },
          ],
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

const CHART_WIDTH = 900;
const CHART_HEIGHT = 400;
const CHART_PADDING = { top: 24, right: 32, bottom: 56, left: 64 };
const INNER_WIDTH = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
const INNER_HEIGHT = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

const CHART_COLORS = [
  { main: 'var(--lp-accent)', strong: 'var(--lp-accent)', subtle: 'var(--lp-glow-accent)' },
  { main: 'var(--lp-accent-2)', strong: 'var(--lp-accent-2)', subtle: 'var(--lp-glow-warm)' },
  { main: 'var(--lp-accent-cool)', strong: 'var(--lp-accent-cool)', subtle: 'var(--lp-glow-cool)' },
  { main: 'var(--lp-red)', strong: 'var(--lp-red)', subtle: 'rgba(255, 107, 107, 0.25)' },
  { main: 'var(--lp-violet)', strong: 'var(--lp-violet)', subtle: 'rgba(167, 139, 250, 0.25)' },
];

function chartGradientDefs(prefix: string): ReactElement {
  return (
    <defs>
      {CHART_COLORS.map((c, i) => (
        <linearGradient key={i} id={`${prefix}-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.main} stopOpacity="0.85" />
          <stop offset="100%" stopColor={c.main} stopOpacity="0.05" />
        </linearGradient>
      ))}
    </defs>
  );
}

function renderBarChart(labels: string[], data: number[], prefix: string): ReactElement {
  const max = Math.max(...data, 1);
  const count = data.length;
  const gap = count <= 6 ? 24 : 12;
  const barWidth = (INNER_WIDTH - gap * (count - 1)) / count;

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="lp-theme02-chart-svg">
      {chartGradientDefs(prefix)}
      <g transform={`translate(${CHART_PADDING.left}, ${CHART_PADDING.top})`}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={0}
            y1={INNER_HEIGHT * t}
            x2={INNER_WIDTH}
            y2={INNER_HEIGHT * t}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}
        {data.map((value, i) => {
          const h = (value / max) * INNER_HEIGHT;
          const x = i * (barWidth + gap);
          const y = INNER_HEIGHT - h;
          const color = CHART_COLORS[i % CHART_COLORS.length];
          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={h} rx={4} fill={`url(#${prefix}-grad-${i % CHART_COLORS.length})`} />
              <rect x={x} y={y} width={barWidth} height={h} rx={4} fill="none" stroke={color.main} strokeWidth={1.5} opacity={0.8} />
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill="var(--lp-ink)" fontSize={12} fontWeight={700}>
                {value}
              </text>
              <text x={x + barWidth / 2} y={INNER_HEIGHT + 20} textAnchor="middle" fill="var(--lp-ink2)" fontSize={12}>
                {labels[i] ?? ''}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function renderLineChart(labels: string[], data: number[], prefix: string, area = false): ReactElement {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const count = data.length;
  const stepX = count > 1 ? INNER_WIDTH / (count - 1) : INNER_WIDTH / 2;

  const points = data.map((value, i) => {
    const x = count > 1 ? i * stepX : INNER_WIDTH / 2;
    const y = INNER_HEIGHT - ((value - min) / range) * INNER_HEIGHT;
    return { x, y, value };
  });

  const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${lineD} L ${points[points.length - 1]?.x ?? 0} ${INNER_HEIGHT} L ${points[0]?.x ?? 0} ${INNER_HEIGHT} Z`;

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="lp-theme02-chart-svg">
      {chartGradientDefs(prefix)}
      <g transform={`translate(${CHART_PADDING.left}, ${CHART_PADDING.top})`}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={0}
            y1={INNER_HEIGHT * t}
            x2={INNER_WIDTH}
            y2={INNER_HEIGHT * t}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}
        {area && <path d={areaD} fill={`url(#${prefix}-grad-0)`} opacity={0.35} />}
        <path d={lineD} fill="none" stroke="var(--lp-accent)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill="var(--lp-bg)" stroke="var(--lp-accent)" strokeWidth={2} />
            <text x={p.x} y={p.y - 12} textAnchor="middle" fill="var(--lp-ink)" fontSize={12} fontWeight={700}>
              {p.value}
            </text>
            <text x={p.x} y={INNER_HEIGHT + 20} textAnchor="middle" fill="var(--lp-ink2)" fontSize={12}>
              {labels[i] ?? ''}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function renderPieChart(labels: string[], data: number[]): ReactElement {
  const total = data.reduce((a, b) => a + b, 0) || 1;
  const radius = 140;
  const cx = INNER_WIDTH / 2;
  const cy = INNER_HEIGHT / 2;
  let angle = -Math.PI / 2;

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="lp-theme02-chart-svg">
      <g transform={`translate(${CHART_PADDING.left}, ${CHART_PADDING.top})`}>
        {data.map((value, i) => {
          const sliceAngle = (value / total) * Math.PI * 2;
          const x1 = cx + radius * Math.cos(angle);
          const y1 = cy + radius * Math.sin(angle);
          const x2 = cx + radius * Math.cos(angle + sliceAngle);
          const y2 = cy + radius * Math.sin(angle + sliceAngle);
          const largeArc = sliceAngle > Math.PI ? 1 : 0;
          const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
          const color = CHART_COLORS[i % CHART_COLORS.length];
          const midAngle = angle + sliceAngle / 2;
          const lx = cx + (radius + 28) * Math.cos(midAngle);
          const ly = cy + (radius + 28) * Math.sin(midAngle);
          const result = (
            <g key={i}>
              <path d={d} fill={color.main} opacity={0.85} stroke="var(--lp-bg)" strokeWidth={2} />
              <text x={lx} y={ly} textAnchor={midAngle > Math.PI / 2 && midAngle < (Math.PI * 3) / 2 ? 'end' : 'start'} fill="var(--lp-ink)" fontSize={12} fontWeight={700}>
                {labels[i]} {Math.round((value / total) * 100)}%
              </text>
            </g>
          );
          angle += sliceAngle;
          return result;
        })}
      </g>
    </svg>
  );
}

export function Theme02ChartV1(props: Theme02ChartV1Props): ReactNode {
  const {
    title,
    kicker,
    subtitle,
    type = 'bar',
    labels = [],
    data = [],
    unit = '',
    showInsight = true,
    insight,
    footnote,
    _slideIdx,
    _editable,
  } = props;

  const safeLabels = labels
    .map((l) => (typeof l === 'string' ? l : (l as { item?: string }).item ?? ''))
    .filter((l): l is string => typeof l === 'string' && l.length > 0);
  const safeData = (data ?? [])
    .map((d) => (typeof d === 'number' ? d : Number((d as { item?: number }).item ?? 0)))
    .filter((d) => !Number.isNaN(d));
  const hasData = safeData.length > 0;
  const chartPrefix = `theme02-chart-${_slideIdx ?? 0}`;

  const renderChart = () => {
    if (!hasData) {
      return <div className="lp-theme02-chart-empty">请配置图表数据</div>;
    }
    if (type === 'pie') return renderPieChart(safeLabels, safeData);
    if (type === 'line') return renderLineChart(safeLabels, safeData, chartPrefix);
    if (type === 'area') return renderLineChart(safeLabels, safeData, chartPrefix, true);
    return renderBarChart(safeLabels, safeData, chartPrefix);
  };

  return (
    <div className="lp-slide lp-theme02-chart-v1">
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
          {unit && <div className="lp-theme02-chart-unit">{unit}</div>}
          {renderChart()}
          {footnote && (
            <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-footnote">
              {footnote}
            </EditableField>
          )}
        </div>
        {showInsight && insight && (
          <div className="lp-theme02-chart-insight lp-rise">
            <div className="lp-theme02-chart-insight-headline">
              <EditableField prop="insight.headline" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-insight-value">
                {insight.headline}
              </EditableField>
              <EditableField prop="insight.subheadline" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-insight-sub">
                {insight.subheadline}
              </EditableField>
            </div>
            {insight.badge?.text && (
              <div className={`lp-pill lp-theme02-chart-insight-badge ${insight.badge.tone ? `lp-theme02-chart-insight-badge--${insight.badge.tone}` : ''}`}>
                {insight.badge.text}
              </div>
            )}
            {(insight.items ?? []).length > 0 && (
              <div className="lp-theme02-chart-insight-items">
                {(insight.items ?? []).map((item, index) => (
                  <div key={index} className="lp-theme02-chart-insight-item">
                    <EditableField prop={`insight.items.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-insight-label">
                      {item.label}
                    </EditableField>
                    <EditableField prop={`insight.items.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-insight-item-value">
                      {item.value}
                    </EditableField>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
