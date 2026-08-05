// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme03ChapterV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  number?: string;
  numberEnglish?: string;
  title: string;
  description?: string;
  items?: Array<{ number: string; title: string }>;
  footnoteLeft?: string;
  footnoteRight?: string;
  image?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ChapterV1Meta: LayoutMeta = {
  id: 'theme03_chapter_v1',
  theme: 'theme03',
  role: 'content',
  displayName: 'Theme 03 编辑风章节页',
  description: '深色代码编辑风章节页，超大章节号 + 竖排英文 + 本章导航',
  needsMedia: true,
  tags: ['chapter', 'section', 'navigation'],
  contentShape: 'chapter-navigation',
};

export const theme03ChapterV1Schema: PropsSchema = {
  fields: [
    {
      key: 'tag',
      label: '标签',
      type: 'text',
      inlineEditable: true,
      defaultValue: '章节',
    },
    {
      key: 'tagLabel',
      label: '标签编号',
      type: 'text',
      inlineEditable: true,
      defaultValue: 'SECTION',
    },
    {
      key: 'topRightMeta',
      label: '顶部元信息',
      type: 'text',
      inlineEditable: true,
      defaultValue: 'AI · VENTURE CAPITAL // USA',
    },
    {
      key: 'number',
      label: '章节号',
      type: 'text',
      inlineEditable: true,
      defaultValue: '04',
    },
    {
      key: 'numberEnglish',
      label: '章节号英文',
      type: 'text',
      inlineEditable: true,
      defaultValue: 'CHAPTER FOUR',
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
      defaultValue: '结构透视与{{展望}}',
    },
    {
      key: 'description',
      label: '描述',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'items',
      label: '本章包含',
      type: 'array',
      itemSchema: [
        { key: 'number', label: '序号', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
      ],
    },
    {
      key: 'footnoteLeft',
      label: '页脚左侧',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'footnoteRight',
      label: '页脚右侧',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'image',
      label: '章节配图',
      type: 'image',
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField
      prop="title"
      slideIdx={slideIdx}
      editable={editable}
      as="h2"
      className="lp-theme03-chapter-title lp-rise"
    >
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return (
            <em key={idx} className="lp-theme03-accent-text">
              {match[1]}
            </em>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03ChapterV1(props: Theme03ChapterV1Props): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    number,
    numberEnglish,
    title,
    description,
    items,
    footnoteLeft,
    footnoteRight,
    image,
    _slideIdx,
    _editable,
  } = props;

  return (
    <div className="lp-slide lp-theme03-chapter-v1">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && (
              <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">
                {tag}
              </EditableField>
            )}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && (
              <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">
                {tagLabel}
              </EditableField>
            )}
          </div>
        )}
        {topRightMeta && (
          <EditableField
            prop="topRightMeta"
            slideIdx={_slideIdx}
            editable={_editable}
            as="div"
            className="lp-theme03-topbar-right"
          >
            {topRightMeta}
          </EditableField>
        )}
      </div>

      <div className="lp-theme03-chapter-main">
        <div className="lp-theme03-chapter-number-block lp-rise">
          {number && (
            <EditableField
              prop="number"
              slideIdx={_slideIdx}
              editable={_editable}
              as="span"
              className="lp-theme03-chapter-number"
            >
              {number}
            </EditableField>
          )}
          {numberEnglish && (
            <EditableField prop="numberEnglish" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-chapter-number-en">
              {numberEnglish.split('').map((char, idx) => (
                <span key={idx}>{char}</span>
              ))}
            </EditableField>
          )}
        </div>

        <div className="lp-theme03-chapter-body lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {description && (
            <EditableField
              prop="description"
              slideIdx={_slideIdx}
              editable={_editable}
              as="p"
              className="lp-theme03-chapter-desc"
            >
              {description}
            </EditableField>
          )}

          {items && items.length > 0 && (
            <div className="lp-theme03-chapter-items">
              <div className="lp-theme03-chapter-items-label">本章包含</div>
              <div className="lp-theme03-chapter-items-list">
                {items.map((item, idx) => (
                  <div key={idx} className="lp-theme03-chapter-item">
                    <EditableField prop={`items.${idx}.number`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-chapter-item-number">{item.number}</EditableField>
                    <EditableField prop={`items.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-chapter-item-title">{item.title}</EditableField>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lp-theme03-chapter-image-wrap lp-rise">
          <LpEditableImage
            className="lp-theme03-chapter-image"
            src={image}
            alt=""
            slideIdx={_slideIdx}
            editable={_editable}
            prop="image"
            placeholderClassName="lp-editable-image-placeholder lp-theme03-chapter-image-placeholder"
            placeholderText="点击上传章节配图"
          />
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && (
          <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">
            {footnoteLeft}
          </EditableField>
        )}
        {footnoteRight && (
          <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">
            {footnoteRight}
          </EditableField>
        )}
      </div>
    </div>
  );
}
