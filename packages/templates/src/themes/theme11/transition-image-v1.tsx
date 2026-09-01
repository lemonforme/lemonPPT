// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 影像过渡页（transition_image_v1）
 * 情绪：aurora | 骨架：full-bleed
 * 满版影像 + 渐变遮罩 + 居中章节标题。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11TransitionImageV1Props {
  label?: string;
  title: string;
  subtitle?: string;
  image?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11TransitionImageV1Meta: LayoutMeta = {
  id: 'theme11_transition_image_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 影像过渡页',
  description: '满版影像 + 渐变遮罩 + 居中章节标题',
  needsMedia: true,
  tags: ['transition', 'image', 'chapter', 'light-stream'],
  contentShape: 'transition-image',
};

export const theme11TransitionImageV1Schema: PropsSchema = {
  fields: [
    { key: 'label', label: '小标签', type: 'text', inlineEditable: true, defaultValue: 'CHAPTER 05' },
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '未来展望' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从愿景到可执行路线图' },
    { key: 'image', label: '背景影像', type: 'image', defaultValue: '' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11TransitionImageV1(props: Theme11TransitionImageV1Props): ReactNode {
  const { label, title, subtitle, image, mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme11-transition-image">
      <div className="lp-theme11-transition-image-media">
        <EditorialPhoto src={image} prop="image" slideIdx={s} editable={e} className="lp-theme11-transition-image-photo" />
      </div>
      <div className="lp-theme11-transition-image-overlay" aria-hidden="true" />
      <div className="lp-theme11-transition-image-inner lp-rise">
        {label && <EditableField prop="label" slideIdx={s} editable={e} as="span" className="lp-theme11-transition-image-label">{label}</EditableField>}
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-transition-image-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-transition-image-sub">{subtitle}</EditableField>}
      </div>
    </Sheet>
  );
}
