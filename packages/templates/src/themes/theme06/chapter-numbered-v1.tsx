// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06ChapterNumberedV1Props {
  imageUrl?: string;
  tag?: string;
  number?: string;
  title: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ChapterNumberedV1Meta: LayoutMeta = {
  id: 'theme06_chapter_numbered_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 大号章节号',
  description: '大号实心章节号 + 标题',
  needsMedia: true,
  tags: ['chapter', 'numbered', 'atlas'],
  contentShape: 'chapter',
};

export const theme06ChapterNumberedV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'tag', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CHAPTER' },
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '市场全景' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从宏观趋势到细分赛道的机会扫描' },
  ],
};

export function Theme06ChapterNumberedV1(props: Theme06ChapterNumberedV1Props): ReactNode {
  const { tag, number, title, subtitle, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme06-chapter-numbered">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-rise">
        {tag && <div className="lp-theme06-kicker">{tag}</div>}
        {number && <div className="lp-theme06-chapter-numbered-digit">{number}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-chapter-numbered-title">{title}</EditableField>
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
