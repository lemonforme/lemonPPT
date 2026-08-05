// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06ChapterMinimalV1Props {
  imageUrl?: string;
  tag?: string;
  title: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ChapterMinimalV1Meta: LayoutMeta = {
  id: 'theme06_chapter_minimal_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 极简章节页',
  description: '纯文字极简章节页，仅标题与细线装饰',
  needsMedia: true,
  tags: ['chapter', 'minimal', 'atlas'],
  contentShape: 'chapter',
};

export const theme06ChapterMinimalV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'tag', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CHAPTER' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '未来展望' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从当前格局推演下一阶段的战略机会' },
  ],
};

export function Theme06ChapterMinimalV1(props: Theme06ChapterMinimalV1Props): ReactNode {
  const { tag, title, subtitle, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme06-chapter-minimal">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-chapter-minimal-body lp-rise">
        {tag && <div className="lp-theme06-kicker">{tag}</div>}
        <div className="lp-theme06-chapter-minimal-line" aria-hidden="true" />
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-chapter-minimal-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
