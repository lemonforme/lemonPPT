// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Folio, Plus, Ring, Sheet } from './shared.js';

export interface Theme01QuoteV1Props {
  quote?: string;
  author?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01QuoteV1Meta: LayoutMeta = {
  id: 'theme01_quote_v1',
  theme: 'theme01',
  role: 'quote',
  displayName: 'Theme 01 引用页',
  description: '居中引用 + 装饰金句卡片',
  needsMedia: false,
};

export const theme01QuoteV1Schema: PropsSchema = {
  fields: [
    {
      key: 'quote',
      label: '引用',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'author',
      label: '作者',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

export function Theme01QuoteV1(props: Theme01QuoteV1Props): ReactNode {
  const { quote = '', author = '', _slideIdx, _editable } = props;

  return (
    <Sheet substrate="tint" tint="pink" frame="stage" className="lp-quote-v1">
      <Blob
        className="lp-quote-v1-blob"
        style={{ width: 420, height: 420, top: -160, left: -120, background: 'var(--lp-pink)', opacity: 0.14 }}
      />
      <DottedPattern
        className="lp-quote-v1-dots"
        style={{ bottom: 80, right: 90, width: 240, height: 240, opacity: 0.18 }}
      />
      <Ring
        className="lp-quote-v1-ring"
        style={{ width: 120, height: 120, top: 110, right: 110, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-quote-v1-plus"
        style={{ bottom: 120, left: 120, width: 32, height: 32, color: 'var(--lp-amber)' }}
      />

      <div className="lp-quote-v1-content lp-rise">
        <div className="lp-quote-v1-mark">“</div>
        <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-quote-v1-text">
          {quote}
        </EditableField>
        {author && (
          <div className="lp-quote-v1-author">
            <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="span">
              — {author}
            </EditableField>
          </div>
        )}
      </div>

      <Folio
        left="QUOTE"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
