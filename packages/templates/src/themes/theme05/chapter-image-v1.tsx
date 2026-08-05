// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme05ChapterImageV1Props {
  number: string;
  title: string;
  subtitle?: string;
  image?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ChapterImageV1Meta: LayoutMeta = {
  id: 'theme05_chapter_image_v1',
  theme: 'theme05',
  role: 'content',
  displayName: 'Theme 05 章节 图背',
  description: '全屏图片背景 + 渐变遮罩 + 章节标题',
  needsMedia: true,
  tags: ['chapter', 'section', 'image'],
  contentShape: 'chapter',
};

export const theme05ChapterImageV1Schema: PropsSchema = {
  fields: [
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心发现' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据到洞察的关键转折' },
    { key: 'image', label: '背景图', type: 'image' },
  ],
};

export function Theme05ChapterImageV1(props: Theme05ChapterImageV1Props): ReactNode {
  const { number, title, subtitle, image, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-chapter-image">
      <div className="lp-theme05-chapter-image-media">
        <LpEditableImage
          src={image}
          prop="image"
          slideIdx={_slideIdx}
          editable={_editable}
          placeholderClassName="lp-theme05-chapter-image-placeholder"
          placeholderText="点击上传章节背景图"
        />
      </div>
      <div className="lp-theme05-chapter-image-overlay" aria-hidden="true" />
      <div className="lp-theme05-chapter-image-content lp-rise">
        <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-chapter-image-number">{number}</EditableField>
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-chapter-image-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-chapter-image-subtitle">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    </div>
  );
}
