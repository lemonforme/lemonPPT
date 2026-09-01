// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 进度面板（progress_v1）
 * 情绪：daylight | 骨架：grid
 * 2×2 环形进度卡片。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11ProgressV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: { label: string; value: number; max?: number; tone?: 'accent' | 'violet' | 'orange' | 'green' }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ProgressV1Meta: LayoutMeta = {
  id: 'theme11_progress_v1',
  theme: 'theme11',
  role: 'stats',
  displayName: 'Theme 11 进度面板',
  description: '2×2 环形进度卡片',
  needsMedia: false,
  tags: ['stats', 'progress', 'grid', 'light-stream'],
  contentShape: 'progress',
};

const TONE_VARS: Record<string, string> = {
  accent: 'var(--lp-accent)',
  violet: 'var(--lp-violet)',
  orange: 'var(--lp-orange)',
  green: 'var(--lp-green)',
};

export const theme11ProgressV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'PROGRESS' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '项目里程碑' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '关键交付物完成度追踪' },
    {
      key: 'items',
      label: '进度项',
      type: 'array',
      maxItems: 4,
      defaultValue: [
        { label: '产品设计', value: 92, max: 100, tone: 'accent' },
        { label: '前端开发', value: 76, max: 100, tone: 'violet' },
        { label: '后端联调', value: 64, max: 100, tone: 'orange' },
        { label: '测试验收', value: 45, max: 100, tone: 'green' },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '当前值', type: 'number' },
        { key: 'max', label: '最大值', type: 'number' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'accent', label: 'accent' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }] },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ProgressV1(props: Theme11ProgressV1Props): ReactNode {
  const { title, subtitle, eyebrow, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const r = 52;
  const c = 2 * Math.PI * r;

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-progress">
      <div className="lp-theme11-progress-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-progress-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-progress-grid">
        {items.slice(0, 4).map((item, i) => {
          const max = Math.max(1, Number(item.max ?? 100));
          const val = Math.min(max, Math.max(0, Number(item.value ?? 0)));
          const pct = Math.round((val / max) * 100);
          const dash = (pct / 100) * c;
          const color = TONE_VARS[item.tone ?? 'accent'];
          return (
            <Card key={i} className="lp-theme11-progress-card lp-rise" padding="medium" style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}>
              <div className="lp-theme11-progress-ring-wrap">
                <svg viewBox="0 0 120 120" className="lp-theme11-progress-ring">
                  <circle cx="60" cy="60" r={r} className="lp-theme11-progress-ring-bg" />
                  <circle cx="60" cy="60" r={r} className="lp-theme11-progress-ring-progress" strokeDasharray={`${dash} ${c}`} style={{ stroke: color } as React.CSSProperties} />
                </svg>
                <span className="lp-theme11-progress-pct">{pct}%</span>
              </div>
              <EditableField prop={`items.${i}.label`} slideIdx={s} editable={e} as="div" className="lp-theme11-progress-label">{item.label}</EditableField>
            </Card>
          );
        })}
      </div>
    </Sheet>
  );
}
