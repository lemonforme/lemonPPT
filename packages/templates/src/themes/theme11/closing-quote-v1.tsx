// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 引用式结束页（closing_quote_v1）
 * 情绪：daylight | 骨架：sidebar
 * 大段引用 + 作者信息 + 装饰引号。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11ClosingQuoteV1Props {
  quote: string;
  author?: string;
  role?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ClosingQuoteV1Meta: LayoutMeta = {
  id: 'theme11_closing_quote_v1',
  theme: 'theme11',
  role: 'closing',
  displayName: 'Theme 11 引用结束页',
  description: '大段引用 + 作者信息 + 装饰引号',
  needsMedia: false,
  tags: ['closing', 'quote', 'light-stream'],
  contentShape: 'closing',
};

export const theme11ClosingQuoteV1Schema: PropsSchema = {
  fields: [
    { key: 'quote', label: '引用内容', type: 'textarea', inlineEditable: true, defaultValue: '好的设计不是装饰，而是让复杂变简单的能力。' },
    { key: 'author', label: '作者', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT 设计团队' },
    { key: 'role', label: '作者身份', type: 'text', inlineEditable: true, defaultValue: 'Light Stream 设计系统' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ClosingQuoteV1(props: Theme11ClosingQuoteV1Props): ReactNode {
  const { quote, author, role, mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme11-closing-quote">
      <div className="lp-theme11-closing-quote-inner lp-rise">
        <SignalLine />
        <div className="lp-theme11-closing-quote-mark" aria-hidden="true">“</div>
        <EditableField prop="quote" slideIdx={s} editable={e} as="blockquote" className="lp-theme11-closing-quote-text">{quote}</EditableField>
        <div className="lp-theme11-closing-quote-attribution">
          {author && <EditableField prop="author" slideIdx={s} editable={e} as="span" className="lp-theme11-closing-quote-author">{author}</EditableField>}
          {role && <EditableField prop="role" slideIdx={s} editable={e} as="span" className="lp-theme11-closing-quote-role">{role}</EditableField>}
        </div>
      </div>
    </Sheet>
  );
}
