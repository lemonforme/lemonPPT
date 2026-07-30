// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04ScoreboardV1Metric {
  key: string;
  label: string;
}

export interface Theme04ScoreboardV1Row {
  rank?: number;
  name: string;
  values: (string | number)[];
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04ScoreboardV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  metrics?: Theme04ScoreboardV1Metric[];
  rows?: Theme04ScoreboardV1Row[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ScoreboardV1Meta: LayoutMeta = {
  id: 'theme04_scoreboard_v1',
  theme: 'theme04',
  role: 'table',
  displayName: 'Theme 04 头部玩家对照表',
  description: '多维度排名对照表，展示头部玩家关键指标',
  needsMedia: false,
  tags: ['ranking', 'scoreboard', 'table', 'candy'],
  contentShape: 'table',
};

export const theme04ScoreboardV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '头部玩家' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{TOP 5}} 玩家多维对照' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '融资规模、估值与增速的综合排名' },
    {
      key: 'metrics',
      label: '指标列',
      type: 'array',
      minItems: 2,
      maxItems: 5,
      defaultValue: [
        { key: 'funding', label: '融资总额' },
        { key: 'valuation', label: '最新估值' },
        { key: 'growth', label: '增速' },
        { key: 'round', label: '轮次' },
      ],
      itemSchema: [
        { key: 'key', label: '键', type: 'text' },
        { key: 'label', label: '显示名', type: 'text' },
      ],
    },
    {
      key: 'rows',
      label: '玩家行',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { rank: 1, name: 'OpenAI', values: ['970 亿', '1570 亿', '+41%', 'D+'], tone: 'green' },
        { rank: 2, name: 'Anthropic', values: ['77 亿', '184 亿', '+120%', 'D'], tone: 'blue' },
        { rank: 3, name: 'xAI', values: ['60 亿', '240 亿', '+300%', 'B'], tone: 'pink' },
        { rank: 4, name: 'Databricks', values: ['50 亿', '430 亿', '+25%', 'I'], tone: 'yellow' },
        { rank: 5, name: 'Stability AI', values: ['12 亿', '10 亿', '-15%', 'C'], tone: 'green' },
      ],
      itemSchema: [
        { key: 'rank', label: '排名', type: 'number' },
        { key: 'name', label: '名称', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
        {
          key: 'values',
          label: '指标值',
          type: 'array',
          maxItems: 5,
          itemSchema: [{ key: 'item', label: '值', type: 'text' }],
        },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-scoreboard-title lp-rise">
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

export function Theme04ScoreboardV1(props: Theme04ScoreboardV1Props): ReactNode {
  const { kicker, title, subtitle, metrics, rows, footnote, _slideIdx, _editable } = props;
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };
  const validMetrics = (metrics || []).slice(0, 5);
  const validRows = (rows || []).slice(0, 8);

  return (
    <div className="lp-slide lp-theme04-scoreboard">
      <div className="lp-theme04-scoreboard-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-scoreboard-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validRows.length > 0 && validMetrics.length > 0 && (
        <div className="lp-theme04-scoreboard-table-wrap lp-rise">
          <table className="lp-theme04-scoreboard-table">
            <thead>
              <tr>
                <th className="lp-theme04-scoreboard-rank">#</th>
                <th className="lp-theme04-scoreboard-name">玩家</th>
                {validMetrics.map((m, idx) => (
                  <th key={idx} className="lp-theme04-scoreboard-metric">{m.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {validRows.map((row, ridx) => (
                <tr key={ridx} className={`lp-theme04-card ${toneClass[row.tone || 'green'] || ''}`}>
                  <td className="lp-theme04-scoreboard-rank">
                    <span className="lp-theme04-scoreboard-rank-badge">{row.rank ?? ridx + 1}</span>
                  </td>
                  <td className="lp-theme04-scoreboard-name">
                    <EditableField prop={`rows.${ridx}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{row.name}</EditableField>
                  </td>
                  {validMetrics.map((_, cidx) => (
                    <td key={cidx} className="lp-theme04-scoreboard-value">
                      <EditableField prop={`rows.${ridx}.values.${cidx}`} slideIdx={_slideIdx} editable={_editable} as="span">{row.values?.[cidx] ?? ''}</EditableField>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-scoreboard-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
