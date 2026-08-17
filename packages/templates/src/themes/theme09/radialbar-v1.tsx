// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9FormatNumber } from './chart-utils.js';

export interface Theme09RadialItem {
  name?: string;
  value?: string | number;
}

export interface Theme09RadialbarV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  items?: Theme09RadialItem[];
  centerTotal?: string;
  centerLabel?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09RadialbarV1Meta: LayoutMeta = {
  id: 'theme09_radialbar_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '径向条',
  description: '径向条形图（SVG 扇区），圆心挂汇总数，首项朱砂，墨底',
  needsMedia: false,
  tags: ['chart', 'radial', 'bar', 'svg'],
  contentShape: 'radial-bar',
};

export const theme09RadialbarV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '结构占比' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'RADIAL BAR' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '22' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '径向' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '六条业务线，{{一条}}独大' },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '半径长度代表全年收入贡献，圆心为合计值。',
    },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
      ],
    },
    { key: 'centerTotal', label: '圆心汇总数', type: 'text', inlineEditable: true, defaultValue: '486' },
    { key: 'centerLabel', label: '圆心说明', type: 'text', inlineEditable: true, defaultValue: '合计（亿元）' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_ITEMS: Theme09RadialItem[] = [
  { name: '智能云', value: 168 },
  { name: '大模型服务', value: 122 },
  { name: '行业解决方案', value: 78 },
  { name: '终端硬件', value: 54 },
  { name: '数据服务', value: 38 },
  { name: '其他', value: 26 },
];

const DEFAULT_TOTAL = '486';
const DEFAULT_CENTER_LABEL = '合计（亿元）';

const CX = 300;
const CY = 232;
const R_MAX = 176;
const R_IN = R_MAX * 0.3;

function pt(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
}

function sectorPath(rIn: number, rOut: number, deg0: number, deg1: number): string {
  const [x0o, y0o] = pt(CX, CY, rOut, deg0);
  const [x1o, y1o] = pt(CX, CY, rOut, deg1);
  const [x1i, y1i] = pt(CX, CY, rIn, deg1);
  const [x0i, y0i] = pt(CX, CY, rIn, deg0);
  const large = Math.abs(deg1 - deg0) > 180 ? 1 : 0;
  return [
    `M ${x0o.toFixed(2)} ${y0o.toFixed(2)}`,
    `A ${rOut} ${rOut} 0 ${large} 1 ${x1o.toFixed(2)} ${y1o.toFixed(2)}`,
    `L ${x1i.toFixed(2)} ${y1i.toFixed(2)}`,
    `A ${rIn} ${rIn} 0 ${large} 0 ${x0i.toFixed(2)} ${y0i.toFixed(2)}`,
    'Z',
  ].join(' ');
}

export function Theme09RadialbarV1(props: Theme09RadialbarV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    items = [],
    centerTotal,
    centerLabel,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('ink');
  const list = items.length ? items : DEFAULT_ITEMS;
  const vals = list.map((s) => t9ParseNumber(s.value));
  const max = Math.max(...vals, 1);
  const n = list.length || 1;
  const total = centerTotal && centerTotal.trim() ? centerTotal : DEFAULT_TOTAL;
  const cLabel = centerLabel && centerLabel.trim() ? centerLabel : DEFAULT_CENTER_LABEL;

  const gap = (360 / n) * 0.16;
  const half = 360 / n / 2 - gap / 2;

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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-radialbar">
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
            className="lp-theme09-radialbar-body"
            style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, gap: '8px' }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div className="lp-theme09-chart-area">
              <svg className="lp-theme09-chart-svg" viewBox="0 0 600 470" preserveAspectRatio="xMidYMid meet" role="img">
                {list.map((s, i) => {
                  const v = vals[i];
                  const degC = -90 + (i + 0.5) * (360 / n);
                  const a0 = degC + half;
                  const a1 = degC - half;
                  const rOut = R_IN + (R_MAX - R_IN) * (v / max);
                  const fill = i === 0 ? c.accent : c.series[i % c.series.length];
                  const [lx, ly] = pt(CX, CY, R_MAX + 18, degC);
                  const anchor = Math.sin((degC * Math.PI) / 180) > 0.1 ? 'start' : Math.sin((degC * Math.PI) / 180) < -0.1 ? 'end' : 'middle';
                  return (
                    <g key={i}>
                      <path
                        d={sectorPath(R_IN, rOut, a0, a1)}
                        fill={fill}
                        opacity={0.92}
                        stroke={c.surfaceSolid}
                        strokeWidth={1}
                      />
                      <text x={lx} y={ly - 4} textAnchor={anchor} fill={c.ink2} fontSize={13} fontFamily={c.font} fontWeight={600}>
                        {s.name ?? `条目 ${i + 1}`}
                      </text>
                      <text x={lx} y={ly + 13} textAnchor={anchor} fill={c.ink3} fontSize={11} fontFamily={c.fontMono}>
                        {t9FormatNumber(v)}
                      </text>
                    </g>
                  );
                })}
                <text x={CX} y={CY - 6} textAnchor="middle" fill={c.accent} fontSize={42} fontFamily={c.fontHeading} fontWeight={700}>
                  {total}
                </text>
                <text x={CX} y={CY + 18} textAnchor="middle" fill={c.ink3} fontSize={12} fontFamily={c.font}>
                  {cLabel}
                </text>
              </svg>
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
