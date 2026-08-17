// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 企业掠影（gallery_wall_v1）
 * 基底：墨 | 骨架：full-bleed | 图位：9
 *
 * 九宫掠影墙 + 底部一行说明 + 右下角标签云。
 * 杂志「企业掠影 / Company Gallery」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Sheet, photoSlots } from './shared.js';

export interface Theme09GalleryWallV1Props {
  section?: string;
  sectionEn?: string;
  title: string;
  titleEn?: string;
  caption?: string;
  images?: Array<{ url?: string; caption?: string }>;
  tags?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09GalleryWallV1Meta: LayoutMeta = {
  id: 'theme09_gallery_wall_v1',
  theme: 'theme09',
  role: 'gallery',
  displayName: 'Theme 09 企业掠影',
  description: '九宫掠影墙 + 底部说明 + 标签云，Company Gallery / 掠影栏',
  needsMedia: true,
  mediaSlots: [{ name: '掠影图片', fieldPath: 'images', canPresetMedia: true }],
  tags: ['gallery', 'wall', 'full-bleed', 'ink'],
  contentShape: 'gallery-wall',
};

export const theme09GalleryWallV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: 'FEATURED COMPANIES' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '代表企业掠影' },
    { key: 'titleEn', label: '英文标题', type: 'text', inlineEditable: true, defaultValue: 'Company Gallery' },
    { key: 'caption', label: '底部说明', type: 'textarea', inlineEditable: true, defaultValue: '拖入代表性 AI 公司的产品、团队或场景图片，画廊按图片真实比例自适应排布 —— 任意数量都保持齐整美观的构图。' },
    { key: 'images', label: '图片组', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'tags', label: '标签云', type: 'text', inlineEditable: true, defaultValue: '大模型,算力基础设施,垂直应用,数据层' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '掠影 · 画廊' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '21' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09GalleryWallV1(props: Theme09GalleryWallV1Props): ReactNode {
  const {
    section, title, titleEn, caption, images = [], tags = '',
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  // 九宫格兜底
  const slots = photoSlots(9, 9);
  const safeImages = [...images];
  while (safeImages.length < slots.length) safeImages.push({});
  const rawTags = Array.isArray(tags) ? tags.join(',') : (typeof tags === 'string' ? tags : String(tags || ''));
  const safeTags: string[] = rawTags.split(/[,，]/).map((s: string) => s.trim()).filter(Boolean);

  return (
    <Sheet substrate="ink" frame="full-bleed" className="lp-theme09-gallerywall" grain={false}>
      {/* 刊头 */}
      <header className="lp-theme09-gallerywall-header">
        {section && (
          <span className="lp-theme09-gallerywall-section">
            <EditableField prop="section" slideIdx={s} editable={e}>{section}</EditableField>
          </span>
        )}
        <h2 className="lp-theme09-gallerywall-title lp-rise">
          <EditableField prop="title" slideIdx={s} editable={e}>{title}</EditableField>
        </h2>
        {titleEn && (
          <span className="lp-theme09-gallerywall-titleen">
            <EditableField prop="titleEn" slideIdx={s} editable={e}>{titleEn}</EditableField>
          </span>
        )}
      </header>

      {/* 九宫墙 */}
      <div className="lp-theme09-gallerywall-wall">
        {slots.map((i) => (
          <figure key={i} className="lp-theme09-gallerywall-cell">
            <InkPhoto
              prop={`images.${i}.url`}
              src={safeImages[i]?.url}
              slideIdx={s}
              editable={e}
              ratio="16:9"
              hint="拖入或点击上传"
              showSpec={false}
            />
          </figure>
        ))}
      </div>

      {/* 底部说明 + 标签 */}
      <footer className="lp-theme09-gallerywall-footer">
        {caption && (
          <p className="lp-theme09-gallerywall-caption lp-rise">
            <EditableField prop="caption" slideIdx={s} editable={e}>{caption}</EditableField>
          </p>
        )}
        <div className="lp-theme09-gallerywall-tags">
          {safeTags.map((tg, i) => (
            <span key={i} className={`lp-theme09-gallerywall-tag ${i === 0 ? 'active' : ''}`}>
              <EditableField prop={`tags.${i}`} slideIdx={s} editable={e}>{tg}</EditableField>
            </span>
          ))}
        </div>
      </footer>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
