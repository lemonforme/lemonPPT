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
  HighlightBlock,
  Pill,
  Plus,
  Ring,
  Sheet,
  Slash,
} from './shared.js';

export interface Theme01MetricV1Props {
  kicker?: string;
  value?: string;
  unit?: string;
  description?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01MetricV1Meta: LayoutMeta = {
  id: 'theme01_metric_v1',
  theme: 'theme01',
  role: 'metric',
  displayName: 'Theme 01 数据页',
  description: '超大数字 + 简洁说明',
  needsMedia: false,
};

export const theme01MetricV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'value', label: '数值', type: 'text', inlineEditable: true },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
    { key: 'description', label: '说明', type: 'textarea', inlineEditable: true },
  ],
};

export function Theme01MetricV1(props: Theme01MetricV1Props): ReactNode {
  const { kicker, value = '0', unit = '', description = '', _slideIdx, _editable } = props;

  return (
    <Sheet substrate="tint" tint="amber" frame="stage" className="lp-metric-v1">
      <Blob
        className="lp-metric-v1-blob"
        style={{ width: 420, height: 420, top: -160, left: -120, background: 'var(--lp-amber)', opacity: 0.14 }}
      />
      <DottedPattern
        className="lp-metric-v1-dots"
        style={{ bottom: 100, right: 90, width: 260, height: 260, opacity: 0.22 }}
      />
      <Slash
        className="lp-metric-v1-slash"
        style={{ top: 130, right: 120, height: 80, background: 'var(--lp-green)', opacity: 0.45 }}
      />
      <Ring
        className="lp-metric-v1-ring"
        style={{ width: 160, height: 160, bottom: 120, left: 100, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-metric-v1-plus"
        style={{ top: 150, left: 130, width: 32, height: 32, color: 'var(--lp-red)' }}
      />

      <div className="lp-metric-v1-content lp-rise">
        <div className="lp-metric-v1-kicker">
          <Pill variant="fill" color="amber">{kicker || 'KEY METRIC'}</Pill>
        </div>

        <div className="lp-metric-v1-figure">
          <EditableField
            prop="value"
            slideIdx={_slideIdx}
            editable={_editable}
            as="span"
            className="lp-metric-v1-value"
          >
            {value}
          </EditableField>
          {unit && (
            <EditableField
              prop="unit"
              slideIdx={_slideIdx}
              editable={_editable}
              as="span"
              className="lp-metric-v1-unit"
            >
              {unit}
            </EditableField>
          )}
        </div>

        {description && (
          <HighlightBlock color="amber" className="lp-metric-v1-description lp-rise">
            <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p">
              {description}
            </EditableField>
          </HighlightBlock>
        )}
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
