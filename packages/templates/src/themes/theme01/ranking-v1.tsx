// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Headline, Masthead, NumberSticker, Plus, Ring, Sheet, Slash } from './shared.js';

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
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
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
          inlineEditable: true,
        },
        {
          key: 'value',
          label: '数值',
          type: 'number',
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'unit',
      label: '单位',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

const RANK_COLORS = ['blue', 'green', 'amber', 'red', 'violet', 'cyan', 'pink', 'lime'] as const;

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
    <Sheet substrate="light" frame="grid" className="lp-ranking-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title ?? ''} en="RANKING" size="large" className="lp-ranking-v1-headline lp-rise" />
      {sorted.length > 0 && (
        <div className="lp-ranking-v1-list lp-rise">
          {sorted.map(({ item, originalIndex }, rank) => {
            const value = item.value ?? 0;
            const pct = (value / maxValue) * 100;
            const color = RANK_COLORS[rank % RANK_COLORS.length];
            return (
              <div key={rank} className={`lp-ranking-v1-row color-${color} rank-${rank + 1}`}>
                <NumberSticker value={rank + 1} className="lp-ranking-v1-rank" />
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
      <Blob
        className="lp-ranking-v1-blob"
        style={{ width: 320, height: 320, bottom: -100, left: -70, background: 'var(--lp-violet)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-ranking-v1-dots"
        style={{ top: 140, right: 80, width: 180, height: 180, opacity: 0.22 }}
      />
      <Slash
        className="lp-ranking-v1-slash"
        style={{ top: 120, right: 100, height: 60, background: 'var(--lp-amber)', opacity: 0.55 }}
      />
      <Plus
        className="lp-ranking-v1-plus"
        style={{ bottom: 100, left: 90, width: 26, height: 26, color: 'var(--lp-green)' }}
      />
      <Ring
        className="lp-ranking-v1-ring"
        style={{ bottom: 90, right: 110, width: 60, height: 60, borderColor: 'var(--lp-blue)' }}
      />
    </Sheet>
  );
}
