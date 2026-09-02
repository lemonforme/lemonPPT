// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';
import { Blob, DottedPattern, Folio, Headline, Pill, Plus, Ring, Sheet, Slash } from './shared.js';

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
  description: '装饰网格展示合作伙伴 Logo',
  needsMedia: true,
};

export const theme01PartnersV1Schema: PropsSchema = {
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

const cardColors = ['blue', 'green', 'amber', 'violet', 'red', 'cyan', 'pink', 'blue'] as const;

export function Theme01PartnersV1(props: Theme01PartnersV1Props): ReactNode {
  const { kicker, title, partners = [], _slideIdx, _editable } = props;

  return (
    <Sheet substrate="light" frame="grid" className="lp-partners-v1">
      <Blob
        className="lp-partners-v1-blob"
        style={{ width: 360, height: 360, top: -130, right: -90, background: 'var(--lp-violet)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-partners-v1-dots"
        style={{ bottom: 90, left: 80, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-partners-v1-slash"
        style={{ top: 110, left: 90, height: 70, background: 'var(--lp-amber)', opacity: 0.45 }}
      />
      <Ring
        className="lp-partners-v1-ring"
        style={{ width: 120, height: 120, bottom: 100, right: 100, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-partners-v1-plus"
        style={{ top: 140, left: 100, width: 30, height: 30, color: 'var(--lp-red)' }}
      />

      <div className="lp-partners-v1-content">
        <div className="lp-partners-v1-header lp-rise">
          {kicker && (
            <div className="lp-partners-v1-kicker">
              <Pill variant="outline" color="violet">
                {kicker}
              </Pill>
            </div>
          )}
          <Headline cn={title} size="large" slideIdx={_slideIdx} editable={_editable} propCn="title" />
        </div>

        <div className="lp-partners-v1-grid">
          {partners.map((partner, index) => (
            <div
              key={index}
              className={`lp-partners-v1-card lp-partners-v1-card--${cardColors[index % cardColors.length]} lp-rise`}
              style={{ animationDelay: `${index * 55}ms` }}
            >
              <LpEditableImage
                src={partner.logoUrl}
                alt={partner.name || ''}
                slideIdx={_slideIdx}
                editable={_editable}
                prop={`partners.${index}.logoUrl`}
                placeholderClassName="lp-partners-v1-logo-placeholder"
                showIcon={false}
                placeholderText="上传 Logo"
              />
              <EditableField
                prop={`partners.${index}.name`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-partners-v1-name"
              >
                {partner.name}
              </EditableField>
            </div>
          ))}
        </div>
      </div>

      <Folio
        left="PARTNERS"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
