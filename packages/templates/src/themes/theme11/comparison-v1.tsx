// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 双栏对比页（comparison_v1）
 * 情绪：daylight | 骨架：column-2
 * 左右两栏对比，每栏含标题、描述、要点列表。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, IconChip, SectionTitle, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11ComparisonV1Props {
  title: string;
  subtitle?: string;
  leftTitle: string;
  leftDesc?: string;
  leftItems?: string[];
  rightTitle: string;
  rightDesc?: string;
  rightItems?: string[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ComparisonV1Meta: LayoutMeta = {
  id: 'theme11_comparison_v1',
  theme: 'theme11',
  role: 'comparison',
  displayName: 'Theme 11 双栏对比页',
  description: '左右两栏对比，含标题、描述、要点',
  needsMedia: false,
  tags: ['comparison', 'column-2', 'light-stream'],
  contentShape: 'comparison',
};

export const theme11ComparisonV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '方案对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '传统方式 vs LemonPPT' },
    { key: 'leftTitle', label: '左栏标题', type: 'text', inlineEditable: true, defaultValue: '传统制作' },
    { key: 'leftDesc', label: '左栏描述', type: 'textarea', inlineEditable: true, defaultValue: '从零开始排版，耗时长且风格难统一。' },
    { key: 'leftItems', label: '左栏要点', type: 'array', maxItems: 4, defaultValue: ['排版耗时', '风格难统一', '协作成本高', '版本管理混乱'], itemSchema: [{ key: 'item', label: '要点', type: 'text', inlineEditable: true }] },
    { key: 'rightTitle', label: '右栏标题', type: 'text', inlineEditable: true, defaultValue: 'LemonPPT' },
    { key: 'rightDesc', label: '右栏描述', type: 'textarea', inlineEditable: true, defaultValue: 'AI 驱动，从大纲到成稿一气呵成。' },
    { key: 'rightItems', label: '右栏要点', type: 'array', maxItems: 4, defaultValue: ['30 秒生成初稿', '全局设计系统', '实时协作', '版本自动同步'], itemSchema: [{ key: 'item', label: '要点', type: 'text', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11ComparisonV1(props: Theme11ComparisonV1Props): ReactNode {
  const { title, subtitle, leftTitle, leftDesc, leftItems = [], rightTitle, rightDesc, rightItems = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="column-2" className="lp-theme11-comparison">
      <div className="lp-theme11-comparison-header">
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-comparison-sub">{subtitle}</EditableField>}
      </div>
      <Card className="lp-theme11-comparison-col lp-rise" padding="large">
        <div className="lp-theme11-comparison-col-head">
          <IconChip icon="◆" tone="orange" className="lp-theme11-comparison-col-chip" />
          <EditableField prop="leftTitle" slideIdx={s} editable={e} as="h3" className="lp-theme11-comparison-col-title">{leftTitle}</EditableField>
        </div>
        {leftDesc && <EditableField prop="leftDesc" slideIdx={s} editable={e} as="p" className="lp-theme11-comparison-col-desc">{leftDesc}</EditableField>}
        <ul className="lp-theme11-comparison-list">
          {leftItems.slice(0, 4).map((item, i) => (
            <li key={i}><EditableField prop={`leftItems.${i}`} slideIdx={s} editable={e} as="span">{item}</EditableField></li>
          ))}
        </ul>
      </Card>
      <Card className="lp-theme11-comparison-col lp-rise" padding="large" style={{ animationDelay: '80ms' }}>
        <div className="lp-theme11-comparison-col-head">
          <IconChip icon="✦" tone="blue" className="lp-theme11-comparison-col-chip" />
          <EditableField prop="rightTitle" slideIdx={s} editable={e} as="h3" className="lp-theme11-comparison-col-title">{rightTitle}</EditableField>
        </div>
        {rightDesc && <EditableField prop="rightDesc" slideIdx={s} editable={e} as="p" className="lp-theme11-comparison-col-desc">{rightDesc}</EditableField>}
        <ul className="lp-theme11-comparison-list">
          {rightItems.slice(0, 4).map((item, i) => (
            <li key={i}><EditableField prop={`rightItems.${i}`} slideIdx={s} editable={e} as="span">{item}</EditableField></li>
          ))}
        </ul>
      </Card>
    </Sheet>
  );
}
