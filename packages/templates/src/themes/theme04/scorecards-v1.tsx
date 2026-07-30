// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04ScorecardsV1Card {
  title: string;
  value: string;
  unit?: string;
  subtitle?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04ScorecardsV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  cards?: Theme04ScorecardsV1Card[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ScorecardsV1Meta: LayoutMeta = {
  id: 'theme04_scorecards_v1',
  theme: 'theme04',
  role: 'metric',
  displayName: 'Theme 04 资本计分卡',
  description: '多卡计分板，展示核心资本的多个维度',
  needsMedia: false,
  tags: ['metric', 'scorecards', 'kpi', 'candy'],
  contentShape: 'title-metric',
};

export const theme04ScorecardsV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '资本计分卡' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{四维度}}看清资本风向' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '规模、增速、集中度与轮次结构' },
    {
      key: 'cards',
      label: '计分卡',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { title: '全年总额', value: '970', unit: '亿美元', subtitle: '同比 +23%', tone: 'green' },
        { title: '平均单笔', value: '≈10', unit: '亿', subtitle: '大额交易均值', tone: 'blue' },
        { title: '头部集中度', value: '68', unit: '%', subtitle: 'TOP3 赛道占比', tone: 'pink' },
        { title: '晚期轮次', value: '74', unit: '%', subtitle: 'C 轮及以后占比', tone: 'yellow' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'subtitle', label: '副标题', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-scorecards-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme04ScorecardsV1(props: Theme04ScorecardsV1Props): ReactNode {
  const { kicker, title, subtitle, cards, footnote, _slideIdx, _editable } = props;
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };
  const validCards = (cards || []).slice(0, 6);

  return (
    <div className="lp-slide lp-theme04-scorecards">
      <div className="lp-theme04-scorecards-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-scorecards-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validCards.length > 0 && (
        <div className={`lp-theme04-scorecards-grid lp-theme04-scorecards-grid--${validCards.length} lp-rise`}>
          {validCards.map((card, idx) => (
            <div key={idx} className={`lp-theme04-scorecards-card lp-theme04-card ${toneClass[card.tone || 'green'] || ''}`} style={{ animationDelay: `${idx * 80}ms` }}>
              <EditableField prop={`cards.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-scorecards-card-title">{card.title}</EditableField>
              <div className="lp-theme04-scorecards-card-value-row">
                <EditableField prop={`cards.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-scorecards-card-value">{card.value}</EditableField>
                {card.unit && <EditableField prop={`cards.${idx}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-scorecards-card-unit">{card.unit}</EditableField>}
              </div>
              {card.subtitle && (
                <EditableField prop={`cards.${idx}.subtitle`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-scorecards-card-subtitle">{card.subtitle}</EditableField>
              )}
            </div>
          ))}
        </div>
      )}

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-scorecards-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
