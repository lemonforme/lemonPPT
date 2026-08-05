// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03MetricV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  value?: string;
  unit?: string;
  description?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03MetricV1Meta: LayoutMeta = {
  id: 'theme03_metric_v1',
  theme: 'theme03',
  role: 'metric',
  displayName: 'Theme 03 编辑风单指标',
  description: '深色代码编辑风超大单数字指标页',
  needsMedia: false,
  tags: ['metric', 'big-number', 'single-stat'],
  contentShape: 'single-stat',
};

export const theme03MetricV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '核心指标' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'FIGURE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '全年{{AI}}风险投资额' },
    { key: 'value', label: '主数值', type: 'text', inlineEditable: true, defaultValue: '970' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'description', label: '解读说明', type: 'textarea', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-metric-v1-title lp-rise">
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

export function Theme03MetricV1(props: Theme03MetricV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, value, unit, description, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-metric-v1">
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

      <div className="lp-theme03-metric-v1-main">
        {title && renderTitle(title, _slideIdx, _editable)}
        <div className="lp-theme03-metric-v1-value-row lp-rise">
          {value && (
            <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-metric-v1-value">{value}</EditableField>
          )}
          {unit && (
            <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-metric-v1-unit">{unit}</EditableField>
          )}
        </div>
        {description && (
          <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-metric-v1-description lp-rise">{description}</EditableField>
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
