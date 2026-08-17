// lemonPPT - theme07 附录章节页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07Barcode, Theme07WatermarkNumber } from './decoration.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07ChapterAppendixV1Props {
  number: string;
  title: string;
  subtitle?: string;
  enSubtitle?: string;
  tags?: string[];
  nextHint?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07ChapterAppendixV1Meta: LayoutMeta = {
  id: 'theme07_chapter_appendix_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 附录章节页',
  description: '深色章节页变体：附录与数据来源，强调资料索引与方法论',
  needsMedia: false,
  tags: ['chapter', 'section', 'appendix', 'research'],
  contentShape: 'chapter',
};

export const theme07ChapterAppendixV1Schema: PropsSchema = {
  fields: [
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '05' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '附录与数据' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '数据来源、研究口径与参考资料索引' },
    { key: 'enSubtitle', label: '英文副标题', type: 'textarea', inlineEditable: true, defaultValue: 'Appendix & Data / Sources · Methodology · References' },
    {
      key: 'tags',
      label: '底部要点标签',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      defaultValue: ['数据来源', '统计口径', '参考资料', '免责声明'],
      itemSchema: [{ key: 'item', label: '标签', type: 'text', inlineEditable: true }],
    },
    { key: 'nextHint', label: '右下角下转提示', type: 'text', inlineEditable: true, defaultValue: '→ 下页进入详细数据来源与处理流程' },
  ],
};

export function Theme07ChapterAppendixV1(props: Theme07ChapterAppendixV1Props): ReactNode {
  const { number, title, subtitle, enSubtitle, tags = [], nextHint, _slideIdx, _editable } = props;
  const normalizedTags = tags
    .map((t) => (typeof t === 'string' ? t : (t as { item?: string }).item ?? ''))
    .filter(Boolean);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-chapter lp-theme07-chapter-appendix">
      <Theme07DecoNodes />
      <Theme07WatermarkNumber number={number} />
      <div className="lp-theme07-chapter-main lp-rise">
        <Theme07IconChip name="book" />
        <div className="lp-theme07-kicker">Appendix · Chapter {number}</div>
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-chapter-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>
        )}
        {enSubtitle && (
          <EditableField prop="enSubtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-chapter-en-subtitle">{enSubtitle}</EditableField>
        )}
      </div>

      {normalizedTags.length > 0 && (
        <div className="lp-theme07-chapter-tags lp-rise">
          {normalizedTags.map((t, i) => (
            <span key={i} className="lp-theme07-chapter-tag">
              <EditableField prop={`tags.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{t}</EditableField>
            </span>
          ))}
        </div>
      )}

      {nextHint && (
        <div className="lp-theme07-chapter-next-hint lp-rise">
          <EditableField prop="nextHint" slideIdx={_slideIdx} editable={_editable} as="span">{nextHint}</EditableField>
        </div>
      )}

      <div className="lp-theme07-glow-line" aria-hidden="true" />
      <Theme07Barcode count={26} />
    </div>
  );
}
