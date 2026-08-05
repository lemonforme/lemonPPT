// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
export interface Theme01PricingV1Props {
  kicker?: string;
  title: string;
  tiers?: {
    name?: string;
    price?: string;
    period?: string;
    features?: string[];
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
  description: '玻璃质感三列价格方案对比，突出推荐方案',
  needsMedia: false,
};
export const theme01PricingV1Schema: PropsSchema = {
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
          inlineEditable: true
        },
        {
          key: 'price',
          label: '价格',
          type: 'text',
          inlineEditable: true
        },
        {
          key: 'period',
          label: '周期',
          type: 'text',
          inlineEditable: true
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
              inlineEditable: true
            }
          ]
        },
        {
          key: 'cta',
          label: '按钮文案',
          type: 'text',
          inlineEditable: true
        }
      ]
    }
  ]
};
export function Theme01PricingV1(props: Theme01PricingV1Props): ReactNode {
  const { kicker, title, tiers = [], _slideIdx, _editable } = props;
  return (<div className="lp-slide lp-pricing-v1">
      <div className="lp-pricing-header">
    {kicker && (<EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>)}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-pricing-title lp-rise">
          {title}
    </EditableField>
      </div>
      <div className="lp-pricing-grid">
    {tiers.map((tier, index) => (<div key={index} className={`lp-card lp-pricing-card lp-rise ${index === 1 ? 'lp-pricing-card-highlight' : ''}`}>
      <EditableField prop={`tiers.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-pricing-name">
              {tier.name}
      </EditableField>
      <div className="lp-pricing-price-row">
              <EditableField prop={`tiers.${index}.price`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-pricing-price">
        {tier.price}
              </EditableField>
              {tier.period && (<EditableField prop={`tiers.${index}.period`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-pricing-period">
                  {tier.period}
        </EditableField>)}
      </div>
      <ul className="lp-pricing-features">
              {(tier.features || []).map((feature, fIndex) => (<li key={fIndex}>
                  <EditableField prop={`tiers.${index}.features.${fIndex}`} slideIdx={_slideIdx} editable={_editable} as="span">
          {feature}
                  </EditableField>
        </li>))}
      </ul>
      {tier.cta && (<EditableField prop={`tiers.${index}.cta`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pricing-cta">
                  {tier.cta}
        </EditableField>)}
      </div>))}
    </div>
      </div>);
}
