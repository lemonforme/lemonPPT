// lemonPPT - theme07 活跃资本页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07ActiveCapitalV1Round {
  date?: string;
  round?: string;
  amount?: string;
  investor?: string;
}

export interface Theme07ActiveCapitalV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  company?: string;
  tagline?: string;
  rounds?: Theme07ActiveCapitalV1Round[];
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07ActiveCapitalV1Meta: LayoutMeta = {
  id: 'theme07_active_capital_v1',
  theme: 'theme07',
  role: 'timeline',
  displayName: 'Theme 07 活跃资本轮次',
  description: '展示典型公司或赛道的融资轮次时间轴',
  needsMedia: true,
  tags: ['capital', 'timeline', 'rounds'],
  contentShape: 'timeline',
};

export const theme07ActiveCapitalV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'ACTIVE CAPITAL' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资本追逐路径' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '典型高成长公司的融资节奏' },
    { key: 'company', label: '公司名称', type: 'text', inlineEditable: true, defaultValue: 'OpenAI' },
    { key: 'tagline', label: '公司定位', type: 'text', inlineEditable: true, defaultValue: '通用大模型与 AI 平台' },
    {
      key: 'rounds',
      label: '融资轮次',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { date: '2019', round: '种子后', amount: '$1B', investor: 'Microsoft' },
        { date: '2021', round: 'B 轮', amount: '$2B', investor: 'a16z' },
        { date: '2023', round: 'C 轮', amount: '$10B', investor: 'Microsoft' },
        { date: '2024', round: 'Thrive 领投', amount: '$6.6B', investor: 'Thrive / NVIDIA' },
      ],
      itemSchema: [
        { key: 'date', label: '时间', type: 'text', inlineEditable: true },
        { key: 'round', label: '轮次', type: 'text', inlineEditable: true },
        { key: 'amount', label: '金额', type: 'text', inlineEditable: true },
        { key: 'investor', label: '投资方', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'focusIndex', label: '高亮轮次', type: 'slider', min: 0, max: 5, defaultValue: 3 },
  ],
};

export function Theme07ActiveCapitalV1(props: Theme07ActiveCapitalV1Props): ReactNode {
  const { imageUrl, kicker, title, subtitle, company, tagline, rounds = [], focusIndex = 3, _slideIdx, _editable } = props;
  const validRounds = (rounds || []).filter((r): r is Theme07ActiveCapitalV1Round => r != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-active-capital">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-active-capital-header lp-rise">
        <Theme07IconChip name="network" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
        {company && (
          <div className="lp-theme07-active-capital-company">
            <EditableField prop="company" slideIdx={_slideIdx} editable={_editable} as="span">{company}</EditableField>
            {tagline && <span className="lp-theme07-active-capital-tagline"><EditableField prop="tagline" slideIdx={_slideIdx} editable={_editable} as="span">{tagline}</EditableField></span>}
          </div>
        )}
      </div>
      {validRounds.length > 0 && (
        <div className="lp-theme07-active-capital-track lp-rise">
          {validRounds.map((round, index) => (
            <div key={index} className={`lp-theme07-card lp-theme07-active-capital-item ${index === focusIndex ? 'lp-focus' : ''}`}>
              {index === focusIndex && <span className="lp-focus-lens" aria-hidden="true" />}
              <div className="lp-theme07-active-capital-dot" />
              {round.date && <div className="lp-theme07-active-capital-date">{round.date}</div>}
              {round.round && <div className="lp-theme07-active-capital-round"><EditableField prop={`rounds.${index}.round`} slideIdx={_slideIdx} editable={_editable} as="span">{round.round}</EditableField></div>}
              {round.amount && <div className="lp-theme07-active-capital-amount">{round.amount}</div>}
              {round.investor && <div className="lp-theme07-active-capital-investor"><EditableField prop={`rounds.${index}.investor`} slideIdx={_slideIdx} editable={_editable} as="span">{round.investor}</EditableField></div>}
            </div>
          ))}
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
