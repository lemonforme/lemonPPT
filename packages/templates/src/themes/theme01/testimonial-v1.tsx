// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';
import { Blob, DottedPattern, Folio, Pill, Plus, Ring, Sheet } from './shared.js';

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
  description: '装饰感大字引用配头像与作者信息',
  needsMedia: true,
};

export const theme01TestimonialV1Schema: PropsSchema = {
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

export function Theme01TestimonialV1(props: Theme01TestimonialV1Props): ReactNode {
  const { kicker, quote, author, role, company, avatarUrl, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="tint" tint="blue" frame="stage" className="lp-testimonial-v1">
      <Blob
        className="lp-testimonial-v1-blob"
        style={{ width: 420, height: 420, top: -160, left: -120, background: 'var(--lp-blue)', opacity: 0.14 }}
      />
      <DottedPattern
        className="lp-testimonial-v1-dots"
        style={{ bottom: 80, right: 90, width: 240, height: 240, opacity: 0.18 }}
      />
      <Ring
        className="lp-testimonial-v1-ring"
        style={{ width: 120, height: 120, top: 110, right: 110, borderColor: 'var(--lp-green)' }}
      />
      <Plus
        className="lp-testimonial-v1-plus"
        style={{ bottom: 120, left: 120, width: 32, height: 32, color: 'var(--lp-amber)' }}
      />

      <div className="lp-testimonial-v1-content lp-rise">
        {kicker && (
          <div className="lp-testimonial-v1-kicker">
            <Pill variant="outline" color="blue">
              {kicker}
            </Pill>
          </div>
        )}
        <div className="lp-testimonial-v1-quote">
          <span className="lp-testimonial-v1-mark">“</span>
          <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote">
            {quote}
          </EditableField>
        </div>
        <div className="lp-testimonial-v1-author">
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

      <Folio
        left="TESTIMONIAL"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
