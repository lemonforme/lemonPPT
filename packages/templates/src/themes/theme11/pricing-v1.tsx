// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 价格方案页（pricing_v1）
 * 情绪：aurora | 骨架：column-3
 * 顶部标题 + 3 列价格卡片。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, GradientCard, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11PricingV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  plans?: { name: string; price: string; period?: string; features: string[]; highlighted?: boolean }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11PricingV1Meta: LayoutMeta = {
  id: 'theme11_pricing_v1',
  theme: 'theme11',
  role: 'pricing',
  displayName: 'Theme 11 价格方案页',
  description: '顶部标题 + 3 列价格卡片',
  needsMedia: false,
  tags: ['pricing', 'column-3', 'light-stream'],
  contentShape: 'pricing',
};

export const theme11PricingV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '定价方案' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '选择适合你的版本' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'PRICING' },
    { key: 'plans', label: '方案', type: 'array', maxItems: 3, defaultValue: [
      { name: '个人版', price: '¥0', period: '/月', features: ['5 个项目', '10 个主题', '基础导出'] },
      { name: '团队版', price: '¥99', period: '/月/人', features: ['无限项目', '全部主题', '实时协作', '品牌规范'], highlighted: true },
      { name: '企业版', price: '定制', period: '', features: ['私有化部署', 'SSO', 'API 接入', '专属支持'] },
    ], itemSchema: [{ key: 'name', label: '名称', type: 'text', inlineEditable: true }, { key: 'price', label: '价格', type: 'text', inlineEditable: true }, { key: 'period', label: '周期', type: 'text', inlineEditable: true }, { key: 'highlighted', label: '高亮', type: 'boolean' }, { key: 'features', label: '权益', type: 'array', maxItems: 5, itemSchema: [{ key: 'item', label: '权益', type: 'text', inlineEditable: true }] }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11PricingV1(props: Theme11PricingV1Props): ReactNode {
  const { title, subtitle, eyebrow, plans = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange'> = ['blue', 'violet', 'orange'];

  return (
    <Sheet mood={mood} frame="column-3" className="lp-theme11-pricing">
      <div className="lp-theme11-pricing-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="violet"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-pricing-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-pricing-grid">
        {plans.slice(0, 3).map((plan, i) => {
          const Wrapper = plan.highlighted ? GradientCard : Card;
          return (
            <Wrapper key={i} tone={tones[i % tones.length]} className={`lp-theme11-pricing-card lp-rise ${plan.highlighted ? 'lp-theme11-pricing-card-highlight' : ''}`} padding="large" style={{ animationDelay: `${i * 80}ms` }}>
              <EditableField prop={`plans.${i}.name`} slideIdx={s} editable={e} as="h3" className="lp-theme11-pricing-name">{plan.name}</EditableField>
              <div className="lp-theme11-pricing-price-row">
                <EditableField prop={`plans.${i}.price`} slideIdx={s} editable={e} as="span" className="lp-theme11-pricing-price">{plan.price}</EditableField>
                {plan.period && <EditableField prop={`plans.${i}.period`} slideIdx={s} editable={e} as="span" className="lp-theme11-pricing-period">{plan.period}</EditableField>}
              </div>
              <ul className="lp-theme11-pricing-features">
                {(plan.features ?? []).slice(0, 5).map((f, j) => (
                  <li key={j}><EditableField prop={`plans.${i}.features.${j}`} slideIdx={s} editable={e} as="span">{f}</EditableField></li>
                ))}
              </ul>
            </Wrapper>
          );
        })}
      </div>
    </Sheet>
  );
}
