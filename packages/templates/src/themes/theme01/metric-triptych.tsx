// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01MetricTriptychPanel {
  index?: string;
  title?: string;
  value?: string;
  subtitle?: string;
  chartType?: 'bar' | 'line' | 'area';
  chartData?: number[];
}

export interface Theme01MetricTriptychProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  panels?: Theme01MetricTriptychPanel[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01MetricTriptychMeta: LayoutMeta = {
  id: 'theme01_metric_triptych',
  theme: 'theme01',
  role: 'metric',
  displayName: 'Theme 01 三指标总览',
  description: '2~3 个带迷你图表的指标面板',
  needsMedia: false,
};

export const theme01MetricTriptychSchema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
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
      key: 'panels',
      label: '指标面板',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      itemSchema: [
        {
          key: 'index',
          label: '序号',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'title',
          label: '标题',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'value',
          label: '数值',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'subtitle',
          label: '说明',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'chartType',
          label: '图表类型',
          type: 'select',
          options: [
            { label: '柱状', value: 'bar' },
            { label: '折线', value: 'line' },
            { label: '面积', value: 'area' },
          ],
        },
        {
          key: 'chartData',
          label: '图表数据',
          type: 'array',
          maxItems: 8,
          itemSchema: [
            {
              key: 'value',
              label: '值',
              type: 'number',
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

function MiniChart({ type, data, color }: { type?: string; data?: number[]; color: string }): ReactNode {
  const values = (data || []).filter((v): v is number => typeof v === 'number');
  if (values.length < 2) return null;

  const width = 120;
  const height = 48;
  const padding = 4;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return { x, y };
  });

  if (type === 'bar') {
    const barWidth = (width - padding * 2) / values.length * 0.6;
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="lp-metric-triptych-chart-svg">
        {values.map((v, i) => {
          const barHeight = ((v - min) / range) * (height - padding * 2);
          const x = padding + i * ((width - padding * 2) / values.length) + barWidth * 0.3;
          const y = height - padding - barHeight;
          return <rect key={i} x={x} y={y} width={barWidth} height={Math.max(barHeight, 1)} rx={2} fill={color} />;
        })}
      </svg>
    );
  }

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="lp-metric-triptych-chart-svg">
      {type === 'area' && <path d={areaPath} fill={color} opacity={0.25} />}
      <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={color} />
      ))}
    </svg>
  );
}

export function Theme01MetricTriptych(props: Theme01MetricTriptychProps): ReactNode {
  const { kicker, title, subtitle, panels = [], footnote, _slideIdx, _editable } = props;
  const safePanels = panels.slice(0, 3);
  const colors = ['var(--lp-blue)', 'var(--lp-green)', 'var(--lp-amber)'];

  return (
    <div className="lp-slide lp-metric-triptych">
      <div className="lp-metric-triptych-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-metric-triptych-title lp-rise">
            {title}
          </EditableField>
        )}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-metric-triptych-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className={`lp-metric-triptych-body lp-metric-triptych-body--${safePanels.length}`}>
        {safePanels.map((panel, index) => (
          <div key={index} className="lp-card lp-metric-triptych-panel lp-rise">
            <div className="lp-metric-triptych-panel-head">
              <span className="lp-metric-triptych-panel-index">{panel.index || String(index + 1).padStart(2, '0')}</span>
              <EditableField
                prop={`panels.${index}.title`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="h3"
                className="lp-metric-triptych-panel-title"
              >
                {panel.title}
              </EditableField>
            </div>
            <EditableField
              prop={`panels.${index}.value`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-metric-triptych-panel-value"
            >
              {panel.value}
            </EditableField>
            <div className="lp-metric-triptych-panel-chart">
              <MiniChart type={panel.chartType} data={panel.chartData} color={colors[index % colors.length]} />
            </div>
            <EditableField
              prop={`panels.${index}.subtitle`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="p"
              className="lp-metric-triptych-panel-subtitle"
            >
              {panel.subtitle}
            </EditableField>
          </div>
        ))}
      </div>
      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-metric-triptych-footnote lp-rise">
          {footnote}
        </EditableField>
      )}
    </div>
  );
}
