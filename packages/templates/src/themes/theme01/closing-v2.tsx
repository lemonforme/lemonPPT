// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet, GlassCard } from './shared.js';

export interface Theme01ClosingV2Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  contact?: string;
  email?: string;
  link?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ClosingV2Meta: LayoutMeta = {
  id: 'theme01_closing_v2',
  theme: 'theme01',
  role: 'closing',
  displayName: 'Theme 01 结尾页',
  description: '居中标题 + 可选 CTA 与联系信息',
  needsMedia: false,
  tags: ['closing', 'ending', 'light', 'tint'],
  contentShape: 'closing',
};

export const theme01ClosingV2Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'cta',
      label: '行动按钮',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'contact',
      label: '联系人',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'email',
      label: '邮箱',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'link',
      label: '链接',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

export function Theme01ClosingV2(props: Theme01ClosingV2Props): ReactNode {
  const { kicker, title, subtitle, cta, contact, email, link, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="tint" frame="stage" className="lp-closing-v2">
      <GlassCard className="lp-closing-card lp-rise">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-closing-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-closing-title">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-closing-subtitle">
            {subtitle}
          </EditableField>
        )}
        {cta && (
          <EditableField prop="cta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-closing-cta">
            {cta}
          </EditableField>
        )}
        {(contact || email || link) && (
          <div className="lp-closing-contacts">
            {contact && (
              <EditableField prop="contact" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-closing-contact">
                {contact}
              </EditableField>
            )}
            {email && (
              <EditableField prop="email" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-closing-email">
                {email}
              </EditableField>
            )}
            {link && (
              <EditableField prop="link" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-closing-link">
                {link}
              </EditableField>
            )}
          </div>
        )}
      </GlassCard>
    </Sheet>
  );
}
