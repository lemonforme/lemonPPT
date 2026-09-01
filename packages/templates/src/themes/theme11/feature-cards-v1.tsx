// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 特性卡片页（feature_cards_v1）
 * 情绪：aurora | 骨架：column-3
 * 顶部标题 + 3 列渐变特性卡片。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, GradientCard, IconChip, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11FeatureCardsV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: { title: string; desc: string; icon: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11FeatureCardsV1Meta: LayoutMeta = {
  id: 'theme11_feature_cards_v1',
  theme: 'theme11',
  role: 'feature',
  displayName: 'Theme 11 渐变特性卡片页',
  description: '顶部标题 + 3 列高饱和渐变特性卡片',
  needsMedia: false,
  tags: ['feature', 'column-3', 'light-stream'],
  contentShape: 'feature-cards',
};

export const theme11FeatureCardsV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '为什么选择我们' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '三大核心优势，让演示更高效' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'WHY US' },
    { key: 'items', label: '特性项', type: 'array', maxItems: 3, defaultValue: [
      { title: '极速生成', desc: '输入主题，30 秒获得完整大纲与初稿。', icon: '▸' },
      { title: '视觉统一', desc: '全局设计系统保证每一页风格一致。', icon: '◈' },
      { title: '数据驱动', desc: '内置 40+ 图表，数据可视化零门槛。', icon: '◉' },
    ], itemSchema: [{ key: 'title', label: '标题', type: 'text', inlineEditable: true }, { key: 'desc', label: '描述', type: 'textarea', inlineEditable: true }, { key: 'icon', label: '图标', type: 'text', inlineEditable: true, defaultValue: '◆' }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11FeatureCardsV1(props: Theme11FeatureCardsV1Props): ReactNode {
  const { title, subtitle, eyebrow, items = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange'> = ['blue', 'violet', 'orange'];

  return (
    <Sheet mood={mood} frame="column-3" className="lp-theme11-feature-cards">
      <div className="lp-theme11-feature-cards-left">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="violet"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-feature-cards-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-feature-cards-right">
        {items.slice(0, 3).map((item, i) => (
          <GradientCard key={i} tone={tones[i % tones.length]} className="lp-theme11-feature-cards-card lp-rise" style={{ animationDelay: `${i * 80}ms` }}>
            <IconChip icon={item.icon} tone={tones[i % tones.length]} className="lp-theme11-feature-cards-icon" />
            <EditableField prop={`items.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme11-feature-cards-card-title">{item.title}</EditableField>
            <EditableField prop={`items.${i}.desc`} slideIdx={s} editable={e} as="p" className="lp-theme11-feature-cards-card-desc">{item.desc}</EditableField>
          </GradientCard>
        ))}
      </div>
    </Sheet>
  );
}
