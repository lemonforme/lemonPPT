// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 原则卡片页（principles_v1）
 * 情绪：daylight | 骨架：grid
 * 顶部标题 + 3 列轻量卡片 + 彩色左侧边条。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, Caption, EditableField, IconChip, SectionTitle, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11PrinciplesV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: { title: string; desc: string; icon: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11PrinciplesV1Meta: LayoutMeta = {
  id: 'theme11_principles_v1',
  theme: 'theme11',
  role: 'feature',
  displayName: 'Theme 11 原则卡片页',
  description: '顶部标题 + 3 列图标卡片 + 彩色左侧边条',
  needsMedia: false,
  tags: ['principles', 'grid', 'light-stream'],
  contentShape: 'principles',
};

export const theme11PrinciplesV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '设计原则' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '让每一页都轻盈、清晰、可行动' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'PRINCIPLES' },
    { key: 'items', label: '原则项', type: 'array', maxItems: 3, defaultValue: [{ title: '轻量卡片', desc: '用圆角白卡替代厚重面板，降低视觉噪音。', icon: '◆' }, { title: '多彩信号', desc: '以青、紫、橙、绿区分状态与层级。', icon: '●' }, { title: '数据优先', desc: '图表与数字占据视觉中心，文字为辅助。', icon: '▲' }], itemSchema: [{ key: 'title', label: '标题', type: 'text', inlineEditable: true }, { key: 'desc', label: '描述', type: 'textarea', inlineEditable: true }, { key: 'icon', label: '图标', type: 'text', inlineEditable: true, defaultValue: '◆' }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11PrinciplesV1(props: Theme11PrinciplesV1Props): ReactNode {
  const { title, subtitle, eyebrow, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange' | 'green'> = ['blue', 'violet', 'orange'];

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-principles">
      <div className="lp-theme11-principles-header">
        {eyebrow && <EditableField prop="eyebrow" slideIdx={s} editable={e} as="span" className="lp-theme11-eyelabel">{eyebrow}</EditableField>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-principles-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-principles-grid">
        {items.slice(0, 3).map((item, i) => (
          <Card key={i} className="lp-theme11-principles-card lp-theme11-tile-strong" padding="large">
            <div className="lp-theme11-principles-card-head lp-rise" style={{ animationDelay: `${i * 80}ms` }}>
              <IconChip icon={item.icon} tone={tones[i % tones.length]} />
            </div>
            <EditableField prop={`items.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme11-principles-card-title">{item.title}</EditableField>
            <Caption><EditableField prop={`items.${i}.desc`} slideIdx={s} editable={e} as="span">{item.desc}</EditableField></Caption>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
