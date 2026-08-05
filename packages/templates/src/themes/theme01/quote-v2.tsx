// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01QuoteV2Props {
  quote?: string;
  author?: string;
  role?: string;
  source?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01QuoteV2Meta: LayoutMeta = {
  id: 'theme01_quote_v2',
  theme: 'theme01',
  role: 'quote',
  displayName: 'Theme 01 引述卡片',
  description: '左侧大引号 + 右侧玻璃卡片内容',
  needsMedia: false,
};

export const theme01QuoteV2Schema: PropsSchema = {
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
  },
  {
      key: 'role',
      label: '职位',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'source',
      label: 'source',
      type: 'text',
      inlineEditable: true
  }
  ]
};


export function Theme01QuoteV2(props: Theme01QuoteV2Props): ReactNode {
  const { quote, author, role, source, _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-quote-v2">
      <div className="lp-quote-v2-mark lp-rise">“</div>
      <div className="lp-card lp-quote-v2-card lp-rise">
    <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-quote-v2-text">
          {quote}
    </EditableField>
    <div className="lp-quote-v2-meta">
          {author && (
      <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-quote-v2-author">
              {author}
      </EditableField>
          )}
          {role && (
      <EditableField prop="role" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-quote-v2-role">
              {role}
      </EditableField>
          )}
          {source && (
      <EditableField prop="source" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-quote-v2-source">
              {source}
      </EditableField>
          )}
    </div>
      </div>
  </div>
  );
}
