// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme01TestimonialV1Props {
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

export const theme01TestimonialV1Meta: LayoutMeta = {
  id: 'theme01_testimonial_v1',
  theme: 'theme01',
  role: 'testimonial',
  displayName: 'Theme 01 客户评价',
  description: '玻璃质感大字引用配头像与作者信息',
  needsMedia: true,
};

export const theme01TestimonialV1Schema: PropsSchema = {
  fields: [
  {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
  },
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
      key: 'company',
      label: '公司',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'avatarUrl',
      label: '头像',
      type: 'image'
  }
  ]
};


export function Theme01TestimonialV1(props: Theme01TestimonialV1Props): ReactNode {
  const { kicker, quote, author, role, company, avatarUrl, _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-testimonial-v1">
      <div className="lp-testimonial-v1-content">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <div className="lp-testimonial-v1-quote lp-rise">
          <span className="lp-testimonial-v1-mark">“</span>
          <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote">
      {quote}
          </EditableField>
    </div>
    <div className="lp-testimonial-v1-author lp-rise">
          <LpEditableImage
              src={avatarUrl}
              alt={author || ''}
              slideIdx={_slideIdx}
              editable={_editable}
              prop="avatarUrl"
              placeholderClassName="lp-testimonial-v1-avatar-placeholder"
              showIcon={false}
              placeholderText="上传头像"
            />
          <div className="lp-testimonial-v1-meta">
      {author && (
              <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-testimonial-v1-name">
        {author}
              </EditableField>
      )}
      {(role || company) && (
              <div className="lp-testimonial-v1-role">
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
