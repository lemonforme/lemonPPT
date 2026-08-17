// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 指数看板（index_board_v1）
 * 情绪：obsidian | 骨架：grid | 角色：stats
 * 多行指数行情：代码 / 名称 / 最新价 / 涨跌；▲涨(金) ▼跌(铜)。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10IndexBoardV1Row { code?: string; name?: string; value?: string; delta?: string; }
export interface Theme10IndexBoardV1Props {
  section?: string;
  title?: string;
  lead?: string;
  rows?: Theme10IndexBoardV1Row[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10IndexBoardV1Meta: LayoutMeta = {
  id: 'theme10_index_board_v1',
  theme: 'theme10',
  role: 'stats',
  displayName: 'Theme 10 指数看板',
  description: '多行指数行情看板',
  needsMedia: false,
  tags: ['index-board', 'ticker', 'stat', 'gold-index', 'obsidian'],
  contentShape: 'index-board',
};

export const theme10IndexBoardV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '行情看板' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一屏看清全场温度' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '红绿之间，是市场对当下的投票。' },
    {
      key: 'rows',
      label: '指数行',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { code: 'LEMON50', name: '柠檬50', value: '3,284.6', delta: '+1.82%' },
        { code: 'GOLD.IDX', name: '黄金指数', value: '2,118.4', delta: '+0.94%' },
        { code: 'BOND.AG', name: '综合债指', value: '1,042.7', delta: '-0.21%' },
        { code: 'TECH.300', name: '科技300', value: '5,619.2', delta: '+2.37%' },
        { code: 'WIND.VIX', name: '波动率', value: '14.8', delta: '-3.10%' },
      ],
      itemSchema: [
        { key: 'code', label: '代码', type: 'text', inlineEditable: true },
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '最新价', type: 'text', inlineEditable: true },
        { key: 'delta', label: '涨跌', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '行情看板' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '78' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10IndexBoardV1(props: Theme10IndexBoardV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const rows = (props.rows ?? []).map((r, i) => ({ code: r?.code ?? `IDX${i + 1}`, name: r?.name ?? `指数 ${i + 1}`, value: r?.value ?? '0', delta: r?.delta ?? '' }));

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-index-board" accent>
      <div className="lp-theme10-kpis-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-kpis-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-kpis-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>}
      </div>

      <div className="lp-theme10-index-board-head">
        <span>代码</span><span>名称</span><span className="t10-idx-num">最新价</span><span className="t10-idx-num">涨跌</span>
      </div>
      <div className="lp-theme10-index-board-rows">
        {rows.map((r, i) => {
          const up = r.delta != null && !/^-/.test(String(r.delta).trim());
          return (
            <div className="lp-theme10-idx-row lp-rise" style={{ animationDelay: `${150 + i * 40}ms` }} key={i}>
              <EditableField prop={`rows.${i}.code`} slideIdx={s} editable={e} as="span" className="t10-idx-code">{r.code}</EditableField>
              <EditableField prop={`rows.${i}.name`} slideIdx={s} editable={e} as="span" className="t10-idx-name">{r.name}</EditableField>
              <EditableField prop={`rows.${i}.value`} slideIdx={s} editable={e} as="span" className="t10-idx-value">{r.value}</EditableField>
              <EditableField prop={`rows.${i}.delta`} slideIdx={s} editable={e} as="span" className={`t10-idx-delta ${up ? 'up' : 'down'}`}>{r.delta}</EditableField>
            </div>
          );
        })}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
