// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme04AuroraBg } from './aurora-bg.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04ChapterSplitV1Props {
  number: string;
  title: string;
  subtitle?: string;
  image?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ChapterSplitV1Meta: LayoutMeta = {
  id: 'theme04_chapter_split_v1',
  theme: 'theme04',
  role: 'content',
  displayName: 'Theme 04 分屏章节页',
  description: '左图右文分屏章节过渡页，图片占 60%',
  needsMedia: true,
  tags: ['chapter', 'section', 'split', 'candy'],
  contentShape: 'chapter',
};

export const theme04ChapterSplitV1Schema: PropsSchema = {
  fields: [
    { key: 'image', label: '章节图片', type: 'image' },
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心发现' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据到洞察的关键转折' },
  ],
};

export function Theme04ChapterSplitV1(props: Theme04ChapterSplitV1Props): ReactNode {
  const { number, title, subtitle, image, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-chapter-split lp-theme04-has-aurora">
      <Theme04AuroraBg />
      <div className="lp-theme04-chapter-split-visual lp-rise">
        <LpEditableImage
          className="lp-theme04-chapter-split-image"
          src={image}
          alt={title}
          slideIdx={_slideIdx}
          editable={_editable}
          prop="image"
          placeholderClassName="lp-editable-image-placeholder lp-theme04-chapter-split-image-placeholder"
          placeholderText="点击上传章节图片"
          showIcon={true}
        />
        <div className="lp-theme04-chapter-split-overlay" aria-hidden="true" />
      </div>

      <div className="lp-theme04-chapter-split-content lp-rise">
        <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-chapter-split-number">{number}</EditableField>
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme04-chapter-split-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-chapter-split-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme04-chapter-split-deco" aria-hidden="true" />
      </div>
    </div>
  );
}
