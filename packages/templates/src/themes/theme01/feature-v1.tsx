// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Folio, Headline, NumberSticker, Pill, Plus, Ring, Sheet, Slash } from './shared.js';

export interface Theme01FeatureV1Props {
  kicker?: string;
  title: string;
  features?: { title?: string; description?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01FeatureV1Meta: LayoutMeta = {
  id: 'theme01_feature_v1',
  theme: 'theme01',
  role: 'feature',
  displayName: 'Theme 01 产品特性',
  description: '彩色序号 + 轻量卡片三列特性展示',
  needsMedia: false,
};

export const theme01FeatureV1Schema: PropsSchema = {
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
      key: 'features',
      label: '特性',
      type: 'array',
      minItems: 2,
      maxItems: 6,
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
  ],
};

const cardColors = ['blue', 'green', 'amber', 'violet', 'red', 'cyan'] as const;

export function Theme01FeatureV1(props: Theme01FeatureV1Props): ReactNode {
  const { kicker, title, features = [], _slideIdx, _editable } = props;

  return (
    <Sheet substrate="light" frame="grid" className="lp-feature-v1">
      <Blob
        className="lp-feature-v1-blob"
        style={{ width: 380, height: 380, top: -140, right: -100, background: 'var(--lp-blue)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-feature-v1-dots"
        style={{ bottom: 90, left: 80, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-feature-v1-slash"
        style={{ top: 110, left: 100, height: 70, background: 'var(--lp-amber)', opacity: 0.45 }}
      />
      <Ring
        className="lp-feature-v1-ring"
        style={{ width: 120, height: 120, bottom: 100, right: 100, borderColor: 'var(--lp-green)' }}
      />
      <Plus
        className="lp-feature-v1-plus"
        style={{ top: 150, left: 130, width: 32, height: 32, color: 'var(--lp-red)' }}
      />

      <div className="lp-feature-v1-content">
        <div className="lp-feature-v1-header lp-rise">
          {kicker && (
            <div className="lp-feature-v1-kicker">
              <Pill variant="outline" color="blue">
                {kicker}
              </Pill>
            </div>
          )}
          <Headline cn={title} size="large" slideIdx={_slideIdx} editable={_editable} propCn="title" />
        </div>

        <div className="lp-feature-v1-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`lp-feature-v1-card lp-feature-v1-card--${cardColors[index % cardColors.length]} lp-rise`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <NumberSticker value={String(index + 1).padStart(2, '0')} outline />
              <EditableField
                prop={`features.${index}.title`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="h3"
                className="lp-feature-v1-card-title"
              >
                {feature.title}
              </EditableField>
              {feature.description && (
                <EditableField
                  prop={`features.${index}.description`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="p"
                  className="lp-feature-v1-card-description"
                >
                  {feature.description}
                </EditableField>
              )}
            </div>
          ))}
        </div>
      </div>

      <Folio
        left="FEATURE"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
