// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Folio, Plus, Ring, Sheet } from './shared.js';

export interface Theme01QuoteV3Props {
  quote?: string;
  author?: string;
  role?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01QuoteV3Meta: LayoutMeta = {
  id: 'theme01_quote_v3',
  theme: 'theme01',
  role: 'quote',
  displayName: 'Theme 01 大字金句',
  description: '全屏大字引用 + 装饰强调',
  needsMedia: false,
};

export const theme01QuoteV3Schema: PropsSchema = {
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
    {
      key: 'role',
      label: '职位',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

export function Theme01QuoteV3(props: Theme01QuoteV3Props): ReactNode {
  const { quote, author, role, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="tint" tint="amber" frame="stage" className="lp-quote-v3">
      <Blob
        className="lp-quote-v3-blob"
        style={{ width: 460, height: 460, bottom: -180, right: -120, background: 'var(--lp-amber)', opacity: 0.14 }}
      />
      <DottedPattern
        className="lp-quote-v3-dots"
        style={{ top: 90, left: 90, width: 220, height: 220, opacity: 0.18 }}
      />
      <Ring
        className="lp-quote-v3-ring"
        style={{ width: 140, height: 140, bottom: 100, left: 100, borderColor: 'var(--lp-pink)' }}
      />
      <Plus
        className="lp-quote-v3-plus"
        style={{ top: 120, right: 130, width: 36, height: 36, color: 'var(--lp-blue)' }}
      />

      <div className="lp-quote-v3-content lp-rise">
        <div className="lp-quote-v3-mark">“</div>
        <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-quote-v3-text">
          {quote}
        </EditableField>
        <div className="lp-quote-v3-line" />
        <div className="lp-quote-v3-meta">
          {author && (
            <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-quote-v3-author">
              {author}
            </EditableField>
          )}
          {role && (
            <EditableField prop="role" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-quote-v3-role">
              {role}
            </EditableField>
          )}
        </div>
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
