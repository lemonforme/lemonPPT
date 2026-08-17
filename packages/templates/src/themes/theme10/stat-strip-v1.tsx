// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 指标长条（stat_strip_v1）
 * 情绪：aurora | 骨架：column-3 | 角色：stats
 * 横向紧凑指标条：多个小指标横排，金线分隔。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10StatStripV1Item { label?: string; value?: string; unit?: string; delta?: string; }
export interface Theme10StatStripV1Props {
  section?: string;
  title?: string;
  items?: Theme10StatStripV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10StatStripV1Meta: LayoutMeta = {
  id: 'theme10_stat_strip_v1',
  theme: 'theme10',
  role: 'stats',
  displayName: 'Theme 10 指标长条',
  description: '横向紧凑指标条',
  needsMedia: false,
  tags: ['stat-strip', 'strip', 'stat', 'gold-index', 'aurora'],
  contentShape: 'stat-strip',
};

export const theme10StatStripV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '关键数据' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一行的数字，半页的结论' },
    {
      key: 'items',
      label: '指标',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { label: '规模', value: '128.4', unit: '亿', delta: '+12.4%' },
        { label: '收益', value: '9.7', unit: '%', delta: '+1.8%' },
        { label: '夏普', value: '2.31', unit: '', delta: '+0.22' },
        { label: '回撤', value: '-6.4', unit: '%', delta: '-1.1%' },
        { label: '换手', value: '38', unit: '%', delta: '-4%' },
      ],
      itemSchema: [
        { key: 'label', label: '指标名', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'delta', label: '涨跌', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '关键数据' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '76' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10StatStripV1(props: Theme10StatStripV1Props): ReactNode {
  const { section, title, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const items = (props.items ?? []).map((it, i) => ({ label: it?.label ?? `指标 ${i + 1}`, value: it?.value ?? '0', unit: it?.unit ?? '', delta: it?.delta ?? '' }));

  return (
    <Sheet mood={mood} frame="column-3" className="lp-theme10-strip">
      <div className="lp-theme10-kpis-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-kpis-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
      </div>

      <div className="lp-theme10-strip-row">
        {items.map((it, i) => {
          const up = it.delta != null && !/^-/.test(String(it.delta).trim());
          return (
            <div className="lp-theme10-strip-item lp-rise" style={{ animationDelay: `${120 + i * 40}ms` }} key={i}>
              <EditableField prop={`items.${i}.label`} slideIdx={s} editable={e} as="div" className="t10-kpi-label">{it.label}</EditableField>
              <div className="t10-kpi-value">
                <EditableField prop={`items.${i}.value`} slideIdx={s} editable={e} as="span" className="t10-kpi-num">{it.value}</EditableField>
                {it.unit && <EditableField prop={`items.${i}.unit`} slideIdx={s} editable={e} as="span" className="t10-kpi-unit">{it.unit}</EditableField>}
              </div>
              {it.delta && <EditableField prop={`items.${i}.delta`} slideIdx={s} editable={e} as="div" className={`t10-kpi-delta ${up ? 'up' : 'down'}`}>{it.delta}</EditableField>}
            </div>
          );
        })}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
