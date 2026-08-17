// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02KpiStripV1Item {
  value?: string;
  unit?: string;
  label?: string;
  delta?: string;
}

export interface Theme02KpiStripV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  items?: Theme02KpiStripV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02KpiStripV1Meta: LayoutMeta = {
  id: 'theme02_kpi_strip_v1',
  theme: 'theme02',
  role: 'stats',
  displayName: 'Theme 02 KPI 条',
  description: '横向指标卡片条',
  needsMedia: false,
};

export const theme02KpiStripV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    {
      key: 'items',
      label: '指标',
      type: 'array',
      maxItems: 5,
      minItems: 1,
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'label', label: '名称', type: 'text', inlineEditable: true },
        { key: 'delta', label: '变化', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme02KpiStripV1(props: Theme02KpiStripV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], _slideIdx, _editable } = props;

  const safeItems = items.filter((it) => it && typeof it === 'object');

  return (
    <div className="lp-slide lp-theme02-kpi-strip-v1">
      <div className="lp-orb lp-theme02-orb--accent" />
      <div className="lp-theme02-kpi-strip-inner">
        <div className="lp-theme02-kpi-strip-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-kpi-strip-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-kpi-strip-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>
        <div className="lp-theme02-kpi-strip-row">
          {safeItems.map((item, i) => (
            <div key={i} className="lp-theme02-kpi-strip-card">
              <div className="lp-theme02-kpi-strip-value">
                <EditableField prop={`items.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-kpi-strip-value-num">
                  {item.value}
                </EditableField>
                {item.unit && (
                  <EditableField prop={`items.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-kpi-strip-value-unit">
                    {item.unit}
                  </EditableField>
                )}
              </div>
              {item.delta && (
                <EditableField prop={`items.${i}.delta`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-kpi-strip-delta">
                  {item.delta}
                </EditableField>
              )}
              {item.label && (
                <EditableField prop={`items.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-kpi-strip-label">
                  {item.label}
                </EditableField>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
