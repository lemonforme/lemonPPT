// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 小多图（small_multiples_v1）
 * 情绪：aurora | 骨架：grid | 角色：chart
 * 2×N 迷你图表网格，每格一个独立 echarts 实例（与 theme01–07 统一）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, barOption, lineOption, trendOption } from './t10echart.js';

export interface Theme10SmallMultiplesPanel {
  title?: string;
  kind?: string;
  labels?: string[];
  values?: string;
}
export interface Theme10SmallMultiplesV1Props {
  section?: string;
  title?: string;
  lead?: string;
  panels?: Theme10SmallMultiplesPanel[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10SmallMultiplesV1Meta: LayoutMeta = {
  id: 'theme10_small_multiples_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 小多图',
  description: '迷你图表网格（多 echarts 实例）',
  needsMedia: false,
  tags: ['small-multiples', 'grid', 'chart', 'gold-index', 'aurora'],
  contentShape: 'small-multiples',
};

export const theme10SmallMultiplesV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '分项速览' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '把多个切面并排看' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '每个小图讲一件事，合起来才是全貌。' },
    {
      key: 'panels',
      label: '小图',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { title: '规模', kind: 'bar', labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: '20,28,33,41' },
        { title: '收益', kind: 'line', labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: '6.1,7.4,8.0,9.7' },
        { title: '回撤', kind: 'area', labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: '-3,-6,-4,-2' },
        { title: '净值', kind: 'trend', labels: ['1月', '2月', '3月', '4月'], values: '100,103,101,108' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'kind', label: '类型', type: 'select', options: [{ value: 'bar', label: 'bar' }, { value: 'line', label: 'line' }, { value: 'area', label: 'area' }, { value: 'trend', label: 'trend' }], defaultValue: 'bar' },
        { key: 'labels', label: '类目', type: 'array', itemSchema: [{ key: 'text', label: '类目', type: 'text', inlineEditable: true }] },
        { key: 'values', label: '数值(逗号分隔)', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '分项速览' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '75' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

function panelOption(p: Theme10SmallMultiplesPanel): Record<string, unknown> {
  const labels = (p.labels ?? []).map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? '')));
  const values = (p.values ?? '')
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((n) => isFinite(n));
  const kind = (p.kind ?? 'bar').toLowerCase();
  if (kind === 'line') return lineOption({ labels, values, area: false });
  if (kind === 'area') return lineOption({ labels, values, area: true });
  if (kind === 'trend') return trendOption({ labels, series: [{ name: p.title ?? '系列', data: values }] });
  return barOption({ labels, values });
}

export function Theme10SmallMultiplesV1(props: Theme10SmallMultiplesV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const panels = props.panels ?? [];

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-sm">
      <div className="lp-theme10-kpis-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-kpis-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-kpis-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>}
      </div>

      <div className="lp-theme10-sm-grid">
        {panels.map((p, i) => (
          <div className="lp-theme10-sm-cell lp-rise" style={{ animationDelay: `${160 + i * 40}ms` }} key={i}>
            <EditableField prop={`panels.${i}.title`} slideIdx={s} editable={e} as="div" className="lp-theme10-sm-title">{p.title}</EditableField>
            <T10EChart option={panelOption(p)} />
          </div>
        ))}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
