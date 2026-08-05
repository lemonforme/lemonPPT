// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01StatsV1Props {
  kicker?: string;
  title?: string;
  stats?: Array<{ value?: string; unit?: string; label?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01StatsV1Meta: LayoutMeta = {
  id: 'theme01_stats_v1',
  theme: 'theme01',
  role: 'stats',
  displayName: 'Theme 01 多指标页',
  description: '玻璃卡片多指标数据展示',
  needsMedia: false,
};

export const theme01StatsV1Schema: PropsSchema = {
  fields: [
  {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'stats',
      label: '统计数据',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
    {
          key: 'value',
          label: '数值',
          type: 'number',
          inlineEditable: true
    },
    {
          key: 'unit',
          label: '单位',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'label',
          label: '名称',
          type: 'text',
          inlineEditable: true
    }
      ]
  }
  ]
};


export function Theme01StatsV1(props: Theme01StatsV1Props): ReactNode {
  const { kicker, title, stats = [], _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-stats-v1">
      <div className="lp-stats-header">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-stats-title lp-rise">
          {title}
    </EditableField>
      </div>
      <div className="lp-stats-grid">
    {stats.map((stat, index) => (
          <div key={index} className="lp-card lp-stats-card lp-rise">
      <div className="lp-stats-value">
              <EditableField prop={`stats.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span">
        {stat.value}
              </EditableField>
              {stat.unit && (
        <EditableField prop={`stats.${index}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-stats-unit">
                  {stat.unit}
        </EditableField>
              )}
      </div>
      <EditableField prop={`stats.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-stats-label">
              {stat.label}
      </EditableField>
          </div>
    ))}
      </div>
  </div>
  );
}
