// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05ChapterSplitV1Props {
  number: string;
  title: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ChapterSplitV1Meta: LayoutMeta = {
  id: 'theme05_chapter_split_v1',
  theme: 'theme05',
  role: 'content',
  displayName: 'Theme 05 章节 分屏',
  description: '左侧色块章节号 + 右侧标题副标题',
  needsMedia: false,
  tags: ['chapter', 'section', 'split'],
  contentShape: 'chapter',
};

export const theme05ChapterSplitV1Schema: PropsSchema = {
  fields: [
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心发现' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据到洞察的关键转折' },
  ],
};

export function Theme05ChapterSplitV1(props: Theme05ChapterSplitV1Props): ReactNode {
  const { number, title, subtitle, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-chapter-split">
      <div className="lp-theme05-chapter-split-left lp-rise">
        <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-chapter-split-number">{number}</EditableField>
      </div>
      <div className="lp-theme05-chapter-split-right lp-rise">
        <div className="lp-theme05-kicker">CHAPTER</div>
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-chapter-split-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    </div>
  );
}
