// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04StatsV1Stat {
  value: string;
  unit?: string;
  label: string;
  badge?: string;
  tone?: 'green' | 'yellow' | 'blue' | 'pink';
}

export interface Theme04StatsV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  stats?: Theme04StatsV1Stat[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04StatsV1Meta: LayoutMeta = {
  id: 'theme04_stats_v1',
  theme: 'theme04',
  role: 'stats',
  displayName: 'Theme 04 三联大数字',
  description: '三列糖果色超大数字指标，适合年度总结关键数据',
  needsMedia: false,
  tags: ['stats', 'number', 'candy'],
  contentShape: 'three-stats',
};

export const theme04StatsV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '资本大年 · BY THE NUMBERS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三组数字，{{读懂这一年}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '' },
    {
      key: 'stats',
      label: '指标项',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { value: '970', unit: '亿', label: '2024 全年 AI 初创吸纳风险投资', badge: '创历史新高', tone: 'green' },
        { value: '97', unit: '笔', label: '单笔 ≥1 亿美元的融资事件', badge: '头部高度集中', tone: 'blue' },
        { value: '≈1/3', unit: '', label: '占全美风险投资总额', badge: '近三分之一', tone: 'yellow' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '说明', type: 'textarea' },
        { key: 'badge', label: '徽章文字', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'green', label: '绿' }, { value: 'yellow', label: '黄' }, { value: 'blue', label: '蓝' }, { value: 'pink', label: '粉' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'textarea', inlineEditable: true, defaultValue: '数据口径：2024 全年公开披露的 ≥1 亿美元 AI 融资事件。' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-stats-title lp-rise">
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

export function Theme04StatsV1(props: Theme04StatsV1Props): ReactNode {
  const { kicker, title, subtitle, stats, footnote, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-stats">
      <div className="lp-theme04-stats-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-stats-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-stats-grid lp-rise">
        {(stats ?? []).slice(0, 3).map((stat, idx) => (
          <div key={idx} className={`lp-theme04-stat-card lp-theme04-card lp-theme04-card--${stat.tone ?? 'green'}`}>
            <div className="lp-theme04-stat-header">
              <span className="lp-theme04-stat-number">{String(idx + 1).padStart(2, '0')}</span>
              <span className="lp-theme04-stat-label-small">{stat.label.split('·')[0]?.trim()}</span>
            </div>
            <div className="lp-theme04-stat-value-wrap">
              <EditableField prop={`stats.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-stat-value">{stat.value}</EditableField>
              {stat.unit && <span className="lp-theme04-stat-unit">{stat.unit}</span>}
            </div>
            <EditableField prop={`stats.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-stat-label">{stat.label}</EditableField>
            {stat.badge && <span className="lp-theme04-stat-badge">{stat.badge}</span>}
          </div>
        ))}
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-stats-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
