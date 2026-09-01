// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 矩阵图（matrix_v1）
 * 情绪：aurora | 骨架：grid
 * 3×3 影响/投入矩阵，卡片按坐标落入对应格子。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11MatrixV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  xLabel?: string;
  yLabel?: string;
  items?: { name: string; x: number; y: number; tone?: 'accent' | 'violet' | 'orange' | 'green' }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11MatrixV1Meta: LayoutMeta = {
  id: 'theme11_matrix_v1',
  theme: 'theme11',
  role: 'stats',
  displayName: 'Theme 11 矩阵图',
  description: '3×3 影响/投入矩阵',
  needsMedia: false,
  tags: ['stats', 'matrix', 'grid', 'light-stream'],
  contentShape: 'matrix',
};

const TONE_VARS: Record<string, string> = {
  accent: 'var(--lp-accent)',
  violet: 'var(--lp-violet)',
  orange: 'var(--lp-orange)',
  green: 'var(--lp-green)',
};

const CELLS = [
  { label: '观望区', tone: 'green' },
  { label: '重点区', tone: 'accent' },
  { label: '核心突破', tone: 'violet' },
  { label: '维持区', tone: 'orange' },
  { label: '优化区', tone: 'accent' },
  { label: '战略投入', tone: 'violet' },
  { label: '淘汰区', tone: 'orange' },
  { label: '低成本快赢', tone: 'green' },
  { label: '高影响攻坚', tone: 'accent' },
];

export const theme11MatrixV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'MATRIX' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '机会优先级矩阵' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '按影响度与投入度定位关键机会' },
    { key: 'xLabel', label: '横轴标签', type: 'text', defaultValue: '影响度 →' },
    { key: 'yLabel', label: '纵轴标签', type: 'text', defaultValue: '投入度 →' },
    {
      key: 'items',
      label: '矩阵项',
      type: 'array',
      maxItems: 9,
      defaultValue: [
        { name: 'AI 一键美化', x: 3, y: 3, tone: 'violet' },
        { name: '智能图表推荐', x: 3, y: 2, tone: 'accent' },
        { name: '多端同步', x: 2, y: 3, tone: 'accent' },
        { name: '模板市场', x: 3, y: 1, tone: 'green' },
        { name: '评论批注', x: 1, y: 2, tone: 'orange' },
        { name: '深色模式', x: 2, y: 1, tone: 'green' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'x', label: 'X(1-3)', type: 'number' },
        { key: 'y', label: 'Y(1-3)', type: 'number' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'accent', label: 'accent' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }] },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11MatrixV1(props: Theme11MatrixV1Props): ReactNode {
  const { title, subtitle, eyebrow, xLabel, yLabel, items = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-matrix">
      <div className="lp-theme11-matrix-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-matrix-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-matrix-body lp-rise">
        <div className="lp-theme11-matrix-yaxis">{yLabel}</div>
        <div className="lp-theme11-matrix-grid">
          {[3, 2, 1].map((y) =>
            [1, 2, 3].map((x) => {
              const cell = CELLS[(3 - y) * 3 + (x - 1)];
              const cellItems = items.filter((it) => Number(it.x ?? 0) === x && Number(it.y ?? 0) === y);
              return (
                <div key={`${x}-${y}`} className={`lp-theme11-matrix-cell lp-theme11-matrix-cell-${cell.tone}`}>
                  <div className="lp-theme11-matrix-cell-label">{cell.label}</div>
                  {cellItems.map((it, idx) => (
                    <Card key={idx} className="lp-theme11-matrix-item" padding="none" style={{ borderLeftColor: TONE_VARS[it.tone ?? 'accent'] } as React.CSSProperties}>
                      <EditableField prop={`items.${items.indexOf(it)}.name`} slideIdx={s} editable={e} as="span">{it.name}</EditableField>
                    </Card>
                  ))}
                </div>
              );
            })
          )}
        </div>
        <div className="lp-theme11-matrix-xaxis">{xLabel}</div>
      </div>
    </Sheet>
  );
}
