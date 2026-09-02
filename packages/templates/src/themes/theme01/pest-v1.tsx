// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet, Masthead, Headline, SwotBadge, Blob, DottedPattern, Ring } from './shared.js';

export interface Theme01PestV1Props {
  title: string;
  kicker?: string;
  political?: string;
  economic?: string;
  social?: string;
  technological?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01PestV1Meta: LayoutMeta = {
  id: 'theme01_pest_v1',
  theme: 'theme01',
  role: 'pest',
  displayName: 'Theme 01 PEST 分析',
  description: '色块拼贴风 2x2 PEST 宏观环境分析矩阵',
  needsMedia: false,
};

export const theme01PestV1Schema: PropsSchema = {
  fields: [
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'political',
      label: 'political',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'economic',
      label: 'economic',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'social',
      label: 'social',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'technological',
      label: 'technological',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

const CELLS = [
  { key: 'political', letter: 'P', subtitle: '政治环境', value: 'political', color: 'red' as const },
  { key: 'economic', letter: 'E', subtitle: '经济环境', value: 'economic', color: 'amber' as const },
  { key: 'social', letter: 'S', subtitle: '社会环境', value: 'social', color: 'blue' as const },
  { key: 'technological', letter: 'T', subtitle: '技术环境', value: 'technological', color: 'violet' as const },
];

export function Theme01PestV1(props: Theme01PestV1Props): ReactNode {
  const { title, kicker, political, economic, social, technological, _slideIdx, _editable } = props;
  const values: Record<string, string | undefined> = { political, economic, social, technological };

  return (
    <Sheet substrate="light" frame="grid" className="lp-pest-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title} en="PEST ANALYSIS" size="large" className="lp-pest-v1-headline lp-rise" />
      <div className="lp-pest-v1-grid lp-rise">
        {CELLS.map((cell) => (
          <div key={cell.key} className={`lp-pest-v1-cell color-${cell.color}`}>
            <div className="lp-pest-v1-cell-head">
              <SwotBadge letter={cell.letter} color={cell.color} />
              <span className="lp-pest-v1-cell-subtitle">{cell.subtitle}</span>
            </div>
            <EditableField
              prop={cell.value}
              slideIdx={_slideIdx}
              editable={_editable}
              as="p"
              className="lp-pest-v1-cell-text"
            >
              {values[cell.value] || cell.subtitle}
            </EditableField>
          </div>
        ))}
      </div>
      <Blob
        className="lp-pest-v1-blob"
        style={{ width: 340, height: 340, bottom: -100, left: -80, background: 'var(--lp-blue)', opacity: 0.16 }}
      />
      <DottedPattern
        className="lp-pest-v1-dots"
        style={{ top: 130, right: 90, width: 140, height: 140, opacity: 0.22 }}
      />
      <Ring
        className="lp-pest-v1-ring"
        style={{ width: 90, height: 90, bottom: 120, right: 100, borderColor: 'var(--lp-amber)' }}
      />
    </Sheet>
  );
}
