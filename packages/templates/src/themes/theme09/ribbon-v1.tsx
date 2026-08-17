// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9DataLabel } from './chart-utils.js';

export interface Theme09RibbonSeg {
  name?: string;
  value?: string | number;
}

export interface Theme09RibbonV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  segments?: Theme09RibbonSeg[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09RibbonV1Meta: LayoutMeta = {
  id: 'theme09_ribbon_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '全幅比例带',
  description: '通栏比例带 + 上下双向标注，纸底',
  needsMedia: false,
  tags: ['chart', 'proportion', 'bar'],
  contentShape: 'ribbon',
};

export const theme09RibbonV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '全幅比例带' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'SHARE' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '20' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '占比' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '大模型独吞 {{43%}} 的融资盘子' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按赛道切分的全年融资占比，朱砂为主轴。' },
    {
      key: 'segments',
      label: '比例段（name/value 百分比）',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '百分比', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_SEGMENTS: Theme09RibbonSeg[] = [
  { name: '大模型', value: 43 },
  { name: '算力', value: 21 },
  { name: '应用', value: 19 },
  { name: '数据', value: 11 },
  { name: '其他', value: 6 },
];

function buildOption(segments: Theme09RibbonSeg[]): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const segs = segments.length ? segments : DEFAULT_SEGMENTS;
  const cats = segs.map((s) => s.name ?? '');
  const vals = segs.map((s) => t9ParseNumber(s.value));
  return {
    grid: { top: 30, right: 20, bottom: 30, left: 20, containLabel: false },
    xAxis: { type: 'value', max: 100, show: false },
    yAxis: { type: 'category', data: [''], show: false },
    series: segs.map((_, i) => ({
      type: 'bar',
      stack: 'total',
      barWidth: 46,
      data: [vals[i]],
      itemStyle: { color: c.series[i % c.series.length], borderRadius: 0 },
      label: t9DataLabel(c, 'inside', {
        show: vals[i] >= 6,
        color: i === 0 ? c.onAccent : c.surfaceSolid,
        fontFamily: c.font,
        fontSize: 13,
        fontWeight: 700,
        formatter: `${cats[i]} ${vals[i]}%`,
      }),
    })),
  };
}

export function Theme09RibbonV1(props: Theme09RibbonV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    segments = [],
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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-ribbon">
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
          <div className="lp-theme09-ribbon-body">
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-ribbon-sub">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div className="lp-theme09-ribbon-chart">
              <LpEChart type="bar" option={buildOption(segments)} className="lp-theme09-ribbon-echart" />
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
