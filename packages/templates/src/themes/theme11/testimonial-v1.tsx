// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 客户证言页（testimonial_v1）
 * 情绪：sunset | 骨架：sidebar
 * 左侧引言 + 右侧客户信息与头像。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, EditorialPhoto, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11TestimonialV1Props {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  photo?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11TestimonialV1Meta: LayoutMeta = {
  id: 'theme11_testimonial_v1',
  theme: 'theme11',
  role: 'quote',
  displayName: 'Theme 11 客户证言页',
  description: '左侧引言 + 右侧客户信息与头像',
  needsMedia: true,
  tags: ['quote', 'testimonial', 'sidebar', 'light-stream'],
  contentShape: 'testimonial',
};

export const theme11TestimonialV1Schema: PropsSchema = {
  fields: [
    { key: 'quote', label: '引言', type: 'textarea', inlineEditable: true, defaultValue: 'LemonPPT 让我们的方案演示效率提升了 3 倍以上，团队可以把更多时间花在内容本身。' },
    { key: 'author', label: '姓名', type: 'text', inlineEditable: true, defaultValue: '李然' },
    { key: 'role', label: '职位', type: 'text', inlineEditable: true, defaultValue: '产品总监' },
    { key: 'company', label: '公司', type: 'text', inlineEditable: true, defaultValue: '星云科技' },
    { key: 'photo', label: '头像', type: 'image', defaultValue: '' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11TestimonialV1(props: Theme11TestimonialV1Props): ReactNode {
  const { quote, author, role, company, photo, mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="sidebar" className="lp-theme11-testimonial">
      <div className="lp-theme11-testimonial-left lp-rise">
        <div className="lp-theme11-testimonial-quote-mark">“</div>
        <EditableField prop="quote" slideIdx={s} editable={e} as="blockquote" className="lp-theme11-testimonial-quote">{quote}</EditableField>
      </div>
      <Card className="lp-theme11-testimonial-card lp-rise" padding="large">
        <EditorialPhoto prop="photo" src={photo} slideIdx={s} editable={e} alt={author} className="lp-theme11-testimonial-photo" placeholderClassName="lp-theme11-testimonial-photo-placeholder" />
        <EditableField prop="author" slideIdx={s} editable={e} as="h3" className="lp-theme11-testimonial-author">{author}</EditableField>
        <div className="lp-theme11-testimonial-meta">
          {role && <EditableField prop="role" slideIdx={s} editable={e} as="span">{role}</EditableField>}
          {company && <EditableField prop="company" slideIdx={s} editable={e} as="span">{company}</EditableField>}
        </div>
      </Card>
    </Sheet>
  );
}
