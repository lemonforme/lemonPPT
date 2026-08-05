// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03PricingV1Tier {
  name?: string;
  price?: string;
  period?: string;
  features?: Array<{ value?: string } | string>;
  cta?: string;
  highlight?: boolean;
}

export interface Theme03PricingV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  tiers?: Theme03PricingV1Tier[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03PricingV1Meta: LayoutMeta = {
  id: 'theme03_pricing_v1',
  theme: 'theme03',
  role: 'pricing',
  displayName: 'Theme 03 编辑风定价',
  description: '深色代码编辑风定价页，三列/四列套餐卡片对比',
  needsMedia: false,
  tags: ['pricing', 'plans', 'comparison'],
  contentShape: 'pricing-table',
};

export const theme03PricingV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '定价方案' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'PRICING' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '选择适合你的{{方案}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'tiers',
      label: '套餐',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'price', label: '价格', type: 'text' },
        { key: 'period', label: '周期', type: 'text' },
        {
          key: 'features',
          label: '特性',
          type: 'array',
          itemSchema: [{ key: 'value', label: '项', type: 'text' }],
        },
        { key: 'cta', label: '按钮文案', type: 'text' },
        { key: 'highlight', label: '高亮推荐', type: 'boolean' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-pricing-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

function getFeatureValue(feature: { value?: string } | string | undefined): string | undefined {
  if (feature == null) return undefined;
  if (typeof feature === 'string') return feature;
  return feature.value;
}

export function Theme03PricingV1(props: Theme03PricingV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, tiers, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validTiers = (tiers || []).filter((t) => t != null);

  return (
    <div className="lp-slide lp-theme03-pricing-v1">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-pricing-main">
        <div className="lp-theme03-pricing-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-pricing-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {validTiers.length > 0 && (
          <div className="lp-theme03-pricing-grid lp-rise">
            {validTiers.map((tier, idx) => (
              <div key={idx} className={`lp-theme03-pricing-card ${tier.highlight ? 'lp-theme03-pricing-card--highlight' : ''}`}>
                {tier.highlight && <div className="lp-theme03-pricing-badge">推荐</div>}
                <EditableField prop={`tiers.${idx}.name`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-pricing-name">{tier.name}</EditableField>
                <div className="lp-theme03-pricing-price-row">
                  <EditableField prop={`tiers.${idx}.price`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-pricing-price">{tier.price}</EditableField>
                  {tier.period && (
                    <EditableField prop={`tiers.${idx}.period`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-pricing-period">{tier.period}</EditableField>
                  )}
                </div>
                {tier.features && tier.features.length > 0 && (
                  <ul className="lp-theme03-pricing-features">
                    {tier.features.map((feature, fidx) => (
                      <li key={fidx}>
                        <EditableField prop={`tiers.${idx}.features.${fidx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{getFeatureValue(feature)}</EditableField>
                      </li>
                    ))}
                  </ul>
                )}
                {tier.cta && (
                  <EditableField prop={`tiers.${idx}.cta`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-pricing-cta">{tier.cta}</EditableField>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
