// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04RankingV1Item {
  rank?: number;
  name: string;
  category?: string;
  value: string;
  score: number;
  tone?: 'green' | 'yellow' | 'blue' | 'pink';
}

export interface Theme04RankingV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  items?: Theme04RankingV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04RankingV1Meta: LayoutMeta = {
  id: 'theme04_ranking_v1',
  theme: 'theme04',
  role: 'metric',
  displayName: 'Theme 04 头部玩家排名',
  description: '横向条形图排名，前 N 名带糖果色编号徽章',
  needsMedia: false,
  tags: ['ranking', 'bar-chart', 'candy'],
  contentShape: 'horizontal-ranking',
};

export const theme04RankingV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '头部玩家 · TOP 10 单笔融资排名' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三大模型公司{{霸榜前三}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '单位：亿美元 · 仅取各公司 2024 年最大单笔融资' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'items',
      label: '排名项',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { rank: 1, name: 'OpenAI', category: '通用大模型', value: '66', score: 100, tone: 'green' },
        { rank: 2, name: 'Anthropic', category: '通用大模型', value: '65', score: 98, tone: 'green' },
        { rank: 3, name: 'xAI', category: '通用大模型', value: '50', score: 76, tone: 'green' },
        { rank: 4, name: 'CoreWeave', category: 'AI 基础设施', value: '11', score: 17, tone: 'blue' },
        { rank: 5, name: 'Safe Superintelligence', category: '通用大模型', value: '10', score: 15, tone: 'green' },
        { rank: 6, name: 'Scale AI', category: 'AI 基础设施', value: '10', score: 15, tone: 'blue' },
      ],
      itemSchema: [
        { key: 'rank', label: '排名', type: 'number' },
        { key: 'name', label: '名称', type: 'text' },
        { key: 'category', label: '类别', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'score', label: '进度条分数(0-100)', type: 'number', min: 0, max: 100 },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'green', label: '绿' }, { value: 'yellow', label: '黄' }, { value: 'blue', label: '蓝' }, { value: 'pink', label: '粉' }] },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-ranking-title lp-rise">
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

export function Theme04RankingV1(props: Theme04RankingV1Props): ReactNode {
  const { kicker, title, subtitle, unit, items, _slideIdx, _editable } = props;
  const safeItems = (items ?? []).slice(0, 8);
  const maxScore = Math.max(1, ...safeItems.map((i) => Number(i.score) || 0));

  return (
    <div className="lp-slide lp-theme04-ranking">
      <div className="lp-theme04-ranking-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-ranking-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-ranking-list lp-rise">
        {safeItems.map((item, idx) => (
          <div key={idx} className="lp-theme04-ranking-row">
            <div className={`lp-theme04-ranking-rank lp-theme04-ranking-rank--${item.tone ?? 'green'}`}>
              {item.rank ?? idx + 1}
            </div>
            <div className="lp-theme04-ranking-info">
              <EditableField prop={`items.${idx}.name`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-ranking-name">{item.name}</EditableField>
              {item.category && <span className="lp-theme04-ranking-category">{item.category}</span>}
            </div>
            <div className="lp-theme04-ranking-bar-wrap">
              <div className="lp-theme04-ranking-bar-bg">
                <div className={`lp-theme04-ranking-bar-fill lp-theme04-ranking-bar-fill--${item.tone ?? 'green'}`} style={{ width: `${((Number(item.score) || 0) / maxScore) * 100}%` }} />
              </div>
            </div>
            <div className="lp-theme04-ranking-value">
              <EditableField prop={`items.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{item.value}</EditableField>
              {unit && <span className="lp-theme04-ranking-unit">{unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
