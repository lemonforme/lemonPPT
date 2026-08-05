// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03MetricTriptychPanel {
  index?: string;
  title?: string;
  value?: string;
  subtitle?: string;
  chartType?: 'bar' | 'line' | 'area';
  chartData?: number[];
}

export interface Theme03MetricTriptychProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  panels?: Theme03MetricTriptychPanel[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03MetricTriptychMeta: LayoutMeta = {
  id: 'theme03_metric_triptych',
  theme: 'theme03',
  role: 'metric',
  displayName: 'Theme 03 编辑风三指标总览',
  description: '深色代码编辑风 2~3 个带迷你图表的指标面板',
  needsMedia: false,
  tags: ['metric', 'triptych', 'mini-chart'],
  contentShape: 'multi-metric-panels',
};

export const theme03MetricTriptychSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '指标总览' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '03' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{核心}}指标三合一' },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    {
      key: 'panels',
      label: '指标面板',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      itemSchema: [
        { key: 'index', label: '序号', type: 'text', inlineEditable: true },
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'subtitle', label: '说明', type: 'text', inlineEditable: true },
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
          itemSchema: [{ key: 'value', label: '值', type: 'number' }],
        },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function MiniChart({ type, data }: { type?: string; data?: number[] }): ReactNode {
  const values = (data || []).filter((v): v is number => typeof v === 'number');
  if (values.length < 2) return null;

  const width = 120;
  const height = 48;
  const padding = 4;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const color = 'var(--lp-accent)';

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return { x, y };
  });

  if (type === 'bar') {
    const barWidth = ((width - padding * 2) / values.length) * 0.6;
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="lp-theme03-metric-triptych-chart-svg">
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
    <svg viewBox={`0 0 ${width} ${height}`} className="lp-theme03-metric-triptych-chart-svg">
      {type === 'area' && <path d={areaPath} fill={color} opacity={0.25} />}
      <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={color} />
      ))}
    </svg>
  );
}

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-metric-triptych-title lp-rise">
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

export function Theme03MetricTriptych(props: Theme03MetricTriptychProps): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, panels = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safePanels = panels.slice(0, 3);

  return (
    <div className="lp-slide lp-theme03-metric-triptych">
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

      <div className="lp-theme03-metric-triptych-main">
        <div className="lp-theme03-metric-triptych-head lp-rise">
          {title && renderTitle(title, _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-metric-triptych-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {safePanels.length > 0 && (
          <div className={`lp-theme03-metric-triptych-body lp-theme03-metric-triptych-body--${safePanels.length}`}>
            {safePanels.map((panel, index) => (
              <div key={index} className="lp-theme03-metric-triptych-panel lp-rise">
                <div className="lp-theme03-metric-triptych-panel-head">
                  <span className="lp-theme03-metric-triptych-panel-index">{panel.index || String(index + 1).padStart(2, '0')}</span>
                  <EditableField
                    prop={`panels.${index}.title`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="h3"
                    className="lp-theme03-metric-triptych-panel-title"
                  >
                    {panel.title}
                  </EditableField>
                </div>
                <EditableField
                  prop={`panels.${index}.value`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-theme03-metric-triptych-panel-value"
                >
                  {panel.value}
                </EditableField>
                <div className="lp-theme03-metric-triptych-panel-chart">
                  <MiniChart type={panel.chartType} data={panel.chartData} />
                </div>
                <EditableField
                  prop={`panels.${index}.subtitle`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="p"
                  className="lp-theme03-metric-triptych-panel-subtitle"
                >
                  {panel.subtitle}
                </EditableField>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
