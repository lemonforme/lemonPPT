// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05HeatmapV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  months?: string[];
  values?: number[];
  peakLabel?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05HeatmapV1Meta: LayoutMeta = {
  id: 'theme05_heatmap_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 月度热力矩阵',
  description: '月度热力矩阵 + 峰值洞察',
  needsMedia: false,
  tags: ['chart', 'heatmap', 'spectrum'],
  contentShape: 'generic-chart',
};

export const theme05HeatmapV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'HEATMAP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '月度融资热度矩阵' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '颜色越深代表当月融资事件越密集' },
    {
      key: 'months',
      label: '月份标签',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      itemSchema: [{ key: 'item', label: '月份', type: 'text', inlineEditable: true }],
    },
    {
      key: 'values',
      label: '热度值',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      itemSchema: [{ key: 'item', label: '值', type: 'number', inlineEditable: true }],
    },
    { key: 'peakLabel', label: '峰值洞察', type: 'text', inlineEditable: true, defaultValue: 'Q2 为全年融资高峰' },
  ],
};

function getHeatColor(value: number, max: number): string {
  if (max === 0) return 'var(--lp-surface-strong)';
  const ratio = value / max;
  if (ratio > 0.75) return 'var(--lp-accent)';
  if (ratio > 0.5) return 'var(--lp-accent-2)';
  if (ratio > 0.25) return 'var(--lp-accent-cool)';
  return 'var(--lp-surface-strong)';
}

export function Theme05HeatmapV1(props: Theme05HeatmapV1Props): ReactNode {
  const { kicker, title, subtitle, months = [], values = [], peakLabel, _slideIdx, _editable } = props;
  const max = Math.max(...values, 1);

  return (
    <div className="lp-slide lp-theme05-heatmap">
      {kicker && <div className="lp-theme05-kicker lp-rise">{kicker}</div>}
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title lp-rise">{title}</EditableField>
      {subtitle && (
        <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle lp-rise">{subtitle}</EditableField>
      )}
      <div className="lp-theme05-heatmap-grid lp-rise">
        {values.map((v, i) => (
          <div
            key={i}
            className="lp-theme05-heatmap-cell"
            style={{ background: getHeatColor(v, max), animationDelay: `${i * 30}ms` }}
          >
            <EditableField prop={`values.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{v}</EditableField>
          </div>
        ))}
      </div>
      <div className="lp-theme05-heatmap-labels lp-rise">
        {months.map((m, i) => (
          <div key={i} className="lp-theme05-heatmap-label">
            <EditableField prop={`months.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{m}</EditableField>
          </div>
        ))}
      </div>
      {peakLabel && (
        <div className="lp-theme05-conclusion lp-rise" style={{ marginTop: '28px' }}>
          <div className="lp-theme05-conclusion-label">峰值洞察</div>
          <div className="lp-theme05-conclusion-description">
            <EditableField prop="peakLabel" slideIdx={_slideIdx} editable={_editable} as="span">{peakLabel}</EditableField>
          </div>
        </div>
      )}
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
