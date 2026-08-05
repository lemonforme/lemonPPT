// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme02TestimonialV1Props {
  kicker?: string;
  quote: string;
  author?: string;
  role?: string;
  company?: string;
  avatarUrl?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02TestimonialV1Meta: LayoutMeta = {
  id: 'theme02_testimonial_v1',
  theme: 'theme02',
  role: 'testimonial',
  displayName: 'Theme 02 霓虹金句',
  description: '深色背景 + 霓虹大字引用配头像',
  needsMedia: true,
};

export const theme02TestimonialV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
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
      key: 'company',
      label: '公司',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'avatarUrl',
      label: '头像',
      type: 'image',
    },
  ],
};

export function Theme02TestimonialV1(props: Theme02TestimonialV1Props): ReactNode {
  const { kicker, quote, author, role, company, avatarUrl, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-testimonial-v1">
      <div className="lp-theme02-testimonial-content">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        <div className="lp-theme02-testimonial-quote lp-rise">
          <span className="lp-theme02-testimonial-mark">“</span>
          <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote">
            {quote}
          </EditableField>
        </div>
        <div className="lp-theme02-testimonial-author lp-rise">
          <LpEditableImage
            src={avatarUrl}
            alt={author || ''}
            slideIdx={_slideIdx}
            editable={_editable}
            prop="avatarUrl"
            placeholderClassName="lp-theme02-testimonial-avatar-placeholder"
            showIcon={false}
            placeholderText="上传头像"
          />
          <div className="lp-theme02-testimonial-meta">
            {author && (
              <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-testimonial-name">
                {author}
              </EditableField>
            )}
            {(role || company) && (
              <div className="lp-theme02-testimonial-role">
                {role && (
                  <EditableField prop="role" slideIdx={_slideIdx} editable={_editable} as="span">
                    {role}
                  </EditableField>
                )}
                {role && company && <span> · </span>}
                {company && (
                  <EditableField prop="company" slideIdx={_slideIdx} editable={_editable} as="span">
                    {company}
                  </EditableField>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
