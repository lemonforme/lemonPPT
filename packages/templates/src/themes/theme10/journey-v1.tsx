// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 客户旅程（journey_v1）
 * 情绪：ember | 骨架：grid | 图位：0
 * 阶段 + 情绪曲线（SVG 折线）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10JourneyItem {
  stage?: string;
  action?: string;
  level?: number;
}
export interface Theme10JourneyV1Props {
  kicker?: string;
  title?: string;
  items?: Theme10JourneyItem[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10JourneyV1Meta: LayoutMeta = {
  id: 'theme10_journey_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 客户旅程',
  description: '阶段 + 情绪曲线',
  needsMedia: false,
  tags: ['journey', 'content', 'gold-index', 'ember'],
  contentShape: 'journey',
};

export const theme10JourneyV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'JOURNEY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '从接触到复购的情绪曲线' },
    {
      key: 'items',
      label: '阶段',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      defaultValue: [
        { stage: '认知', action: '看到投教内容', level: 40 },
        { stage: '兴趣', action: '下载并试算', level: 68 },
        { stage: '顾虑', action: '对比风险', level: 28 },
        { stage: '转化', action: '完成首投', level: 82 },
        { stage: '忠诚', action: '复购推荐', level: 95 },
      ],
      itemSchema: [
        { key: 'stage', label: '阶段', type: 'text' },
        { key: 'action', label: '动作', type: 'text' },
        { key: 'level', label: '情绪值', type: 'number' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'ember' },
  ],
};

export function Theme10JourneyV1(props: Theme10JourneyV1Props): ReactNode {
  const { kicker, title, items, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const list = (Array.isArray(items) ? items : []).slice(0, 6);
  const N = list.length || 1;
  const x0 = 70;
  const x1 = 930;
  const yTop = 70;
  const yBot = 300;
  const pts = list.map((it, i) => {
    const x = x0 + (i * (x1 - x0)) / Math.max(1, N - 1);
    const lv = Math.max(0, Math.min(100, Number(it.level ?? 50)));
    const y = yBot - (lv / 100) * (yBot - yTop);
    return { x, y, it };
  });
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-journey" accent>
      <div className="lp-theme10-journey-head">
        {kicker && (
          <EditableField prop="kicker" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField
            prop="title"
            slideIdx={s}
            editable={e}
            as="h2"
            className="lp-theme10-title lp-rise"
            style={{ animationDelay: '60ms', fontSize: 'var(--lp-font-size-h1)', marginTop: 12 }}
          >
            {title}
          </EditableField>
        )}
      </div>
      <div className="lp-theme10-journey-stage">
        <svg className="lp-t10-chart-svg" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <line x1={x0} y1={yTop} x2={x0} y2={yBot} stroke="var(--lp-t10-rule)" strokeWidth={1} />
          <line x1={x0} y1={yBot} x2={x1} y2={yBot} stroke="var(--lp-t10-rule)" strokeWidth={1} />
          <path d={path} fill="none" stroke="var(--lp-t10-gold)" strokeWidth={2.5} strokeLinejoin="round" />
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={6} fill="var(--lp-t10-blue)" stroke="var(--lp-surface-solid)" strokeWidth={2} />
              <text x={p.x} y={p.y - 14} textAnchor="middle" fontFamily="var(--lp-font-mono)" fontSize={13} fontWeight={700} fill="var(--lp-ink)">
                {p.it.level}
              </text>
              <text x={p.x} y={yBot + 26} textAnchor="middle" fontFamily="var(--lp-font-heading)" fontSize={15} fontWeight={700} fill="var(--lp-ink)">
                {p.it.stage}
              </text>
              <text x={p.x} y={yBot + 48} textAnchor="middle" fontFamily="var(--lp-font-body)" fontSize={12} fill="var(--lp-ink3)">
                {p.it.action}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Sheet>
  );
}
