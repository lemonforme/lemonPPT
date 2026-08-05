// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02QuoteV2Props {
  quote: string;
  author?: string;
  role?: string;
  source?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02QuoteV2Meta: LayoutMeta = {
  id: 'theme02_quote_v2',
  theme: 'theme02',
  role: 'quote',
  displayName: 'Theme 02 霓虹引述',
  description: '居中名言 + 霓虹引号装饰 + 玻璃卡片',
  needsMedia: false,
  tags: ['quote', 'high-impact'],
};

export const theme02QuoteV2Schema: PropsSchema = {
  fields: [
    {
      key: 'quote',
      label: '引用内容',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'author',
      label: '作者',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'role',
      label: '职位',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'source',
      label: '来源',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

export function Theme02QuoteV2(props: Theme02QuoteV2Props): ReactNode {
  const { quote, author, role, source, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-quote-v2">
      <div className="lp-theme02-quote-v2-glow" aria-hidden="true" />
      <div className="lp-theme02-quote-v2-card lp-rise">
        <div className="lp-theme02-quote-v2-mark lp-rise">“</div>
        <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-theme02-quote-v2-text">
          {quote}
        </EditableField>
        <div className="lp-theme02-quote-v2-meta lp-rise">
          {author && (
            <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-quote-v2-author">
              {author}
            </EditableField>
          )}
          {role && (
            <EditableField prop="role" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-quote-v2-role">
              {role}
            </EditableField>
          )}
          {source && (
            <EditableField prop="source" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-quote-v2-source">
              {source}
            </EditableField>
          )}
        </div>
      </div>
    </div>
  );
}
