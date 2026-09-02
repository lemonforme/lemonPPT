// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import {
  Blob,
  DottedPattern,
  Folio,
  Headline,
  Pill,
  Plus,
  Ring,
  Sheet,
  Slash,
} from './shared.js';

export interface Theme01StatsV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
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
  description: '轻量化多指标数据展示',
  needsMedia: false,
};

export const theme01StatsV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    {
      key: 'stats',
      label: '统计数据',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'label', label: '名称', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

const STAT_COLORS = ['blue', 'green', 'amber', 'red', 'violet', 'cyan'] as const;

export function Theme01StatsV1(props: Theme01StatsV1Props): ReactNode {
  const { kicker, title, subtitle, stats = [], _slideIdx, _editable } = props;

  return (
    <Sheet substrate="light" frame="stage" className="lp-stats-v1">
      <Blob
        className="lp-stats-v1-blob"
        style={{ width: 380, height: 380, top: -130, right: -100, background: 'var(--lp-green)', opacity: 0.11 }}
      />
      <DottedPattern
        className="lp-stats-v1-dots"
        style={{ bottom: 110, left: 80, width: 200, height: 200, opacity: 0.2 }}
      />
      <Slash
        className="lp-stats-v1-slash"
        style={{ top: 120, left: 100, height: 70, background: 'var(--lp-amber)', opacity: 0.45 }}
      />
      <Ring
        className="lp-stats-v1-ring"
        style={{ bottom: 120, right: 110, width: 60, height: 60, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-stats-v1-plus"
        style={{ bottom: 110, right: 100, width: 26, height: 26, color: 'var(--lp-red)' }}
      />

      <div className="lp-stats-v1-header lp-rise">
        {kicker && (
          <div className="lp-stats-v1-kicker">
            <Pill variant="fill" color="green">{kicker}</Pill>
          </div>
        )}
        <Headline
          cn={title || '关键数据'}
          en={subtitle}
          size="large"
          slideIdx={_slideIdx}
          editable={_editable}
          propCn="title"
          propEn="subtitle"
          className="lp-stats-v1-headline"
        />
      </div>

      <div className="lp-stats-v1-grid lp-rise">
        {stats.map((stat, index) => {
          const color = STAT_COLORS[index % STAT_COLORS.length];
          return (
            <div key={index} className={`lp-stats-v1-card color-${color}`} style={{ animationDelay: `${index * 70}ms` }}>
              <span className="lp-stats-v1-bar" aria-hidden="true" />
              <div className="lp-stats-v1-value">
                <EditableField prop={`stats.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span">
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
              <EditableField
                prop={`stats.${index}.label`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-stats-v1-label"
              >
                {stat.label}
              </EditableField>
            </div>
          );
        })}
      </div>

      <Folio
        left="STATS"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
