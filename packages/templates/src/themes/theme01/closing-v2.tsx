// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet, Pill, Blob, DottedPattern, Ring, Plus } from './shared.js';

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
  description: 'Vivid Pop 居中结尾页：标题、CTA 与联系信息',
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
    <Sheet substrate="tint" tint="blue" frame="stage" className="lp-closing-v2">
      <Blob
        className="lp-closing-v2-blob"
        style={{ width: 520, height: 520, top: -220, left: -180, background: 'var(--lp-blue)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-closing-v2-dots"
        style={{ bottom: 90, right: 90, width: 220, height: 220, opacity: 0.18 }}
      />
      <Ring
        className="lp-closing-v2-ring"
        style={{ width: 140, height: 140, bottom: 110, left: 110, borderColor: 'var(--lp-amber)' }}
      />
      <Plus
        className="lp-closing-v2-plus"
        style={{ top: 130, right: 130, width: 36, height: 36, color: 'var(--lp-red)' }}
      />

      <div className="lp-closing-v2-content lp-rise">
        {kicker && (
          <div className="lp-closing-v2-kicker">
            <Pill variant="outline" color="blue">{kicker}</Pill>
          </div>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-closing-v2-title">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-closing-v2-subtitle">
            {subtitle}
          </EditableField>
        )}
        {cta && (
          <EditableField prop="cta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-closing-v2-cta">
            {cta}
          </EditableField>
        )}
        {(contact || email || link) && (
          <div className="lp-closing-v2-contacts">
            {contact && (
              <EditableField prop="contact" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-closing-v2-contact">
                {contact}
              </EditableField>
            )}
            {email && (
              <EditableField prop="email" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-closing-v2-email">
                {email}
              </EditableField>
            )}
            {link && (
              <EditableField prop="link" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-closing-v2-link">
                {link}
              </EditableField>
            )}
          </div>
        )}
      </div>
    </Sheet>
  );
}
