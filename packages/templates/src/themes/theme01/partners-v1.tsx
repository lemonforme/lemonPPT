// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme01PartnersV1Props {
  kicker?: string;
  title: string;
  partners?: { name?: string; logoUrl?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01PartnersV1Meta: LayoutMeta = {
  id: 'theme01_partners_v1',
  theme: 'theme01',
  role: 'partners',
  displayName: 'Theme 01 合作伙伴墙',
  description: '玻璃卡片网格展示合作伙伴 Logo',
  needsMedia: true,
};

export const theme01PartnersV1Schema: PropsSchema = {
  fields: [
  {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
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
          inlineEditable: true
    },
    {
          key: 'logoUrl',
          label: 'Logo',
          type: 'image'
    }
      ]
  }
  ]
};


export function Theme01PartnersV1(props: Theme01PartnersV1Props): ReactNode {
  const { kicker, title, partners = [], _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-partners-v1">
      <div className="lp-partners-header">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-partners-title lp-rise">
          {title}
    </EditableField>
      </div>
      <div className="lp-partners-grid">
    {partners.map((partner, index) => (
          <div key={index} className="lp-card lp-partners-card lp-rise">
      <LpEditableImage
              src={partner.logoUrl}
              alt={partner.name || ''}
              slideIdx={_slideIdx}
              editable={_editable}
              prop={`partners.${index}.logoUrl`}
              placeholderClassName="lp-partners-logo-placeholder"
              showIcon={false}
              placeholderText="上传 Logo"
            />
      <EditableField
              prop={`partners.${index}.name`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-partners-name"
      >
              {partner.name}
      </EditableField>
          </div>
    ))}
      </div>
  </div>
  );
}
