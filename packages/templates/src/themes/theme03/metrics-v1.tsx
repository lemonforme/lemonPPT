// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03MetricV1Item {
  value?: string;
  unit?: string;
  label?: string;
  change?: string;
}

export interface Theme03MetricsV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  stats?: Theme03MetricV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03MetricsV1Meta: LayoutMeta = {
  id: 'theme03_metrics_v1',
  theme: 'theme03',
  role: 'stats',
  displayName: 'Theme 03 编辑风数据墙',
  description: '深色代码编辑风多指标数据墙，2x2 或横向卡片',
  needsMedia: false,
  tags: ['stats', 'metrics', 'data-wall'],
  contentShape: 'multi-metric-cards',
};

export const theme03MetricsV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '数据墙' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'METRICS' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心{{指标}}一览' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'stats',
      label: '指标卡片',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '说明', type: 'text' },
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
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-metrics-title lp-rise">
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

export function Theme03MetricsV1(props: Theme03MetricsV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, stats, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validStats = (stats || []).filter((s) => s != null);

  return (
    <div className="lp-slide lp-theme03-metrics-v1">
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

      <div className="lp-theme03-metrics-main">
        <div className="lp-theme03-metrics-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-metrics-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {validStats.length > 0 && (
          <div className="lp-theme03-metrics-grid lp-rise">
            {validStats.map((stat, idx) => (
              <div key={idx} className="lp-theme03-metrics-card">
                <div className="lp-theme03-metrics-card-top">
                  <div className="lp-theme03-metrics-card-value">
                    <EditableField prop={`stats.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{stat.value}</EditableField>
                    {stat.unit && (
                      <EditableField prop={`stats.${idx}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-metrics-card-unit">{stat.unit}</EditableField>
                    )}
                  </div>
                  {stat.change && (
                    <EditableField prop={`stats.${idx}.change`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-metrics-card-change">{stat.change}</EditableField>
                  )}
                </div>
                <EditableField prop={`stats.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-metrics-card-label">{stat.label}</EditableField>
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
