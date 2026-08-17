// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02StatGridV1Stat {
  value: string;
  unit?: string;
  label?: string;
  delta?: string;
}

export interface Theme02StatGridV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  stats?: Theme02StatGridV1Stat[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02StatGridV1Meta: LayoutMeta = {
  id: 'theme02_stat_grid_v1',
  theme: 'theme02',
  role: 'stats',
  displayName: 'Theme 02 指标网格',
  description: '数字指标卡片网格，含数值 / 单位 / 标签 / 涨跌',
  needsMedia: false,
};

export const theme02StatGridV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'stats',
      label: '指标',
      type: 'array',
      minItems: 0,
      maxItems: 8,
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'delta', label: '涨跌', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme02StatGridV1(props: Theme02StatGridV1Props): ReactNode {
  const { kicker, title, subtitle, stats = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-stat-grid-v1">
      <div className="lp-card lp-theme02-stat-grid-card lp-rise">
        <div className="lp-theme02-stat-grid-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-stat-grid-title">
            {title}
          </EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-stat-grid-subtitle">
              {subtitle}
            </EditableField>
          )}
        </div>
        <div className="lp-theme02-stat-grid-items">
          {stats.map((s, i) => (
            <div key={i} className="lp-theme02-stat-grid-item lp-rise" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="lp-theme02-stat-grid-value">
                <EditableField prop={`stats.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {s.value}
                </EditableField>
                {s.unit && <EditableField prop={`stats.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-stat-grid-unit">{s.unit}</EditableField>}
              </div>
              {s.label && (
                <EditableField prop={`stats.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-stat-grid-label">
                  {s.label}
                </EditableField>
              )}
              {s.delta && (
                <EditableField prop={`stats.${i}.delta`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-stat-grid-delta">
                  {s.delta}
                </EditableField>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
