// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05ScorecardsV1Card {
  label: string;
  value: string;
  unit?: string;
  change?: string;
  positive?: boolean;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05ScorecardsV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  cards?: Theme05ScorecardsV1Card[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ScorecardsV1Meta: LayoutMeta = {
  id: 'theme05_scorecards_v1',
  theme: 'theme05',
  role: 'metric',
  displayName: 'Theme 05 资本计分卡',
  description: '顶部标题 + 下方 3-4 个横向计分卡，左侧色条、中间标签、右侧数值与变化',
  needsMedia: false,
  tags: ['metric', 'scorecards', 'kpi', 'spectrum'],
  contentShape: 'title-metric',
};

export const theme05ScorecardsV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SCORECARDS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资本风向标' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '四维度追踪市场核心指标' },
    {
      key: 'cards',
      label: '计分卡',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { label: '全年融资总额', value: '970', unit: '亿美元', change: '+23%', positive: true, scheme: 'coral' },
        { label: '大额事件数量', value: '97', unit: '笔', change: '+12%', positive: true, scheme: 'amber' },
        { label: '平均单笔规模', value: '≈10', unit: '亿', change: '-5%', positive: false, scheme: 'teal' },
        { label: '头部赛道集中度', value: '68', unit: '%', change: '+8%', positive: true, scheme: 'indigo' },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'change', label: '变化', type: 'text' },
        { key: 'positive', label: '正向', type: 'boolean' },
        {
          key: 'scheme',
          label: '强调色',
          type: 'select',
          defaultValue: 'coral',
          options: [
            { value: 'coral', label: '珊瑚红' },
            { value: 'amber', label: '琥珀黄' },
            { value: 'teal', label: '青绿' },
            { value: 'indigo', label: '靛蓝' },
            { value: 'violet', label: '紫罗兰' },
          ],
        },
      ],
    },
  ],
};

function schemeBarClass(scheme?: string): string {
  return `lp-theme05-scorecards-bar--${scheme || 'coral'}`;
}

export function Theme05ScorecardsV1(props: Theme05ScorecardsV1Props): ReactNode {
  const { kicker, title, subtitle, cards = [], _slideIdx, _editable } = props;
  const validCards = (cards || []).slice(0, 4);

  return (
    <div className="lp-slide lp-theme05-scorecards">
      <div className="lp-theme05-scorecards-head lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validCards.length > 0 && (
        <div className="lp-theme05-scorecards-list lp-rise">
          {validCards.map((card, idx) => (
            <div key={idx} className="lp-theme05-scorecards-card lp-theme05-card" style={{ animationDelay: `${idx * 70}ms` }}>
              <div className={`lp-theme05-scorecards-bar ${schemeBarClass(card.scheme)}`} />
              <div className="lp-theme05-scorecards-label">
                <EditableField prop={`cards.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{card.label}</EditableField>
              </div>
              <div className="lp-theme05-scorecards-value-group">
                <div className="lp-theme05-scorecards-value-row">
                  <EditableField prop={`cards.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme05-scorecards-value">{card.value}</EditableField>
                  {card.unit && (
                    <EditableField prop={`cards.${idx}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme05-scorecards-unit">{card.unit}</EditableField>
                  )}
                </div>
                {card.change && (
                  <div className={`lp-theme05-scorecards-change ${card.positive ? 'positive' : 'negative'}`}>
                    <EditableField prop={`cards.${idx}.change`} slideIdx={_slideIdx} editable={_editable} as="span">{card.change}</EditableField>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
