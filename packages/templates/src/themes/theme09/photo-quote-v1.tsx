// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 影像金句（photo_quote_v1）
 * 基底：墨 | 骨架：full-bleed | 图位：1
 *
 * 满版出血影像铺底（整面压暗蒙版），专色竖线挂大字引文 + 出处，
 * 底部 meta 行。杂志「人物引述 / 观点」页。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { InkPhoto, Sheet, normalizeStrings } from './shared.js';

export interface Theme09PhotoQuoteV1Props {
  quote: string;
  attribution?: string;
  attributionEn?: string;
  metaItems?: string[];
  imageUrl?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09PhotoQuoteV1Meta: LayoutMeta = {
  id: 'theme09_photo_quote_v1',
  theme: 'theme09',
  role: 'quote',
  displayName: 'Theme 09 影像金句',
  description: '满版影像 + 整面压暗蒙版 + 大字引文与出处，人物引述 / 观点页',
  needsMedia: true,
  mediaSlots: [{ name: '金句影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['photo', 'quote', 'editorial', 'full-bleed'],
  contentShape: 'photo-quote',
};

export const theme09PhotoQuoteV1Schema: PropsSchema = {
  fields: [
    {
      key: 'quote',
      label: '引文',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '品牌不是被设计出来的，而是被使用出来的。',
    },
    { key: 'attribution', label: '出处', type: 'text', inlineEditable: true, defaultValue: '—— 品牌主理人 · 年度复盘' },
    { key: 'attributionEn', label: '出处英文', type: 'text', inlineEditable: true, defaultValue: 'Brand Lead, Annual Review' },
    {
      key: 'metaItems',
      label: '底部信息',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: ['ISSUE 09', '2026.08', '观点引述'],
      itemSchema: [{ key: 'item', label: '条目', type: 'text' }],
    },
    { key: 'imageUrl', label: '金句影像', type: 'image', defaultValue: '' },
  ],
};

export function Theme09PhotoQuoteV1(props: Theme09PhotoQuoteV1Props): ReactNode {
  const { quote, attribution, attributionEn, imageUrl, _slideIdx: s, _editable: e } = props;
  const metaItems = normalizeStrings(props.metaItems).slice(0, 4);

  return (
    <Sheet substrate="ink" frame="full-bleed" className="lp-theme09-photoquote" grain={false}>
      <InkPhoto
        prop="imageUrl"
        src={imageUrl}
        slideIdx={s}
        editable={e}
        ratio="fill"
        scrim="full"
        hint="点击上传金句影像"
      />

      <div className="lp-theme09-photoquote-inner">
        <span className="lp-theme09-photoquote-rule lp-rise" aria-hidden="true" />
        <EditableField prop="quote" slideIdx={s} editable={e} as="blockquote" className="lp-theme09-photoquote-text lp-rise">
          {quote}
        </EditableField>
        {attribution && (
          <EditableField prop="attribution" slideIdx={s} editable={e} as="cite" className="lp-theme09-photoquote-attr lp-rise">
            {attribution}
          </EditableField>
        )}
        {attributionEn && (
          <EditableField prop="attributionEn" slideIdx={s} editable={e} as="span" className="lp-theme09-photoquote-attr-en lp-rise">
            {attributionEn}
          </EditableField>
        )}
        {metaItems.length > 0 && (
          <div className="lp-theme09-photoquote-meta lp-rise" style={{ animationDelay: '140ms' }}>
            {metaItems.map((m, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '22px' }}>
                {i > 0 && <i aria-hidden="true">/</i>}
                <EditableField prop={`metaItems.${i}`} slideIdx={s} editable={e} as="span">
                  {m}
                </EditableField>
              </span>
            ))}
          </div>
        )}
      </div>
    </Sheet>
  );
}
