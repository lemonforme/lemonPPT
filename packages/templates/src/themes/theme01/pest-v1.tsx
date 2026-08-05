// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

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
  description: '玻璃质感 2x2 PEST 宏观环境分析矩阵',
  needsMedia: false,
};

export const theme01PestV1Schema: PropsSchema = {
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
      key: 'political',
      label: 'political',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'economic',
      label: 'economic',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'social',
      label: 'social',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'technological',
      label: 'technological',
      type: 'text',
      inlineEditable: true
  }
  ]
};


export function Theme01PestV1(props: Theme01PestV1Props): ReactNode {
  const { title, kicker, political, economic, social, technological, _slideIdx, _editable } = props;

  const cells = [
  { key: 'political', label: 'P', subtitle: '政治环境', value: political, cls: 'lp-pest-p' },
  { key: 'economic', label: 'E', subtitle: '经济环境', value: economic, cls: 'lp-pest-e' },
  { key: 'social', label: 'S', subtitle: '社会环境', value: social, cls: 'lp-pest-s' },
  { key: 'technological', label: 'T', subtitle: '技术环境', value: technological, cls: 'lp-pest-t' },
  ];

  return (
  <div className="lp-slide lp-pest-v1">
      <div className="lp-pest-header">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-pest-title lp-rise">
          {title}
    </EditableField>
      </div>
      <div className="lp-pest-grid">
    {cells.map((cell) => (
          <div key={cell.key} className={`lp-card lp-pest-cell lp-rise ${cell.cls}`}>
      <div className="lp-pest-label">{cell.label}</div>
      <div className="lp-pest-subtitle">{cell.subtitle}</div>
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
