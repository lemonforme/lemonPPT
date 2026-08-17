// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ComparisonV2Column {
  title: string;
  points?: string[];
}

export interface Theme02ComparisonV2Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  columns?: Theme02ComparisonV2Column[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ComparisonV2Meta: LayoutMeta = {
  id: 'theme02_comparison_v2',
  theme: 'theme02',
  role: 'comparison',
  displayName: 'Theme 02 双栏对比',
  description: '左右两栏对照，每栏带要点列表',
  needsMedia: false,
};

export const theme02ComparisonV2Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'columns',
      label: '对比栏',
      type: 'array',
      minItems: 0,
      maxItems: 2,
      itemSchema: [
        { key: 'title', label: '栏标题', type: 'text', inlineEditable: true },
        { key: 'points', label: '要点', type: 'array', maxItems: 6, itemSchema: [{ key: 'item', label: '要点', type: 'text', inlineEditable: true }] },
      ],
    },
  ],
};

export function Theme02ComparisonV2(props: Theme02ComparisonV2Props): ReactNode {
  const { kicker, title, subtitle, columns = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-comparison-v2">
      <div className="lp-card lp-theme02-comparison-card lp-rise">
        <div className="lp-theme02-comparison-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-comparison-title">
            {title}
          </EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-comparison-subtitle">
              {subtitle}
            </EditableField>
          )}
        </div>
        <div className="lp-theme02-comparison-cols">
          {columns.map((col, ci) => (
            <div key={ci} className={`lp-theme02-comparison-col lp-theme02-comparison-col--${ci === 0 ? 'left' : 'right'} lp-rise`} style={{ animationDelay: `${ci * 80}ms` }}>
              <EditableField prop={`columns.${ci}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme02-comparison-col-title">
                {col.title}
              </EditableField>
              <ul className="lp-theme02-comparison-points">
                {(col.points || []).map((p, pi) => (
                  <li key={pi}>
                    <EditableField prop={`columns.${ci}.points.${pi}`} slideIdx={_slideIdx} editable={_editable} as="span">
                      {p}
                    </EditableField>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
