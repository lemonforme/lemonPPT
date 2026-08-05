// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02PricingV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  tiers?: {
    name?: string;
    price?: string;
    period?: string;
    features?: string[];
    cta?: string;
    highlight?: boolean;
  }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02PricingV1Meta: LayoutMeta = {
  id: 'theme02_pricing_v1',
  theme: 'theme02',
  role: 'pricing',
  displayName: 'Theme 02 霓虹定价',
  description: '深色背景 + 霓虹边框三列价格方案对比',
  needsMedia: false,
};

export const theme02PricingV1Schema: PropsSchema = {
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
          minItems: 1,
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
        {
          key: 'highlight',
          label: '高亮推荐',
          type: 'boolean',
        },
      ],
    },
  ],
};

export function Theme02PricingV1(props: Theme02PricingV1Props): ReactNode {
  const { kicker, title, subtitle, tiers = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-pricing-v1">
      <div className="lp-theme02-pricing-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-pricing-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-pricing-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme02-pricing-grid">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={`lp-theme02-pricing-card lp-rise ${tier.highlight ? 'lp-theme02-pricing-card--highlight' : ''}`}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            {tier.highlight && <div className="lp-theme02-pricing-badge">推荐</div>}
            <EditableField prop={`tiers.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme02-pricing-name">
              {tier.name}
            </EditableField>
            <div className="lp-theme02-pricing-price-row">
              <EditableField prop={`tiers.${index}.price`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-pricing-price">
                {tier.price}
              </EditableField>
              {tier.period && (
                <EditableField prop={`tiers.${index}.period`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-pricing-period">
                  {tier.period}
                </EditableField>
              )}
            </div>
            <ul className="lp-theme02-pricing-features">
              {(tier.features || []).map((feature, fIndex) => (
                <li key={fIndex}>
                  <EditableField prop={`tiers.${index}.features.${fIndex}`} slideIdx={_slideIdx} editable={_editable} as="span">
                    {feature}
                  </EditableField>
                </li>
              ))}
            </ul>
            {tier.cta && (
              <EditableField prop={`tiers.${index}.cta`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-pricing-cta">
                {tier.cta}
              </EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
