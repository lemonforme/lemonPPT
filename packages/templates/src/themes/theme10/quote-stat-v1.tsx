// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 金句指标（quote_stat_v1）
 * 情绪：ember | 骨架：stage | 角色：quote
 * 满版金句 + 嵌入式高亮指标（大 mono 数字），金融编辑式「金句卡」。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10QuoteStatV1Props {
  section?: string;
  quote?: string;
  sign?: string;
  statLabel?: string;
  statValue?: string;
  statUnit?: string;
  statDelta?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10QuoteStatV1Meta: LayoutMeta = {
  id: 'theme10_quote_stat_v1',
  theme: 'theme10',
  role: 'quote',
  displayName: 'Theme 10 金句指标',
  description: '金句 + 嵌入式高亮指标',
  needsMedia: false,
  tags: ['quote', 'stat', 'gold-index', 'ember'],
  contentShape: 'quote-stat',
};

export const theme10QuoteStatV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '观点' },
    { key: 'quote', label: '金句', type: 'textarea', inlineEditable: true, defaultValue: '当所有人都盯着收益率，\n真正的护城河是风险。' },
    { key: 'sign', label: '落款', type: 'text', inlineEditable: true, defaultValue: '— lemonPPT Research' },
    { key: 'statLabel', label: '指标名', type: 'text', inlineEditable: true, defaultValue: '年化波动' },
    { key: 'statValue', label: '数值', type: 'text', inlineEditable: true, defaultValue: '4.8' },
    { key: 'statUnit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '%' },
    { key: 'statDelta', label: '涨跌', type: 'text', inlineEditable: true, defaultValue: '-0.6%' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '观点' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '77' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10QuoteStatV1(props: Theme10QuoteStatV1Props): ReactNode {
  const { section, quote, sign, statLabel, statValue, statUnit, statDelta, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const up = statDelta != null && !/^-/.test(String(statDelta).trim());

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme10-quote-stat" accent>
      <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
      <div className="lp-theme10-quote-stat-body lp-rise" style={{ animationDelay: '60ms' }}>
        <EditableField prop="quote" slideIdx={s} editable={e} as="div" className="lp-theme10-quote-stat-text">{quote}</EditableField>
        {sign && <EditableField prop="sign" slideIdx={s} editable={e} as="div" className="lp-theme10-quote-stat-sign">{sign}</EditableField>}
      </div>
      <div className="lp-theme10-quote-stat-chip lp-rise" style={{ animationDelay: '120ms' }}>
        <EditableField prop="statLabel" slideIdx={s} editable={e} as="div" className="t10-kpi-label">{statLabel}</EditableField>
        <div className="t10-kpi-value">
          <EditableField prop="statValue" slideIdx={s} editable={e} as="span" className="t10-kpi-num">{statValue}</EditableField>
          {statUnit && <EditableField prop="statUnit" slideIdx={s} editable={e} as="span" className="t10-kpi-unit">{statUnit}</EditableField>}
        </div>
        {statDelta && <EditableField prop="statDelta" slideIdx={s} editable={e} as="div" className={`t10-kpi-delta ${up ? 'up' : 'down'}`}>{statDelta}</EditableField>}
      </div>
      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
