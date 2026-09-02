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
  NumberSticker,
  Pill,
  Plus,
  Ring,
  Sheet,
  Slash,
} from './shared.js';

export interface Theme01MetricV2Item {
  value?: string;
  unit?: string;
  label?: string;
}

export interface Theme01MetricV2Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  metrics?: Theme01MetricV2Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01MetricV2Meta: LayoutMeta = {
  id: 'theme01_metric_v2',
  theme: 'theme01',
  role: 'metric',
  displayName: 'Theme 01 多指标网格',
  description: '细边框指标网格 + 彩色数值',
  needsMedia: false,
};

export const theme01MetricV2Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    {
      key: 'metrics',
      label: '指标',
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

const ACCENT_COLORS = ['red', 'amber', 'green', 'blue', 'violet', 'cyan'] as const;

export function Theme01MetricV2(props: Theme01MetricV2Props): ReactNode {
  const { kicker, title, subtitle, metrics = [], _slideIdx, _editable } = props;
  const safeMetrics = metrics.slice(0, 6);

  return (
    <Sheet substrate="tint" tint="blue" frame="stage" className="lp-metric-v2">
      <Blob
        className="lp-metric-v2-blob"
        style={{ width: 440, height: 440, bottom: -180, right: -140, background: 'var(--lp-blue)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-metric-v2-dots"
        style={{ top: 100, left: 90, width: 240, height: 240, opacity: 0.2 }}
      />
      <Slash
        className="lp-metric-v2-slash"
        style={{ bottom: 140, left: 110, height: 80, background: 'var(--lp-amber)', opacity: 0.45 }}
      />
      <Ring
        className="lp-metric-v2-ring"
        style={{ top: 120, right: 120, width: 72, height: 72, borderColor: 'var(--lp-green)' }}
      />
      <Plus
        className="lp-metric-v2-plus"
        style={{ top: 160, left: 130, width: 28, height: 28, color: 'var(--lp-red)' }}
      />

      <div className="lp-metric-v2-content">
        <div className="lp-metric-v2-header lp-rise">
          {kicker && (
            <div className="lp-metric-v2-kicker">
              <Pill variant="fill" color="blue">{kicker}</Pill>
            </div>
          )}
          <Headline
            cn={title || '核心指标'}
            en={subtitle}
            size="large"
            slideIdx={_slideIdx}
            editable={_editable}
            propCn="title"
            propEn="subtitle"
          />
        </div>

        <div className="lp-metric-v2-grid lp-rise">
          {safeMetrics.map((metric, index) => {
            const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
            return (
              <div key={index} className={`lp-metric-v2-card color-${color} lp-rise`} style={{ animationDelay: `${index * 60}ms` }}>
                <div className="lp-metric-v2-card-top">
                  <NumberSticker value={String(index + 1).padStart(2, '0')} outline />
                </div>
                <div className="lp-metric-v2-card-value">
                  <EditableField
                    prop={`metrics.${index}.value`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                  >
                    {metric.value ?? '0'}
                  </EditableField>
                  {metric.unit && (
                    <EditableField
                      prop={`metrics.${index}.unit`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-metric-v2-card-unit"
                    >
                      {metric.unit}
                    </EditableField>
                  )}
                </div>
                <EditableField
                  prop={`metrics.${index}.label`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-metric-v2-card-label"
                >
                  {metric.label || ''}
                </EditableField>
              </div>
            );
          })}
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
