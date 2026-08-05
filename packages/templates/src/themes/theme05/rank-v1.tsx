// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05RankV1Row {
  rank: number;
  name: string;
  value: string;
  change?: string;
  positive?: boolean;
}

export interface Theme05RankV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  rows?: Theme05RankV1Row[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05RankV1Meta: LayoutMeta = {
  id: 'theme05_rank_v1',
  theme: 'theme05',
  role: 'table',
  displayName: 'Theme 05 排名表',
  description: '色条排名 + 数值 + 变化标签',
  needsMedia: false,
  tags: ['table', 'rank', 'spectrum'],
  contentShape: 'table',
};

export const theme05RankV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'RANKING' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '赛道融资额排名' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按年度融资总额排序' },
    {
      key: 'rows',
      label: '排名行',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      itemSchema: [
        { key: 'rank', label: '排名', type: 'number' },
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'change', label: '变化', type: 'text' },
        { key: 'positive', label: '正向', type: 'boolean' },
      ],
    },
  ],
};

export function Theme05RankV1(props: Theme05RankV1Props): ReactNode {
  const { kicker, title, subtitle, rows = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-rank">
      {kicker && <div className="lp-theme05-kicker lp-rise">{kicker}</div>}
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title lp-rise">{title}</EditableField>
      {subtitle && (
        <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle lp-rise">{subtitle}</EditableField>
      )}
      <div className="lp-theme05-rank-rows lp-rise">
        {rows.map((row, i) => (
          <div key={i} className="lp-theme05-rank-row" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="lp-theme05-rank-rank">
              <EditableField prop={`rows.${i}.rank`} slideIdx={_slideIdx} editable={_editable} as="span">{row.rank}</EditableField>
            </div>
            <div className="lp-theme05-rank-name">
              <EditableField prop={`rows.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{row.name}</EditableField>
            </div>
            <div className="lp-theme05-rank-value">
              <EditableField prop={`rows.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{row.value}</EditableField>
            </div>
            {row.change && (
              <div className={`lp-theme05-rank-change ${row.positive ? 'positive' : 'negative'}`}>
                <EditableField prop={`rows.${i}.change`} slideIdx={_slideIdx} editable={_editable} as="span">{row.change}</EditableField>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
