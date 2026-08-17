// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 韦恩图（venn_v1）
 * 情绪：ember | 骨架：stage | 图位：0
 * 三集合韦恩（交集示意）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10VennItem {
  name?: string;
}
export interface Theme10VennV1Props {
  kicker?: string;
  title?: string;
  items?: Theme10VennItem[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10VennV1Meta: LayoutMeta = {
  id: 'theme10_venn_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 韦恩图',
  description: '三集合韦恩图',
  needsMedia: false,
  tags: ['venn', 'content', 'gold-index', 'ember'],
  contentShape: 'venn',
};

export const theme10VennV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'OVERLAP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三类客户的需求交集' },
    {
      key: 'items',
      label: '集合',
      type: 'array',
      minItems: 0,
      maxItems: 3,
      defaultValue: [
        { name: '稳健型' },
        { name: '成长型' },
        { name: '另类型' },
      ],
      itemSchema: [{ key: 'name', label: '集合名', type: 'text' }],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'ember' },
  ],
};

const COLORS = ['var(--lp-t10-blue)', 'var(--lp-t10-gold)', 'var(--lp-t10-copper)'];

export function Theme10VennV1(props: Theme10VennV1Props): ReactNode {
  const { kicker, title, items, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const list = (Array.isArray(items) ? items : []).slice(0, 3);
  const names = [
    list[0]?.name ?? 'A',
    list[1]?.name ?? 'B',
    list[2]?.name ?? 'C',
  ];
  const R = 150;
  const cx = [380, 620, 500];
  const cy = [250, 250, 380];

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme10-venn" accent>
      <div className="lp-theme10-venn-head">
        {kicker && (
          <EditableField prop="kicker" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField
            prop="title"
            slideIdx={s}
            editable={e}
            as="h2"
            className="lp-theme10-title lp-rise"
            style={{ animationDelay: '60ms', fontSize: 'var(--lp-font-size-h1)', marginTop: 12 }}
          >
            {title}
          </EditableField>
        )}
      </div>
      <div className="lp-theme10-venn-stage">
        <svg className="lp-t10-chart-svg" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          {cx.map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={cy[i]}
              r={R}
              fill={COLORS[i]}
              fillOpacity={0.16}
              stroke={COLORS[i]}
              strokeWidth={1.5}
            />
          ))}
          <text x={cx[0] - 70} y={cy[0] - R + 28} textAnchor="middle" fontFamily="var(--lp-font-heading)" fontSize={18} fontWeight={700} fill="var(--lp-ink)">
            {names[0]}
          </text>
          <text x={cx[1] + 70} y={cy[1] - R + 28} textAnchor="middle" fontFamily="var(--lp-font-heading)" fontSize={18} fontWeight={700} fill="var(--lp-ink)">
            {names[1]}
          </text>
          <text x={cx[2]} y={cy[2] + R - 14} textAnchor="middle" fontFamily="var(--lp-font-heading)" fontSize={18} fontWeight={700} fill="var(--lp-ink)">
            {names[2]}
          </text>
          <text x={500} y={330} textAnchor="middle" fontFamily="var(--lp-font-mono)" fontSize={13} fill="var(--lp-ink2)">
            交集 = 共同诉求
          </text>
        </svg>
      </div>
    </Sheet>
  );
}
