// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04GalleryV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  images?: Array<{ url?: string; caption?: string }>;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04GalleryV1Meta: LayoutMeta = {
  id: 'theme04_gallery_v1',
  theme: 'theme04',
  role: 'gallery',
  displayName: 'Theme 04 糖果图集页',
  description: '玻璃糖果风图片网格墙，糖果色编号 + 圆角卡片',
  needsMedia: true,
  tags: ['gallery', 'images', 'candy'],
  contentShape: 'image-grid',
};

export const theme04GalleryV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '图集' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'GALLERY' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'GLASS CANDY · EDITION 01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{产品}}界面一览' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从编辑到导出，每个环节都更高效' },
    {
      key: 'images',
      label: '图片',
      type: 'array',
      maxItems: 4,
      minItems: 1,
      defaultValue: [
        { caption: 'AI 生成大纲' },
        { caption: '主题一键切换' },
        { caption: '数据可视化' },
        { caption: 'PPTX 导出' },
      ],
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'caption', label: '说明', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-gallery-title lp-rise">
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

export function Theme04GalleryV1(props: Theme04GalleryV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, images = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeImages = images.slice(0, 4);

  return (
    <div className="lp-slide lp-theme04-gallery">
      <div className="lp-theme04-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme04-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span>·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme04-gallery-main">
        <div className="lp-theme04-gallery-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-gallery-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {safeImages.length > 0 && (
          <div className={`lp-theme04-gallery-grid lp-theme04-gallery-grid--${safeImages.length}`}>
            {safeImages.map((image, index) => (
              <div key={index} className="lp-theme04-gallery-card lp-theme04-card lp-rise" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="lp-theme04-gallery-number">{String(index + 1).padStart(2, '0')}</div>
                <LpEditableImage
                  className="lp-theme04-gallery-image"
                  src={image.url}
                  alt={image.caption || ''}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  prop={`images.${index}.url`}
                  placeholderClassName="lp-editable-image-placeholder lp-theme04-gallery-image-placeholder"
                  placeholderText="图片"
                />
                {image.caption && (
                  <EditableField prop={`images.${index}.caption`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-gallery-caption">
                    {image.caption}
                  </EditableField>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme04-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
