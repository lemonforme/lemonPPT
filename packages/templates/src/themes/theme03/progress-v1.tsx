// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03ProgressV1Item {
  label?: string;
  value?: number;
  max?: number;
  unit?: string;
}

export interface Theme03ProgressV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  items?: Theme03ProgressV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ProgressV1Meta: LayoutMeta = {
  id: 'theme03_progress_v1',
  theme: 'theme03',
  role: 'metric',
  displayName: 'Theme 03 编辑风进度条',
  description: '深色代码编辑风 OKR 进度条，霓虹进度 + 百分比 mono 数字',
  needsMedia: false,
  tags: ['metric', 'progress', 'okr'],
  contentShape: 'progress-bars',
};

export const theme03ProgressV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '达成度' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'PROGRESS' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{Q3}} OKR 进度' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'items',
      label: '进度项',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'value', label: '当前值', type: 'number' },
        { key: 'max', label: '最大值', type: 'number' },
        { key: 'unit', label: '单位', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-progress-title lp-rise">
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

export function Theme03ProgressV1(props: Theme03ProgressV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  const validItems = items
    .filter((item): item is Theme03ProgressV1Item => item != null)
    .map((item, index) => {
      const value = Number(item.value) || 0;
      const max = Number(item.max) || 100;
      const pct = max > 0 ? Math.min(100, Math.round((value / max) * 1000) / 10) : 0;
      return { ...item, value, max, pct, index };
    })
    .slice(0, 6);

  return (
    <div className="lp-slide lp-theme03-progress-v1 lp-theme03-grid-bg">
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

      <div className="lp-theme03-progress-main">
        <div className="lp-theme03-progress-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-progress-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-progress-card lp-rise lp-theme03-corner-bracket">
          {validItems.map((item) => (
            <div key={item.index} className="lp-theme03-progress-item lp-rise" style={{ animationDelay: `${item.index * 80}ms` }}>
              <div className="lp-theme03-progress-meta">
                <EditableField prop={`items.${item.index}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-progress-label">{item.label}</EditableField>
                <div className="lp-theme03-progress-value">
                  <span className="lp-theme03-progress-number">{item.value}</span>
                  {item.unit && <span className="lp-theme03-progress-unit">{item.unit}</span>}
                  <span className="lp-theme03-progress-pct">{item.pct}%</span>
                </div>
              </div>
              <div className="lp-theme03-progress-bar">
                <div className="lp-theme03-progress-fill" style={{ width: `${item.pct}%` }} data-pct={item.pct} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
