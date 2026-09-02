// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Folio, Headline, Pill, Plus, Ring, Sheet, Slash } from './shared.js';

export interface Theme01PricingV1Props {
  kicker?: string;
  title: string;
  tiers?: {
    name?: string;
    price?: string;
    period?: string;
    features?: { item?: string }[];
    cta?: string;
  }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01PricingV1Meta: LayoutMeta = {
  id: 'theme01_pricing_v1',
  theme: 'theme01',
  role: 'pricing',
  displayName: 'Theme 01 价格方案',
  description: 'Vivid Pop 三列价格方案对比，突出推荐方案',
  needsMedia: false,
};

export const theme01PricingV1Schema: PropsSchema = {
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
      key: 'tiers',
      label: '套餐',
      type: 'array',
      maxItems: 4,
      minItems: 2,
      itemSchema: [
        {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'price',
          label: '价格',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'period',
          label: '周期',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'features',
          label: '特性',
          type: 'array',
          minItems: 2,
          maxItems: 8,
          itemSchema: [
            {
              key: 'item',
              label: '项',
              type: 'text',
              inlineEditable: true,
            },
          ],
        },
        {
          key: 'cta',
          label: '按钮文案',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
  ],
};

const tierColors = ['blue', 'green', 'amber', 'violet'] as const;

export function Theme01PricingV1(props: Theme01PricingV1Props): ReactNode {
  const { kicker, title, tiers = [], _slideIdx, _editable } = props;
  const safeTiers = tiers.slice(0, 4);

  return (
    <Sheet substrate="tint" tint="amber" frame="grid" className="lp-pricing-v1">
      <Blob
        className="lp-pricing-v1-blob"
        style={{ width: 420, height: 420, top: -170, left: -120, background: 'var(--lp-amber)', opacity: 0.13 }}
      />
      <DottedPattern
        className="lp-pricing-v1-dots"
        style={{ bottom: 80, right: 80, width: 240, height: 240, opacity: 0.18 }}
      />
      <Slash
        className="lp-pricing-v1-slash"
        style={{ top: 120, right: 120, height: 80, background: 'var(--lp-blue)', opacity: 0.45 }}
      />
      <Ring
        className="lp-pricing-v1-ring"
        style={{ width: 130, height: 130, bottom: 100, left: 100, borderColor: 'var(--lp-green)' }}
      />
      <Plus
        className="lp-pricing-v1-plus"
        style={{ top: 160, right: 140, width: 34, height: 34, color: 'var(--lp-red)' }}
      />

      <div className="lp-pricing-v1-content">
        <div className="lp-pricing-v1-header lp-rise">
          {kicker && (
            <div className="lp-pricing-v1-kicker">
              <Pill variant="outline" color="amber">
                {kicker}
              </Pill>
            </div>
          )}
          <Headline cn={title} size="large" slideIdx={_slideIdx} editable={_editable} propCn="title" />
        </div>

        <div className="lp-pricing-v1-grid">
          {safeTiers.map((tier, index) => {
            const color = tierColors[index % tierColors.length];
            const isHighlight = index === 1;
            return (
              <div
                key={index}
                className={`lp-pricing-v1-card lp-pricing-v1-card--${color} ${isHighlight ? 'lp-pricing-v1-card--highlight' : ''} lp-rise`}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {isHighlight && <span className="lp-pricing-v1-recommended">推荐</span>}
                <EditableField
                  prop={`tiers.${index}.name`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="h3"
                  className="lp-pricing-v1-name"
                >
                  {tier.name}
                </EditableField>
                <div className="lp-pricing-v1-price-row">
                  <EditableField
                    prop={`tiers.${index}.price`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                    className="lp-pricing-v1-price"
                  >
                    {tier.price}
                  </EditableField>
                  {tier.period && (
                    <EditableField
                      prop={`tiers.${index}.period`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-pricing-v1-period"
                    >
                      {tier.period}
                    </EditableField>
                  )}
                </div>
                <ul className="lp-pricing-v1-features">
                  {(tier.features || []).map((feature, fIndex) => (
                    <li key={fIndex}>
                      <span className="lp-pricing-v1-bullet" aria-hidden="true" />
                      <EditableField
                        prop={`tiers.${index}.features.${fIndex}.item`}
                        slideIdx={_slideIdx}
                        editable={_editable}
                        as="span"
                      >
                        {feature?.item ?? ''}
                      </EditableField>
                    </li>
                  ))}
                </ul>
                {tier.cta && (
                  <EditableField
                    prop={`tiers.${index}.cta`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="div"
                    className="lp-pricing-v1-cta"
                  >
                    {tier.cta}
                  </EditableField>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Folio
        left="PRICING"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
