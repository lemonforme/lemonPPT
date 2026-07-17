import type { LayoutMeta } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface ChartV1Props {
  title: string;
  kicker?: string;
  type?: 'bar' | 'line' | 'pie';
  labels?: string[];
  data?: number[];
  unit?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const chartV1Meta: LayoutMeta = {
  id: 'minimal_chart_v1',
  theme: 'minimal',
  role: 'chart',
  displayName: '基础图表',
  description: '柱状图、折线图、饼图，适合数据展示',
  needsMedia: false,
};

const CHART_WIDTH = 840;
const CHART_HEIGHT = 380;
const CHART_PADDING = { top: 20, right: 24, bottom: 48, left: 56 };
const INNER_WIDTH = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
const INNER_HEIGHT = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
const COLOR_COUNT = 6;

function maxValue(values: number[]): number {
  if (values.length === 0) return 0;
  const max = Math.max(...values);
  return max === 0 ? 1 : max;
}

function niceStep(max: number): number {
  const rough = max / 5;
  const pow10 = Math.pow(10, Math.floor(Math.log10(rough)));
  const residual = rough / pow10;
  let step = pow10;
  if (residual > 5) step = pow10 * 10;
  else if (residual > 2) step = pow10 * 5;
  else if (residual > 1) step = pow10 * 2;
  return step;
}

function barChart(labels: string[], data: number[]): ReactElement {
  const max = maxValue(data);
  const step = niceStep(max);
  const yMax = Math.ceil(max / step) * step;

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="lp-chart-svg">
      {/* grid lines */}
      {Array.from({ length: Math.floor(yMax / step) + 1 }).map((_, i) => {
        const y = CHART_PADDING.top + INNER_HEIGHT - (i * step * INNER_HEIGHT) / yMax;
        return (
          <g key={`grid-${i}`}>
            <line x1={CHART_PADDING.left} y1={y} x2={CHART_WIDTH - CHART_PADDING.right} y2={y} className="lp-chart-grid" />
            <text x={CHART_PADDING.left - 10} y={y + 4} className="lp-chart-axis-text" textAnchor="end">
              {Math.round(i * step)}
            </text>
          </g>
        );
      })}

      {/* bars */}
      {data.map((value, index) => {
        const barWidth = INNER_WIDTH / data.length * 0.55;
        const x = CHART_PADDING.left + (index + 0.5) * (INNER_WIDTH / data.length) - barWidth / 2;
        const height = (value / yMax) * INNER_HEIGHT;
        const y = CHART_PADDING.top + INNER_HEIGHT - height;
        return (
          <g key={`bar-${index}`}>
            <rect x={x} y={y} width={barWidth} height={height} rx={6} className={`lp-chart-bar lp-chart-color-${index % COLOR_COUNT}`} />
            <text x={x + barWidth / 2} y={CHART_HEIGHT - CHART_PADDING.bottom + 24} className="lp-chart-axis-text" textAnchor="middle">
              {labels[index] || ''}
            </text>
            <text x={x + barWidth / 2} y={y - 8} className="lp-chart-value-text" textAnchor="middle">
              {value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function lineChart(labels: string[], data: number[]): ReactElement {
  const max = maxValue(data);
  const step = niceStep(max);
  const yMax = Math.ceil(max / step) * step;

  const points = data.map((value, index) => {
    const x = CHART_PADDING.left + (index + 0.5) * (INNER_WIDTH / data.length);
    const y = CHART_PADDING.top + INNER_HEIGHT - (value / yMax) * INNER_HEIGHT;
    return { x, y, value, label: labels[index] || '' };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="lp-chart-svg">
      {/* grid lines */}
      {Array.from({ length: Math.floor(yMax / step) + 1 }).map((_, i) => {
        const y = CHART_PADDING.top + INNER_HEIGHT - (i * step * INNER_HEIGHT) / yMax;
        return (
          <g key={`grid-${i}`}>
            <line x1={CHART_PADDING.left} y1={y} x2={CHART_WIDTH - CHART_PADDING.right} y2={y} className="lp-chart-grid" />
            <text x={CHART_PADDING.left - 10} y={y + 4} className="lp-chart-axis-text" textAnchor="end">
              {Math.round(i * step)}
            </text>
          </g>
        );
      })}

      <polyline points={polylinePoints} fill="none" className="lp-chart-line" strokeWidth={4} />

      {points.map((p, index) => (
        <g key={`point-${index}`}>
          <circle cx={p.x} cy={p.y} r={6} className={`lp-chart-dot lp-chart-color-${index % COLOR_COUNT}`} />
          <text x={p.x} y={CHART_HEIGHT - CHART_PADDING.bottom + 24} className="lp-chart-axis-text" textAnchor="middle">
            {p.label}
          </text>
          <text x={p.x} y={p.y - 14} className="lp-chart-value-text" textAnchor="middle">
            {p.value}
          </text>
        </g>
      ))}
    </svg>
  );
}

function pieChart(labels: string[], data: number[]): ReactElement {
  const total = data.reduce((sum, v) => sum + v, 0) || 1;
  const radius = Math.min(INNER_WIDTH, INNER_HEIGHT) / 2;
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
    const labelRadius = radius * 0.7;
    const labelX = cx + labelRadius * Math.cos(midAngle);
    const labelY = cy + labelRadius * Math.sin(midAngle);

    startAngle = endAngle;
    return { path, label: labels[index] || '', value, labelX, labelY, index };
  });

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="lp-chart-svg">
      {slices.map((slice) => (
        <g key={`slice-${slice.index}`}>
          <path d={slice.path} className={`lp-chart-slice lp-chart-color-${slice.index % COLOR_COUNT}`} />
          <text x={slice.labelX} y={slice.labelY} className="lp-chart-pie-label" textAnchor="middle" dominantBaseline="middle">
            {slice.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function ChartV1(props: ChartV1Props): ReactNode {
  const { title, kicker, type = 'bar', labels = [], data = [], unit, _slideIdx, _editable } = props;

  const chartElement = type === 'line' ? lineChart(labels, data) : type === 'pie' ? pieChart(labels, data) : barChart(labels, data);

  return (
    <div className="lp-slide lp-chart-v1">
      <div className="lp-chart-inner">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading lp-chart-title">
          {title}
        </EditableField>
        <div className="lp-chart-wrapper">
          {chartElement}
        </div>
        {unit && <div className="lp-chart-unit">单位：{unit}</div>}
      </div>
    </div>
  );
}
