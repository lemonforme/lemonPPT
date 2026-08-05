// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03CoverV4Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  edition?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03CoverV4Meta: LayoutMeta = {
  id: 'theme03_cover_v4',
  theme: 'theme03',
  role: 'cover',
  displayName: 'Theme 03 编辑风封面 v4',
  description: '杂志刊头式封面',
  needsMedia: false,
  tags: ['cover', 'hero', 'masthead'],
  contentShape: 'cover-masthead',
};

export const theme03CoverV4Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'FEATURED STORY' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'ED. 01' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'AI · VENTURE CAPITAL // USA' },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{AI}} 融资格局重绘' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'date', label: '日期', type: 'text', inlineEditable: true, defaultValue: '2026.06' },
    { key: 'edition', label: '刊号', type: 'text', inlineEditable: true, defaultValue: 'ED. 01' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme03CoverV4(props: Theme03CoverV4Props): ReactNode {
  const { tag, tagLabel, topRightMeta, kicker, title, subtitle, date, edition, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-cover-v4">
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

      <div className="lp-theme03-cover-v4-main">
        <div className="lp-theme03-cover-v4-masthead lp-rise">
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-cover-v4-masthead-text">{kicker || 'FEATURED STORY'}</EditableField>
          <div className="lp-theme03-cover-v4-masthead-line" />
          <EditableField prop="edition" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-cover-v4-masthead-text">{edition || 'ED. 01'}</EditableField>
        </div>
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme03-cover-v4-title lp-rise">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-cover-v4-subtitle lp-rise">{subtitle}</EditableField>
        )}
        <div className="lp-theme03-cover-v4-footer lp-rise">
          {date && <EditableField prop="date" slideIdx={_slideIdx} editable={_editable} as="span">{date}</EditableField>}
          <span>lemonPPT</span>
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
