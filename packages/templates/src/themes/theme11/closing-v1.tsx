// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 结束页（closing_v1）
 * 情绪：aurora | 骨架：full-bleed
 * 大标题 CTA + 联系方式 + 彩色信号线。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, GradientCard, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11ClosingV1Props {
  title: string;
  subtitle?: string;
  cta?: string;
  contact?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ClosingV1Meta: LayoutMeta = {
  id: 'theme11_closing_v1',
  theme: 'theme11',
  role: 'closing',
  displayName: 'Theme 11 结束页',
  description: '大标题 CTA + 联系方式 + 彩色信号线',
  needsMedia: false,
  tags: ['closing', 'light-stream'],
  contentShape: 'closing',
};

export const theme11ClosingV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '开始你的\n下一场演示' },
    { key: 'subtitle', label: '副语', type: 'textarea', inlineEditable: true, defaultValue: '用 lemonPPT，把想法变成值得分享的画面。' },
    { key: 'cta', label: '按钮文案', type: 'text', inlineEditable: true, defaultValue: '立即体验' },
    { key: 'contact', label: '联系方式', type: 'text', inlineEditable: true, defaultValue: 'hello@lemonppt.dev' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11ClosingV1(props: Theme11ClosingV1Props): ReactNode {
  const { title, subtitle, cta, contact, mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme11-closing">
      <div className="lp-theme11-closing-inner">
        <SignalLine />
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-closing-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-closing-sub">{subtitle}</EditableField>}
        <div className="lp-theme11-closing-actions">
          {cta && (
            <GradientCard tone="blue" className="lp-theme11-closing-cta">
              <EditableField prop="cta" slideIdx={s} editable={e} as="span">{cta}</EditableField>
            </GradientCard>
          )}
          {contact && <EditableField prop="contact" slideIdx={s} editable={e} as="div" className="lp-theme11-closing-contact">{contact}</EditableField>}
        </div>
      </div>
    </Sheet>
  );
}
