// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 指标长条页（stat_strip_v1）
 * 情绪：daylight | 骨架：column-3
 * 顶部标题 + 3 列横向指标长条。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, GradientCard, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11StatStripV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: { value: string; label: string; tone?: 'blue' | 'violet' | 'orange' | 'green' }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11StatStripV1Meta: LayoutMeta = {
  id: 'theme11_stat_strip_v1',
  theme: 'theme11',
  role: 'stats',
  displayName: 'Theme 11 指标长条页',
  description: '顶部标题 + 3 列横向渐变指标长条',
  needsMedia: false,
  tags: ['stats', 'strip', 'column-3', 'light-stream'],
  contentShape: 'stat-strip',
};

export const theme11StatStripV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '增长数据' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '过去一年的关键里程碑' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'GROWTH' },
    { key: 'items', label: '指标', type: 'array', maxItems: 3, defaultValue: [
      { value: '+128%', label: 'ARR 增长', tone: 'blue' },
      { value: '4.2k', label: '新增用户', tone: 'violet' },
      { value: '98%', label: '留存率', tone: 'green' },
    ], itemSchema: [{ key: 'value', label: '值', type: 'text', inlineEditable: true }, { key: 'label', label: '标签', type: 'text', inlineEditable: true }, { key: 'tone', label: '色调', type: 'select', options: [{ value: 'blue', label: 'blue' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }] }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11StatStripV1(props: Theme11StatStripV1Props): ReactNode {
  const { title, subtitle, eyebrow, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="column-3" className="lp-theme11-stat-strip">
      <div className="lp-theme11-stat-strip-left">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-stat-strip-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-stat-strip-right">
        {items.slice(0, 3).map((item, i) => (
          <GradientCard key={i} tone={item.tone ?? 'blue'} className="lp-theme11-stat-strip-card lp-rise" style={{ animationDelay: `${i * 80}ms` }}>
            <EditableField prop={`items.${i}.value`} slideIdx={s} editable={e} as="span" className="lp-theme11-stat-strip-value">{item.value}</EditableField>
            <EditableField prop={`items.${i}.label`} slideIdx={s} editable={e} as="span" className="lp-theme11-stat-strip-label">{item.label}</EditableField>
          </GradientCard>
        ))}
      </div>
    </Sheet>
  );
}
