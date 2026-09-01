// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 左右分屏封面（cover_split_v1）
 * 情绪：daylight | 骨架：split | 图位：1
 * 左侧标题 + 右侧可编辑图片与特性列表。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, EditorialPhoto, IconChip, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11CoverSplitV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  features?: string[];
  imageUrl?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11CoverSplitV1Meta: LayoutMeta = {
  id: 'theme11_cover_split_v1',
  theme: 'theme11',
  role: 'cover',
  displayName: 'Theme 11 左右分屏封面',
  description: '左侧标题 + 右侧可编辑图片与特性列表',
  needsMedia: true,
  tags: ['cover', 'split', 'light-stream'],
  contentShape: 'cover-split',
};

export const theme11CoverSplitV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'PRODUCT SHOWCASE' },
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '一站式\n智能演示' },
    { key: 'subtitle', label: '副语', type: 'textarea', inlineEditable: true, defaultValue: '输入主题，自动生成结构清晰、视觉统一的演示文稿。' },
    { key: 'features', label: '特性', type: 'array', maxItems: 4, defaultValue: ['AI 自动排版', '多主题切换', '实时协作编辑', '品牌规范导出'], itemSchema: [{ key: 'item', label: '特性', type: 'text', inlineEditable: true }] },
    { key: 'imageUrl', label: '封面图', type: 'image', defaultValue: '' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11CoverSplitV1(props: Theme11CoverSplitV1Props): ReactNode {
  const { kicker, title, subtitle, features = [], imageUrl, mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const chips = ['✓', '◆', '◇', '●'];
  const tones: Array<'blue' | 'violet' | 'orange' | 'green'> = ['blue', 'violet', 'orange', 'green'];

  return (
    <Sheet mood={mood} frame="split" className="lp-theme11-cover-split">
      <div className="lp-theme11-cover-split-left">
        {kicker && <EditableField prop="kicker" slideIdx={s} editable={e} as="div" className="lp-theme11-eyelabel">{kicker}</EditableField>}
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme11-cover-split-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-cover-split-sub">{subtitle}</EditableField>}
        <SignalLine />
      </div>
      <div className="lp-theme11-cover-split-right">
        <EditorialPhoto prop="imageUrl" src={imageUrl} slideIdx={s} editable={e} alt="封面图" className="lp-theme11-cover-split-image" placeholderClassName="lp-theme11-cover-split-image-placeholder" />
        <div className="lp-theme11-cover-split-features">
          {features.slice(0, 4).map((f, i) => (
            <Card key={i} className="lp-theme11-cover-split-feature lp-theme11-tile-strong lp-rise" padding="medium" style={{ animationDelay: `${i * 60}ms` }}>
              <IconChip icon={chips[i % chips.length]} tone={tones[i % tones.length]} />
              <EditableField prop={`features.${i}`} slideIdx={s} editable={e} as="span">{f}</EditableField>
            </Card>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
