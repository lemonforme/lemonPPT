// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05ChapterNumberedV1Props {
  number: string;
  title: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ChapterNumberedV1Meta: LayoutMeta = {
  id: 'theme05_chapter_numbered_v1',
  theme: 'theme05',
  role: 'content',
  displayName: 'Theme 05 章节 极简编号',
  description: '顶部小编号 + 居中大标题 + 副标题',
  needsMedia: false,
  tags: ['chapter', 'section', 'minimal'],
  contentShape: 'chapter',
};

export const theme05ChapterNumberedV1Schema: PropsSchema = {
  fields: [
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心发现' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据到洞察的关键转折' },
  ],
};

export function Theme05ChapterNumberedV1(props: Theme05ChapterNumberedV1Props): ReactNode {
  const { number, title, subtitle, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-chapter-numbered">
      <div className="lp-theme05-chapter-numbered-content lp-rise">
        <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-chapter-numbered-number">{number}</EditableField>
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-chapter-numbered-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-underline" />
      </div>
      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    </div>
  );
}
