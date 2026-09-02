// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Folio, Headline, NumberSticker, Pill, Plus, Ring, Sheet, Slash, LpPhoto } from './shared.js';

export interface Theme01FeatureV2Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  items?: Array<{ title?: string; description?: string }>;
  footer?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01FeatureV2Meta: LayoutMeta = {
  id: 'theme01_feature_v2',
  theme: 'theme01',
  role: 'feature',
  displayName: 'Theme 01 案例与竞争力',
  description: '左侧影像区 + 右侧编号要点卡片',
  needsMedia: true,
};

export const theme01FeatureV2Schema: PropsSchema = {
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
      key: 'imageUrl',
      label: '图片',
      type: 'image',
    },
    {
      key: 'imageAlt',
      label: '图片说明',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'items',
      label: '要点',
      type: 'array',
      minItems: 1,
      maxItems: 5,
      itemSchema: [
        {
          key: 'title',
          label: '标题',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'description',
          label: '描述',
          type: 'textarea',
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'footer',
      label: '底部注释',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

const numberColors = ['violet', 'green', 'amber', 'cyan', 'pink'] as const;

export function Theme01FeatureV2(props: Theme01FeatureV2Props): ReactNode {
  const { kicker, title, subtitle, imageUrl, items = [], footer, _slideIdx, _editable } = props;
  const safeItems = items.slice(0, 5);

  return (
    <Sheet substrate="tint" tint="blue" frame="split" className="lp-feature-v2">
      <Blob
        className="lp-feature-v2-blob"
        style={{ width: 400, height: 400, top: -160, right: -140, background: 'var(--lp-blue)', opacity: 0.14 }}
      />
      <DottedPattern
        className="lp-feature-v2-dots"
        style={{ bottom: 70, left: 70, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-feature-v2-slash"
        style={{ top: 120, right: 120, height: 80, background: 'var(--lp-amber)', opacity: 0.5 }}
      />
      <Ring
        className="lp-feature-v2-ring"
        style={{ width: 130, height: 130, bottom: 90, right: 90, borderColor: 'var(--lp-green)' }}
      />
      <Plus
        className="lp-feature-v2-plus"
        style={{ top: 160, left: 130, width: 34, height: 34, color: 'var(--lp-red)' }}
      />

      <div className="lp-feature-v2-content">
        <div className="lp-feature-v2-header lp-rise">
          {kicker && (
            <div className="lp-feature-v2-kicker">
              <Pill variant="outline" color="blue">
                {kicker}
              </Pill>
            </div>
          )}
          <Headline cn={title} size="large" slideIdx={_slideIdx} editable={_editable} propCn="title" />
          {subtitle && (
            <EditableField
              prop="subtitle"
              slideIdx={_slideIdx}
              editable={_editable}
              as="p"
              className="lp-feature-v2-subtitle"
            >
              {subtitle}
            </EditableField>
          )}
        </div>

        <div className="lp-feature-v2-body">
          <LpPhoto
            prop="imageUrl"
            src={imageUrl}
            slideIdx={_slideIdx}
            editable={_editable}
            ratio="fill"
            className="lp-feature-v2-image lp-rise"
            hint="点击上传"
          />

          <div className="lp-feature-v2-cards">
            {safeItems.map((item, index) => (
              <div
                key={index}
                className={`lp-feature-v2-card lp-feature-v2-card--${numberColors[index % numberColors.length]} lp-rise`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <NumberSticker value={String(index + 1).padStart(2, '0')} />
                <div className="lp-feature-v2-card-body">
                  <EditableField
                    prop={`items.${index}.title`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="h3"
                    className="lp-feature-v2-card-title"
                  >
                    {item.title}
                  </EditableField>
                  {item.description && (
                    <EditableField
                      prop={`items.${index}.description`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="p"
                      className="lp-feature-v2-card-description"
                    >
                      {item.description}
                    </EditableField>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {footer && (
          <EditableField
            prop="footer"
            slideIdx={_slideIdx}
            editable={_editable}
            as="div"
            className="lp-feature-v2-footer lp-rise"
          >
            {footer}
          </EditableField>
        )}
      </div>

      <Folio
        left="CASE"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
