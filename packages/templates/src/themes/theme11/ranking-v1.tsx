// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 排行榜（ranking_v1）
 * 情绪：sunset | 骨架：sidebar
 * 左侧标题 + 右侧带横向条的排名卡片。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11RankingV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: { rank?: number; name: string; value: string; change?: string; tone?: 'accent' | 'violet' | 'orange' | 'green' }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11RankingV1Meta: LayoutMeta = {
  id: 'theme11_ranking_v1',
  theme: 'theme11',
  role: 'stats',
  displayName: 'Theme 11 排行榜',
  description: '带横向条的排名卡片',
  needsMedia: false,
  tags: ['stats', 'ranking', 'sidebar', 'light-stream'],
  contentShape: 'ranking',
};

const TONE_VARS: Record<string, string> = {
  accent: 'var(--lp-accent)',
  violet: 'var(--lp-violet)',
  orange: 'var(--lp-orange)',
  green: 'var(--lp-green)',
};

export const theme11RankingV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'RANKING' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '热门功能排行' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '按过去 30 天使用频次排序' },
    {
      key: 'items',
      label: '排名项',
      type: 'array',
      maxItems: 6,
      defaultValue: [
        { rank: 1, name: '智能排版', value: '12.5k', change: '+8%', tone: 'accent' },
        { rank: 2, name: '一键配色', value: '9.8k', change: '+12%', tone: 'violet' },
        { rank: 3, name: '图表推荐', value: '8.2k', change: '+5%', tone: 'orange' },
        { rank: 4, name: '数据导入', value: '6.4k', change: '-2%', tone: 'green' },
        { rank: 5, name: '协作批注', value: '4.1k', change: '+15%', tone: 'accent' },
      ],
      itemSchema: [
        { key: 'rank', label: '排名', type: 'number' },
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'change', label: '变化', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'accent', label: 'accent' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }] },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'sunset' },
  ],
};

export function Theme11RankingV1(props: Theme11RankingV1Props): ReactNode {
  const { title, subtitle, eyebrow, items = [], mood = 'sunset', _slideIdx: s, _editable: e } = props;
  const maxVal = Math.max(...items.map((it) => Number(String(it.value).replace(/[^0-9.]/g, '')) || 1));

  return (
    <Sheet mood={mood} frame="sidebar" className="lp-theme11-ranking">
      <div className="lp-theme11-ranking-left lp-rise">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-ranking-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-ranking-list">
        {items.slice(0, 6).map((item, i) => {
          const numeric = Number(String(item.value).replace(/[^0-9.]/g, '')) || 0;
          const width = `${(numeric / maxVal) * 100}%`;
          return (
            <Card key={i} className="lp-theme11-ranking-card lp-rise" padding="medium" style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}>
              <div className="lp-theme11-ranking-card-head">
                <span className="lp-theme11-ranking-rank">{item.rank ?? i + 1}</span>
                <EditableField prop={`items.${i}.name`} slideIdx={s} editable={e} as="span" className="lp-theme11-ranking-name">{item.name}</EditableField>
                <EditableField prop={`items.${i}.value`} slideIdx={s} editable={e} as="span" className="lp-theme11-ranking-value">{item.value}</EditableField>
                {item.change && <EditableField prop={`items.${i}.change`} slideIdx={s} editable={e} as="span" className="lp-theme11-ranking-change">{item.change}</EditableField>}
              </div>
              <div className="lp-theme11-ranking-bar-bg">
                <div className="lp-theme11-ranking-bar-fill" style={{ width, background: TONE_VARS[item.tone ?? 'accent'] } as React.CSSProperties} />
              </div>
            </Card>
          );
        })}
      </div>
    </Sheet>
  );
}
