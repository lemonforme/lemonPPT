// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 阶段时序（phases_v1）
 * 基底：墨 | 骨架：stage | 图位：—
 *
 * 横向阶段条时间线：等宽阶段色条串在一条主轴上，
 * 菱形节点标注里程碑，阶段名与时间范围分列条上下。纯 SVG + CSS。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Masthead, Sheet, normalizeStrings } from './shared.js';

export interface Theme09PhaseItem {
  name?: string;
  start?: string;
  end?: string;
  milestones?: Array<string | { item?: string }>;
}

export interface Theme09PhasesV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  phases?: Theme09PhaseItem[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09PhasesV1Meta: LayoutMeta = {
  id: 'theme09_phases_v1',
  theme: 'theme09',
  role: 'roadmap',
  displayName: '阶段时序',
  description: '横向阶段条时间线 + 菱形里程碑节点 + 时间范围标注，墨底',
  needsMedia: false,
  tags: ['phases', 'timeline', 'roadmap', 'milestone'],
  contentShape: 'phase-timeline',
};

export const theme09PhasesV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '阶段时序' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'PHASES' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '13' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '从验证到规模化的四个阶段' },
    {
      key: 'phases',
      label: '阶段',
      type: 'array',
      maxItems: 5,
      itemSchema: [
        { key: 'name', label: '阶段名称', type: 'text' },
        { key: 'start', label: '起始时间', type: 'text' },
        { key: 'end', label: '结束时间', type: 'text' },
        { key: 'milestones', label: '里程碑（多条）', type: 'array', itemSchema: [{ key: 'item', label: '里程碑', type: 'text' }] },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '时序 · 阶段' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '35' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_PHASES: Theme09PhaseItem[] = [
  {
    name: '概念验证',
    start: '25Q3',
    end: '25Q4',
    milestones: ['三个场景 POC 通过', '基线指标对齐'],
  },
  {
    name: '试点交付',
    start: '26Q1',
    end: '26Q2',
    milestones: ['首批 8 家客户上线', '交付手册定稿'],
  },
  {
    name: '规模复制',
    start: '26Q3',
    end: '27Q1',
    milestones: ['渠道伙伴接入', '单位交付成本 -30%'],
  },
  {
    name: '生态外延',
    start: '27Q2',
    end: '27Q4',
    milestones: ['开放平台发布', '行业方案市场上线'],
  },
];

const VIEW_W = 1160;
const VIEW_H = 96;
/** 阶段条竖直中心线 */
const BAR_Y = 52;
const BAR_H = 22;

function diamond(cx: number, cy: number, r: number): string {
  return `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
}

export function Theme09PhasesV1(props: Theme09PhasesV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    phases = [],
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (phases.length ? phases : DEFAULT_PHASES).slice(0, 5);
  const n = list.length || 1;
  const gap = 12;
  const segW = (VIEW_W - gap * (n - 1)) / n;

  return (
    <Sheet substrate="ink" frame="stage" className="lp-theme09-phases">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 22, padding: '96px 60px 70px' }}>
        {title && (
          <h2
            className="lp-t9-serif"
            style={{ margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.26, color: 'var(--lp-ink)', flex: 'none' }}
          >
            <EditableField prop="title" slideIdx={s} editable={e} as="span">
              {title}
            </EditableField>
          </h2>
        )}

        {/* 阶段条 + 里程碑菱形 */}
        <svg
          width="100%"
          height={VIEW_H}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          role="presentation"
          aria-hidden="true"
          style={{ flex: 'none', display: 'block' }}
        >
          {/* 主轴 */}
          <line x1={0} y1={BAR_Y + BAR_H / 2 + 20} x2={VIEW_W} y2={BAR_Y + BAR_H / 2 + 20} stroke="var(--lp-t9-rule)" strokeWidth={1} />
          {list.map((phase, i) => {
            const x = i * (segW + gap);
            const tone = i === 0 ? 'var(--lp-accent)' : `var(--lp-series-${(i % 6) + 1})`;
            const mCount = normalizeStrings(phase.milestones).length;
            return (
              <g key={i}>
                <rect x={x} y={BAR_Y} width={segW} height={BAR_H} fill={tone} opacity={0.9} />
                <rect x={x} y={BAR_Y - 4} width={2} height={BAR_H + 8} fill={tone} />
                {Array.from({ length: mCount }).map((__, k) => {
                  const cx = x + (segW * (k + 1)) / (mCount + 1);
                  return (
                    <polygon
                      key={k}
                      points={diamond(cx, BAR_Y + BAR_H / 2, 9)}
                      fill="var(--lp-bg)"
                      stroke={tone}
                      strokeWidth={2}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* 阶段名 / 时间范围 / 里程碑清单 */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', flex: '1 1 auto', minHeight: 0 }}>
          {list.map((phase, i) => {
            const tone = i === 0 ? 'var(--lp-accent)' : `var(--lp-series-${(i % 6) + 1})`;
            const milestones = normalizeStrings(phase.milestones).slice(0, 4);
            return (
              <div key={i} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flex: 'none' }}>
                  <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: 11, letterSpacing: '0.12em', color: tone }}>
                    {`P${i + 1}`}
                  </span>
                  <h3 className="lp-t9-serif" style={{ margin: 0, fontSize: 19, fontWeight: 700, lineHeight: 1.3, color: 'var(--lp-ink)' }}>
                    <EditableField prop={`phases.${i}.name`} slideIdx={s} editable={e} as="span">
                      {phase.name ?? ''}
                    </EditableField>
                  </h3>
                </div>

                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--lp-font-mono)', fontSize: 12, color: 'var(--lp-ink3)', flex: 'none' }}>
                  <EditableField prop={`phases.${i}.start`} slideIdx={s} editable={e} as="span">
                    {phase.start ?? ''}
                  </EditableField>
                  <span aria-hidden="true">—</span>
                  <EditableField prop={`phases.${i}.end`} slideIdx={s} editable={e} as="span">
                    {phase.end ?? ''}
                  </EditableField>
                </span>

                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {milestones.map((ms, k) => (
                    <li key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <svg width="9" height="9" viewBox="0 0 9 9" style={{ flex: 'none', marginTop: 6 }} aria-hidden="true">
                        <polygon points="4.5,0 9,4.5 4.5,9 0,4.5" fill={tone} />
                      </svg>
                      <span style={{ fontSize: 13.5, lineHeight: 1.62, color: 'var(--lp-ink2)', minWidth: 0 }}>
                        <EditableField prop={`phases.${i}.milestones.${k}`} slideIdx={s} editable={e} as="span">
                          {ms}
                        </EditableField>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
