// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04CoverHeroV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  caption?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04CoverHeroV1Meta: LayoutMeta = {
  id: 'theme04_cover_hero_v1',
  theme: 'theme04',
  role: 'cover',
  displayName: 'Theme 04 大图英雄封面',
  description: '全幅背景图 + 渐变遮罩 + 居中杂志化标题的封面变体',
  needsMedia: true,
  tags: ['cover', 'hero', 'image', 'candy'],
  contentShape: 'image-hero',
};

export const theme04CoverHeroV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '年度封面' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '01' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'GLASS CANDY · EDITION 01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{资本}}重新分配的开局之年' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '2024 全球 AI 大额融资全景年鉴' },
    { key: 'imageUrl', label: '背景图', type: 'image' },
    { key: 'caption', label: '图注', type: 'text', inlineEditable: true, defaultValue: '图片来源：lemonPPT 研究团队' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT 研究出品' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: 'github.com/lemonforme/lemonPPT' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h1" className="lp-theme04-cover-hero-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return (
            <em key={idx} className="lp-theme04-pill">
              {match[1]}
            </em>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme04CoverHeroV1(props: Theme04CoverHeroV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, imageUrl, caption, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-cover-hero">
      <div className="lp-theme04-cover-hero-bg">
        <LpEditableImage
          className="lp-theme04-cover-hero-image"
          src={imageUrl}
          alt=""
          slideIdx={_slideIdx}
          editable={_editable}
          prop="imageUrl"
          placeholderClassName="lp-editable-image-placeholder"
          placeholderText="点击上传封面背景图"
          showIcon={true}
        />
        <div className="lp-theme04-cover-hero-vignette" aria-hidden="true" />
      </div>

      <div className="lp-theme04-cover-hero-top">
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

      <div className="lp-theme04-cover-hero-body">
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-cover-hero-subtitle lp-rise">{subtitle}</EditableField>
        )}
        {caption && (
          <EditableField prop="caption" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-cover-hero-caption lp-rise">{caption}</EditableField>
        )}
      </div>

      <div className="lp-theme04-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
