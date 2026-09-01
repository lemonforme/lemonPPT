// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · KPI 长条（kpi_strip_v1）
 * 情绪：daylight | 骨架：column-3
 * 顶部标题 + 横向排列的 KPI 渐变卡片。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, GradientCard, IconChip, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11KpiStripV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: { icon: string; label: string; value: string; change?: string; tone?: 'blue' | 'violet' | 'orange' | 'green' }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11KpiStripV1Meta: LayoutMeta = {
  id: 'theme11_kpi_strip_v1',
  theme: 'theme11',
  role: 'stats',
  displayName: 'Theme 11 KPI 长条',
  description: '横向排列的 KPI 渐变卡片',
  needsMedia: false,
  tags: ['stats', 'kpi', 'column-3', 'light-stream'],
  contentShape: 'kpi-strip',
};

export const theme11KpiStripV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'KPI' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '本周关键绩效' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '核心运营指标快速扫描' },
    {
      key: 'items',
      label: 'KPI',
      type: 'array',
      maxItems: 4,
      defaultValue: [
        { icon: '◈', label: '线索量', value: '1,240', change: '+12%', tone: 'blue' },
        { icon: '▸', label: '成交率', value: '18.5%', change: '+2.1%', tone: 'violet' },
        { icon: '◉', label: '回款额', value: '¥860k', change: '+8%', tone: 'green' },
      ],
      itemSchema: [
        { key: 'icon', label: '图标', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'change', label: '变化', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'blue', label: 'blue' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }] },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11KpiStripV1(props: Theme11KpiStripV1Props): ReactNode {
  const { title, subtitle, eyebrow, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="column-3" className="lp-theme11-kpi-strip">
      <div className="lp-theme11-kpi-strip-left">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-kpi-strip-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-kpi-strip-right">
        {items.slice(0, 4).map((item, i) => (
          <GradientCard key={i} tone={item.tone ?? 'blue'} className="lp-theme11-kpi-strip-card lp-rise" style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}>
            <IconChip icon={item.icon} tone={item.tone ?? 'blue'} className="lp-theme11-kpi-strip-icon" />
            <EditableField prop={`items.${i}.label`} slideIdx={s} editable={e} as="div" className="lp-theme11-kpi-strip-label">{item.label}</EditableField>
            <EditableField prop={`items.${i}.value`} slideIdx={s} editable={e} as="div" className="lp-theme11-kpi-strip-value">{item.value}</EditableField>
            {item.change && <EditableField prop={`items.${i}.change`} slideIdx={s} editable={e} as="div" className="lp-theme11-kpi-strip-change">{item.change}</EditableField>}
          </GradientCard>
        ))}
      </div>
    </Sheet>
  );
}
