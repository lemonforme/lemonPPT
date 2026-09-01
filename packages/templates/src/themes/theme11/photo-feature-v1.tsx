// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 大图特性页（photo_feature_v1）
 * 情绪：aurora | 骨架：full-bleed
 * 全屏大图 + 底部渐变特性条。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, GradientCard, IconChip, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11PhotoFeatureV1Props {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  items?: { title: string; icon: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11PhotoFeatureV1Meta: LayoutMeta = {
  id: 'theme11_photo_feature_v1',
  theme: 'theme11',
  role: 'image',
  displayName: 'Theme 11 大图特性页',
  description: '全屏大图 + 底部渐变特性条',
  needsMedia: true,
  tags: ['image', 'feature', 'full-bleed', 'light-stream'],
  contentShape: 'photo-feature',
};

export const theme11PhotoFeatureV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '沉浸式体验' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '每一页都像是为内容量身定制的界面' },
    { key: 'imageUrl', label: '主图', type: 'image', defaultValue: '' },
    { key: 'items', label: '特性', type: 'array', maxItems: 3, defaultValue: [{ title: '自适应版式', icon: '▣' }, { title: '智能配色', icon: '◈' }, { title: '实时预览', icon: '◉' }], itemSchema: [{ key: 'title', label: '标题', type: 'text', inlineEditable: true }, { key: 'icon', label: '图标', type: 'text', inlineEditable: true, defaultValue: '◆' }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11PhotoFeatureV1(props: Theme11PhotoFeatureV1Props): ReactNode {
  const { title, subtitle, imageUrl, items = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange'> = ['blue', 'violet', 'orange'];

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme11-photo-feature">
      <div className="lp-theme11-photo-feature-text lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-photo-feature-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-photo-feature-sub">{subtitle}</EditableField>}
      </div>
      <EditorialPhoto prop="imageUrl" src={imageUrl} slideIdx={s} editable={e} alt="特性图" className="lp-theme11-photo-feature-image" placeholderClassName="lp-theme11-photo-feature-image-placeholder" />
      <div className="lp-theme11-photo-feature-bar">
        {items.slice(0, 3).map((item, i) => (
          <GradientCard key={i} tone={tones[i % tones.length]} className="lp-theme11-photo-feature-card lp-rise" style={{ animationDelay: `${i * 80}ms` }}>
            <IconChip icon={item.icon} tone={tones[i % tones.length]} className="lp-theme11-photo-feature-card-icon" />
            <EditableField prop={`items.${i}.title`} slideIdx={s} editable={e} as="span">{item.title}</EditableField>
          </GradientCard>
        ))}
      </div>
    </Sheet>
  );
}
