// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 卡片对比页（comparison_cards_v1）
 * 情绪：sunset | 骨架：column-2
 * 顶部标题 + 两个大渐变卡片对比。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, GradientCard, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11ComparisonCardsV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  leftTitle: string;
  leftItems?: string[];
  rightTitle: string;
  rightItems?: string[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ComparisonCardsV1Meta: LayoutMeta = {
  id: 'theme11_comparison_cards_v1',
  theme: 'theme11',
  role: 'comparison',
  displayName: 'Theme 11 渐变卡片对比页',
  description: '顶部标题 + 两个渐变卡片对比',
  needsMedia: false,
  tags: ['comparison', 'column-2', 'light-stream'],
  contentShape: 'comparison-cards',
};

export const theme11ComparisonCardsV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '两种模式' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '选择更适合你的工作流' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'COMPARE' },
    { key: 'leftTitle', label: '左卡片标题', type: 'text', inlineEditable: true, defaultValue: '手动模式' },
    { key: 'leftItems', label: '左卡片要点', type: 'array', maxItems: 4, defaultValue: ['完全可控', '精细调整', '适合定制', '时间成本高'], itemSchema: [{ key: 'item', label: '要点', type: 'text', inlineEditable: true }] },
    { key: 'rightTitle', label: '右卡片标题', type: 'text', inlineEditable: true, defaultValue: 'AI 模式' },
    { key: 'rightItems', label: '右卡片要点', type: 'array', maxItems: 4, defaultValue: ['30 秒出稿', '智能配图', '自动排版', '一键迭代'], itemSchema: [{ key: 'item', label: '要点', type: 'text', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11ComparisonCardsV1(props: Theme11ComparisonCardsV1Props): ReactNode {
  const { title, subtitle, eyebrow, leftTitle, leftItems = [], rightTitle, rightItems = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="column-2" className="lp-theme11-comparison-cards">
      <div className="lp-theme11-comparison-cards-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="orange"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-comparison-cards-sub">{subtitle}</EditableField>}
      </div>
      <GradientCard tone="violet" className="lp-theme11-comparison-cards-card lp-rise">
        <EditableField prop="leftTitle" slideIdx={s} editable={e} as="h3" className="lp-theme11-comparison-cards-card-title">{leftTitle}</EditableField>
        <ul className="lp-theme11-comparison-cards-list">
          {leftItems.slice(0, 4).map((item, i) => (
            <li key={i}><EditableField prop={`leftItems.${i}`} slideIdx={s} editable={e} as="span">{item}</EditableField></li>
          ))}
        </ul>
      </GradientCard>
      <GradientCard tone="blue" className="lp-theme11-comparison-cards-card lp-rise" style={{ animationDelay: '80ms' }}>
        <EditableField prop="rightTitle" slideIdx={s} editable={e} as="h3" className="lp-theme11-comparison-cards-card-title">{rightTitle}</EditableField>
        <ul className="lp-theme11-comparison-cards-list">
          {rightItems.slice(0, 4).map((item, i) => (
            <li key={i}><EditableField prop={`rightItems.${i}`} slideIdx={s} editable={e} as="span">{item}</EditableField></li>
          ))}
        </ul>
      </GradientCard>
    </Sheet>
  );
}
