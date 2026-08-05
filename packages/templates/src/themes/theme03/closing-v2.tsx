// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03ClosingV2Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  contact?: string;
  email?: string;
  link?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ClosingV2Meta: LayoutMeta = {
  id: 'theme03_closing_v2',
  theme: 'theme03',
  role: 'closing',
  displayName: 'Theme 03 编辑风结尾 v2',
  description: '居中标题 + CTA + 联系信息',
  needsMedia: false,
  tags: ['closing', 'contact'],
  contentShape: 'title-cta-contact',
};

export const theme03ClosingV2Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '感谢' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'CLOSING' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'AI · VENTURE CAPITAL // USA' },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '感谢阅读' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'cta', label: '行动按钮', type: 'text', inlineEditable: true },
    { key: 'contact', label: '联系人', type: 'text', inlineEditable: true },
    { key: 'email', label: '邮箱', type: 'text', inlineEditable: true },
    { key: 'link', label: '链接', type: 'text', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme03ClosingV2(props: Theme03ClosingV2Props): ReactNode {
  const { tag, tagLabel, topRightMeta, kicker, title, subtitle, cta, contact, email, link, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-closing-v2">
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

      <div className="lp-theme03-closing-v2-main">
        <div className="lp-theme03-closing-v2-card lp-rise">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-closing-v2-kicker">
              {kicker}
            </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme03-closing-v2-title">
            {title}
          </EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-closing-v2-subtitle">
              {subtitle}
            </EditableField>
          )}
          {cta && (
            <EditableField prop="cta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-closing-v2-cta">
              {cta}
            </EditableField>
          )}
          {(contact || email || link) && (
            <div className="lp-theme03-closing-v2-contacts">
              {contact && <EditableField prop="contact" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-closing-v2-contact">{contact}</EditableField>}
              {email && <EditableField prop="email" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-closing-v2-contact">{email}</EditableField>}
              {link && <EditableField prop="link" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-closing-v2-contact">{link}</EditableField>}
            </div>
          )}
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
