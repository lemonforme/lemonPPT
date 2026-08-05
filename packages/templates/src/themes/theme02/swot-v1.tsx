// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02SwotV1Props {
  title: string;
  kicker?: string;
  subtitle?: string;
  strength?: string;
  weakness?: string;
  opportunity?: string;
  threat?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02SwotV1Meta: LayoutMeta = {
  id: 'theme02_swot_v1',
  theme: 'theme02',
  role: 'swot',
  displayName: 'Theme 02 霓虹 SWOT',
  description: '深色背景 + 霓虹四象限 SWOT 分析矩阵',
  needsMedia: false,
};

export const theme02SwotV1Schema: PropsSchema = {
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
      key: 'strength',
      label: '优势',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'weakness',
      label: '劣势',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'opportunity',
      label: '机会',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'threat',
      label: '威胁',
      type: 'textarea',
      inlineEditable: true,
    },
  ],
};

export function Theme02SwotV1(props: Theme02SwotV1Props): ReactNode {
  const { title, kicker, subtitle, strength, weakness, opportunity, threat, _slideIdx, _editable } = props;

  const cells = [
    { key: 'strength', label: 'S', subtitle: '优势', value: strength, cls: 'lp-theme02-swot-s' },
    { key: 'weakness', label: 'W', subtitle: '劣势', value: weakness, cls: 'lp-theme02-swot-w' },
    { key: 'opportunity', label: 'O', subtitle: '机会', value: opportunity, cls: 'lp-theme02-swot-o' },
    { key: 'threat', label: 'T', subtitle: '威胁', value: threat, cls: 'lp-theme02-swot-t' },
  ];

  return (
    <div className="lp-slide lp-theme02-swot-v1">
      <div className="lp-theme02-swot-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-swot-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-swot-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme02-swot-grid">
        {cells.map((cell, index) => (
          <div key={cell.key} className={`lp-theme02-swot-cell lp-rise ${cell.cls}`} style={{ animationDelay: `${index * 100}ms` }}>
            <div className="lp-theme02-swot-label-group">
              <div className="lp-theme02-swot-label">{cell.label}</div>
              <div className="lp-theme02-swot-label-subtitle">{cell.subtitle}</div>
            </div>
            <EditableField prop={cell.key} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-swot-value">
              {cell.value || cell.subtitle}
            </EditableField>
          </div>
        ))}
      </div>
    </div>
  );
}
