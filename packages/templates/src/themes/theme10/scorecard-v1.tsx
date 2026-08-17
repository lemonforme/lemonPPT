// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 记分卡（scorecard_v1）
 * 情绪：ember | 骨架：grid | 角色：stats
 * 多张记分卡：指标 + 评分(大) + 满分基准 + 评语；金线分隔。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10ScorecardV1Item { label?: string; score?: string; total?: string; note?: string; }
export interface Theme10ScorecardV1Props {
  section?: string;
  title?: string;
  lead?: string;
  items?: Theme10ScorecardV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10ScorecardV1Meta: LayoutMeta = {
  id: 'theme10_scorecard_v1',
  theme: 'theme10',
  role: 'stats',
  displayName: 'Theme 10 记分卡',
  description: '多指标评分卡 + 评语',
  needsMedia: false,
  tags: ['scorecard', 'rating', 'stat', 'gold-index', 'ember'],
  contentShape: 'scorecard',
};

export const theme10ScorecardV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '综合评分' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '把表现折成分数' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '每一项都可被量化，分数让比较变得直接。' },
    {
      key: 'items',
      label: '记分卡',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { label: '盈利能力', score: '92', total: '100', note: 'ROE 领先同业' },
        { label: '成长性', score: '86', total: '100', note: '营收复合增速 24%' },
        { label: '稳健性', score: '78', total: '100', note: '杠杆可控' },
        { label: '流动性', score: '81', total: '100', note: '现金覆盖充足' },
      ],
      itemSchema: [
        { key: 'label', label: '指标名', type: 'text', inlineEditable: true },
        { key: 'score', label: '评分', type: 'text', inlineEditable: true },
        { key: 'total', label: '满分', type: 'text', inlineEditable: true },
        { key: 'note', label: '评语', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '综合评分' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '73' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10ScorecardV1(props: Theme10ScorecardV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? []).map((it, i) => ({ label: it?.label ?? `指标 ${i + 1}`, score: it?.score ?? '0', total: it?.total ?? '100', note: it?.note ?? '' }));

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-scorecard">
      <div className="lp-theme10-kpis-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-kpis-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-kpis-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>}
      </div>

      <div className="lp-theme10-scorecard-grid">
        {items.map((it, i) => (
          <div className="lp-theme10-scorecard-card lp-rise" style={{ animationDelay: `${160 + i * 50}ms` }} key={i}>
            <EditableField prop={`items.${i}.label`} slideIdx={s} editable={e} as="div" className="t10-kpi-label">{it.label}</EditableField>
            <div className="t10-kpi-value">
              <EditableField prop={`items.${i}.score`} slideIdx={s} editable={e} as="span" className="t10-kpi-num">{it.score}</EditableField>
              {it.total && <EditableField prop={`items.${i}.total`} slideIdx={s} editable={e} as="span" className="t10-kpi-unit">/{it.total}</EditableField>}
            </div>
            {it.note && <EditableField prop={`items.${i}.note`} slideIdx={s} editable={e} as="div" className="lp-theme10-scorecard-note">{it.note}</EditableField>}
          </div>
        ))}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
