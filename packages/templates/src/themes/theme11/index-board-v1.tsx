// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 指标看板（index_board_v1）
 * 情绪：aurora | 骨架：grid
 * Bento 式指标网格：一张主卡 + 四张副卡。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, GradientCard, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11IndexBoardV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: { label: string; value: string; change?: string; tone?: 'blue' | 'violet' | 'orange' | 'green' }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11IndexBoardV1Meta: LayoutMeta = {
  id: 'theme11_index_board_v1',
  theme: 'theme11',
  role: 'stats',
  displayName: 'Theme 11 指标看板',
  description: 'Bento 式核心指标网格',
  needsMedia: false,
  tags: ['stats', 'dashboard', 'grid', 'light-stream'],
  contentShape: 'index-board',
};

export const theme11IndexBoardV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'DASHBOARD' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '实时业务看板' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '关键指标一览，快速定位业务健康度' },
    {
      key: 'items',
      label: '指标',
      type: 'array',
      maxItems: 5,
      defaultValue: [
        { label: '总营收', value: '¥2.4M', change: '+18%', tone: 'blue' },
        { label: '活跃用户', value: '42k', change: '+12%', tone: 'violet' },
        { label: '转化率', value: '4.8%', change: '+0.6%', tone: 'green' },
        { label: '客诉率', value: '0.9%', change: '-0.3%', tone: 'orange' },
        { label: 'NPS', value: '72', change: '+5', tone: 'blue' },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'change', label: '变化', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'blue', label: 'blue' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }] },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11IndexBoardV1(props: Theme11IndexBoardV1Props): ReactNode {
  const { title, subtitle, eyebrow, items = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const [hero, ...rest] = items.slice(0, 5);
  const changeColor = (c?: string) => (c?.startsWith('-') ? 'var(--lp-red)' : 'var(--lp-green)');

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-index-board">
      <div className="lp-theme11-index-board-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-index-board-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-index-board-grid">
        {hero && (
          <GradientCard tone={(hero.tone ?? 'blue') as any} className="lp-theme11-index-board-hero lp-rise">
            <EditableField prop="items.0.label" slideIdx={s} editable={e} as="div" className="lp-theme11-index-board-label">{hero.label}</EditableField>
            <EditableField prop="items.0.value" slideIdx={s} editable={e} as="div" className="lp-theme11-index-board-hero-value">{hero.value}</EditableField>
            {hero.change && <EditableField prop="items.0.change" slideIdx={s} editable={e} as="div" className="lp-theme11-index-board-change" style={{ color: changeColor(hero.change) } as React.CSSProperties}>{hero.change}</EditableField>}
          </GradientCard>
        )}
        <div className="lp-theme11-index-board-secondary">
          {rest.map((item, i) => (
            <Card key={i} className={`lp-theme11-index-board-card lp-rise lp-theme11-tile-tone-${item.tone ?? 'blue'}`} padding="medium" style={{ animationDelay: `${(i + 1) * 70}ms` } as React.CSSProperties}>
              <EditableField prop={`items.${i + 1}.label`} slideIdx={s} editable={e} as="div" className="lp-theme11-index-board-card-label">{item.label}</EditableField>
              <EditableField prop={`items.${i + 1}.value`} slideIdx={s} editable={e} as="div" className="lp-theme11-index-board-card-value">{item.value}</EditableField>
              {item.change && <EditableField prop={`items.${i + 1}.change`} slideIdx={s} editable={e} as="div" className="lp-theme11-index-board-card-change" style={{ color: changeColor(item.change) } as React.CSSProperties}>{item.change}</EditableField>}
            </Card>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
