// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06MetricGridV1Metric {
  value: string;
  unit?: string;
  label: string;
  change?: string;
  accent?: boolean;
}

export interface Theme06MetricGridV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  metrics?: Theme06MetricGridV1Metric[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06MetricGridV1Meta: LayoutMeta = {
  id: 'theme06_metric_grid_v1',
  theme: 'theme06',
  role: 'metric',
  displayName: 'Theme 06 指标网格',
  description: '2×2 指标网格卡：数值 + 单位 + 标签 + 变化徽章',
  needsMedia: true,
  tags: ['metric', 'grid', 'big-number'],
  contentShape: 'metric',
};

export const theme06MetricGridV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'METRICS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心指标一览' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '本季度关键数据表现' },
    {
      key: 'metrics',
      label: '指标',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'change', label: '变化', type: 'text' },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
  ],
};

export function Theme06MetricGridV1(props: Theme06MetricGridV1Props): ReactNode {
  const { kicker, title, subtitle, metrics = [], _slideIdx, _editable } = props;
  const validMetrics = metrics.slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-metric lp-theme06-metric-grid-layout">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>}
        <div className="lp-theme06-metric-grid">
          {validMetrics.map((m, i) => (
            <div key={i} className={`lp-theme06-metric-grid-item ${m.accent ? 'accent' : ''}`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="lp-theme06-metric-grid-value">
                <EditableField prop={`metrics.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{m.value}</EditableField>
                {m.unit && <EditableField prop={`metrics.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme06-metric-grid-unit">{m.unit}</EditableField>}
              </div>
              <div className="lp-theme06-metric-grid-label">
                <EditableField prop={`metrics.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{m.label}</EditableField>
              </div>
              {m.change && (
                <div className={`lp-theme06-metric-grid-change ${m.change.startsWith('-') ? 'negative' : ''}`}>
                  <EditableField prop={`metrics.${i}.change`} slideIdx={_slideIdx} editable={_editable} as="span">{m.change}</EditableField>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="lp-theme06-glow-line lp-rise" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
