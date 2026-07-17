import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface PricingV1Props {
  kicker?: string;
  title: string;
  tiers?: { name?: string; price?: string; period?: string; features?: string[]; cta?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const pricingV1Meta: LayoutMeta = {
  id: 'minimal_pricing_v1',
  theme: 'minimal',
  role: 'pricing',
  displayName: '价格方案',
  description: '三列价格方案对比，突出推荐方案',
  needsMedia: false,
};

export function PricingV1(props: PricingV1Props): ReactNode {
  const { kicker, title, tiers = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-pricing-v1">
      <div className="lp-pricing-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-pricing-grid">
        {tiers.map((tier, index) => (
          <div key={index} className={`lp-pricing-card ${index === 1 ? 'lp-pricing-card-highlight' : ''}`}>
            <EditableField
              prop={`tiers.${index}.name`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-pricing-name"
            >
              {tier.name}
            </EditableField>
            <div className="lp-pricing-price-row">
              <EditableField
                prop={`tiers.${index}.price`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="span"
                className="lp-pricing-price"
              >
                {tier.price}
              </EditableField>
              {tier.period && (
                <EditableField
                  prop={`tiers.${index}.period`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="span"
                  className="lp-pricing-period"
                >
                  {tier.period}
                </EditableField>
              )}
            </div>
            <ul className="lp-pricing-features">
              {(tier.features || []).map((feature, fIndex) => (
                <li key={fIndex}>
                  <EditableField
                    prop={`tiers.${index}.features.${fIndex}`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                  >
                    {feature}
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
                className="lp-pricing-cta"
              >
                {tier.cta}
              </EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
