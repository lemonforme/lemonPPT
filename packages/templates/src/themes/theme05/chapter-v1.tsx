// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05ChapterV1Props {
  tag?: string;
  number: string;
  title: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ChapterV1Meta: LayoutMeta = {
  id: 'theme05_chapter_v1',
  theme: 'theme05',
  role: 'content',
  displayName: 'Theme 05 光谱章节页',
  description: '大号章节号 + 底部光谱色带，用于章节过渡',
  needsMedia: false,
  tags: ['chapter', 'section', 'spectrum'],
  contentShape: 'chapter',
};

export const theme05ChapterV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'CHAPTER' },
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心发现' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据到洞察的关键转折' },
  ],
};

export function Theme05ChapterV1(props: Theme05ChapterV1Props): ReactNode {
  const { tag, number, title, subtitle, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-chapter">
      {tag && (
        <div className="lp-theme05-kicker lp-rise">{tag}</div>
      )}
      <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-chapter-number lp-rise">{number}</EditableField>
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-chapter-title lp-rise">{title}</EditableField>
      {subtitle && (
        <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle lp-rise">{subtitle}</EditableField>
      )}
      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    </div>
  );
}
