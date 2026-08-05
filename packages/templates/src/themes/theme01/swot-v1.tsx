// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

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
  description: '玻璃质感 2x2 SWOT 分析矩阵',
  needsMedia: false,
};

export const theme01SwotV1Schema: PropsSchema = {
  fields: [
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'strength',
      label: 'strength',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'weakness',
      label: 'weakness',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'opportunity',
      label: 'opportunity',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'threat',
      label: 'threat',
      type: 'text',
      inlineEditable: true
  }
  ]
};


export function Theme01SwotV1(props: Theme01SwotV1Props): ReactNode {
  const { title, kicker, strength, weakness, opportunity, threat, _slideIdx, _editable } = props;

  const cells = [
  { key: 'strength', label: 'S', subtitle: '优势', value: strength, cls: 'lp-swot-s' },
  { key: 'weakness', label: 'W', subtitle: '劣势', value: weakness, cls: 'lp-swot-w' },
  { key: 'opportunity', label: 'O', subtitle: '机会', value: opportunity, cls: 'lp-swot-o' },
  { key: 'threat', label: 'T', subtitle: '威胁', value: threat, cls: 'lp-swot-t' },
  ];

  return (
  <div className="lp-slide lp-swot-v1">
      <div className="lp-swot-header">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-swot-title lp-rise">
          {title}
    </EditableField>
      </div>
      <div className="lp-swot-grid">
    {cells.map((cell) => (
          <div key={cell.key} className={`lp-card lp-swot-cell lp-rise ${cell.cls}`}>
      <div className="lp-swot-label">{cell.label}</div>
      <div className="lp-swot-subtitle">{cell.subtitle}</div>
      <EditableField
              prop={cell.key}
              slideIdx={_slideIdx}
              editable={_editable}
              as="p"
      >
              {cell.value || cell.subtitle}
      </EditableField>
          </div>
    ))}
      </div>
  </div>
  );
}
