// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05ChapterBigV1Props {
  tag?: string;
  title: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ChapterBigV1Meta: LayoutMeta = {
  id: 'theme05_chapter_big_v1',
  theme: 'theme05',
  role: 'content',
  displayName: 'Theme 05 章节 大字标题',
  description: '全屏超大章节标题 + 光谱色带',
  needsMedia: false,
  tags: ['chapter', 'section', 'big'],
  contentShape: 'chapter',
};

export const theme05ChapterBigV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'CHAPTER' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心发现' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据到洞察的关键转折' },
  ],
};

export function Theme05ChapterBigV1(props: Theme05ChapterBigV1Props): ReactNode {
  const { tag, title, subtitle, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-chapter-big">
      <div className="lp-theme05-chapter-big-content lp-rise">
        {tag && <div className="lp-theme05-kicker">{tag}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-chapter-big-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-chapter-big-subtitle">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    </div>
  );
}
