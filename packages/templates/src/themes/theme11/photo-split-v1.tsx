// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 图文分屏页（photo_split_v1）
 * 情绪：sunset | 骨架：split
 * 左侧图片 + 右侧文字与要点。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Caption, EditableField, EditorialPhoto, IconChip, SectionTitle, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11PhotoSplitV1Props {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  items?: { title: string; desc: string; icon: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11PhotoSplitV1Meta: LayoutMeta = {
  id: 'theme11_photo_split_v1',
  theme: 'theme11',
  role: 'image',
  displayName: 'Theme 11 图文分屏页',
  description: '左侧图片 + 右侧文字与要点',
  needsMedia: true,
  tags: ['image', 'split', 'light-stream'],
  contentShape: 'photo-split',
};

export const theme11PhotoSplitV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '场景化体验' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从想法到成稿，只需三步' },
    { key: 'imageUrl', label: '主图', type: 'image', defaultValue: '' },
    { key: 'items', label: '要点', type: 'array', maxItems: 3, defaultValue: [
      { title: '输入主题', desc: '用一句话描述演示目标。', icon: '▸' },
      { title: '智能生成', desc: 'AI 自动完成大纲与版式。', icon: '✦' },
      { title: '一键交付', desc: '导出 PPTX / PDF / 在线链接。', icon: '◈' },
    ], itemSchema: [{ key: 'title', label: '标题', type: 'text', inlineEditable: true }, { key: 'desc', label: '描述', type: 'textarea', inlineEditable: true }, { key: 'icon', label: '图标', type: 'text', inlineEditable: true, defaultValue: '◆' }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11PhotoSplitV1(props: Theme11PhotoSplitV1Props): ReactNode {
  const { title, subtitle, imageUrl, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange'> = ['blue', 'violet', 'orange'];

  return (
    <Sheet mood={mood} frame="split" className="lp-theme11-photo-split">
      <EditorialPhoto prop="imageUrl" src={imageUrl} slideIdx={s} editable={e} alt="场景图" className="lp-theme11-photo-split-image" placeholderClassName="lp-theme11-photo-split-image-placeholder" />
      <div className="lp-theme11-photo-split-right">
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <Caption className="lp-theme11-photo-split-sub"><EditableField prop="subtitle" slideIdx={s} editable={e} as="span">{subtitle}</EditableField></Caption>}
        <div className="lp-theme11-photo-split-items">
          {items.slice(0, 3).map((item, i) => (
            <div key={i} className="lp-theme11-photo-split-item lp-rise" style={{ animationDelay: `${i * 80}ms` }}>
              <IconChip icon={item.icon} tone={tones[i % tones.length]} />
              <div>
                <EditableField prop={`items.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme11-photo-split-item-title">{item.title}</EditableField>
                <Caption><EditableField prop={`items.${i}.desc`} slideIdx={s} editable={e} as="span">{item.desc}</EditableField></Caption>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
