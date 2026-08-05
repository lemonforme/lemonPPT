// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06RankV1Row {
  name: string;
  value: string;
  change?: string;
  focus?: boolean;
}

export interface Theme06RankV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  rows?: Theme06RankV1Row[];
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06RankV1Meta: LayoutMeta = {
  id: 'theme06_rank_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 Top N 排名',
  description: 'Top N 横向排名列表：序号 + 名称 + 数值 + 变化徽章',
  needsMedia: true,
  tags: ['rank', 'top', 'list'],
  contentShape: 'ranking',
};

export const theme06RankV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'RANKING' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '头部玩家融资排名' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按 2026 年度融资额排序' },
    {
      key: 'rows',
      label: '排名项',
      type: 'array',
      minItems: 3,
      maxItems: 10,
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

export function Theme06RankV1(props: Theme06RankV1Props): ReactNode {
  const { kicker, title, subtitle, rows = [], focusIndex = 0, _slideIdx, _editable } = props;
  const validRows = rows.slice(0, 10);

  return (
    <div className="lp-slide lp-theme06-rank">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>}
        <div className="lp-theme06-rank-rows">
          {validRows.map((row, i) => (
            <div key={i} className={`lp-theme06-rank-row ${(row.focus || i === focusIndex) ? 'focus' : ''}`} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="lp-theme06-rank-rank">{i + 1}</div>
              <div className="lp-theme06-rank-name">
                <EditableField prop={`rows.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{row.name}</EditableField>
              </div>
              <div className="lp-theme06-rank-value">
                <EditableField prop={`rows.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{row.value}</EditableField>
              </div>
              {row.change && (
                <div className={`lp-theme06-rank-change ${row.change.startsWith('-') ? 'negative' : ''}`}>
                  <EditableField prop={`rows.${i}.change`} slideIdx={_slideIdx} editable={_editable} as="span">{row.change}</EditableField>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="lp-theme06-glow-line lp-rise" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
