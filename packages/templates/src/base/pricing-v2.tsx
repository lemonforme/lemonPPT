// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface PricingV2Props {
  kicker?: string;
  title: string;
  plans?: { name?: string; price?: string; period?: string; features?: string[]; highlighted?: boolean }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const pricingV2Meta: LayoutMeta = {
  id: 'pricing_v2',
  theme: 'base',
  role: 'pricing',
  displayName: '价格对比',
  description: '三列价格方案对比，适合 SaaS 定价页',
  needsMedia: false,
};

export function PricingV2(props: PricingV2Props): ReactNode {
  const { kicker, title, plans = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-pricing-v2">
      <div className="lp-pricing-v2-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-pricing-v2-grid">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`lp-pricing-v2-card${plan.highlighted ? ' lp-pricing-v2-card-highlighted' : ''}`}
          >
            <EditableField
              prop={`plans.${index}.name`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-pricing-v2-name"
            >
              {plan.name}
            </EditableField>
            <div className="lp-pricing-v2-price-row">
              <EditableField
                prop={`plans.${index}.price`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="span"
                className="lp-pricing-v2-price"
              >
                {plan.price}
              </EditableField>
              <EditableField
                prop={`plans.${index}.period`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="span"
                className="lp-pricing-v2-period"
              >
                {plan.period}
              </EditableField>
            </div>
            <ul className="lp-pricing-v2-features">
              {(plan.features ?? []).map((feature, featureIndex) => (
                <li key={featureIndex} className="lp-pricing-v2-feature-item">
                  <EditableField
                    prop={`plans.${index}.features.${featureIndex}`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                    className="lp-pricing-v2-feature"
                  >
                    {feature}
                  </EditableField>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
