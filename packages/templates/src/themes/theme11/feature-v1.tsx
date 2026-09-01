// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 特性展示页（feature_v1）
 * 情绪：daylight | 骨架：sidebar
 * 左侧标题 + 右侧大特性卡片（图标 + 描述 + 要点）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Caption, Card, EditableField, IconChip, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11FeatureV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  featureTitle: string;
  featureDesc?: string;
  icon?: string;
  items?: string[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11FeatureV1Meta: LayoutMeta = {
  id: 'theme11_feature_v1',
  theme: 'theme11',
  role: 'feature',
  displayName: 'Theme 11 特性展示页',
  description: '左侧标题 + 右侧大特性卡片 + 图标要点',
  needsMedia: false,
  tags: ['feature', 'sidebar', 'light-stream'],
  contentShape: 'feature-detail',
};

export const theme11FeatureV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '核心能力' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '为现代团队打造的 AI 演示引擎' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'FEATURE' },
    { key: 'featureTitle', label: '特性标题', type: 'text', inlineEditable: true, defaultValue: '智能版式匹配' },
    { key: 'featureDesc', label: '特性描述', type: 'textarea', inlineEditable: true, defaultValue: '基于内容语义自动推荐最佳版式，让每一页都信息层次分明。' },
    { key: 'icon', label: '图标', type: 'text', inlineEditable: true, defaultValue: '✦' },
    { key: 'items', label: '要点', type: 'array', maxItems: 4, defaultValue: ['语义理解', '版式推荐', '自动配色', '一键导出'], itemSchema: [{ key: 'item', label: '要点', type: 'text', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11FeatureV1(props: Theme11FeatureV1Props): ReactNode {
  const { title, subtitle, eyebrow, featureTitle, featureDesc, icon = '✦', items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange' | 'green'> = ['blue', 'violet', 'orange', 'green'];

  return (
    <Sheet mood={mood} frame="sidebar" className="lp-theme11-feature">
      <div className="lp-theme11-feature-left">
        {eyebrow && <Tagline className="lp-theme11-feature-eyebrow">{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-feature-sub">{subtitle}</EditableField>}
      </div>
      <Card className="lp-theme11-feature-card lp-theme11-tile-strong lp-rise" padding="large">
        <div className="lp-theme11-feature-card-head">
          <IconChip icon={icon} tone="blue" />
          <EditableField prop="featureTitle" slideIdx={s} editable={e} as="h3" className="lp-theme11-feature-card-title">{featureTitle}</EditableField>
        </div>
        {featureDesc && <Caption><EditableField prop="featureDesc" slideIdx={s} editable={e} as="span">{featureDesc}</EditableField></Caption>}
        <div className="lp-theme11-feature-items">
          {items.slice(0, 4).map((item, i) => (
            <div key={i} className="lp-theme11-feature-item">
              <IconChip icon={`0${i + 1}`} tone={tones[i % tones.length]} className="lp-theme11-feature-item-chip" />
              <EditableField prop={`items.${i}`} slideIdx={s} editable={e} as="span">{item}</EditableField>
            </div>
          ))}
        </div>
      </Card>
    </Sheet>
  );
}
