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
  Pill,
  Plus,
  Ring,
  Sheet,
  Slash,
} from './shared.js';

export interface Theme01MetricV3Props {
  value?: string;
  unit?: string;
  icon?: string;
  description?: string;
  tags?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01MetricV3Meta: LayoutMeta = {
  id: 'theme01_metric_v3',
  theme: 'theme01',
  role: 'metric',
  displayName: 'Theme 01 图标大数字',
  description: '图标徽章 + 大数字 + 说明胶囊',
  needsMedia: false,
};

export const theme01MetricV3Schema: PropsSchema = {
  fields: [
    { key: 'value', label: '数值', type: 'text', inlineEditable: true },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
    { key: 'icon', label: 'icon', type: 'text', inlineEditable: true },
    { key: 'description', label: '说明', type: 'textarea', inlineEditable: true },
  ],
};

const TAG_COLORS = ['red', 'blue', 'green', 'amber', 'violet', 'cyan', 'pink'] as const;

export function Theme01MetricV3(props: Theme01MetricV3Props): ReactNode {
  const { value = '0', unit = '', icon = '01', description = '', tags = [], _slideIdx, _editable } = props;

  return (
    <Sheet substrate="tint" tint="green" frame="stage" className="lp-metric-v3">
      <Blob
        className="lp-metric-v3-blob"
        style={{ width: 420, height: 420, top: -160, right: -120, background: 'var(--lp-green)', opacity: 0.14 }}
      />
      <DottedPattern
        className="lp-metric-v3-dots"
        style={{ bottom: 110, left: 90, width: 240, height: 240, opacity: 0.2 }}
      />
      <Slash
        className="lp-metric-v3-slash"
        style={{ top: 140, left: 110, height: 80, background: 'var(--lp-amber)', opacity: 0.45 }}
      />
      <Ring
        className="lp-metric-v3-ring"
        style={{ width: 160, height: 160, bottom: 120, right: 100, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-metric-v3-plus"
        style={{ bottom: 150, right: 130, width: 32, height: 32, color: 'var(--lp-red)' }}
      />

      <div className="lp-metric-v3-content lp-rise">
        <div className="lp-metric-v3-badge">
          <EditableField prop="icon" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-metric-v3-icon-text">
            {icon}
          </EditableField>
        </div>

        <div className="lp-metric-v3-body">
          <div className="lp-metric-v3-figure">
            <EditableField
              prop="value"
              slideIdx={_slideIdx}
              editable={_editable}
              as="span"
              className="lp-metric-v3-value"
            >
              {value}
            </EditableField>
            {unit && (
              <EditableField
                prop="unit"
                slideIdx={_slideIdx}
                editable={_editable}
                as="span"
                className="lp-metric-v3-unit"
              >
                {unit}
              </EditableField>
            )}
          </div>

          {description && (
            <div className="lp-metric-v3-description">
              <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p">
                {description}
              </EditableField>
            </div>
          )}

          {tags.length > 0 && (
            <div className="lp-metric-v3-tags">
              {tags.map((tag, index) => {
                const color = TAG_COLORS[index % TAG_COLORS.length];
                return (
                  <Pill key={index} variant="outline" color={color}>
                    <EditableField
                      prop={`tags.${index}`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                    >
                      {tag}
                    </EditableField>
                  </Pill>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Folio
        left="METRIC"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
