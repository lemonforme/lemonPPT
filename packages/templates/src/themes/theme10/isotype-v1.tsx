// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 象形图（isotype_v1）
 * 情绪：obsidian | 骨架：grid | 图位：0
 * 单位符号重复（每个方块代表固定数量）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10IsoItem {
  label?: string;
  value?: number;
  unit?: string;
}
export interface Theme10IsotypeV1Props {
  kicker?: string;
  title?: string;
  items?: Theme10IsoItem[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10IsotypeV1Meta: LayoutMeta = {
  id: 'theme10_isotype_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 象形图',
  description: '单位符号重复象形图',
  needsMedia: false,
  tags: ['isotype', 'content', 'gold-index', 'obsidian'],
  contentShape: 'isotype',
};

export const theme10IsotypeV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'UNITS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '每类资产对应多少持仓单元' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 0,
      maxItems: 5,
      defaultValue: [
        { label: '权益', value: 12, unit: '× 5%' },
        { label: '债券', value: 8, unit: '× 5%' },
        { label: '另类', value: 4, unit: '× 5%' },
        { label: '现金', value: 2, unit: '× 5%' },
      ],
      itemSchema: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'value', label: '单元数', type: 'number' },
        { key: 'unit', label: '每单元', type: 'text' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'obsidian' },
  ],
};

const MAX_GLYPH = 20;

export function Theme10IsotypeV1(props: Theme10IsotypeV1Props): ReactNode {
  const { kicker, title, items, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const list = (Array.isArray(items) ? items : []).slice(0, 5);
  const maxVal = Math.max(1, ...list.map((it) => Number(it.value ?? 0)));

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-isotype" accent>
      <div className="lp-theme10-isotype-head">
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
      <div className="lp-theme10-isotype-list">
        {list.map((it, i) => {
          const v = Math.max(0, Math.round(Number(it.value ?? 0)));
          const n = Math.max(1, Math.round((v / maxVal) * MAX_GLYPH));
          return (
            <div className="lp-theme10-isotype-row lp-rise" key={i} style={{ animationDelay: `${120 + i * 60}ms` }}>
              <div className="t10-iso-label">
                <EditableField prop={`items.${i}.label`} slideIdx={s} editable={e} as="span">
                  {it.label}
                </EditableField>
                <span className="t10-iso-unit">
                  <EditableField prop={`items.${i}.unit`} slideIdx={s} editable={e} as="span">
                    {it.unit}
                  </EditableField>
                </span>
              </div>
              <div className="t10-iso-glyphs" aria-hidden="true">
                {Array.from({ length: n }).map((_, j) => (
                  <span className="t10-iso-glyph" key={j} style={{ background: i % 2 ? 'var(--lp-t10-gold)' : 'var(--lp-t10-blue)' }} />
                ))}
              </div>
              <div className="t10-iso-val">
                <EditableField prop={`items.${i}.value`} slideIdx={s} editable={e} as="span">
                  {v}
                </EditableField>
              </div>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}
