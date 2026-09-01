// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 金句页（quote_v1）
 * 情绪：aurora | 骨架：stage
 * 居中展示一句金句 + 署名。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, GradientCard, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11QuoteV1Props {
  quote: string;
  author?: string;
  eyebrow?: string;
  highlight?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11QuoteV1Meta: LayoutMeta = {
  id: 'theme11_quote_v1',
  theme: 'theme11',
  role: 'quote',
  displayName: 'Theme 11 金句页',
  description: '居中展示一句金句 + 署名',
  needsMedia: false,
  tags: ['quote', 'stage', 'light-stream'],
  contentShape: 'quote',
};

export const theme11QuoteV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'QUOTE' },
    { key: 'quote', label: '金句', type: 'textarea', inlineEditable: true, defaultValue: '设计的本质不是装饰，而是让复杂变得可理解。' },
    { key: 'highlight', label: '高亮词', type: 'text', inlineEditable: true, defaultValue: '可理解' },
    { key: 'author', label: '署名', type: 'text', inlineEditable: true, defaultValue: '—— 设计团队' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11QuoteV1(props: Theme11QuoteV1Props): ReactNode {
  const { quote, author, eyebrow, highlight, mood = 'aurora', _slideIdx: s, _editable: e } = props;

  const renderQuote = () => {
    if (!highlight) return quote;
    const parts = quote.split(highlight);
    if (parts.length === 1) return quote;
    return (
      <>
        {parts[0]}
        <GradientCard tone="blue" className="lp-theme11-quote-highlight-card">
          <span className="lp-theme11-quote-highlight">{highlight}</span>
        </GradientCard>
        {parts[1]}
      </>
    );
  };

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme11-quote">
      <div className="lp-theme11-quote-inner lp-rise">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <div className="lp-theme11-quote-text">
          <EditableField prop="quote" slideIdx={s} editable={e} as="blockquote">{renderQuote()}</EditableField>
        </div>
        {author && <EditableField prop="author" slideIdx={s} editable={e} as="p" className="lp-theme11-quote-author">{author}</EditableField>}
      </div>
    </Sheet>
  );
}
