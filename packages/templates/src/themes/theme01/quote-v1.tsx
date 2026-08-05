// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

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
  description: '居中引用 + 玻璃卡片',
  needsMedia: false,
};

export const theme01QuoteV1Schema: PropsSchema = {
  fields: [
  {
      key: 'quote',
      label: '引用',
      type: 'textarea',
      inlineEditable: true
  },
  {
      key: 'author',
      label: '作者',
      type: 'text',
      inlineEditable: true
  }
  ]
};


export function Theme01QuoteV1(props: Theme01QuoteV1Props): ReactNode {
  const { quote = '', author = '', _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-quote-v1">
      <div className="lp-card lp-quote-card lp-rise">
    <div className="lp-quote-text">
          <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="p">
      {quote}
          </EditableField>
    </div>
    {author && (
          <div className="lp-quote-author">
      <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="span">
              — {author}
      </EditableField>
          </div>
    )}
      </div>
  </div>
  );
}
