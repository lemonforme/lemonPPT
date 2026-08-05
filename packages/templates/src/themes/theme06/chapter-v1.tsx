// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme06ChapterV1Props {
  tag?: string;
  topLeftLabel?: string;
  topRightLabel?: string;
  number: string;
  title: string;
  subtitle?: string;
  enSubtitle?: string;
  tags?: string[];
  nextHint?: string;
  imageUrl?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ChapterV1Meta: LayoutMeta = {
  id: 'theme06_chapter_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 图谱章节页',
  description: '超大实心章节号 + 顶部双标签 + 底部要点标签按钮 + 可选背景图',
  needsMedia: true,
  tags: ['chapter', 'section', 'atlas'],
  contentShape: 'chapter',
};

export const theme06ChapterV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'tag', label: '顶部标签（兼容）', type: 'text', inlineEditable: true, defaultValue: 'CHAPTER' },
    { key: 'topLeftLabel', label: '左上角标签', type: 'text', inlineEditable: true, defaultValue: '[CH] CHAPTER' },
    { key: 'topRightLabel', label: '右上角标签', type: 'text', inlineEditable: true, defaultValue: '章节 / SECTION' },
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '02' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '市场数据深拆' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据到洞察的关键转折' },
    { key: 'enSubtitle', label: '英文副标题/关键词', type: 'textarea', inlineEditable: true, defaultValue: '融资节奏 · 集中度 · 交易规模 / MARKET DATA DEEP-DIVE' },
    {
      key: 'tags',
      label: '底部要点标签',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      itemSchema: [{ key: 'item', label: '标签', type: 'text', inlineEditable: true }],
    },
    { key: 'nextHint', label: '右下角下转提示', type: 'text', inlineEditable: true, defaultValue: '→ 下一组页面进入更细的拆解' },
  ],
};

export function Theme06ChapterV1(props: Theme06ChapterV1Props): ReactNode {
  const {
    tag,
    topLeftLabel,
    topRightLabel,
    number,
    title,
    subtitle,
    enSubtitle,
    tags = [],
    nextHint,
    imageUrl,
    _slideIdx,
    _editable,
  } = props;

  const leftLabel = topLeftLabel ?? (tag ? `[CH] ${tag}` : '[CH] CHAPTER');
  const rightLabel = topRightLabel ?? (tag ? `章节 / ${tag}` : '章节 / SECTION');
  const normalizedTags = tags.map((t) => (typeof t === 'string' ? t : (t as { item?: string }).item ?? '')).filter(Boolean);

  return (
    <div className="lp-slide lp-theme06-chapter">
      {imageUrl && (
        <div className="lp-theme06-chapter-bg">
          <LpEditableImage
            prop="imageUrl"
            src={imageUrl}
            slideIdx={_slideIdx}
            editable={_editable}
            className="lp-theme06-chapter-bg-img"
            placeholderClassName="lp-theme06-chapter-bg-placeholder"
            placeholderText="点击上传背景图"
          />
          <div className="lp-theme06-chapter-bg-overlay" aria-hidden="true" />
        </div>
      )}

      <div className="lp-theme06-chapter-topbar lp-rise">
        {leftLabel && (
          <EditableField prop="topLeftLabel" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-chapter-toplabel">
            {leftLabel}
          </EditableField>
        )}
        {rightLabel && (
          <EditableField prop="topRightLabel" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-chapter-toplabel lp-theme06-chapter-toplabel--right">
            {rightLabel}
          </EditableField>
        )}
      </div>

      <div className="lp-theme06-chapter-main lp-rise">
        <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-chapter-number">{number}</EditableField>
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-chapter-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-chapter-subtitle">{subtitle}</EditableField>
        )}
        {enSubtitle && (
          <EditableField prop="enSubtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-chapter-en-subtitle">{enSubtitle}</EditableField>
        )}
      </div>

      {normalizedTags.length > 0 && (
        <div className="lp-theme06-chapter-tags lp-rise">
          {normalizedTags.map((t, i) => (
            <span key={i} className="lp-theme06-chapter-tag">
              <EditableField prop={`tags.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{t}</EditableField>
            </span>
          ))}
        </div>
      )}

      {nextHint && (
        <div className="lp-theme06-chapter-next-hint lp-rise">
          <EditableField prop="nextHint" slideIdx={_slideIdx} editable={_editable} as="span">{nextHint}</EditableField>
        </div>
      )}

      <div className="lp-theme06-glow-line" aria-hidden="true" />
    </div>
  );
}
