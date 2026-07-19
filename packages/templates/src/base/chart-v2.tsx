import type { LayoutMeta } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface ChartV2Props {
  title: string;
  kicker?: string;
  labels?: string[];
  datasets?: { label?: string; data?: number[]; color?: string }[];
  unit?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const chartV2Meta: LayoutMeta = {
  id: 'chart_v2',
  theme: 'base',
  role: 'chart',
  displayName: '多系列图表',
  description: '多组数据对比折线/柱状图，适合趋势与对比分析',
  needsMedia: false,
};

const CHART_WIDTH = 880;
const CHART_HEIGHT = 380;
const CHART_PADDING = { top: 24, right: 24, bottom: 48, left: 64 };
const INNER_WIDTH = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
const INNER_HEIGHT = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
const DEFAULT_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

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

function multiSeriesChart(
  labels: string[],
  datasets: { label?: string; data?: number[]; color?: string }[],
): ReactElement {
  const allValues = datasets.flatMap((d) => d.data ?? []);
  const max = maxValue(allValues);
  const step = niceStep(max);
  const yMax = Math.ceil(max / step) * step;
  const barGroupWidth = INNER_WIDTH / labels.length * 0.65;
  const barWidth = datasets.length > 0 ? barGroupWidth / datasets.length : 0;

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="lp-chart-v2-svg">
      {/* grid lines */}
      {Array.from({ length: Math.floor(yMax / step) + 1 }).map((_, i) => {
        const y = CHART_PADDING.top + INNER_HEIGHT - (i * step * INNER_HEIGHT) / yMax;
        return (
          <g key={`grid-${i}`}>
            <line
              x1={CHART_PADDING.left}
              y1={y}
              x2={CHART_WIDTH - CHART_PADDING.right}
              y2={y}
              className="lp-chart-v2-grid"
            />
            <text
              x={CHART_PADDING.left - 10}
              y={y + 4}
              className="lp-chart-v2-axis-text"
              textAnchor="end"
            >
              {Math.round(i * step)}
            </text>
          </g>
        );
      })}

      {/* bars per dataset */}
      {labels.map((label, index) => {
        const groupX = CHART_PADDING.left + (index + 0.5) * (INNER_WIDTH / labels.length) - barGroupWidth / 2;
        return (
          <g key={`group-${index}`}>
            {datasets.map((dataset, dIndex) => {
              const value = (dataset.data ?? [])[index] ?? 0;
              const x = groupX + dIndex * barWidth;
              const height = (value / yMax) * INNER_HEIGHT;
              const y = CHART_PADDING.top + INNER_HEIGHT - height;
              return (
                <rect
                  key={`bar-${index}-${dIndex}`}
                  x={x}
                  y={y}
                  width={barWidth * 0.85}
                  height={height}
                  rx={4}
                  fill={dataset.color || DEFAULT_COLORS[dIndex % DEFAULT_COLORS.length]}
                  className="lp-chart-v2-bar"
                />
              );
            })}
            <text
              x={CHART_PADDING.left + (index + 0.5) * (INNER_WIDTH / labels.length)}
              y={CHART_HEIGHT - CHART_PADDING.bottom + 24}
              className="lp-chart-v2-axis-text"
              textAnchor="middle"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* legend */}
      {datasets.length > 1 && (
        <g transform={`translate(${CHART_PADDING.left}, 4)`}>
          {datasets.map((dataset, dIndex) => {
            const color = dataset.color || DEFAULT_COLORS[dIndex % DEFAULT_COLORS.length];
            const x = dIndex * 140;
            return (
              <g key={`legend-${dIndex}`} transform={`translate(${x}, 0)`}>
                <rect x={0} y={0} width={12} height={12} rx={2} fill={color} />
                <text x={18} y={11} className="lp-chart-v2-legend-text">
                  {dataset.label || `系列 ${dIndex + 1}`}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}

export function ChartV2(props: ChartV2Props): ReactNode {
  const { title, kicker, labels = [], datasets = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-chart-v2">
      <div className="lp-chart-v2-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-chart-v2-body">
        {multiSeriesChart(labels, datasets)}
      </div>
    </div>
  );
}
