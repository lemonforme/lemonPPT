// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme06ChapterImageV1Props {
  tag?: string;
  number?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ChapterImageV1Meta: LayoutMeta = {
  id: 'theme06_chapter_image_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 图文章节页',
  description: '左侧全高图片 + 右侧章节标题与副标题',
  needsMedia: true,
  tags: ['chapter', 'image', 'atlas'],
  contentShape: 'chapter',
};

export const theme06ChapterImageV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CHAPTER' },
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '04' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '区域洞察' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从地理分布看创新中心与资本热土' },
    { key: 'imageUrl', label: '章节图片', type: 'image' },
  ],
};

export function Theme06ChapterImageV1(props: Theme06ChapterImageV1Props): ReactNode {
  const { tag, number, title, subtitle, imageUrl, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme06-chapter-image">
      <div className="lp-theme06-chapter-image-visual lp-rise">
        <LpEditableImage
          prop="imageUrl"
          src={imageUrl}
          slideIdx={_slideIdx}
          editable={_editable}
          className="lp-theme06-chapter-image-img"
          placeholderClassName="lp-theme06-chapter-image-placeholder"
          placeholderText="点击上传章节配图"
        />
        <div className="lp-theme06-chapter-image-overlay" aria-hidden="true" />
      </div>

      <div className="lp-theme06-chapter-image-main lp-rise">
        {tag && <div className="lp-theme06-kicker">{tag}</div>}
        {number && <div className="lp-theme06-chapter-image-number">{number}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-chapter-image-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme06-underline" />
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
