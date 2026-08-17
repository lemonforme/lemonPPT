// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 引述清单（testimonials_v1）
 * 情绪：ember | 骨架：column-3 | 图位：1
 * 主引述卡（头像 + 金句 + 署名）+ 底部三联短引述。
 * 金融编辑「客户说 / 同行说」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10TestimonialsV1Quote {
  text?: string;
  who?: string;
}
export interface Theme10TestimonialsV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  quote?: string;
  name?: string;
  title?: string;
  source?: string;
  imageUrl?: string;
  quotes?: Theme10TestimonialsV1Quote[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const SECONDARY = 3;

export const theme10TestimonialsV1Meta: LayoutMeta = {
  id: 'theme10_testimonials_v1',
  theme: 'theme10',
  role: 'testimonial',
  displayName: 'Theme 10 引述清单',
  description: '主引述卡（头像）+ 三联短引述',
  needsMedia: true,
  mediaSlots: [{ name: '主引述头像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['testimonials', 'gold-index', 'ember'],
  contentShape: 'testimonials',
};

export const theme10TestimonialsV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '客户说' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Voices' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'quote', label: '主引述', type: 'textarea', inlineEditable: true, defaultValue: '我们没有预测市场，只是把每一次下注都当成一份需要解释给客户听的报告。' },
    { key: 'name', label: '姓名', type: 'text', inlineEditable: true, defaultValue: '沈砚' },
    { key: 'title', label: '职务', type: 'text', inlineEditable: true, defaultValue: '家族办公室 · 投资总监' },
    { key: 'source', label: '来源', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 访谈 · 2026' },
    { key: 'imageUrl', label: '主引述头像', type: 'image', defaultValue: '' },
    {
      key: 'quotes',
      label: '短引述',
      type: 'array',
      minItems: 0,
      maxItems: SECONDARY,
      defaultValue: Array.from({ length: SECONDARY }, () => ({ text: '', who: '' })),
      itemSchema: [
        { key: 'text', label: '引述', type: 'textarea', inlineEditable: true },
        { key: 'who', label: '署名', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '客户说' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '30' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10TestimonialsV1(props: Theme10TestimonialsV1Props): ReactNode {
  const { section, mark, quote, name, title, source, imageUrl, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const raw = props.quotes ?? [];
  const quotes: Theme10TestimonialsV1Quote[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="column-3" className="lp-theme10-testimonials">
      <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>

      <div className="lp-theme10-testimonials-main lp-rise" style={{ animationDelay: '60ms' }}>
        <div className="lp-theme10-testimonials-avatar">
          <EditorialPhoto
            prop="imageUrl"
            src={imageUrl}
            slideIdx={s}
            editable={e}
            ratio="1:1"
            fit="cover"
            hint="点击上传头像"
            className="lp-theme10-testimonials-photo"
          />
        </div>
        <div className="lp-theme10-testimonials-body">
          <span className="lp-theme10-quote-glyph" aria-hidden="true">“</span>
          <EditableField prop="quote" slideIdx={s} editable={e} as="blockquote" className="lp-theme10-testimonials-quote">{quote}</EditableField>
          <div className="lp-theme10-testimonials-sign">
            <EditableField prop="name" slideIdx={s} editable={e} as="span" className="t10-name">{name}</EditableField>
            <EditableField prop="title" slideIdx={s} editable={e} as="span" className="t10-title">{title}</EditableField>
            {source && <EditableField prop="source" slideIdx={s} editable={e} as="span" className="t10-source">{source}</EditableField>}
          </div>
        </div>
      </div>

      <div className="lp-theme10-testimonials-strip">
        {quotes.map((q, i) => (
          <div className="lp-theme10-testimonials-mini lp-rise" style={{ animationDelay: `${160 + i * 50}ms` }} key={i}>
            <EditableField prop={`quotes.${i}.text`} slideIdx={s} editable={e} as="p" className="t10-mini-text">{q.text}</EditableField>
            {q.who && <EditableField prop={`quotes.${i}.who`} slideIdx={s} editable={e} as="span" className="t10-mini-who">{q.who}</EditableField>}
          </div>
        ))}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
