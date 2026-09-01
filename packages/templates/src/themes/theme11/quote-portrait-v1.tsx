// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 人物金句页（quote_portrait_v1）
 * 情绪：daylight | 骨架：sidebar
 * 左侧人物头像 + 右侧金句与署名。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11QuotePortraitV1Props {
  quote: string;
  author: string;
  role?: string;
  photo?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11QuotePortraitV1Meta: LayoutMeta = {
  id: 'theme11_quote_portrait_v1',
  theme: 'theme11',
  role: 'quote',
  displayName: 'Theme 11 人物金句页',
  description: '左侧人物头像 + 右侧金句与署名',
  needsMedia: true,
  tags: ['quote', 'portrait', 'sidebar', 'light-stream'],
  contentShape: 'quote-portrait',
};

export const theme11QuotePortraitV1Schema: PropsSchema = {
  fields: [
    { key: 'quote', label: '金句', type: 'textarea', inlineEditable: true, defaultValue: '我们不是在卖工具，而是在帮团队找回表达的自由。' },
    { key: 'author', label: '姓名', type: 'text', inlineEditable: true, defaultValue: '林晓' },
    { key: 'role', label: '职位', type: 'text', inlineEditable: true, defaultValue: '创始人' },
    { key: 'photo', label: '头像', type: 'image', defaultValue: '' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11QuotePortraitV1(props: Theme11QuotePortraitV1Props): ReactNode {
  const { quote, author, role, photo, mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="sidebar" className="lp-theme11-quote-portrait">
      <div className="lp-theme11-quote-portrait-left lp-rise">
        <EditorialPhoto prop="photo" src={photo} slideIdx={s} editable={e} alt={author} className="lp-theme11-quote-portrait-photo" placeholderClassName="lp-theme11-quote-portrait-photo-placeholder" />
      </div>
      <div className="lp-theme11-quote-portrait-right lp-rise" style={{ animationDelay: '80ms' }}>
        <div className="lp-theme11-quote-portrait-mark">“</div>
        <EditableField prop="quote" slideIdx={s} editable={e} as="blockquote" className="lp-theme11-quote-portrait-quote">{quote}</EditableField>
        <EditableField prop="author" slideIdx={s} editable={e} as="p" className="lp-theme11-quote-portrait-author">{author}</EditableField>
        {role && <EditableField prop="role" slideIdx={s} editable={e} as="span" className="lp-theme11-quote-portrait-role">{role}</EditableField>}
      </div>
    </Sheet>
  );
}
