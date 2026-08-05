// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme03TestimonialV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  quote: string;
  author?: string;
  role?: string;
  company?: string;
  avatarUrl?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03TestimonialV1Meta: LayoutMeta = {
  id: 'theme03_testimonial_v1',
  theme: 'theme03',
  role: 'testimonial',
  displayName: 'Theme 03 编辑风证言',
  description: '深色代码编辑风客户证言，大引号 + 头像 + mono 身份线',
  needsMedia: true,
  tags: ['testimonial', 'quote', 'social-proof'],
  contentShape: 'testimonial',
};

export const theme03TestimonialV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '客户证言' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'VOICE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'quote', label: '引用', type: 'textarea', inlineEditable: true, defaultValue: 'AI 产业正在从「叙事驱动」进入「兑现驱动」的{{新阶段}}。' },
    { key: 'author', label: '作者', type: 'text', inlineEditable: true, defaultValue: 'Sam Altman' },
    { key: 'role', label: '职位', type: 'text', inlineEditable: true, defaultValue: 'CEO' },
    { key: 'company', label: '公司', type: 'text', inlineEditable: true, defaultValue: 'OpenAI' },
    { key: 'avatarUrl', label: '头像', type: 'image' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderQuote(quote: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = quote.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="quote" slideIdx={slideIdx} editable={editable} as="blockquote" className="lp-theme03-testimonial-quote-text">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03TestimonialV1(props: Theme03TestimonialV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, quote, author, role, company, avatarUrl, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-testimonial-v1 lp-theme03-scanlines">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-testimonial-main">
        <div className="lp-theme03-testimonial-card lp-rise lp-theme03-corner-bracket">
          <span className="lp-theme03-testimonial-mark" aria-hidden="true">“</span>
          {renderQuote(quote || '', _slideIdx, _editable)}

          <div className="lp-theme03-testimonial-author lp-rise">
            <LpEditableImage
              src={avatarUrl}
              alt={author || ''}
              slideIdx={_slideIdx}
              editable={_editable}
              prop="avatarUrl"
              placeholderClassName="lp-editable-image-placeholder lp-theme03-testimonial-avatar-placeholder"
              placeholderText="头像"
              showIcon={false}
            />
            <div className="lp-theme03-testimonial-meta">
              {author && (
                <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-testimonial-name">{author}</EditableField>
              )}
              {(role || company) && (
                <div className="lp-theme03-testimonial-role">
                  {role && <EditableField prop="role" slideIdx={_slideIdx} editable={_editable} as="span">{role}</EditableField>}
                  {role && company && <span> · </span>}
                  {company && <EditableField prop="company" slideIdx={_slideIdx} editable={_editable} as="span">{company}</EditableField>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
