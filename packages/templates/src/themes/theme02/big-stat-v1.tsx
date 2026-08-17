// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02BigStatV1Props {
  kicker?: string;
  title?: string;
  value?: string;
  unit?: string;
  label?: string;
  footnote?: string;
  delta?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02BigStatV1Meta: LayoutMeta = {
  id: 'theme02_big_stat_v1',
  theme: 'theme02',
  role: 'stats',
  displayName: 'Theme 02 巨型数字',
  description: '单一主数据重点展示',
  needsMedia: false,
};

export const theme02BigStatV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'value', label: '数值', type: 'text', inlineEditable: true },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
    { key: 'label', label: '名称', type: 'text', inlineEditable: true },
    { key: 'delta', label: '变化', type: 'text', inlineEditable: true },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true },
  ],
};

export function Theme02BigStatV1(props: Theme02BigStatV1Props): ReactNode {
  const { kicker, title, value, unit, label, footnote, delta, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-big-stat-v1">
      <div className="lp-orb lp-theme02-orb--accent" />
      <div className="lp-theme02-big-stat-inner">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-theme02-big-stat-pill">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-big-stat-title">
            {title}
          </EditableField>
        )}
        <div className="lp-theme02-big-stat-hero">
          <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-big-stat-value">
            {value}
          </EditableField>
          {unit && (
            <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-big-stat-unit">
              {unit}
            </EditableField>
          )}
        </div>
        <div className="lp-theme02-big-stat-meta">
          {label && (
            <EditableField prop="label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-big-stat-label">
              {label}
            </EditableField>
          )}
          {delta && (
            <EditableField prop="delta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-big-stat-delta">
              {delta}
            </EditableField>
          )}
        </div>
        {footnote && (
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-big-stat-footnote">
            {footnote}
          </EditableField>
        )}
      </div>
    </div>
  );
}
