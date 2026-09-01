// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 小多图（small_multiples_v1）
 * 情绪：daylight | 骨架：grid
 * 2×2 迷你面积图卡片，错落悬浮。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, Sheet, Tagline, type Theme11Mood } from './shared.js';
import { T11EChart, t11MiniAreaOption, t11ParseVals } from './t11echart.js';

export interface Theme11SmallMultiplesV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  categories?: (string | { text?: string })[];
  items?: { name: string; values: string; tone?: 'accent' | 'violet' | 'orange' | 'green' }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11SmallMultiplesV1Meta: LayoutMeta = {
  id: 'theme11_small_multiples_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 小多图',
  description: '2×2 迷你趋势卡片',
  needsMedia: false,
  tags: ['chart', 'multiples', 'grid', 'light-stream'],
  contentShape: 'small-multiples',
};

const TONE_COLORS: Record<string, string> = {
  accent: 'var(--lp-accent)',
  violet: 'var(--lp-violet)',
  orange: 'var(--lp-orange)',
  green: 'var(--lp-green)',
};

export const theme11SmallMultiplesV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'TRENDS' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '多维度趋势对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '四个核心指标在 6 个月内的变化轨迹' },
    { key: 'categories', label: '类目', type: 'array', maxItems: 8, defaultValue: ['1月', '2月', '3月', '4月', '5月', '6月'], itemSchema: [{ key: 'item', label: '类目名', type: 'text' }] },
    {
      key: 'items',
      label: '序列',
      type: 'array',
      maxItems: 4,
      defaultValue: [
        { name: '活跃用户', values: '120,135,158,172,195,220', tone: 'accent' },
        { name: '付费转化', values: '12,14,18,21,25,29', tone: 'violet' },
        { name: '内容产出', values: '45,52,48,67,74,82', tone: 'orange' },
        { name: '客户满意度', values: '82,84,83,87,89,92', tone: 'green' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'values', label: '数值(逗号分隔)', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'accent', label: 'accent' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }] },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11SmallMultiplesV1(props: Theme11SmallMultiplesV1Props): ReactNode {
  const { title, subtitle, eyebrow, categories = [], items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const cats = categories.map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? ''))).filter(Boolean);
  const offsets = ['translateY(0)', 'translateY(10px)', 'translateY(-8px)', 'translateY(6px)'];

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-small-multiples">
      <div className="lp-theme11-small-multiples-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-small-multiples-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-small-multiples-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-small-multiples-grid">
        {items.slice(0, 4).map((item, i) => {
          const vals = t11ParseVals(item.values);
          const option = t11MiniAreaOption({ labels: cats.slice(0, vals.length), values: vals, color: TONE_COLORS[item.tone ?? 'accent'] });
          const last = vals[vals.length - 1] ?? 0;
          return (
            <Card key={i} className="lp-theme11-small-multiples-card lp-rise" padding="medium" style={{ transform: offsets[i % offsets.length], animationDelay: `${i * 80}ms` } as React.CSSProperties}>
              <div className="lp-theme11-small-multiples-top">
                <EditableField prop={`items.${i}.name`} slideIdx={s} editable={e} as="h3" className="lp-theme11-small-multiples-name">{item.name}</EditableField>
                <span className="lp-theme11-small-multiples-last" style={{ color: TONE_COLORS[item.tone ?? 'accent'] }}>{last}</span>
              </div>
              <div className="lp-theme11-small-multiples-chart">
                <T11EChart option={option} type="line" />
              </div>
            </Card>
          );
        })}
      </div>
    </Sheet>
  );
}
