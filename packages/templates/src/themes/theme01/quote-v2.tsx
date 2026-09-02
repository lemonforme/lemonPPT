// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Folio, Plus, Ring, Sheet, Slash } from './shared.js';

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
  description: '左侧大引号 + 右侧装饰内容',
  needsMedia: false,
};

export const theme01QuoteV2Schema: PropsSchema = {
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
    {
      key: 'source',
      label: '来源',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

export function Theme01QuoteV2(props: Theme01QuoteV2Props): ReactNode {
  const { quote, author, role, source, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="light" frame="grid" className="lp-quote-v2">
      <Blob
        className="lp-quote-v2-blob"
        style={{ width: 380, height: 380, top: -140, right: -100, background: 'var(--lp-blue)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-quote-v2-dots"
        style={{ bottom: 80, left: 80, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-quote-v2-slash"
        style={{ top: 120, right: 140, height: 70, background: 'var(--lp-amber)', opacity: 0.45 }}
      />
      <Ring
        className="lp-quote-v2-ring"
        style={{ width: 120, height: 120, bottom: 90, right: 100, borderColor: 'var(--lp-green)' }}
      />
      <Plus
        className="lp-quote-v2-plus"
        style={{ top: 140, left: 130, width: 30, height: 30, color: 'var(--lp-red)' }}
      />

      <div className="lp-quote-v2-content lp-rise">
        <div className="lp-quote-v2-mark">“</div>
        <div className="lp-quote-v2-card">
          <EditableField
            prop="quote"
            slideIdx={_slideIdx}
            editable={_editable}
            as="blockquote"
            className="lp-quote-v2-text"
          >
            {quote}
          </EditableField>
          <div className="lp-quote-v2-meta">
            {author && (
              <EditableField
                prop="author"
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-quote-v2-author"
              >
                {author}
              </EditableField>
            )}
            {role && (
              <EditableField prop="role" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-quote-v2-role">
                {role}
              </EditableField>
            )}
            {source && (
              <EditableField
                prop="source"
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-quote-v2-source"
              >
                {source}
              </EditableField>
            )}
          </div>
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
