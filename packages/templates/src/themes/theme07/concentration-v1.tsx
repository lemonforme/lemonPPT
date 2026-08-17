// lemonPPT - theme07 市场集中度页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07ConcentrationV1Row {
  name: string;
  value: string;
  change?: string;
  focus?: boolean;
}

export interface Theme07ConcentrationV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  rows?: Theme07ConcentrationV1Row[];
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07ConcentrationV1Meta: LayoutMeta = {
  id: 'theme07_concentration_v1',
  theme: 'theme07',
  role: 'chart',
  displayName: 'Theme 07 市场集中度',
  description: 'Top N 横向排名列表，展示资金或份额集中度',
  needsMedia: true,
  tags: ['rank', 'concentration', 'top'],
  contentShape: 'ranking',
};

export const theme07ConcentrationV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'CONCENTRATION' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资金集中度排名' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '前 10% 项目吸纳的资金份额' },
    {
      key: 'rows',
      label: '排名项',
      type: 'array',
      minItems: 3,
      maxItems: 10,
      defaultValue: [
        { name: 'Top 1% 项目', value: '34%', change: '+4pp', focus: true },
        { name: 'Top 5% 项目', value: '58%', change: '+6pp' },
        { name: 'Top 10% 项目', value: '71%', change: '+5pp' },
        { name: '其余 90% 项目', value: '29%', change: '-5pp' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'change', label: '变化', type: 'text' },
        { key: 'focus', label: '强调', type: 'boolean' },
      ],
    },
    { key: 'focusIndex', label: '高亮序号', type: 'slider', min: 0, max: 9, defaultValue: 0 },
  ],
};

export function Theme07ConcentrationV1(props: Theme07ConcentrationV1Props): ReactNode {
  const { imageUrl, kicker, title, subtitle, rows = [], focusIndex = 0, _slideIdx, _editable } = props;
  const validRows = (rows || []).filter((r): r is Theme07ConcentrationV1Row => r != null && !!r.name).slice(0, 10);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-ranking">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-ranking-header lp-rise">
        <Theme07IconChip name="pie" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      {validRows.length > 0 && (
        <div className="lp-theme07-ranking-list lp-rise">
          {validRows.map((row, i) => (
            <div key={i} className={`lp-theme07-rank-row ${(row.focus || i === focusIndex) ? 'lp-focus accent' : ''}`} style={{ animationDelay: `${i * 60}ms` }}>
              {(row.focus || i === focusIndex) && <span className="lp-focus-lens" aria-hidden="true" />}
              <div className="lp-theme07-rank-number">{String(i + 1).padStart(2, '0')}</div>
              <div className="lp-theme07-rank-name">
                <EditableField prop={`rows.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{row.name}</EditableField>
              </div>
              <div className="lp-theme07-rank-value">
                <EditableField prop={`rows.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{row.value}</EditableField>
              </div>
              {row.change && (
                <div className={`lp-theme07-rank-change ${row.change.startsWith('-') ? 'negative' : ''}`}>
                  <EditableField prop={`rows.${i}.change`} slideIdx={_slideIdx} editable={_editable} as="span">{row.change}</EditableField>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
