// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 图片画廊页（gallery_v1）
 * 情绪：daylight | 骨架：grid
 * 顶部标题 + 3 列图片卡片。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11GalleryV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  images?: { caption?: string; src?: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11GalleryV1Meta: LayoutMeta = {
  id: 'theme11_gallery_v1',
  theme: 'theme11',
  role: 'gallery',
  displayName: 'Theme 11 图片画廊页',
  description: '顶部标题 + 3 列图片卡片',
  needsMedia: true,
  tags: ['gallery', 'grid', 'light-stream'],
  contentShape: 'gallery',
};

export const theme11GalleryV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '场景展示' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '真实使用场景与界面预览' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'GALLERY' },
    { key: 'images', label: '图片', type: 'array', maxItems: 3, defaultValue: [{ caption: '编辑器' }, { caption: '协作空间' }, { caption: '导出预览' }], itemSchema: [{ key: 'caption', label: '说明', type: 'text', inlineEditable: true }, { key: 'src', label: '图片', type: 'image', defaultValue: '' }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11GalleryV1(props: Theme11GalleryV1Props): ReactNode {
  const { title, subtitle, eyebrow, images = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-gallery">
      <div className="lp-theme11-gallery-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-gallery-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-gallery-grid">
        {images.slice(0, 3).map((img, i) => (
          <div key={i} className="lp-theme11-gallery-item lp-rise" style={{ animationDelay: `${i * 80}ms` }}>
            <EditorialPhoto prop={`images.${i}.src`} src={img.src} slideIdx={s} editable={e} alt={img.caption || `图片 ${i + 1}`} className="lp-theme11-gallery-image" placeholderClassName="lp-theme11-gallery-image-placeholder" />
            {img.caption && <EditableField prop={`images.${i}.caption`} slideIdx={s} editable={e} as="span" className="lp-theme11-gallery-caption">{img.caption}</EditableField>}
          </div>
        ))}
      </div>
    </Sheet>
  );
}
