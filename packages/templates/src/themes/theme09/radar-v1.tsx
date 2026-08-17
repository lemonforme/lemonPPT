// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Rgba, t9Tooltip, t9Legend, t9RadarAreaStyle, t9Emphasis } from './chart-utils.js';

export interface Theme09RadarIndicator {
  name?: string;
  max?: string | number;
}

export interface Theme09RadarV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  indicators?: Theme09RadarIndicator[];
  seriesA?: (string | number)[];
  seriesB?: (string | number)[];
  seriesAName?: string;
  seriesBName?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09RadarV1Meta: LayoutMeta = {
  id: 'theme09_radar_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '多维雷达',
  description: '六维雷达图，双序列对照，朱砂与青碧叠印，墨底',
  needsMedia: false,
  tags: ['chart', 'radar', 'compare', 'capability'],
  contentShape: 'radar-compare',
};

export const theme09RadarV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '能力画像' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'RADAR' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '26' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '多维' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '六个维度里，我们赢在{{工程化}}' },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '满分 100 的六维能力评估，实线为本方，虚面为行业均值。',
    },
    {
      key: 'indicators',
      label: '维度',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '维度名', type: 'text' },
        { key: 'max', label: '满分值', type: 'number' },
      ],
    },
    { key: 'seriesA', label: '序列 A 数值', type: 'array' },
    { key: 'seriesB', label: '序列 B 数值', type: 'array' },
    { key: 'seriesAName', label: '序列 A 名称', type: 'text', inlineEditable: true, defaultValue: '本方能力' },
    { key: 'seriesBName', label: '序列 B 名称', type: 'text', inlineEditable: true, defaultValue: '行业均值' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_INDICATORS: Theme09RadarIndicator[] = [
  { name: '算力', max: 100 },
  { name: '数据', max: 100 },
  { name: '算法', max: 100 },
  { name: '工程化', max: 100 },
  { name: '生态', max: 100 },
  { name: '合规', max: 100 },
];

const DEFAULT_A = [78, 84, 72, 93, 66, 81];
const DEFAULT_B = [62, 70, 68, 55, 74, 63];

function buildOption(
  indicators: Theme09RadarIndicator[],
  seriesA: (string | number)[],
  seriesB: (string | number)[],
  nameA: string,
  nameB: string,
): Record<string, unknown> {
  const c = t9ChartColors('ink');
  const inds = indicators.length ? indicators : DEFAULT_INDICATORS;
  const a = (seriesA.length ? seriesA : DEFAULT_A).map((v) => t9ParseNumber(v));
  const b = (seriesB.length ? seriesB : DEFAULT_B).map((v) => t9ParseNumber(v));
  const colorB = c.series[3 % c.series.length];

  return {
    tooltip: t9Tooltip(c),
    legend: t9Legend(c, { bottom: 0 }),
    radar: {
      center: ['40%', '50%'],
      radius: '42%',
      splitNumber: 4,
      shape: 'polygon',
      indicator: inds.map((i, idx) => ({
        name: i.name ?? `维度 ${idx + 1}`,
        max: t9ParseNumber(i.max) || 100,
      })),
      axisName: { color: c.ink2, fontFamily: c.font, fontSize: 14 },
      axisLine: { lineStyle: { color: t9Rgba(c.ink, 0.16) } },
      splitLine: { lineStyle: { color: t9Rgba(c.ink, 0.12) } },
      splitArea: { areaStyle: { color: [t9Rgba(c.ink, 0.02), 'transparent'] } },
    },
    series: [
      {
        type: 'radar',
        symbolSize: 6,
        emphasis: t9Emphasis(c),
        data: [
          {
            name: nameA,
            value: a,
            ...t9RadarAreaStyle(c.accent, 0.22),
            label: { show: false },
          },
          {
            name: nameB,
            value: b,
            ...t9RadarAreaStyle(colorB, 0.12),
            lineStyle: { ...(t9RadarAreaStyle(colorB).lineStyle as Record<string, unknown>), type: 'dashed' as const, width: 1.8 },
            label: { show: false },
          },
        ],
      },
    ],
  };
}

export function Theme09RadarV1(props: Theme09RadarV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    indicators = [],
    seriesA = [],
    seriesB = [],
    seriesAName,
    seriesBName,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const nameA = seriesAName && seriesAName.trim() ? seriesAName : '本方能力';
  const nameB = seriesBName && seriesBName.trim() ? seriesBName : '行业均值';

  const renderTitle = (t: string): ReactNode => {
    const parts = t.split(/(\{\{[^}]+\}\})/g);
    return (
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme09-chart-title lp-t9-serif">
        {parts.map((part, idx) => {
          const m = part.match(/^\{\{(.+)\}\}$/);
          if (m) return <em key={idx} className="lp-theme09-accent-text">{m[1]}</em>;
          return <span key={idx}>{part}</span>;
        })}
      </EditableField>
    );
  };

  return (
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-radar">
      <T9ChartShell
        slideIdx={_slideIdx}
        editable={_editable}
        footnoteLeft={footnoteLeft}
        footnoteRight={footnoteRight}
        head={
          <T9ChartHeader
            section={section}
            sectionEn={sectionEn}
            mark={mark}
            kicker={kicker}
            slideIdx={_slideIdx}
            editable={_editable}
          />
        }
        body={
          <div
            className="lp-theme09-radar-body"
            style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, gap: '8px' }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart
              type="radar"
              option={buildOption(indicators, seriesA, seriesB, nameA, nameB)}
              className="lp-theme09-chart-area"
            />
          </div>
        }
      />
    </Sheet>
  );
}
