// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · KPI 指标卡（kpis_v1）
 * 情绪：ember | 骨架：grid | 角色：stat
 * 2×2 指标卡：大数字(mono) + 涨跌 delta(冰蓝/铜) + 金线分隔。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10KpisV1Item {
  label?: string;
  value?: string;
  unit?: string;
  delta?: string;
}
export interface Theme10KpisV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  items?: Theme10KpisV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 4;

export const theme10KpisV1Meta: LayoutMeta = {
  id: 'theme10_kpis_v1',
  theme: 'theme10',
  role: 'stats',
  displayName: 'Theme 10 指标卡',
  description: '2×2 KPI 大数字指标卡',
  needsMedia: false,
  tags: ['kpi', 'stat', 'gold-index', 'ember'],
  contentShape: 'kpis',
};

export const theme10KpisV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '核心指标' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'KPI' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '四个数字，撑起一页结论' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '把最该被记住的指标放大，其余留作注脚。' },
    {
      key: 'items',
      label: '指标',
      type: 'array',
      minItems: 1,
      maxItems: COUNT,
      defaultValue: [
        { label: '管理规模', value: '¥128', unit: '亿', delta: '+12.4%' },
        { label: '年化收益', value: '9.7', unit: '%', delta: '+1.8%' },
        { label: '夏普比率', value: '2.31', unit: '', delta: '+0.22' },
        { label: '最大回撤', value: '-6.4', unit: '%', delta: '-1.1%' },
      ],
      itemSchema: [
        { key: 'label', label: '指标名', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'delta', label: '涨跌', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '核心指标' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '48' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10KpisV1(props: Theme10KpisV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const raw = props.items ?? [];
  const items: Theme10KpisV1Item[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-kpis">
      <div className="lp-theme10-kpis-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-kpis-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-kpis-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-kpis-grid">
        {items.map((it, i) => {
          const up = it.delta != null && !/^-/.test(it.delta.trim());
          return (
            <div className="lp-theme10-kpi-card lp-rise" style={{ animationDelay: `${160 + i * 50}ms` }} key={i}>
              <EditableField prop={`items.${i}.label`} slideIdx={s} editable={e} as="div" className="t10-kpi-label">{it.label}</EditableField>
              <div className="t10-kpi-value">
                <EditableField prop={`items.${i}.value`} slideIdx={s} editable={e} as="span" className="t10-kpi-num">{it.value}</EditableField>
                {it.unit && <EditableField prop={`items.${i}.unit`} slideIdx={s} editable={e} as="span" className="t10-kpi-unit">{it.unit}</EditableField>}
              </div>
              <EditableField prop={`items.${i}.delta`} slideIdx={s} editable={e} as="div" className={`t10-kpi-delta ${up ? 'up' : 'down'}`}>{it.delta}</EditableField>
            </div>
          );
        })}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
