// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 产品展示封面（cover_product_v1）
 * 情绪：daylight | 骨架：full-bleed | 图位：1
 * 产品图 + 大标题 + 彩色标签。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, GradientCard, IconChip, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11CoverProductV1Props {
  title: string;
  subtitle?: string;
  tags?: string[];
  imageUrl?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11CoverProductV1Meta: LayoutMeta = {
  id: 'theme11_cover_product_v1',
  theme: 'theme11',
  role: 'cover',
  displayName: 'Theme 11 产品展示封面',
  description: '产品图 + 大标题 + 彩色标签',
  needsMedia: true,
  tags: ['cover', 'product', 'light-stream'],
  contentShape: 'cover-product',
};

export const theme11CoverProductV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: 'LemonPPT\nTheme 11' },
    { key: 'subtitle', label: '副语', type: 'textarea', inlineEditable: true, defaultValue: '浅色科技风 · 轻量卡片 · 多彩信号' },
    { key: 'tags', label: '标签', type: 'array', maxItems: 4, defaultValue: ['AI', 'SaaS', 'Data', 'Design'], itemSchema: [{ key: 'item', label: '标签', type: 'text', inlineEditable: true }] },
    { key: 'imageUrl', label: '产品图', type: 'image', defaultValue: '' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11CoverProductV1(props: Theme11CoverProductV1Props): ReactNode {
  const { title, subtitle, tags = [], imageUrl, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const chips = ['◎', '▣', '◈', '✦'];
  const tones: Array<'blue' | 'violet' | 'orange' | 'green'> = ['blue', 'violet', 'orange', 'green'];

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme11-cover-product">
      <div className="lp-theme11-cover-product-inner">
        <div className="lp-theme11-cover-product-text">
          <div className="lp-theme11-cover-product-tags">
            {tags.slice(0, 4).map((t, i) => (
              <GradientCard key={i} tone={tones[i % tones.length]} className="lp-theme11-cover-product-tag">
                <IconChip icon={chips[i % chips.length]} tone={tones[i % tones.length]} />
                <EditableField prop={`tags.${i}`} slideIdx={s} editable={e} as="span">{t}</EditableField>
              </GradientCard>
            ))}
          </div>
          <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme11-cover-product-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-cover-product-sub">{subtitle}</EditableField>}
        </div>
        <EditorialPhoto prop="imageUrl" src={imageUrl} slideIdx={s} editable={e} alt="产品图" className="lp-theme11-cover-product-image" placeholderClassName="lp-theme11-cover-product-image-placeholder" />
      </div>
    </Sheet>
  );
}
