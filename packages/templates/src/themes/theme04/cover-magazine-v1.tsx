// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04CoverMagazineV1Metadata {
  label: string;
  value: string;
}

export interface Theme04CoverMagazineV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  caption?: string;
  image?: string;
  metadata?: Theme04CoverMagazineV1Metadata[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04CoverMagazineV1Meta: LayoutMeta = {
  id: 'theme04_cover_magazine_v1',
  theme: 'theme04',
  role: 'cover',
  displayName: 'Theme 04 杂志封面',
  description: '杂志风封面：左半区大标题与元数据，右半区焦点图片',
  needsMedia: true,
  tags: ['cover', 'magazine', 'hero', 'candy'],
  contentShape: 'image-with-caption',
};

export const theme04CoverMagazineV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '封面故事' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'COVER' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'GLASS CANDY · EDITION 01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 融资{{新格局}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从叙事驱动到兑现驱动的关键转折' },
    { key: 'image', label: '封面图片', type: 'image' },
    { key: 'caption', label: '图片说明', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究 · 2026' },
    {
      key: 'metadata',
      label: '元数据',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { label: '报告期', value: '2024 全年' },
        { label: '样本量', value: '97 笔大额融资' },
        { label: '覆盖市场', value: '全球' },
        { label: '发布日期', value: '2026.07' },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '值', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT 研究出品' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: 'github.com/lemonforme/lemonPPT' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h1" className="lp-theme04-cover-magazine-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme04CoverMagazineV1(props: Theme04CoverMagazineV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, caption, image, metadata, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-cover-magazine">
      <div className="lp-theme04-cover-magazine-top">
        {(tag || tagLabel) && (
          <div className="lp-theme04-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span>·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-kicker">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme04-cover-magazine-body">
        <div className="lp-theme04-cover-magazine-left lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-cover-magazine-subtitle">{subtitle}</EditableField>
          )}
          {metadata && metadata.length > 0 && (
            <div className="lp-theme04-cover-magazine-meta">
              {metadata.slice(0, 4).map((m, idx) => (
                <div key={idx} className="lp-theme04-cover-magazine-meta-item">
                  <EditableField prop={`metadata.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-cover-magazine-meta-label">{m.label}</EditableField>
                  <EditableField prop={`metadata.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-cover-magazine-meta-value">{m.value}</EditableField>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lp-theme04-cover-magazine-right lp-rise">
          <div className="lp-theme04-cover-magazine-image-wrap lp-theme04-card">
            <LpEditableImage
              className="lp-theme04-cover-magazine-image"
              src={image}
              alt={caption || ''}
              slideIdx={_slideIdx}
              editable={_editable}
              prop="image"
              placeholderClassName="lp-editable-image-placeholder lp-theme04-cover-magazine-image-placeholder"
              placeholderText="点击上传封面图片"
              showIcon={true}
            />
          </div>
          {caption && (
            <EditableField prop="caption" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-cover-magazine-caption">{caption}</EditableField>
          )}
        </div>
      </div>

      <div className="lp-theme04-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
