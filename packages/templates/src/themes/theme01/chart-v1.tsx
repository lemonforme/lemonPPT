// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet, GlassCard } from './shared.js';
export interface Theme01ChartV1InsightItem {
  label?: string;
  value?: string;
}

export interface Theme01ChartV1Insight {
  headline?: string;
  subheadline?: string;
  items?: Theme01ChartV1InsightItem[];
  badge?: {
    text?: string;
    tone?: 'accent' | 'success' | 'warning';
  };
}

export interface Theme01ChartV1Props {
  title?: string;
  kicker?: string;
  subtitle?: string;
  type?: 'bar' | 'line' | 'area' | 'pie';
  labels?: string[];
  data?: number[];
  unit?: string;
  showInsight?: boolean;
  insight?: Theme01ChartV1Insight;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01ChartV1Meta: LayoutMeta = {
  id: 'theme01_chart_v1',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 图表页',
  description: '玻璃卡片 + SVG 图表（柱状/折线/饼图）',
  needsMedia: false,
  tags: ['chart', 'data', 'svg', 'light'],
  contentShape: 'chart',
};
export const theme01ChartV1Schema: PropsSchema = {
  fields: [
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'type',
      label: '图表类型',
      type: 'select',
      options: [
        {
          value: 'bar',
          label: '柱状'
        },
        {
          value: 'line',
          label: '折线'
        },
        {
          value: 'area',
          label: '面积'
        },
        {
          value: 'pie',
          label: '饼图'
        }
      ]
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
          inlineEditable: true
        }
      ]
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
          type: 'number'
        }
      ]
    },
    {
      key: 'unit',
      label: '单位',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'showInsight',
      label: '重点强调',
      type: 'boolean',
      defaultValue: true
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
          { label: '平均季度', value: '2,875' }
        ],
        badge: { text: 'Q4 增长最快', tone: 'success' }
      },
      itemSchema: [
        {
          key: 'headline',
          label: '主数值',
          type: 'text'
        },
        {
          key: 'subheadline',
          label: '主数值说明',
          type: 'text'
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
              type: 'text'
            },
            {
              key: 'value',
              label: '数值',
              type: 'text'
            }
          ]
        },
        {
          key: 'badge',
          label: '高亮标签',
          type: 'object',
          itemSchema: [
            {
              key: 'text',
              label: '文字',
              type: 'text'
            },
            {
              key: 'tone',
              label: '色调',
              type: 'select',
              options: [
                { value: 'accent', label: '主题色' },
                { value: 'success', label: '成功绿' },
                { value: 'warning', label: '警告黄' }
              ]
            }
          ]
        }
      ]
    },
    {
      key: 'footnote',
      label: '脚注',
      type: 'text',
      inlineEditable: true
    }
  ]
};
const CHART_WIDTH = 900;
const CHART_HEIGHT = 400;
const CHART_PADDING = { top: 24, right: 32, bottom: 56, left: 64 };
const INNER_WIDTH = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
const INNER_HEIGHT = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
const COLOR_COUNT = 5;

const CHART_COLORS = [
  { main: 'var(--lp-blue)', strong: 'var(--lp-blue)', subtle: 'var(--lp-blue)' },
  { main: 'var(--lp-green)', strong: 'var(--lp-green)', subtle: 'var(--lp-green)' },
  { main: 'var(--lp-amber)', strong: 'var(--lp-amber)', subtle: 'var(--lp-amber)' },
  { main: 'var(--lp-red)', strong: 'var(--lp-red)', subtle: 'var(--lp-red)' },
  { main: 'var(--lp-violet)', strong: 'var(--lp-violet)', subtle: 'var(--lp-violet)' },
];

function chartGradientDefs(prefix: string): ReactElement {
  return (
    <defs>
      <filter id={`${prefix}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.10)" floodOpacity="1" />
      </filter>
      {CHART_COLORS.map((color, i) => (
        <linearGradient key={i} id={`${prefix}-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color.main} stopOpacity="1" />
          <stop offset="100%" stopColor={color.main} stopOpacity="0.68" />
        </linearGradient>
      ))}
      <linearGradient id={`${prefix}-area-grad`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--lp-blue)" stopOpacity="0.35" />
        <stop offset="100%" stopColor="var(--lp-blue)" stopOpacity="0.02" />
      </linearGradient>
    </defs>
  );
}
function maxValue(values: number[]): number {
  if (values.length === 0)
    return 0;
  const max = Math.max(...values);
  return max === 0 ? 1 : max;
}
function niceStep(max: number): number {
  const rough = max / 5;
  const pow10 = Math.pow(10, Math.floor(Math.log10(rough)));
  const residual = rough / pow10;
  let step = pow10;
  if (residual > 5)
    step = pow10 * 10;
  else if (residual > 2)
    step = pow10 * 5;
  else if (residual > 1)
    step = pow10 * 2;
  return step;
}
function barChart(labels: string[], data: number[]): ReactElement {
  const max = maxValue(data);
  const step = niceStep(max);
  const yMax = Math.ceil(max / step) * step;
  const gradPrefix = 'lp-chart-bar';
  return (<svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="lp-chart-svg">
      {chartGradientDefs(gradPrefix)}
      {Array.from({ length: Math.floor(yMax / step) + 1 }).map((_, i) => {
      const y = CHART_PADDING.top + INNER_HEIGHT - (i * step * INNER_HEIGHT) / yMax;
      return (<g key={`grid-${i}`}>
      <line x1={CHART_PADDING.left} y1={y} x2={CHART_WIDTH - CHART_PADDING.right} y2={y} className="lp-chart-grid"/>
      <text x={CHART_PADDING.left - 10} y={y + 4} className="lp-chart-axis-text" textAnchor="end">
              {Math.round(i * step)}
      </text>
          </g>);
    })}

      {data.map((value, index) => {
      const barWidth = (INNER_WIDTH / data.length) * 0.5;
      const x = CHART_PADDING.left + (index + 0.5) * (INNER_WIDTH / data.length) - barWidth / 2;
      const height = (value / yMax) * INNER_HEIGHT;
      const y = CHART_PADDING.top + INNER_HEIGHT - height;
      return (<g key={`bar-${index}`}>
      <rect x={x} y={y} width={barWidth} height={height} rx={10} className={`lp-chart-bar lp-chart-color-${index % COLOR_COUNT}`} fill={`url(#${gradPrefix}-grad-${index % COLOR_COUNT})`} filter={`url(#${gradPrefix}-shadow)`} style={{ animationDelay: `${index * 60}ms` }}/>
      <text x={x + barWidth / 2} y={CHART_HEIGHT - CHART_PADDING.bottom + 24} className="lp-chart-axis-text" textAnchor="middle">
              {labels[index] || ''}
      </text>
      <text x={x + barWidth / 2} y={y - 14} className="lp-chart-value-text" textAnchor="middle">
              {value}
      </text>
          </g>);
    })}
  </svg>);
}
function smoothLinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  const smoothing = 0.18;
  const clone = [
    points[0],
    ...points,
    points[points.length - 1],
  ];
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = clone[i];
    const curr = clone[i + 1];
    const next = clone[i + 2];
    const after = clone[i + 3] ?? next;
    const cp1x = prev.x + (curr.x - prev.x) * (1 - smoothing) + (next.x - prev.x) * smoothing * 0.5;
    const cp1y = prev.y + (curr.y - prev.y) * (1 - smoothing) + (next.y - prev.y) * smoothing * 0.5;
    const cp2x = curr.x - (after.x - prev.x) * smoothing * 0.5;
    const cp2y = curr.y - (after.y - prev.y) * smoothing * 0.5;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function lineChart(labels: string[], data: number[], areaMode = false): ReactElement {
  const max = maxValue(data);
  const step = niceStep(max);
  const yMax = Math.ceil(max / step) * step;
  const points = data.map((value, index) => {
    const x = CHART_PADDING.left + (index + 0.5) * (INNER_WIDTH / data.length);
    const y = CHART_PADDING.top + INNER_HEIGHT - (value / yMax) * INNER_HEIGHT;
    return { x, y, value, label: labels[index] || '' };
  });
  const gradPrefix = 'lp-chart-line';
  const linePath = smoothLinePath(points);
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? CHART_WIDTH - CHART_PADDING.right} ${CHART_PADDING.top + INNER_HEIGHT} L ${points[0]?.x ?? CHART_PADDING.left} ${CHART_PADDING.top + INNER_HEIGHT} Z`;
  return (<svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="lp-chart-svg">
      {chartGradientDefs(gradPrefix)}
      {Array.from({ length: Math.floor(yMax / step) + 1 }).map((_, i) => {
      const y = CHART_PADDING.top + INNER_HEIGHT - (i * step * INNER_HEIGHT) / yMax;
      return (<g key={`grid-${i}`}>
      <line x1={CHART_PADDING.left} y1={y} x2={CHART_WIDTH - CHART_PADDING.right} y2={y} className="lp-chart-grid"/>
      <text x={CHART_PADDING.left - 10} y={y + 4} className="lp-chart-axis-text" textAnchor="end">
              {Math.round(i * step)}
      </text>
          </g>);
    })}

      <path d={areaPath} fill={`url(#${gradPrefix}-area-grad)`} className="lp-chart-area" style={{ opacity: areaMode ? 1 : 0.9 }}/>
      <path d={linePath} fill="none" className="lp-chart-line" strokeWidth={areaMode ? 3 : 5} filter={`url(#${gradPrefix}-shadow)`}/>

      {points.map((p, index) => (<g key={`point-${index}`}>
          <circle cx={p.x} cy={p.y} r={14} className={`lp-chart-dot-halo`} fill="var(--lp-blue)" opacity={areaMode ? '0.22' : '0.14'} style={{ animationDelay: `${index * 80}ms` }}/>
          <circle cx={p.x} cy={p.y} r={areaMode ? 9 : 8} className={`lp-chart-dot`} fill="var(--lp-white)" stroke="var(--lp-blue)" strokeWidth={areaMode ? 5 : 4} style={{ animationDelay: `${index * 80}ms` }}/>
          <text x={p.x} y={CHART_HEIGHT - CHART_PADDING.bottom + 24} className="lp-chart-axis-text" textAnchor="middle">
      {p.label}
          </text>
          <text x={p.x} y={p.y - 24} className="lp-chart-value-text" textAnchor="middle" style={{ animationDelay: `${index * 80 + 120}ms` }}>
      {p.value}
          </text>
    </g>))}
  </svg>);
}
function pieChart(labels: string[], data: number[]): ReactElement {
  const total = data.reduce((sum, v) => sum + v, 0) || 1;
  const radius = Math.min(INNER_WIDTH, INNER_HEIGHT) / 2 - 12;
  const cx = CHART_WIDTH / 2;
  const cy = CHART_HEIGHT / 2;
  let startAngle = 0;
  const slices = data.map((value, index) => {
    const angle = (value / total) * Math.PI * 2;
    const endAngle = startAngle + angle;
    const largeArc = angle > Math.PI ? 1 : 0;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    const midAngle = startAngle + angle / 2;
    const labelRadius = radius * 0.62;
    const labelX = cx + labelRadius * Math.cos(midAngle);
    const labelY = cy + labelRadius * Math.sin(midAngle);
    startAngle = endAngle;
    return { path, label: labels[index] || '', value, labelX, labelY, index };
  });
  const gradPrefix = 'lp-chart-pie';
  return (<svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="lp-chart-svg">
      {chartGradientDefs(gradPrefix)}
      {slices.map((slice) => (<g key={`slice-${slice.index}`}>
          <path d={slice.path} className={`lp-chart-slice lp-chart-color-${slice.index % COLOR_COUNT}`} fill={`url(#${gradPrefix}-grad-${slice.index % COLOR_COUNT})`} filter={`url(#${gradPrefix}-shadow)`} style={{ animationDelay: `${slice.index * 70}ms` }}/>
          <text x={slice.labelX} y={slice.labelY - 8} className="lp-chart-pie-label" textAnchor="middle" dominantBaseline="middle" style={{ animationDelay: `${slice.index * 70 + 160}ms` }}>
      {slice.label}
          </text>
          <text x={slice.labelX} y={slice.labelY + 12} className="lp-chart-pie-value" textAnchor="middle" dominantBaseline="middle" style={{ animationDelay: `${slice.index * 70 + 240}ms` }}>
      {Math.round((slice.value / total) * 100)}%
          </text>
    </g>))}
  </svg>);
}
function insightPanel(
  insight: Theme01ChartV1Insight | undefined,
  slideIdx: number | undefined,
  editable: boolean | undefined
): ReactNode {
  if (!insight) return null;
  const hasContent = insight.headline || insight.subheadline || (insight.items && insight.items.length > 0) || insight.badge?.text;
  if (!hasContent) return null;

  const badgeTone = insight.badge?.tone || 'accent';
  const badgeClass = `lp-chart-insight-badge lp-chart-insight-badge--${badgeTone}`;

  return (
    <div className="lp-chart-insight">
      {(insight.headline || insight.subheadline) && (
        <div className="lp-chart-insight-head">
          {insight.headline && (
            <EditableField
              prop="insight.headline"
              slideIdx={slideIdx}
              editable={editable}
              as="div"
              className="lp-chart-insight-headline"
            >
              {insight.headline}
            </EditableField>
          )}
          {insight.subheadline && (
            <EditableField
              prop="insight.subheadline"
              slideIdx={slideIdx}
              editable={editable}
              as="div"
              className="lp-chart-insight-subheadline"
            >
              {insight.subheadline}
            </EditableField>
          )}
        </div>
      )}

      {insight.items && insight.items.length > 0 && (
        <div className="lp-chart-insight-items">
          {insight.items.map((item, index) => (
            <div key={index} className="lp-chart-insight-item">
              <EditableField
                prop={`insight.items.${index}.label`}
                slideIdx={slideIdx}
                editable={editable}
                as="span"
                className="lp-chart-insight-item-label"
              >
                {item.label || ''}
              </EditableField>
              <EditableField
                prop={`insight.items.${index}.value`}
                slideIdx={slideIdx}
                editable={editable}
                as="span"
                className="lp-chart-insight-item-value"
              >
                {item.value || ''}
              </EditableField>
            </div>
          ))}
        </div>
      )}

      {insight.badge?.text && (
        <EditableField
          prop="insight.badge.text"
          slideIdx={slideIdx}
          editable={editable}
          as="div"
          className={badgeClass}
        >
          {insight.badge.text}
        </EditableField>
      )}
    </div>
  );
}

export function Theme01ChartV1(props: Theme01ChartV1Props): ReactNode {
  const {
    title,
    kicker,
    subtitle,
    type = 'bar',
    labels = [],
    data = [],
    unit,
    showInsight = true,
    insight,
    footnote,
    _slideIdx,
    _editable,
  } = props;

  const hasInsight = showInsight !== false && !!insight && (
    !!insight.headline ||
    !!insight.subheadline ||
    (insight.items && insight.items.length > 0) ||
    !!insight.badge?.text
  );

  const chartElement = type === 'line' || type === 'area'
    ? lineChart(labels, data, type === 'area')
    : type === 'pie'
      ? pieChart(labels, data)
      : barChart(labels, data);

  return (
    <Sheet substrate="light" frame="chart-canvas" className={`lp-chart-v1 ${hasInsight ? 'lp-chart-v1--with-insight' : ''}`}>
      <GlassCard className="lp-chart-card lp-rise">
        <div className="lp-chart-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div className="lp-chart-titles">
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-chart-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>

        <div className={`lp-chart-body ${hasInsight ? 'lp-chart-body--with-insight' : ''}`}>
          <div className="lp-chart-wrapper">
            {chartElement}
          </div>
          {hasInsight && insightPanel(insight, _slideIdx, _editable)}
        </div>

        {(unit || footnote) && (
          <div className="lp-chart-footer">
            {unit && (
              <div className="lp-chart-unit">
                单位：
                <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span">
                  {unit}
                </EditableField>
              </div>
            )}
            {footnote && (
              <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-chart-footnote">
                {footnote}
              </EditableField>
            )}
          </div>
        )}
      </GlassCard>
    </Sheet>
  );
}
