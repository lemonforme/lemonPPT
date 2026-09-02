// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
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

export interface Theme01ChartDonutSegment {
  label?: string;
  labelEn?: string;
  value?: string;
  percent?: string;
  color?: string;
}

export interface Theme01ChartDonutTotal {
  value?: string;
  label?: string;
}

export interface Theme01ChartDonutProps {
  title?: string;
  kicker?: string;
  subtitle?: string;
  total?: Theme01ChartDonutTotal;
  segments?: Theme01ChartDonutSegment[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ChartDonutMeta: LayoutMeta = {
  id: 'theme01_chart_donut',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 环形图拆解',
  description: '环形图 + 中心合计 + 右侧分类解读',
  needsMedia: false,
};

const DEFAULT_COLORS = [
  'var(--lp-blue)',
  'var(--lp-green)',
  'var(--lp-amber)',
  'var(--lp-red)',
  'var(--lp-violet)',
];

export const theme01ChartDonutSchema: PropsSchema = {
  fields: [
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'total',
      label: '合计',
      type: 'object',
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '说明', type: 'text' },
      ],
    },
    {
      key: 'segments',
      label: '分类数据',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'labelEn', label: '英文名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'percent', label: '百分比', type: 'text' },
      ],
    },
    {
      key: 'footnote',
      label: '脚注',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

const CHART_SIZE = 360;
const STROKE_WIDTH = 52;
const CENTER = CHART_SIZE / 2;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function donutChart(segments: Theme01ChartDonutSegment[]): ReactElement {
  const total = segments.reduce((sum, s) => {
    const n = parseFloat(String(s.value || '0').replace(/,/g, ''));
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0) || 1;
  let offset = 0;

  return (
    <svg viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`} className="lp-chart-donut-svg">
      <defs>
        <filter id="lp-donut-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.12)" floodOpacity="1" />
        </filter>
      </defs>
      <g filter="url(#lp-donut-shadow)">
        {segments.map((segment, index) => {
          const n = parseFloat(String(segment.value || '0').replace(/,/g, ''));
          const ratio = n / total;
          const dash = ratio * CIRCUMFERENCE;
          const gap = CIRCUMFERENCE - dash;
          const color = segment.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
          const ring = (
            <circle
              key={`ring-${index}`}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={color}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="lp-chart-donut-ring"
              style={{ animationDelay: `${index * 90}ms` }}
            />
          );
          offset += dash;
          return ring;
        })}
      </g>
    </svg>
  );
}

export function Theme01ChartDonut(props: Theme01ChartDonutProps): ReactNode {
  const {
    title,
    kicker,
    subtitle,
    total = { value: '0', label: '合计' },
    segments = [],
    footnote,
    _slideIdx,
    _editable,
  } = props;

  const validSegments = (segments || [])
    .filter((s): s is Theme01ChartDonutSegment => s != null && !!(s.label || s.value))
    .map((s) => ({ ...s }))
    .sort((a, b) => {
      const na = parseFloat(String(a.value || '0').replace(/,/g, ''));
      const nb = parseFloat(String(b.value || '0').replace(/,/g, ''));
      return nb - na;
    });

  const totalValue = validSegments.reduce((sum, s) => {
    return sum + parseFloat(String(s.value || '0').replace(/,/g, ''));
  }, 0);

  validSegments.forEach((s) => {
    if (!s.percent) {
      const n = parseFloat(String(s.value || '0').replace(/,/g, ''));
      const pct = totalValue > 0 ? Math.round((n / totalValue) * 1000) / 10 : 0;
      s.percent = `${pct}%`;
    }
  });

  return (
    <Sheet substrate="tint" tint="pink" frame="chart-canvas" className="lp-chart-donut">
      <Blob
        className="lp-chart-donut-blob"
        style={{ width: 400, height: 400, top: -150, right: -120, background: 'var(--lp-pink)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-chart-donut-dots"
        style={{ bottom: 100, left: 80, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-chart-donut-slash"
        style={{ top: 130, right: 100, height: 70, background: 'var(--lp-amber)', opacity: 0.45 }}
      />
      <Ring
        className="lp-chart-donut-ring-deco"
        style={{ bottom: 130, left: 100, width: 64, height: 64, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-chart-donut-plus"
        style={{ top: 140, right: 120, width: 28, height: 28, color: 'var(--lp-red)' }}
      />

      <div className="lp-chart-donut-header lp-rise">
        {kicker && (
          <div className="lp-chart-kicker">
            <Pill variant="fill" color="pink">{kicker}</Pill>
          </div>
        )}
        <Headline
          cn={title || '构成分析'}
          en={subtitle}
          size="large"
          slideIdx={_slideIdx}
          editable={_editable}
          propCn="title"
          propEn="subtitle"
          className="lp-chart-headline"
        />
      </div>

      <div className="lp-chart-donut-body lp-rise">
        <div className="lp-chart-donut-chart">
          {donutChart(validSegments)}
          <div className="lp-chart-donut-center">
            <EditableField prop="total.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-chart-donut-total-value">
              {total.value}
            </EditableField>
            <EditableField prop="total.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-chart-donut-total-label">
              {total.label}
            </EditableField>
          </div>
        </div>

        <div className="lp-chart-donut-legend">
          {validSegments.map((segment, index) => (
            <div key={index} className="lp-chart-donut-legend-item lp-rise" style={{ animationDelay: `${index * 60}ms` }}>
              <span
                className="lp-chart-donut-legend-dot"
                style={{ backgroundColor: segment.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length] }}
              />
              <div className="lp-chart-donut-legend-text">
                <EditableField prop={`segments.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-chart-donut-legend-label">
                  {segment.label}
                </EditableField>
                {segment.labelEn && (
                  <EditableField prop={`segments.${index}.labelEn`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-chart-donut-legend-en">
                    {segment.labelEn}
                  </EditableField>
                )}
              </div>
              <div className="lp-chart-donut-legend-numbers">
                <EditableField prop={`segments.${index}.percent`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-chart-donut-legend-percent">
                  {segment.percent}
                </EditableField>
                <EditableField prop={`segments.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-chart-donut-legend-value">
                  {segment.value}
                </EditableField>
              </div>
            </div>
          ))}
        </div>
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-chart-donut-footnote lp-rise">
          {footnote}
        </EditableField>
      )}

      <Folio
        left="CHART"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
