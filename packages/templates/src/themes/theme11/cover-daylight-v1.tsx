// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 日光分栏封面（cover_daylight_v1）
 * 情绪：daylight | 骨架：split | 图位：0
 * 左侧巨型标题 + 右侧轻量卡片堆叠 + 彩色信号线。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, IconChip, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11CoverDaylightV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  points?: string[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11CoverDaylightV1Meta: LayoutMeta = {
  id: 'theme11_cover_daylight_v1',
  theme: 'theme11',
  role: 'cover',
  displayName: 'Theme 11 日光分栏封面',
  description: '左侧巨型标题 + 右侧轻量卡片堆叠 + 彩色信号线',
  needsMedia: false,
  tags: ['cover', 'daylight', 'light-stream'],
  contentShape: 'cover-daylight',
};

export const theme11CoverDaylightV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'PRODUCT DECK' },
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: 'AI 原生\n协作平台' },
    { key: 'subtitle', label: '副语', type: 'textarea', inlineEditable: true, defaultValue: '从数据整理到演示生成，一站完成。' },
    { key: 'points', label: '右侧要点', type: 'array', maxItems: 4, defaultValue: ['智能版式匹配', '多情绪渐变', '组件级编辑', '一键导出 PPTX'], itemSchema: [{ key: 'item', label: '要点', type: 'text', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11CoverDaylightV1(props: Theme11CoverDaylightV1Props): ReactNode {
  const { kicker, title, subtitle, points = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const chips = ['▣', '◈', '◇', '✦'];
  const tones: Array<'blue' | 'violet' | 'orange' | 'green'> = ['blue', 'violet', 'orange', 'green'];

  return (
    <Sheet mood={mood} frame="split" className="lp-theme11-cover-daylight">
      <div className="lp-theme11-cover-daylight-left">
        {kicker && <EditableField prop="kicker" slideIdx={s} editable={e} as="div" className="lp-theme11-eyelabel">{kicker}</EditableField>}
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme11-cover-daylight-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-cover-daylight-sub">{subtitle}</EditableField>}
        <SignalLine />
      </div>
      <div className="lp-theme11-cover-daylight-right">
        {points.slice(0, 4).map((p, i) => (
          <Card key={i} className="lp-theme11-cover-daylight-card lp-theme11-tile-strong lp-rise" padding="medium" style={{ animationDelay: `${i * 70}ms` }}>
            <IconChip icon={chips[i % chips.length]} tone={tones[i % tones.length]} />
            <EditableField prop={`points.${i}`} slideIdx={s} editable={e} as="span">{p}</EditableField>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
