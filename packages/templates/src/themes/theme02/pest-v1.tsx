// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02PestV1Props {
  title: string;
  kicker?: string;
  subtitle?: string;
  political?: string;
  economic?: string;
  social?: string;
  technological?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02PestV1Meta: LayoutMeta = {
  id: 'theme02_pest_v1',
  theme: 'theme02',
  role: 'pest',
  displayName: 'Theme 02 霓虹 PEST',
  description: '深色背景 + 霓虹 2x2 PEST 宏观环境矩阵',
  needsMedia: false,
};

export const theme02PestV1Schema: PropsSchema = {
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
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'political',
      label: '政治环境',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'economic',
      label: '经济环境',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'social',
      label: '社会环境',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'technological',
      label: '技术环境',
      type: 'textarea',
      inlineEditable: true,
    },
  ],
};

export function Theme02PestV1(props: Theme02PestV1Props): ReactNode {
  const { title, kicker, subtitle, political, economic, social, technological, _slideIdx, _editable } = props;

  const cells = [
    { key: 'political', label: 'P', subtitle: '政治环境', value: political, cls: 'lp-theme02-pest-p' },
    { key: 'economic', label: 'E', subtitle: '经济环境', value: economic, cls: 'lp-theme02-pest-e' },
    { key: 'social', label: 'S', subtitle: '社会环境', value: social, cls: 'lp-theme02-pest-s' },
    { key: 'technological', label: 'T', subtitle: '技术环境', value: technological, cls: 'lp-theme02-pest-t' },
  ];

  return (
    <div className="lp-slide lp-theme02-pest-v1">
      <div className="lp-theme02-pest-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-pest-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-pest-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme02-pest-grid">
        {cells.map((cell, index) => (
          <div key={cell.key} className={`lp-theme02-pest-cell lp-rise ${cell.cls}`} style={{ animationDelay: `${index * 100}ms` }}>
            <div className="lp-theme02-pest-label-group">
              <div className="lp-theme02-pest-label">{cell.label}</div>
              <div className="lp-theme02-pest-label-subtitle">{cell.subtitle}</div>
            </div>
            <EditableField prop={cell.key} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-pest-value">
              {cell.value || cell.subtitle}
            </EditableField>
          </div>
        ))}
      </div>
    </div>
  );
}
