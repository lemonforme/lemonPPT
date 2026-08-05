// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme04AuroraBg } from './aurora-bg.js';

export interface Theme04ChapterNumberedV1Props {
  tag?: string;
  number: string;
  title: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ChapterNumberedV1Meta: LayoutMeta = {
  id: 'theme04_chapter_numbered_v1',
  theme: 'theme04',
  role: 'content',
  displayName: 'Theme 04 编号章节页',
  description: '超大编号 + 小标签与标题的极简章节页',
  needsMedia: false,
  tags: ['chapter', 'section', 'minimal', 'candy'],
  contentShape: 'chapter',
};

export const theme04ChapterNumberedV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'CHAPTER' },
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '02' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心发现' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据到洞察的关键转折' },
  ],
};

export function Theme04ChapterNumberedV1(props: Theme04ChapterNumberedV1Props): ReactNode {
  const { tag, number, title, subtitle, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-chapter-numbered lp-theme04-has-aurora">
      <Theme04AuroraBg />
      <div className="lp-theme04-chapter-numbered-main lp-rise">
        <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-chapter-numbered-number" aria-hidden="true">{number}</EditableField>
        <div className="lp-theme04-chapter-numbered-text">
          {tag && <div className="lp-theme04-tag lp-theme04-chapter-numbered-tag">{tag}</div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme04-chapter-numbered-title">{title}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-chapter-numbered-subtitle">{subtitle}</EditableField>
          )}
        </div>
      </div>
      <div className="lp-theme04-chapter-numbered-deco" aria-hidden="true" />
    </div>
  );
}
