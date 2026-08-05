// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02QuoteV1Props {
  quote: string;
  author?: string;
  role?: string;
  avatar?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02QuoteV1Meta: LayoutMeta = {
  id: 'theme02_quote_v1',
  theme: 'theme02',
  role: 'quote',
  displayName: 'Theme 02 霓虹金句',
  description: '大号引用 + 头像署名 + 霓虹引号',
  needsMedia: true,
};

export const theme02QuoteV1Schema: PropsSchema = {
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
      key: 'avatar',
      label: '头像',
      type: 'image',
    },
  ],
};

export function Theme02QuoteV1(props: Theme02QuoteV1Props): ReactNode {
  const { quote, author, role, avatar, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-quote-v1">
      <div className="lp-theme02-quote-mark lp-rise">“</div>
      <div className="lp-theme02-quote-content lp-rise">
        <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-theme02-quote-text">
          {quote}
        </EditableField>
        {(author || role || avatar) && (
          <div className="lp-theme02-quote-author lp-rise">
            {avatar && (
              <img
                className="lp-theme02-quote-avatar"
                src={avatar}
                alt=""
                data-lp-editable-image="true"
                data-lp-slide-idx={_slideIdx}
                data-lp-prop="avatar"
              />
            )}
            <div className="lp-theme02-quote-meta">
              {author && (
                <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-quote-name">
                  {author}
                </EditableField>
              )}
              {role && (
                <EditableField prop="role" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-quote-role">
                  {role}
                </EditableField>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
