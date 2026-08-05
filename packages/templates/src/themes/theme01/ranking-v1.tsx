// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01RankingV1Item {
  label?: string;
  value?: number;
}

export interface Theme01RankingV1Props {
  kicker?: string;
  title?: string;
  items?: Theme01RankingV1Item[];
  unit?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01RankingV1Meta: LayoutMeta = {
  id: 'theme01_ranking_v1',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 排名条形图',
  description: '横向条形排名 + 序号 + 数值',
  needsMedia: false,
};

export const theme01RankingV1Schema: PropsSchema = {
  fields: [
  {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'items',
      label: '排名项',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
    {
          key: 'label',
          label: '名称',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'value',
          label: '数值',
          type: 'number',
          inlineEditable: true
    }
      ]
  },
  {
      key: 'unit',
      label: '单位',
      type: 'text',
      inlineEditable: true
  }
  ]
};


export function Theme01RankingV1(props: Theme01RankingV1Props): ReactNode {
  const { kicker, title, items = [], unit = '', _slideIdx, _editable } = props;
  const indexed = items
  .map((item, originalIndex) => ({ item, originalIndex }))
  .filter(({ item }) => typeof item.value === 'number');
  const sorted = [...indexed]
  .sort((a, b) => (b.item.value ?? 0) - (a.item.value ?? 0))
  .slice(0, 8);
  const maxValue = Math.max(1, ...sorted.map(({ item }) => item.value ?? 0));

  return (
  <div className="lp-slide lp-ranking-v1">
      <div className="lp-ranking-v1-inner">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-ranking-v1-title lp-rise">
          {title}
    </EditableField>
    {sorted.length > 0 && (
          <div className="lp-ranking-v1-list lp-rise">
      {sorted.map(({ item, originalIndex }, rank) => {
              const value = item.value ?? 0;
              const pct = (value / maxValue) * 100;
              return (
        <div key={rank} className="lp-ranking-v1-row">
                  <div className="lp-ranking-v1-rank">{rank + 1}</div>
                  <EditableField
          prop={`items.${originalIndex}.label`}
          slideIdx={_slideIdx}
          editable={_editable}
          as="div"
          className="lp-ranking-v1-label"
                  >
          {item.label || ''}
                  </EditableField>
                  <div className="lp-ranking-v1-bar-wrap">
          <div className="lp-ranking-v1-bar" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="lp-ranking-v1-value">
          {value}
          {unit && <span className="lp-ranking-v1-unit">{unit}</span>}
                  </div>
        </div>
              );
      })}
          </div>
    )}
      </div>
  </div>
  );
}
