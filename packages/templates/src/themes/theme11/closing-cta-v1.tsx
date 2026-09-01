// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · CTA 结束页（closing_cta_v1）
 * 情绪：sunset | 骨架：stage
 * 居中大标题 + 强视觉 CTA 按钮 + 联系方式。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, GradientCard, Sheet, SignalLine, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11ClosingCtaV1Props {
  tag?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  contact?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ClosingCtaV1Meta: LayoutMeta = {
  id: 'theme11_closing_cta_v1',
  theme: 'theme11',
  role: 'closing',
  displayName: 'Theme 11 CTA 结束页',
  description: '居中大标题 + 强视觉 CTA 按钮 + 联系方式',
  needsMedia: false,
  tags: ['closing', 'cta', 'light-stream'],
  contentShape: 'cta',
};

export const theme11ClosingCtaV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '下一步' },
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '开启你的\n智能演示之旅' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '让每一次分享，都成为值得被记住的画面。' },
    { key: 'cta', label: '按钮文案', type: 'text', inlineEditable: true, defaultValue: '立即预约演示' },
    { key: 'contact', label: '联系信息', type: 'text', inlineEditable: true, defaultValue: 'hello@lemonppt.dev' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'sunset' },
  ],
};

export function Theme11ClosingCtaV1(props: Theme11ClosingCtaV1Props): ReactNode {
  const { tag, title, subtitle, cta, contact, mood = 'sunset', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme11-closing-cta">
      <div className="lp-theme11-closing-cta-inner lp-rise">
        {tag && <Tagline>{tag}</Tagline>}
        <SignalLine />
        <h2 className="lp-theme11-closing-cta-title"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></h2>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-closing-cta-sub">{subtitle}</EditableField>}
        <div className="lp-theme11-closing-cta-actions">
          {cta && (
            <GradientCard tone="orange" className="lp-theme11-closing-cta-button">
              <EditableField prop="cta" slideIdx={s} editable={e} as="span">{cta}</EditableField>
            </GradientCard>
          )}
          {contact && <EditableField prop="contact" slideIdx={s} editable={e} as="div" className="lp-theme11-closing-cta-contact">{contact}</EditableField>}
        </div>
      </div>
    </Sheet>
  );
}
