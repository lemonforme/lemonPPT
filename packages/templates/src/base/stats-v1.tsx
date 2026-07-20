// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface StatsV1Props {
  kicker?: string;
  title: string;
  stats?: { label?: string; value?: string; unit?: string; change?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const statsV1Meta: LayoutMeta = {
  id: 'stats_v1',
  theme: 'base',
  role: 'stats',
  displayName: '关键指标网格',
  description: '2x2 指标卡片，适合数据概览页',
  needsMedia: false,
};

export function StatsV1(props: StatsV1Props): ReactNode {
  const { kicker, title, stats = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-stats-v1">
      <div className="lp-stats-v1-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-stats-v1-grid">
        {stats.map((stat, index) => (
          <div key={index} className="lp-stats-v1-card">
            <EditableField
              prop={`stats.${index}.label`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-stats-v1-label"
            >
              {stat.label}
            </EditableField>
            <div className="lp-stats-v1-value-row">
              <EditableField
                prop={`stats.${index}.value`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="span"
                className="lp-stats-v1-value"
              >
                {stat.value}
              </EditableField>
              {stat.unit && (
                <EditableField
                  prop={`stats.${index}.unit`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="span"
                  className="lp-stats-v1-unit"
                >
                  {stat.unit}
                </EditableField>
              )}
            </div>
            {stat.change && (
              <EditableField
                prop={`stats.${index}.change`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-stats-v1-change"
              >
                {stat.change}
              </EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
