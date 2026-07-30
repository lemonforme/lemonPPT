// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04CardsV1Card {
  title: string;
  description?: string;
  value?: string;
  unit?: string;
  tag?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04CardsV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  cards?: Theme04CardsV1Card[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04CardsV1Meta: LayoutMeta = {
  id: 'theme04_cards_v1',
  theme: 'theme04',
  role: 'feature',
  displayName: 'Theme 04 行业赛道卡片',
  description: '横向 3-4 列行业赛道卡片，顶部彩色标签与数据指标',
  needsMedia: false,
  tags: ['feature', 'cards', 'tracks', 'candy'],
  contentShape: 'title-grid',
};

export const theme04CardsV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '行业赛道' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{AI 投资}}的热门赛道' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '资本正在向基础设施与应用层集中' },
    {
      key: 'cards',
      label: '赛道卡片',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { title: '基础模型', description: '大模型研发与算力层，单笔融资规模最大。', value: '420', unit: '亿美元', tag: 'TOP1', tone: 'green' },
        { title: 'AI 基础设施', description: '云服务、数据标注、模型部署工具链。', value: '210', unit: '亿美元', tag: 'TOP2', tone: 'blue' },
        { title: '垂直应用', description: '医疗、金融、法律等行业 AI 应用。', value: '180', unit: '亿美元', tag: 'TOP3', tone: 'pink' },
        { title: '具身智能', description: '机器人、自动驾驶、智能硬件等新兴方向。', value: '85', unit: '亿美元', tag: '新兴', tone: 'yellow' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'tag', label: '标签', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-cards-title lp-rise">
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

export function Theme04CardsV1(props: Theme04CardsV1Props): ReactNode {
  const { kicker, title, subtitle, cards, _slideIdx, _editable } = props;
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-cards">
      <div className="lp-theme04-cards-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-cards-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-cards-grid lp-rise">
        {(cards ?? []).slice(0, 4).map((card, idx) => (
          <div key={idx} className={`lp-theme04-cards-card lp-theme04-card ${toneClass[card.tone ?? 'green'] ?? ''}`}>
            <div className="lp-theme04-cards-card-top">
              {card.tag && (
                <EditableField prop={`cards.${idx}.tag`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-cards-card-tag">{card.tag}</EditableField>
              )}
              {(card.value || card.unit) && (
                <div className="lp-theme04-cards-card-metric">
                  {card.value && <EditableField prop={`cards.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-cards-card-value">{card.value}</EditableField>}
                  {card.unit && <EditableField prop={`cards.${idx}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-cards-card-unit">{card.unit}</EditableField>}
                </div>
              )}
            </div>
            <EditableField prop={`cards.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-cards-card-title">{card.title}</EditableField>
            {card.description && (
              <EditableField prop={`cards.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-cards-card-desc">{card.description}</EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
