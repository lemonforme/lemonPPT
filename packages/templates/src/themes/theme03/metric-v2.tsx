// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03MetricV2Item {
  value?: string;
  unit?: string;
  label?: string;
  change?: string;
}

export interface Theme03MetricV2Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  metrics?: Theme03MetricV2Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03MetricV2Meta: LayoutMeta = {
  id: 'theme03_metric_v2',
  theme: 'theme03',
  role: 'metric',
  displayName: 'Theme 03 编辑风多指标网格',
  description: '深色代码编辑风多指标卡片网格',
  needsMedia: false,
  tags: ['metric', 'multi-metric', 'cards'],
  contentShape: 'multi-metric-cards',
};

export const theme03MetricV2Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '数据墙' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'METRICS' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{核心}}指标一览' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'metrics',
      label: '指标',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '名称', type: 'text' },
        { key: 'change', label: '变化趋势', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-metric-v2-title lp-rise">
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

export function Theme03MetricV2(props: Theme03MetricV2Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, metrics, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validMetrics = (metrics || []).filter((m) => m != null);

  return (
    <div className="lp-slide lp-theme03-metric-v2">
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

      <div className="lp-theme03-metric-v2-main">
        <div className="lp-theme03-metric-v2-head lp-rise">
          {title && renderTitle(title, _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-metric-v2-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {validMetrics.length > 0 && (
          <div className="lp-theme03-metric-v2-grid lp-rise">
            {validMetrics.map((metric, idx) => (
              <div key={idx} className="lp-theme03-metric-v2-card">
                <div className="lp-theme03-metric-v2-card-top">
                  <div className="lp-theme03-metric-v2-card-value">
                    <EditableField prop={`metrics.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{metric.value || '0'}</EditableField>
                    {metric.unit && (
                      <EditableField prop={`metrics.${idx}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-metric-v2-card-unit">{metric.unit}</EditableField>
                    )}
                  </div>
                  {metric.change && (
                    <EditableField prop={`metrics.${idx}.change`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-metric-v2-card-change">{metric.change}</EditableField>
                  )}
                </div>
                <EditableField prop={`metrics.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-metric-v2-card-label">{metric.label || ''}</EditableField>
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
