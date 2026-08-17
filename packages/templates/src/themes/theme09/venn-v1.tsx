// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Rgba } from './chart-utils.js';

export interface Theme09VennSet {
  label?: string;
  caption?: string;
  cx?: string | number;
  cy?: string | number;
  r?: string | number;
  color?: string;
}

export interface Theme09VennV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  sets?: Theme09VennSet[];
  centerLabel?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09VennV1Meta: LayoutMeta = {
  id: 'theme09_venn_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '交集视图',
  description: '三圆交集，交叠处专色叠印，纯 SVG 绘制，纸底',
  needsMedia: false,
  tags: ['chart', 'venn', 'overlap', 'set'],
  contentShape: 'venn',
};

export const theme09VennV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '交集视图' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'INTERSECTION' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '25' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '交叠' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三重能力的 {{交汇地带}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '叠印越深，代表该区域同时具备的能力维度越多。' },
    {
      key: 'sets',
      label: '集合',
      type: 'array',
      itemSchema: [
        { key: 'label', label: '集合名称', type: 'text' },
        { key: 'caption', label: '说明', type: 'text' },
        { key: 'cx', label: '圆心 X', type: 'number' },
        { key: 'cy', label: '圆心 Y', type: 'number' },
        { key: 'r', label: '半径', type: 'number' },
        { key: 'color', label: '颜色（可留空）', type: 'color' },
      ],
    },
    { key: 'centerLabel', label: '中心交集标注', type: 'text', inlineEditable: true, defaultValue: '全栈自研' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const VB_W = 900;
const VB_H = 400;

const DEFAULT_SETS: Theme09VennSet[] = [
  { label: '算法模型', caption: '预训练与对齐', cx: 372, cy: 158, r: 128 },
  { label: '算力基建', caption: '集群与调度', cx: 528, cy: 158, r: 128 },
  { label: '场景数据', caption: '行业语料', cx: 450, cy: 278, r: 128 },
];

export function Theme09VennV1(props: Theme09VennV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    sets = [],
    centerLabel = '全栈自研',
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('paper');
  const list = (sets.length ? sets : DEFAULT_SETS).slice(0, 3);
  const palette = [c.accent, c.series[1], c.series[3]];

  const circles = list.map((s, i) => {
    const def = DEFAULT_SETS[i] ?? DEFAULT_SETS[0];
    return {
      label: s.label ?? def.label ?? '',
      caption: s.caption ?? '',
      cx: s.cx != null ? t9ParseNumber(s.cx) : t9ParseNumber(def.cx),
      cy: s.cy != null ? t9ParseNumber(s.cy) : t9ParseNumber(def.cy),
      r: s.r != null ? t9ParseNumber(s.r) : t9ParseNumber(def.r),
      color: s.color ?? palette[i % palette.length],
    };
  });

  const centroid = {
    x: circles.reduce((a, b) => a + b.cx, 0) / (circles.length || 1),
    y: circles.reduce((a, b) => a + b.cy, 0) / (circles.length || 1),
  };

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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-venn">
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
            className="lp-theme09-venn-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div className="lp-theme09-chart-area">
              <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet" className="lp-theme09-chart-svg" role="img">
                <g>
                  {circles.map((s, i) => (
                    <circle
                      key={`fill-${i}`}
                      cx={s.cx}
                      cy={s.cy}
                      r={s.r}
                      fill={t9Rgba(s.color, 0.42)}
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  ))}
                </g>
                {circles.map((s, i) => (
                  <circle key={`ring-${i}`} cx={s.cx} cy={s.cy} r={s.r} fill="none" stroke={s.color} strokeWidth={1.5} />
                ))}

                {centerLabel && (
                  <text
                    x={centroid.x}
                    y={centroid.y + 4}
                    textAnchor="middle"
                    fontFamily={c.fontHeading}
                    fontSize={17}
                    fontWeight={700}
                    fill={c.ink}
                  >
                    {centerLabel}
                  </text>
                )}

                {circles.map((s, i) => {
                  const dx = s.cx - centroid.x;
                  const dy = s.cy - centroid.y;
                  const len = Math.sqrt(dx * dx + dy * dy) || 1;
                  const lx = s.cx + (dx / len) * (s.r + 26);
                  const ly = s.cy + (dy / len) * (s.r + 26);
                  const anchor = dx > 12 ? 'start' : dx < -12 ? 'end' : 'middle';
                  return (
                    <g key={`label-${i}`}>
                      <circle cx={s.cx + (dx / len) * s.r} cy={s.cy + (dy / len) * s.r} r={3.5} fill={s.color} />
                      <text x={lx} y={ly} textAnchor={anchor} fontFamily={c.fontHeading} fontSize={17} fontWeight={700} fill={s.color}>
                        {s.label}
                      </text>
                      {s.caption && (
                        <text x={lx} y={ly + 20} textAnchor={anchor} fontFamily={c.font} fontSize={13} fill={c.ink3}>
                          {s.caption}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: c.font, fontSize: 12, color: c.ink3 }}>
              {circles.map((s, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: t9Rgba(s.color, 0.55), border: `1px solid ${s.color}` }} />
                  {s.label}
                </span>
              ))}
              <span style={{ marginLeft: 'auto' }}>叠印区 = 多维能力重合</span>
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
