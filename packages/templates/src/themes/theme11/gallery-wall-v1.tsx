// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 图片墙页（gallery_wall_v1）
 * 情绪：aurora | 骨架：grid
 * 左侧标题 + 右侧不规则图片墙（最多 6 张）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11GalleryWallV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  images?: { src?: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11GalleryWallV1Meta: LayoutMeta = {
  id: 'theme11_gallery_wall_v1',
  theme: 'theme11',
  role: 'gallery',
  displayName: 'Theme 11 图片墙页',
  description: '左侧标题 + 右侧不规则图片墙',
  needsMedia: true,
  tags: ['gallery', 'wall', 'grid', 'light-stream'],
  contentShape: 'gallery-wall',
};

export const theme11GalleryWallV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '视觉拼图' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '多场景、多界面、多视角' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'COLLAGE' },
    { key: 'images', label: '图片', type: 'array', maxItems: 6, defaultValue: [{}, {}, {}, {}, {}, {}], itemSchema: [{ key: 'src', label: '图片', type: 'image', defaultValue: '' }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11GalleryWallV1(props: Theme11GalleryWallV1Props): ReactNode {
  const { title, subtitle, eyebrow, images = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const cells = ['lp-theme11-gallery-wall-large', '', 'lp-theme11-gallery-wall-tall', 'lp-theme11-gallery-wall-wide', '', ''];

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-gallery-wall">
      <div className="lp-theme11-gallery-wall-left">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="violet"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-gallery-wall-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-gallery-wall-grid">
        {images.slice(0, 6).map((img, i) => (
          <EditorialPhoto key={i} prop={`images.${i}.src`} src={img.src} slideIdx={s} editable={e} alt={`图片 ${i + 1}`} className={`lp-theme11-gallery-wall-image ${cells[i] ?? ''}`.trim()} placeholderClassName="lp-theme11-gallery-wall-image-placeholder" />
        ))}
      </div>
    </Sheet>
  );
}
