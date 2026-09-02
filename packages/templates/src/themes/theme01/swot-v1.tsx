// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet, Masthead, Headline, SwotBadge, Blob, DottedPattern } from './shared.js';

export interface Theme01SwotV1Props {
  title: string;
  kicker?: string;
  strength?: string;
  weakness?: string;
  opportunity?: string;
  threat?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01SwotV1Meta: LayoutMeta = {
  id: 'theme01_swot_v1',
  theme: 'theme01',
  role: 'swot',
  displayName: 'Theme 01 SWOT 分析',
  description: '色块拼贴风 2x2 SWOT 分析矩阵',
  needsMedia: false,
};

export const theme01SwotV1Schema: PropsSchema = {
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
      key: 'strength',
      label: 'strength',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'weakness',
      label: 'weakness',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'opportunity',
      label: 'opportunity',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'threat',
      label: 'threat',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

const CELLS = [
  { key: 'strength', letter: 'S', subtitle: '优势', value: 'strength', color: 'green' as const },
  { key: 'weakness', letter: 'W', subtitle: '劣势', value: 'weakness', color: 'red' as const },
  { key: 'opportunity', letter: 'O', subtitle: '机会', value: 'opportunity', color: 'blue' as const },
  { key: 'threat', letter: 'T', subtitle: '威胁', value: 'threat', color: 'amber' as const },
];

export function Theme01SwotV1(props: Theme01SwotV1Props): ReactNode {
  const { title, kicker, strength, weakness, opportunity, threat, _slideIdx, _editable } = props;
  const values: Record<string, string | undefined> = { strength, weakness, opportunity, threat };

  return (
    <Sheet substrate="light" frame="grid" className="lp-swot-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title} en="SWOT ANALYSIS" size="large" className="lp-swot-v1-headline lp-rise" />
      <div className="lp-swot-v1-grid lp-rise">
        {CELLS.map((cell) => (
          <div key={cell.key} className={`lp-swot-v1-cell color-${cell.color}`}>
            <div className="lp-swot-v1-cell-head">
              <SwotBadge letter={cell.letter} color={cell.color} />
              <span className="lp-swot-v1-cell-subtitle">{cell.subtitle}</span>
            </div>
            <EditableField
              prop={cell.value}
              slideIdx={_slideIdx}
              editable={_editable}
              as="p"
              className="lp-swot-v1-cell-text"
            >
              {values[cell.value] || cell.subtitle}
            </EditableField>
          </div>
        ))}
      </div>
      <Blob
        className="lp-swot-v1-blob"
        style={{ width: 360, height: 360, top: -120, right: -80, background: 'var(--lp-amber)', opacity: 0.18 }}
      />
      <DottedPattern
        className="lp-swot-v1-dots"
        style={{ bottom: 90, left: 70, width: 160, height: 160, opacity: 0.22 }}
      />
    </Sheet>
  );
}
