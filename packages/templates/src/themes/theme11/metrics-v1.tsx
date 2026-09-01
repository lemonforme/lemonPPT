// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 指标卡页（metrics_v1）
 * 情绪：daylight | 骨架：grid
 * 顶部标题 + 4 列指标卡片（数字 + 标签 + 变化）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11MetricsV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: { value: string; label: string; change?: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11MetricsV1Meta: LayoutMeta = {
  id: 'theme11_metrics_v1',
  theme: 'theme11',
  role: 'stats',
  displayName: 'Theme 11 指标卡页',
  description: '顶部标题 + 4 列指标卡片',
  needsMedia: false,
  tags: ['stats', 'metrics', 'grid', 'light-stream'],
  contentShape: 'metrics',
};

export const theme11MetricsV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '关键指标' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '数据呈现业务增长的真实轨迹' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'METRICS' },
    { key: 'items', label: '指标项', type: 'array', maxItems: 4, defaultValue: [
      { value: '128%', label: '营收增长', change: '+12%' },
      { value: '4.2k', label: '活跃用户', change: '+8%' },
      { value: '98%', label: '客户满意度', change: '+3%' },
      { value: '24h', label: '平均交付', change: '-40%' },
    ], itemSchema: [{ key: 'value', label: '值', type: 'text', inlineEditable: true }, { key: 'label', label: '标签', type: 'text', inlineEditable: true }, { key: 'change', label: '变化', type: 'text', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11MetricsV1(props: Theme11MetricsV1Props): ReactNode {
  const { title, subtitle, eyebrow, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const tones: Array<'accent' | 'violet' | 'orange' | 'green'> = ['accent', 'violet', 'orange', 'green'];

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-metrics">
      <div className="lp-theme11-metrics-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-metrics-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-metrics-grid">
        {items.slice(0, 4).map((item, i) => (
          <Card key={i} className={`lp-theme11-metrics-card lp-theme11-tile-tone-${tones[i % tones.length]} lp-rise`} padding="large" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="lp-theme11-metrics-card-top">
              <EditableField prop={`items.${i}.value`} slideIdx={s} editable={e} as="span" className="lp-theme11-metric-value">{item.value}</EditableField>
              {item.change && <EditableField prop={`items.${i}.change`} slideIdx={s} editable={e} as="span" className="lp-theme11-metrics-change">{item.change}</EditableField>}
            </div>
            <EditableField prop={`items.${i}.label`} slideIdx={s} editable={e} as="span" className="lp-theme11-metric-label">{item.label}</EditableField>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
