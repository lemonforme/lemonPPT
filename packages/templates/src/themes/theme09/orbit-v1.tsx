// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 环形纪程（orbit_v1）
 * 基底：墨 | 骨架：stage | 图位：—
 *
 * 同心环时间线：节点沿外环等距分布并标注年份，环心落核心主题，右栏展开纪事。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Masthead, Sheet } from './shared.js';
import { t9ChartColors } from './chart-utils.js';

export interface Theme09OrbitEvent {
  year?: string;
  label?: string;
  description?: string;
}

export interface Theme09OrbitV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  centerText?: string;
  events?: Theme09OrbitEvent[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09OrbitV1Meta: LayoutMeta = {
  id: 'theme09_orbit_v1',
  theme: 'theme09',
  role: 'timeline',
  displayName: '环形纪程',
  description: '同心环时间线 + 环上节点年份标注 + 环心主题，墨底',
  needsMedia: false,
  tags: ['timeline', 'orbit', 'ring', 'chronicle'],
  contentShape: 'orbit',
};

export const theme09OrbitV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '环形纪程' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'ORBIT' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '11' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '六个节点连成的一轮周期' },
    { key: 'centerText', label: '环心文字', type: 'text', inlineEditable: true, defaultValue: '资本之年' },
    {
      key: 'events',
      label: '纪程节点',
      type: 'array',
      maxItems: 6,
      itemSchema: [
        { key: 'year', label: '年份 / 时点', type: 'text' },
        { key: 'label', label: '事件名称', type: 'text' },
        { key: 'description', label: '事件描述', type: 'text' },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '纪程 · 环形' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '63' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_EVENTS: Theme09OrbitEvent[] = [
  { year: '2021', label: '底座竞速开启', description: '首批千亿参数模型发布，训练算力集中采购。' },
  { year: '2022', label: '资本快速涌入', description: '一级市场融资额同比增长 2.6 倍，估值抬升。' },
  { year: '2023', label: '场景验证之年', description: '金融与制造率先跑通付费闭环，交付队伍成型。' },
  { year: '2024', label: '算力供给转折', description: '集群交付集中释放，租赁价格开始回落。' },
  { year: '2025', label: '价值向应用迁移', description: '服务与实施收入占比首次超过模型订阅。' },
  { year: '2026', label: '进入效率周期', description: '现金流与续约率取代规模，成为主要定价依据。' },
];

const VB = 452;
const CX = VB / 2;
const CY = VB / 2;
const R_OUTER = 168;

export function Theme09OrbitV1(props: Theme09OrbitV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    centerText = '资本之年',
    events = [],
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const c = t9ChartColors('ink');
  const list = (events.length ? events : DEFAULT_EVENTS).slice(0, 6);
  const step = 360 / Math.max(list.length, 1);

  const points = list.map((ev, i) => {
    const rad = ((-90 + i * step) * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
      ev,
      x: CX + R_OUTER * cos,
      y: CY + R_OUTER * sin,
      lx: CX + (R_OUTER + 20) * cos,
      ly: CY + (R_OUTER + 20) * sin,
      anchor: (cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle') as 'start' | 'end' | 'middle',
      color: c.series[i % c.series.length],
    };
  });

  return (
    <Sheet substrate="ink" frame="stage" className="lp-theme09-orbit">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', gap: 34, padding: '92px 60px 68px' }}>
        {/* 左：同心环 */}
        <div style={{ flex: 'none', width: 480, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox={`0 0 ${VB} ${VB}`} width="100%" height="100%" role="presentation" aria-hidden="true" style={{ display: 'block' }}>
            <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke={c.rule} strokeWidth={1} />
            <circle cx={CX} cy={CY} r={R_OUTER - 46} fill="none" stroke={c.rule} strokeWidth={1} strokeDasharray="3 6" />
            <circle cx={CX} cy={CY} r={R_OUTER - 92} fill="none" stroke={c.rule} strokeWidth={1} />
            {points.map((p, i) => (
              <g key={i}>
                <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={c.rule} strokeWidth={1} strokeDasharray="2 7" />
                <circle cx={p.x} cy={p.y} r={9} fill={c.substrate === 'ink' ? '#14161C' : '#F4F1EA'} stroke={p.color} strokeWidth={2} />
                <circle cx={p.x} cy={p.y} r={3.4} fill={p.color} />
                <text
                  x={p.lx}
                  y={p.ly + 4}
                  textAnchor={p.anchor}
                  fontFamily={c.fontMono}
                  fontSize={13}
                  fontWeight={700}
                  fill={p.color}
                >
                  {p.ev.year ?? ''}
                </text>
              </g>
            ))}
          </svg>

          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              width: 150,
              textAlign: 'center',
            }}
          >
            <span style={{ width: 26, height: 3, background: c.accent, display: 'block' }} aria-hidden="true" />
            <span className="lp-t9-serif" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.3, color: c.ink }}>
              <EditableField prop="centerText" slideIdx={s} editable={e} as="span">
                {centerText}
              </EditableField>
            </span>
            <span style={{ fontFamily: c.fontMono, fontSize: 10.5, letterSpacing: '0.2em', color: c.ink3 }}>
              {`${String(list.length).padStart(2, '0')} STOPS`}
            </span>
          </div>
        </div>

        {/* 右：纪事列 */}
        <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {title && (
            <h2 className="lp-t9-serif" style={{ margin: 0, fontSize: 30, fontWeight: 700, lineHeight: 1.24, color: c.ink }}>
              <EditableField prop="title" slideIdx={s} editable={e} as="span">
                {title}
              </EditableField>
            </h2>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, justifyContent: 'space-between' }}>
            {list.map((ev, i) => (
              <article
                key={i}
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'baseline',
                  borderTop: `1px solid ${c.rule}`,
                  paddingTop: 8,
                  flex: '1 1 0',
                  minHeight: 0,
                }}
              >
                <span
                  style={{
                    flex: 'none',
                    width: 46,
                    fontFamily: c.fontMono,
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: c.series[i % c.series.length],
                    letterSpacing: '0.04em',
                  }}
                >
                  <EditableField prop={`events.${i}.year`} slideIdx={s} editable={e} as="span">
                    {ev.year ?? ''}
                  </EditableField>
                </span>
                <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span className="lp-t9-serif" style={{ fontSize: 17, fontWeight: 700, color: c.ink, lineHeight: 1.35 }}>
                    <EditableField prop={`events.${i}.label`} slideIdx={s} editable={e} as="span">
                      {ev.label ?? ''}
                    </EditableField>
                  </span>
                  {ev.description && (
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.62, color: c.ink3 }}>
                      <EditableField prop={`events.${i}.description`} slideIdx={s} editable={e} as="span">
                        {ev.description}
                      </EditableField>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
