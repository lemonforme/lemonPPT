// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 晚霞版本封面（cover_sunset_v1）
 * 情绪：sunset | 骨架：full-bleed | 图位：0
 * 版本徽章 + 大标题 + 三列彩色指标卡。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { GradientCard, Caption, EditableField, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11CoverSunsetV1Props {
  badge?: string;
  title: string;
  subtitle?: string;
  metrics?: { label: string; value: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11CoverSunsetV1Meta: LayoutMeta = {
  id: 'theme11_cover_sunset_v1',
  theme: 'theme11',
  role: 'cover',
  displayName: 'Theme 11 晚霞版本封面',
  description: '版本徽章 + 大标题 + 三列彩色指标卡',
  needsMedia: false,
  tags: ['cover', 'sunset', 'light-stream'],
  contentShape: 'cover-sunset',
};

export const theme11CoverSunsetV1Schema: PropsSchema = {
  fields: [
    { key: 'badge', label: '徽章', type: 'text', inlineEditable: true, defaultValue: 'v2.0' },
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '全新升级\n轻盈呈现' },
    { key: 'subtitle', label: '副语', type: 'textarea', inlineEditable: true, defaultValue: '更现代的科技演示语言，从封面开始。' },
    { key: 'metrics', label: '指标卡', type: 'array', maxItems: 3, defaultValue: [{ label: '主题数', value: '11' }, { label: '版式数', value: '60+' }, { label: '导出格式', value: 'PPTX/PDF' }], itemSchema: [{ key: 'label', label: '标签', type: 'text', inlineEditable: true }, { key: 'value', label: '数值', type: 'text', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11CoverSunsetV1(props: Theme11CoverSunsetV1Props): ReactNode {
  const { badge, title, subtitle, metrics = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange' | 'green' | 'cyan'> = ['blue', 'violet', 'orange'];

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme11-cover-sunset">
      <div className="lp-theme11-cover-sunset-inner">
        {badge && (
          <EditableField prop="badge" slideIdx={s} editable={e} as="div" className="lp-theme11-cover-sunset-badge">
            {badge}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme11-cover-sunset-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-cover-sunset-sub">{subtitle}</EditableField>}
        <div className="lp-theme11-cover-sunset-metrics">
          {metrics.slice(0, 3).map((m, i) => (
            <GradientCard key={i} tone={tones[i % tones.length]} className="lp-theme11-cover-sunset-metric lp-rise" style={{ animationDelay: `${i * 80}ms` }}>
              <EditableField prop={`metrics.${i}.value`} slideIdx={s} editable={e} as="div" className="lp-theme11-cover-sunset-value">{m.value}</EditableField>
              <Caption><EditableField prop={`metrics.${i}.label`} slideIdx={s} editable={e} as="span">{m.label}</EditableField></Caption>
            </GradientCard>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
