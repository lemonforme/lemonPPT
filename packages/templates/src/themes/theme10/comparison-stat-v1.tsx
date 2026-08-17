// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 对比指标（comparison_stat_v1）
 * 情绪：obsidian | 骨架：spread | 角色：stats
 * 左右两组大指标，中间金线分隔；适合「本期 vs 上期」「A vs B」。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10CmpStatSide { label?: string; value?: string; unit?: string; delta?: string; }
export interface Theme10ComparisonStatV1Props {
  section?: string;
  title?: string;
  left?: Theme10CmpStatSide;
  right?: Theme10CmpStatSide;
  versus?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10ComparisonStatV1Meta: LayoutMeta = {
  id: 'theme10_comparison_stat_v1',
  theme: 'theme10',
  role: 'stats',
  displayName: 'Theme 10 对比指标',
  description: '左右两组大指标对比',
  needsMedia: false,
  tags: ['comparison', 'versus', 'stat', 'gold-index', 'obsidian'],
  contentShape: 'comparison-stat',
};

export const theme10ComparisonStatV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '同比对比' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '把两年摆在一起看' },
    { key: 'versus', label: '中间标注', type: 'text', inlineEditable: true, defaultValue: 'VS' },
    { key: 'left', label: '左侧', type: 'object', defaultValue: { label: '上期', value: '96.2', unit: '亿', delta: '-3.1%' }, itemSchema: [
      { key: 'label', label: '指标名', type: 'text', inlineEditable: true },
      { key: 'value', label: '数值', type: 'text', inlineEditable: true },
      { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
      { key: 'delta', label: '涨跌', type: 'text', inlineEditable: true },
    ] },
    { key: 'right', label: '右侧', type: 'object', defaultValue: { label: '本期', value: '128.4', unit: '亿', delta: '+12.4%' }, itemSchema: [
      { key: 'label', label: '指标名', type: 'text', inlineEditable: true },
      { key: 'value', label: '数值', type: 'text', inlineEditable: true },
      { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
      { key: 'delta', label: '涨跌', type: 'text', inlineEditable: true },
    ] },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '同比对比' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '74' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

function CmpSide({ side, sideKey, s, e }: { side: Theme10CmpStatSide; sideKey: string; s?: number; e?: boolean }) {
  const up = side.delta != null && !/^-/.test(String(side.delta).trim());
  return (
    <div className="lp-theme10-cmp-side">
      <EditableField prop={`${sideKey}.label`} slideIdx={s} editable={e} as="div" className="t10-kpi-label">{side.label}</EditableField>
      <div className="t10-kpi-value">
        <EditableField prop={`${sideKey}.value`} slideIdx={s} editable={e} as="span" className="t10-kpi-num">{side.value}</EditableField>
        {side.unit && <EditableField prop={`${sideKey}.unit`} slideIdx={s} editable={e} as="span" className="t10-kpi-unit">{side.unit}</EditableField>}
      </div>
      {side.delta && <EditableField prop={`${sideKey}.delta`} slideIdx={s} editable={e} as="div" className={`t10-kpi-delta ${up ? 'up' : 'down'}`}>{side.delta}</EditableField>}
    </div>
  );
}

export function Theme10ComparisonStatV1(props: Theme10ComparisonStatV1Props): ReactNode {
  const { section, title, versus, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const left = props.left ?? {};
  const right = props.right ?? {};

  return (
    <Sheet mood={mood} frame="spread" className="lp-theme10-cmp-stat" accent>
      <div className="lp-theme10-kpis-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-kpis-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
      </div>

      <div className="lp-theme10-cmp-stat-row">
        <CmpSide side={left} sideKey="left" s={s} e={e} />
        <div className="lp-theme10-cmp-vs">{versus}</div>
        <CmpSide side={right} sideKey="right" s={s} e={e} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
