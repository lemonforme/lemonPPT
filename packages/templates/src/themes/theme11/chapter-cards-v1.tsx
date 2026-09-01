// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 卡片导航章节页（chapter_cards_v1）
 * 情绪：daylight | 骨架：grid
 * 顶部标题 + 章节主题卡片矩阵，当前章节高亮。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, GradientCard, IconChip, Sheet, SignalLine, type GradientTone, type Theme11Mood } from './shared.js';

export interface Theme11ChapterCardsV1Card {
  number?: string;
  title: string;
  desc?: string;
  icon?: string;
  tone?: GradientTone;
  active?: boolean;
}

export interface Theme11ChapterCardsV1Props {
  title: string;
  subtitle?: string;
  cards?: Theme11ChapterCardsV1Card[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const defaultCards: Theme11ChapterCardsV1Card[] = [
  { number: '01', title: '市场洞察', desc: '趋势与竞争格局', icon: '📊', tone: 'blue', active: false },
  { number: '02', title: '产品能力', desc: '智能生成与协作', icon: '⚡', tone: 'violet', active: true },
  { number: '03', title: '客户案例', desc: '真实场景验证', icon: '🏆', tone: 'orange', active: false },
  { number: '04', title: '数据决策', desc: '指标到行动', icon: '🎯', tone: 'green', active: false },
];

export const theme11ChapterCardsV1Meta: LayoutMeta = {
  id: 'theme11_chapter_cards_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 卡片导航章节页',
  description: '顶部标题 + 章节主题卡片矩阵，当前章节高亮',
  needsMedia: false,
  tags: ['chapter', 'cards', 'grid', 'light-stream'],
  contentShape: 'chapter-cards',
};

export const theme11ChapterCardsV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '本章导航' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '快速定位当前章节与前后内容' },
    {
      key: 'cards',
      label: '章节卡片',
      type: 'array',
      maxItems: 6,
      defaultValue: defaultCards,
      itemSchema: [
        { key: 'number', label: '编号', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'desc', label: '描述', type: 'text' },
        { key: 'icon', label: '图标', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'blue', label: 'blue' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }, { value: 'cyan', label: 'cyan' }] },
        { key: 'active', label: '当前章节', type: 'boolean' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChapterCardsV1(props: Theme11ChapterCardsV1Props): ReactNode {
  const { title, subtitle, cards = defaultCards, mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-chapter-cards">
      <div className="lp-theme11-chapter-cards-header lp-rise">
        <SignalLine />
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-chapter-cards-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chapter-cards-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-chapter-cards-grid">
        {cards.slice(0, 6).map((c, i) => (
          <Card
            key={i}
            className={`lp-theme11-chapter-cards-item lp-rise ${c.active ? 'lp-theme11-chapter-cards-item-active' : ''}`}
            padding="medium"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="lp-theme11-chapter-cards-top">
              <IconChip icon={c.icon || '•'} tone={c.tone ?? 'blue'} className="lp-theme11-chapter-cards-chip" />
              {c.number && (
                <GradientCard tone={c.tone ?? 'blue'} className="lp-theme11-chapter-cards-number">
                  <EditableField prop={`cards.${i}.number`} slideIdx={s} editable={e} as="span">{c.number}</EditableField>
                </GradientCard>
              )}
            </div>
            <EditableField prop={`cards.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme11-chapter-cards-item-title">{c.title}</EditableField>
            {c.desc && <EditableField prop={`cards.${i}.desc`} slideIdx={s} editable={e} as="p" className="lp-theme11-chapter-cards-desc">{c.desc}</EditableField>}
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
