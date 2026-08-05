// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03ConclusionV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  points?: Array<{ item?: string }>;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ConclusionV1Meta: LayoutMeta = {
  id: 'theme03_conclusion_v1',
  theme: 'theme03',
  role: 'closing',
  displayName: 'Theme 03 编辑风结论',
  description: '深色代码编辑风结论页，顶部标签 + 结论卡片矩阵',
  needsMedia: false,
  tags: ['closing', 'conclusion', 'summary'],
  contentShape: 'conclusion-cards',
};

export const theme03ConclusionV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '结论' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'CONCLUSION' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心结论' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'points',
      label: '要点',
      type: 'array',
      maxItems: 4,
      minItems: 2,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-conclusion-title lp-rise">
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

export function Theme03ConclusionV1(props: Theme03ConclusionV1Props): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    points = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;
  const safePoints = points.slice(0, 4);

  return (
    <div className="lp-slide lp-theme03-conclusion-v1">
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

      <div className="lp-theme03-conclusion-main">
        <div className="lp-theme03-conclusion-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-conclusion-subtitle">{subtitle}</EditableField>
          )}
        </div>
        {safePoints.length > 0 && (
          <div className="lp-theme03-conclusion-grid">
            {safePoints.map((point, index) => (
              <div key={index} className="lp-theme03-conclusion-card lp-rise" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="lp-theme03-conclusion-number">{String(index + 1).padStart(2, '0')}</div>
                <EditableField
                  prop={`points.${index}.item`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="p"
                  className="lp-theme03-conclusion-text"
                >
                  {point?.item ?? ''}
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
