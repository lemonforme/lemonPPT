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

export interface Theme01MetricBigCard {
  value?: string;
  label?: string;
  accent?: boolean;
}

export interface Theme01MetricBigProps {
  title?: string;
  subtitle?: string;
  kicker?: string;
  value?: string;
  unit?: string;
  context?: string;
  metrics?: Theme01MetricBigCard[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01MetricBigMeta: LayoutMeta = {
  id: 'theme01_metric_big',
  theme: 'theme01',
  role: 'metric',
  displayName: 'Theme 01 大数字页',
  description: '核心指标 + 上下文 + 底部指标卡',
  needsMedia: false,
};

export const theme01MetricBigSchema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'value', label: '主数值', type: 'text', inlineEditable: true },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
    { key: 'context', label: '上下文说明', type: 'text', inlineEditable: true },
    {
      key: 'metrics',
      label: '底部指标卡',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '名称', type: 'text' },
        { key: 'accent', label: '强调', type: 'boolean', defaultValue: false },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true },
  ],
};

const METRIC_COLORS = ['blue', 'green', 'amber', 'red', 'violet', 'cyan'] as const;

export function Theme01MetricBig(props: Theme01MetricBigProps): ReactNode {
  const {
    title,
    subtitle,
    kicker,
    value = '0',
    unit = '',
    context = '',
    metrics = [],
    footnote,
    _slideIdx,
    _editable,
  } = props;

  const safeMetrics = (metrics || []).filter((m) => m != null && (m.value || m.label));

  return (
    <Sheet substrate="tint" tint="pink" frame="stage" className="lp-metric-big">
      <Blob
        className="lp-metric-big-blob"
        style={{ width: 420, height: 420, top: -140, left: -120, background: 'var(--lp-amber)', opacity: 0.13 }}
      />
      <DottedPattern
        className="lp-metric-big-dots"
        style={{ bottom: 120, right: 90, width: 240, height: 240, opacity: 0.2 }}
      />
      <Slash
        className="lp-metric-big-slash"
        style={{ top: 130, right: 120, height: 80, background: 'var(--lp-green)', opacity: 0.45 }}
      />
      <Ring
        className="lp-metric-big-ring"
        style={{ bottom: 130, left: 110, width: 72, height: 72, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-metric-big-plus"
        style={{ top: 140, left: 120, width: 30, height: 30, color: 'var(--lp-red)' }}
      />

      <div className="lp-metric-big-header lp-rise">
        {kicker && (
          <div className="lp-metric-big-kicker">
            <Pill variant="fill" color="red">{kicker}</Pill>
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
          className="lp-metric-big-headline"
        />
      </div>

      <div className="lp-metric-big-body lp-rise">
        <div className="lp-metric-big-value-wrap">
          <EditableField
            prop="value"
            slideIdx={_slideIdx}
            editable={_editable}
            as="span"
            className="lp-metric-big-value"
          >
            {value}
          </EditableField>
          {unit && (
            <EditableField
              prop="unit"
              slideIdx={_slideIdx}
              editable={_editable}
              as="span"
              className="lp-metric-big-unit"
            >
              {unit}
            </EditableField>
          )}
        </div>
        {context && (
          <EditableField
            prop="context"
            slideIdx={_slideIdx}
            editable={_editable}
            as="p"
            className="lp-metric-big-context"
          >
            {context}
          </EditableField>
        )}
      </div>

      {safeMetrics.length > 0 && (
        <div className="lp-metric-big-metrics lp-rise">
          {safeMetrics.map((metric, index) => {
            const color = METRIC_COLORS[index % METRIC_COLORS.length];
            return (
              <div
                key={index}
                className={`lp-metric-big-metric color-${color} ${metric.accent ? 'lp-metric-big-metric--accent' : ''}`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <EditableField
                  prop={`metrics.${index}.value`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-metric-big-metric-value"
                >
                  {metric.value}
                </EditableField>
                <EditableField
                  prop={`metrics.${index}.label`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-metric-big-metric-label"
                >
                  {metric.label}
                </EditableField>
              </div>
            );
          })}
        </div>
      )}

      {footnote && (
        <EditableField
          prop="footnote"
          slideIdx={_slideIdx}
          editable={_editable}
          as="div"
          className="lp-metric-big-footnote lp-rise"
        >
          {footnote}
        </EditableField>
      )}

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
