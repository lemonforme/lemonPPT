// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06MatrixV1Cell {
  title: string;
  description?: string;
  focus?: boolean;
}

export interface Theme06MatrixV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  cells?: Theme06MatrixV1Cell[];
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06MatrixV1Meta: LayoutMeta = {
  id: 'theme06_matrix_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 战略矩阵',
  description: '2×2 战略四象限矩阵，支持坐标轴标签与焦点高亮',
  needsMedia: true,
  tags: ['matrix', 'quadrant', 'strategy'],
  contentShape: 'matrix',
};

export const theme06MatrixV1Schema: PropsSchema = {
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

export function Theme06MatrixV1(props: Theme06MatrixV1Props): ReactNode {
  const { kicker, title, subtitle, xAxisLabel, yAxisLabel, cells = [], focusIndex = 0, _slideIdx, _editable } = props;
  const validCells = cells.slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-matrix">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-rise" style={{ position: 'relative', height: '100%' }}>
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>}
        {xAxisLabel && (
          <div className="lp-theme06-matrix-axis" style={{ bottom: '24px', right: '56px' }}>{xAxisLabel}</div>
        )}
        {yAxisLabel && (
          <div className="lp-theme06-matrix-axis" style={{ top: '96px', left: '0' }}>{yAxisLabel}</div>
        )}
        <div className="lp-theme06-matrix-grid">
          {validCells.map((cell, i) => (
            <div key={i} className={`lp-theme06-matrix-cell ${(cell.focus || i === focusIndex) ? 'focus' : ''}`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="lp-theme06-matrix-cell-title">
                <EditableField prop={`cells.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{cell.title}</EditableField>
              </div>
              {cell.description && (
                <div className="lp-theme06-matrix-cell-desc">
                  <EditableField prop={`cells.${i}.description`} slideIdx={_slideIdx} editable={_editable} as="span">{cell.description}</EditableField>
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
