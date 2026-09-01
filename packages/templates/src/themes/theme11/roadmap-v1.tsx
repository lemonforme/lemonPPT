// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 路线图页（roadmap_v1）
 * 情绪：daylight | 骨架：grid
 * 顶部标题 + 横向季度路线图卡片。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11RoadmapV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  phases?: { quarter: string; title: string; items: string[] }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11RoadmapV1Meta: LayoutMeta = {
  id: 'theme11_roadmap_v1',
  theme: 'theme11',
  role: 'roadmap',
  displayName: 'Theme 11 路线图页',
  description: '顶部标题 + 横向季度路线图卡片',
  needsMedia: false,
  tags: ['roadmap', 'grid', 'light-stream'],
  contentShape: 'roadmap',
};

export const theme11RoadmapV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '产品路线图' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '未来四个季度的关键规划' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'ROADMAP' },
    { key: 'phases', label: '阶段', type: 'array', maxItems: 4, defaultValue: [
      { quarter: 'Q1', title: '基础能力', items: ['AI 大纲', '10 个主题', 'PPTX 导出'] },
      { quarter: 'Q2', title: '协作升级', items: ['实时编辑', '评论反馈', '版本历史'] },
      { quarter: 'Q3', title: '数据增强', items: ['图表库', '数据连接', '动态更新'] },
      { quarter: 'Q4', title: '企业方案', items: ['SSO', '品牌规范', '私有部署'] },
    ], itemSchema: [{ key: 'quarter', label: '季度', type: 'text', inlineEditable: true }, { key: 'title', label: '标题', type: 'text', inlineEditable: true }, { key: 'items', label: '要点', type: 'array', maxItems: 3, itemSchema: [{ key: 'item', label: '要点', type: 'text', inlineEditable: true }] }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11RoadmapV1(props: Theme11RoadmapV1Props): ReactNode {
  const { title, subtitle, eyebrow, phases = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange' | 'green'> = ['blue', 'violet', 'orange', 'green'];

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-roadmap">
      <div className="lp-theme11-roadmap-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-roadmap-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-roadmap-track">
        {phases.slice(0, 4).map((phase, i) => (
          <div key={i} className="lp-theme11-roadmap-phase lp-rise" style={{ animationDelay: `${i * 80}ms` }}>
            <div className={`lp-theme11-roadmap-badge lp-theme11-roadmap-badge-${tones[i % tones.length]}`}>
              <EditableField prop={`phases.${i}.quarter`} slideIdx={s} editable={e} as="span">{phase.quarter}</EditableField>
            </div>
            <Card className="lp-theme11-roadmap-card" padding="medium">
              <EditableField prop={`phases.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme11-roadmap-card-title">{phase.title}</EditableField>
              <ul className="lp-theme11-roadmap-list">
                {(phase.items ?? []).slice(0, 3).map((item, j) => (
                  <li key={j}><EditableField prop={`phases.${i}.items.${j}`} slideIdx={s} editable={e} as="span">{item}</EditableField></li>
                ))}
              </ul>
            </Card>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
