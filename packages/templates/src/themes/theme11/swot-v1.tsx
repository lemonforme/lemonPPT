// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · SWOT 分析页（swot_v1）
 * 情绪：daylight | 骨架：grid
 * 2×2 渐变卡片，错落排布，强化视觉节奏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, GradientCard, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11SwotV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11SwotV1Meta: LayoutMeta = {
  id: 'theme11_swot_v1',
  theme: 'theme11',
  role: 'swot',
  displayName: 'Theme 11 SWOT 分析页',
  description: '2×2 渐变卡片错落排布',
  needsMedia: false,
  tags: ['swot', 'analysis', 'grid', 'light-stream'],
  contentShape: '2x2-grid',
};

export const theme11SwotV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: 'SWOT 分析' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '看清优势、劣势、机会与威胁' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'SWOT' },
    {
      key: 'strengths',
      label: '优势',
      type: 'array',
      maxItems: 4,
      defaultValue: ['自研 AI 模型', '数据资产丰富', '客户续约率高', '产研响应快'],
      itemSchema: [{ key: 'text', label: '条目', type: 'text' }],
    },
    {
      key: 'weaknesses',
      label: '劣势',
      type: 'array',
      maxItems: 4,
      defaultValue: ['品牌知名度有限', '海外市场覆盖少', '大客户案例不足'],
      itemSchema: [{ key: 'text', label: '条目', type: 'text' }],
    },
    {
      key: 'opportunities',
      label: '机会',
      type: 'array',
      maxItems: 4,
      defaultValue: ['企业数字化加速', 'AIGC 应用场景爆发', '垂直行业需求增长'],
      itemSchema: [{ key: 'text', label: '条目', type: 'text' }],
    },
    {
      key: 'threats',
      label: '威胁',
      type: 'array',
      maxItems: 4,
      defaultValue: ['巨头入局', '价格战风险', '数据合规趋严'],
      itemSchema: [{ key: 'text', label: '条目', type: 'text' }],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

const quadrants = [
  { key: 'strengths', label: 'Strengths', tone: 'green', itemsKey: 'strengths' as const },
  { key: 'weaknesses', label: 'Weaknesses', tone: 'orange', itemsKey: 'weaknesses' as const },
  { key: 'opportunities', label: 'Opportunities', tone: 'blue', itemsKey: 'opportunities' as const },
  { key: 'threats', label: 'Threats', tone: 'violet', itemsKey: 'threats' as const },
];

export function Theme11SwotV1(props: Theme11SwotV1Props): ReactNode {
  const { title, subtitle, eyebrow, strengths = [], weaknesses = [], opportunities = [], threats = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const lists = { strengths, weaknesses, opportunities, threats };

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-swot">
      <div className="lp-theme11-swot-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-swot-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-swot-grid">
        {quadrants.map((q, qi) => (
          <GradientCard key={q.key} tone={q.tone as never} className={`lp-theme11-swot-card lp-rise lp-theme11-swot-card-${q.key}`} style={{ animationDelay: `${qi * 80}ms` }}>
            <div className="lp-theme11-swot-card-label">{q.label}</div>
            <ul className="lp-theme11-swot-list">
              {(lists[q.itemsKey] || []).slice(0, 4).map((item, i) => (
                <li key={i}>
                  <EditableField prop={`${q.itemsKey}.${i}`} slideIdx={s} editable={e} as="span">{typeof item === 'string' ? item : (item as any)?.text}</EditableField>
                </li>
              ))}
            </ul>
          </GradientCard>
        ))}
      </div>
    </Sheet>
  );
}
