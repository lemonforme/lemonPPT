// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 分屏结束页（closing_split_v1）
 * 情绪：sunset | 骨架：split
 * 左侧可编辑图片 + 右侧标题/CTA/联系。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, GradientCard, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11ClosingSplitV1Props {
  title: string;
  subtitle?: string;
  cta?: string;
  contact?: string;
  image?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ClosingSplitV1Meta: LayoutMeta = {
  id: 'theme11_closing_split_v1',
  theme: 'theme11',
  role: 'closing',
  displayName: 'Theme 11 分屏结束页',
  description: '左侧可编辑图片 + 右侧标题/CTA/联系',
  needsMedia: true,
  tags: ['closing', 'split', 'image', 'light-stream'],
  contentShape: 'closing',
};

export const theme11ClosingSplitV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '开启你的\n下一场演示' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '用 lemonPPT，把想法变成值得分享的画面。' },
    { key: 'cta', label: '按钮文案', type: 'text', inlineEditable: true, defaultValue: '立即体验' },
    { key: 'contact', label: '联系信息', type: 'text', inlineEditable: true, defaultValue: 'hello@lemonppt.dev' },
    { key: 'image', label: '图片', type: 'image', defaultValue: '' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'sunset' },
  ],
};

export function Theme11ClosingSplitV1(props: Theme11ClosingSplitV1Props): ReactNode {
  const { title, subtitle, cta, contact, image, mood = 'sunset', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="split" className="lp-theme11-closing-split">
      <div className="lp-theme11-closing-split-media lp-rise">
        <EditorialPhoto
          src={image}
          prop="image"
          slideIdx={s}
          editable={e}
          className="lp-theme11-closing-split-photo"
        />
      </div>
      <div className="lp-theme11-closing-split-body lp-rise">
        <SignalLine />
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-closing-split-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-closing-split-sub">{subtitle}</EditableField>}
        <div className="lp-theme11-closing-split-actions">
          {cta && (
            <GradientCard tone="orange" className="lp-theme11-closing-split-cta">
              <EditableField prop="cta" slideIdx={s} editable={e} as="span">{cta}</EditableField>
            </GradientCard>
          )}
          {contact && <EditableField prop="contact" slideIdx={s} editable={e} as="div" className="lp-theme11-closing-split-contact">{contact}</EditableField>}
        </div>
      </div>
    </Sheet>
  );
}
