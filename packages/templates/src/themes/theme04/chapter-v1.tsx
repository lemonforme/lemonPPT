// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme04AuroraBg } from './aurora-bg.js';

export interface Theme04ChapterV1Props {
  tag?: string;
  number: string;
  title: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ChapterV1Meta: LayoutMeta = {
  id: 'theme04_chapter_v1',
  theme: 'theme04',
  role: 'content',
  displayName: 'Theme 04 糖果章节页',
  description: '大号描边章节号 + 糖果色装饰，用于章节过渡',
  needsMedia: false,
  tags: ['chapter', 'section', 'candy'],
  contentShape: 'chapter',
};

export const theme04ChapterV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'CHAPTER' },
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心发现' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据到洞察的关键转折' },
  ],
};

export function Theme04ChapterV1(props: Theme04ChapterV1Props): ReactNode {
  const { tag, number, title, subtitle, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-chapter lp-theme04-has-aurora">
      <Theme04AuroraBg />
      <div className="lp-theme04-chapter-deco" aria-hidden="true" />
      {tag && (
        <div className="lp-theme04-tag lp-rise">{tag}</div>
      )}
      <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-chapter-number lp-rise">{number}</EditableField>
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme04-chapter-title lp-rise">{title}</EditableField>
      {subtitle && (
        <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-chapter-subtitle lp-rise">{subtitle}</EditableField>
      )}
    </div>
  );
}
