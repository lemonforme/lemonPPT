// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface TestimonialV1Props {
  quote: string;
  author?: string;
  role?: string;
  company?: string;
  avatarUrl?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const testimonialV1Meta: LayoutMeta = {
  id: 'testimonial_v1',
  theme: 'base',
  role: 'testimonial',
  displayName: '客户评价',
  description: '大字引用配头像与作者信息，适合客户证言页',
  needsMedia: true,
};

export function TestimonialV1(props: TestimonialV1Props): ReactNode {
  const { quote, author, role, company, avatarUrl, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-testimonial-v1">
      <div className="lp-testimonial-v1-content">
        <div className="lp-testimonial-v1-quote">
          <span className="lp-testimonial-v1-mark">“</span>
          <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote">
            {quote}
          </EditableField>
        </div>
        <div className="lp-testimonial-v1-author">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={author || ''}
              data-lp-editable-image="true"
              data-lp-slide-idx={_slideIdx}
              data-lp-prop="avatarUrl"
            />
          ) : (
            <div className="lp-testimonial-v1-avatar-placeholder" />
          )}
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
