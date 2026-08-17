// lemonPPT - theme07 战略矩阵页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07MatrixV1Cell {
  title: string;
  description?: string;
  focus?: boolean;
}

export interface Theme07MatrixV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  cells?: Theme07MatrixV1Cell[];
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07MatrixV1Meta: LayoutMeta = {
  id: 'theme07_matrix_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 战略矩阵',
  description: '2×2 战略四象限矩阵，支持坐标轴标签与焦点高亮',
  needsMedia: true,
  tags: ['matrix', 'quadrant', 'strategy'],
  contentShape: 'matrix',
};

export const theme07MatrixV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'MATRIX' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '战略优先级矩阵' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按吸引力与可行性划分的机会象限' },
    { key: 'xAxisLabel', label: '横轴标签', type: 'text', defaultValue: '可行性 →' },
    { key: 'yAxisLabel', label: '纵轴标签', type: 'text', defaultValue: '吸引力 ↑' },
    {
      key: 'cells',
      label: '象限',
      type: 'array',
      minItems: 4,
      maxItems: 4,
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
        { key: 'focus', label: '强调', type: 'boolean' },
      ],
    },
    { key: 'focusIndex', label: '高亮象限', type: 'slider', min: 0, max: 3, defaultValue: 0 },
  ],
};

export function Theme07MatrixV1(props: Theme07MatrixV1Props): ReactNode {
  const { imageUrl, kicker, title, subtitle, xAxisLabel, yAxisLabel, cells = [], focusIndex = 0, _slideIdx, _editable } = props;
  const validCells = cells.slice(0, 4);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-matrix">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-rise" style={{ position: 'relative', height: '100%' }}>
        <Theme07IconChip name="layers" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
        {xAxisLabel && (
          <div className="lp-theme07-matrix-axis lp-theme07-matrix-axis--x">{xAxisLabel}</div>
        )}
        {yAxisLabel && (
          <div className="lp-theme07-matrix-axis lp-theme07-matrix-axis--y">{yAxisLabel}</div>
        )}
        <div className="lp-theme07-matrix-grid-wrap">
          <svg className="lp-theme07-matrix-axis-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <line x1="50" y1="3" x2="50" y2="97" stroke="var(--lp-accent)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.55" />
            <line x1="3" y1="50" x2="97" y2="50" stroke="var(--lp-accent)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.55" />
            <polygon points="97,50 90,46 90,54" fill="var(--lp-accent)" opacity="0.85" />
            <polygon points="50,3 46,9 54,9" fill="var(--lp-accent)" opacity="0.85" />
          </svg>
          <div className="lp-theme07-matrix-grid">
            {validCells.map((cell, i) => (
              <div key={i} className={`lp-theme07-matrix-cell ${(cell.focus || i === focusIndex) ? 'lp-focus' : ''}`} style={{ animationDelay: `${i * 80}ms` }}>
                {(cell.focus || i === focusIndex) && <span className="lp-focus-lens" aria-hidden="true" />}
                <div className="lp-theme07-matrix-cell-title">
                  <EditableField prop={`cells.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{cell.title}</EditableField>
                </div>
                {cell.description && (
                  <div className="lp-theme07-matrix-cell-desc">
                    <EditableField prop={`cells.${i}.description`} slideIdx={_slideIdx} editable={_editable} as="span">{cell.description}</EditableField>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lp-theme07-glow-line lp-rise" aria-hidden="true" />
    </div>
  );
}
