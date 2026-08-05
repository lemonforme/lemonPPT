// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme02PartnersV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  partners?: { name?: string; logoUrl?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02PartnersV1Meta: LayoutMeta = {
  id: 'theme02_partners_v1',
  theme: 'theme02',
  role: 'partners',
  displayName: 'Theme 02 霓虹伙伴墙',
  description: '深色背景 + 霓虹边框合作伙伴网格',
  needsMedia: true,
};

export const theme02PartnersV1Schema: PropsSchema = {
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
      key: 'partners',
      label: '合作伙伴',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'logoUrl',
          label: 'Logo',
          type: 'image',
        },
      ],
    },
  ],
};

export function Theme02PartnersV1(props: Theme02PartnersV1Props): ReactNode {
  const { kicker, title, subtitle, partners = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-partners-v1">
      <div className="lp-theme02-partners-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-partners-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-partners-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme02-partners-grid">
        {partners.map((partner, index) => (
          <div key={index} className="lp-theme02-partners-card lp-rise" style={{ animationDelay: `${index * 70}ms` }}>
            <LpEditableImage
              src={partner.logoUrl}
              alt={partner.name || ''}
              slideIdx={_slideIdx}
              editable={_editable}
              prop={`partners.${index}.logoUrl`}
              placeholderClassName="lp-theme02-partners-logo-placeholder"
              showIcon={false}
              placeholderText="上传 Logo"
            />
            <EditableField prop={`partners.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-partners-name">
              {partner.name}
            </EditableField>
          </div>
        ))}
      </div>
    </div>
  );
}
