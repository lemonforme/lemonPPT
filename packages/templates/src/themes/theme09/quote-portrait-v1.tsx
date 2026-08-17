import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Sheet } from './shared.js';

export interface Theme09QuotePortraitV1Props {
  mark?: string;
  quote?: string;
  attribution?: string;
  images?: { url?: string; caption?: string }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09QuotePortraitV1Meta: LayoutMeta = {
  id: 'theme09_quote_portrait_v1',
  theme: 'theme09',
  role: 'quote',
  displayName: 'Theme 09 人物引述',
  description: '左肖像出血 + 右侧巨型引号与引语',
  needsMedia: true,
  mediaSlots: [{ name: '人物肖像', fieldPath: 'images', canPresetMedia: true }],
  tags: ['quote', 'portrait', 'editorial'],
  contentShape: 'quote-portrait',
};

export const theme09QuotePortraitV1Schema: PropsSchema = {
  fields: [
    { key: 'mark', label: '标记', type: 'text', inlineEditable: true, defaultValue: '观点引述' },
    { key: 'quote', label: '引语', type: 'textarea', inlineEditable: true, defaultValue: '我们不是在建造一个更聪明的产品，而是在学习如何对一个真实的人保持耐心。' },
    { key: 'attribution', label: '署名', type: 'text', inlineEditable: true, defaultValue: '— 周明，产品负责人' },
    { key: 'images', label: '肖像', type: 'array', defaultValue: [] },
    { key: 'folioLeft', label: '骑缝左', type: 'text', inlineEditable: true, defaultValue: '观点引述' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '52' },
    { key: 'folioRight', label: '骑缝右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme09QuotePortraitV1(props: Theme09QuotePortraitV1Props): ReactNode {
  const { mark, quote, attribution, images, folioLeft, folioPage, folioRight, _slideIdx: s, _editable: e } = props;
  const img = images?.[0] ?? {};
  return (
    <Sheet frame="spread" substrate="ink" className="lp-theme09-quoteportrait" cropMarks accent>
      <InkPhoto
        prop="images.0.url"
        src={img.url}
        slideIdx={s}
        editable={e}
        ratio="3:4"
        fit="cover"
        halftone
        hint="点击上传人物肖像"
        className="lp-theme09-quoteportrait-photo"
      />
      <div className="lp-theme09-quoteportrait-body">
        <div className="lp-theme09-quoteportrait-mark">
          <EditableField prop="mark" slideIdx={s} editable={e} as="span">{mark}</EditableField>
        </div>
        <div className="lp-theme09-quoteportrait-quote">
          <span className="lp-theme09-quoteportrait-mark-quote" aria-hidden="true">“</span>
          <EditableField prop="quote" slideIdx={s} editable={e} as="blockquote" className="lp-theme09-quoteportrait-text">{quote}</EditableField>
        </div>
        {attribution && (
          <EditableField prop="attribution" slideIdx={s} editable={e} as="p" className="lp-theme09-quoteportrait-attr">{attribution}</EditableField>
        )}
        <Folio inverse left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
      </div>
    </Sheet>
  );
}
