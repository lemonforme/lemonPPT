// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Legend, t9Emphasis } from './chart-utils.js';

export interface Theme09ParallelProfile {
  name?: string;
  values?: string;
}

export interface Theme09ParallelV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  dimensions?: string[];
  profiles?: Theme09ParallelProfile[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ParallelV1Meta: LayoutMeta = {
  id: 'theme09_parallel_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '平行坐标',
  description: '平行坐标多维画像，专色折线穿轴，首个对象朱砂加粗，纸底',
  needsMedia: false,
  tags: ['chart', 'parallel', 'multi-dimension', 'profile'],
  contentShape: 'parallel',
};

export const theme09ParallelV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '多维画像' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'PARALLEL' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '47' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '画像' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '同一张坐标上，{{新锐挑战者}} 的折线最陡' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '五条纵轴分别为增长、规模、效率、口碑与壁垒，均归一到 0–100。' },
    { key: 'dimensions', label: '维度名称', type: 'array', inlineEditable: true, defaultValue: ['增长', '规模', '效率', '口碑', '壁垒'] },
    {
      key: 'profiles',
      label: '对象画像',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '对象名', type: 'text' },
        { key: 'values', label: '各维数值（用 | 分隔）', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_DIMENSIONS = ['增长', '规模', '效率', '口碑', '壁垒'];

const DEFAULT_PROFILES: Theme09ParallelProfile[] = [
  { name: '新锐挑战者', values: '92|48|76|66|44' },
  { name: '甲方阵营', values: '68|88|62|78|72' },
  { name: '区域龙头', values: '64|74|58|72|70' },
  { name: '跨界玩家', values: '58|56|82|54|48' },
  { name: '垂直厂商', values: '46|38|66|82|58' },
];

function buildOption(dimensions: string[], profiles: Theme09ParallelProfile[]): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const dims = dimensions.length ? dimensions : DEFAULT_DIMENSIONS;
  const list = profiles.length ? profiles : DEFAULT_PROFILES;

  const rows = list.map((p) =>
    String(p.values ?? '')
      .split('|')
      .map((v) => t9ParseNumber(v)),
  );

  const dimMax = dims.map((_d, di) => {
    const col = rows.map((r) => r[di] ?? 0);
    return Math.max(Math.ceil(Math.max(...col, 1) / 10) * 10, 10);
  });

  return {
    legend: t9Legend(c, {
      top: 0,
      left: 0,
      right: 'auto',
      itemGap: 16,
      data: list.map((p) => p.name ?? ''),
    }),
    parallel: {
      left: 52,
      right: 52,
      top: 54,
      bottom: 26,
      parallelAxisDefault: {
        type: 'value',
        min: 0,
        nameLocation: 'end',
        nameGap: 14,
        nameTextStyle: { color: c.ink2, fontFamily: c.font, fontSize: 12, fontWeight: 600 },
        axisLine: { lineStyle: { color: c.rule, width: 1 } },
        axisTick: { lineStyle: { color: c.rule } },
        axisLabel: { color: c.ink3, fontFamily: c.fontMono, fontSize: 10 },
        splitLine: { show: false },
      },
    },
    parallelAxis: dims.map((d, i) => ({
      dim: i,
      name: d,
      type: 'value',
      min: 0,
      max: dimMax[i],
    })),
    series: list.map((p, i) => ({
      name: p.name ?? '',
      type: 'parallel',
      coordinateSystem: 'parallel',
      smooth: false,
      data: [rows[i] ?? []],
      lineStyle: {
        color: i === 0 ? c.accent : c.series[(i + 1) % c.series.length],
        width: i === 0 ? 2.4 : 1.8,
        opacity: 1,
      },
      emphasis: t9Emphasis(c, { lineStyle: { width: 3.2 } }),
      symbol: 'circle',
      symbolSize: 5,
      z: i === 0 ? 6 : 2,
    })),
  };
}

export function Theme09ParallelV1(props: Theme09ParallelV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    dimensions = [],
    profiles = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-parallel">
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
            className="lp-theme09-parallel-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="custom" option={buildOption(dimensions, profiles)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
