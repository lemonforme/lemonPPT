// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03CoverV3Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  presenter?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03CoverV3Meta: LayoutMeta = {
  id: 'theme03_cover_v3',
  theme: 'theme03',
  role: 'cover',
  displayName: 'Theme 03 编辑风封面 v3',
  description: 'Bento 网格玻璃卡片封面',
  needsMedia: false,
  tags: ['cover', 'hero', 'bento'],
  contentShape: 'cover-bento',
};

export const theme03CoverV3Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '调研报告' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '2024' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'AI · VENTURE CAPITAL // USA' },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '2024 美国大额融资 {{AI}} 公司调研报告' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'date', label: '日期', type: 'text', inlineEditable: true, defaultValue: '2026.06' },
    { key: 'presenter', label: '演讲者', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT Research' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme03CoverV3(props: Theme03CoverV3Props): ReactNode {
  const { tag, tagLabel, topRightMeta, kicker, title, subtitle, date, presenter, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-cover-v3">
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

      <div className="lp-theme03-cover-v3-main">
        <div className="lp-theme03-cover-v3-card lp-theme03-cover-v3-main-card lp-rise">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-cover-v3-kicker">{kicker}</EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme03-cover-v3-title">{title}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-cover-v3-subtitle">{subtitle}</EditableField>
          )}
        </div>
        <div className="lp-theme03-cover-v3-card lp-theme03-cover-v3-bento-card lp-rise">
          <EditableField prop="presenter" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-cover-v3-meta">{presenter || 'Presenter'}</EditableField>
        </div>
        <div className="lp-theme03-cover-v3-card lp-theme03-cover-v3-bento-card lp-rise">
          <div className="lp-theme03-cover-v3-meta">
            {date && <EditableField prop="date" slideIdx={_slideIdx} editable={_editable} as="span">{date}</EditableField>}
            <span>Theme 03</span>
          </div>
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
