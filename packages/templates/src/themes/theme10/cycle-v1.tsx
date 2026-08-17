// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 循环流程（cycle_v1）
 * 情绪：obsidian | 骨架：stage | 图位：0
 * 环形节点 + 顺时针箭头（经营/反馈循环）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10CycleItem {
  name?: string;
  desc?: string;
}
export interface Theme10CycleV1Props {
  kicker?: string;
  title?: string;
  items?: Theme10CycleItem[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10CycleV1Meta: LayoutMeta = {
  id: 'theme10_cycle_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 循环流程',
  description: '环形节点 + 顺时针箭头',
  needsMedia: false,
  tags: ['cycle', 'content', 'gold-index', 'obsidian'],
  contentShape: 'cycle',
};

export const theme10CycleV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'LOOP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '投研闭环：假设—验证—修正' },
    {
      key: 'items',
      label: '环节',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      defaultValue: [
        { name: '观察', desc: '跟踪市场与宏观信号' },
        { name: '假设', desc: '形成可证伪的投资假说' },
        { name: '验证', desc: '用数据与回测检验' },
        { name: '修正', desc: '更新仓位与观点' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'desc', label: '说明', type: 'textarea' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'obsidian' },
  ],
};

const CX = 500;
const CY = 258;
const R = 172;

function arrowAt(angleDeg: number): string {
  const a = (angleDeg * Math.PI) / 180;
  const x = CX + R * Math.cos(a);
  const y = CY + R * Math.sin(a);
  const ta = a + Math.PI / 2;
  const tx = Math.cos(ta);
  const ty = Math.sin(ta);
  const nx = -Math.sin(ta);
  const ny = Math.cos(ta);
  const sz = 11;
  const p1 = [x + tx * sz, y + ty * sz];
  const p2 = [x - tx * sz * 0.55 + nx * sz * 0.72, y - ty * sz * 0.55 + ny * sz * 0.72];
  const p3 = [x - tx * sz * 0.55 - nx * sz * 0.72, y - ty * sz * 0.55 - ny * sz * 0.72];
  return `M${p1[0].toFixed(1)},${p1[1].toFixed(1)} L${p2[0].toFixed(1)},${p2[1].toFixed(1)} L${p3[0].toFixed(1)},${p3[1].toFixed(1)} Z`;
}

export function Theme10CycleV1(props: Theme10CycleV1Props): ReactNode {
  const { kicker, title, items, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const list = (Array.isArray(items) ? items : []).slice(0, 6);
  const N = list.length || 1;
  const pts = list.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
    return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
  });

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme10-cycle" accent>
      <div className="lp-theme10-cycle-head">
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
      <div className="lp-theme10-cycle-stage">
        <svg className="lp-t10-chart-svg" viewBox="0 0 1000 540" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--lp-t10-rule-strong)" strokeWidth={1.5} strokeDasharray="3 9" />
          <circle cx={CX} cy={CY} r={R * 0.46} fill="none" stroke="var(--lp-t10-gold)" strokeWidth={1} strokeOpacity={0.5} />
          {pts.map((_, i) => (
            <path key={`a${i}`} d={arrowAt(-90 + (i + 0.5) * (360 / N))} fill="var(--lp-t10-gold)" />
          ))}
          {pts.map((pt, i) => {
            const it = list[i];
            const lx = CX + (R + 64) * Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / N);
            const ly = CY + (R + 64) * Math.sin(-Math.PI / 2 + (i * 2 * Math.PI) / N);
            return (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r={34} fill="var(--lp-surface-solid)" stroke="var(--lp-t10-gold)" strokeWidth={1.5} />
                <text x={pt.x} y={pt.y + 8} textAnchor="middle" fontFamily="var(--lp-font-mono)" fontSize={24} fontWeight={700} fill="var(--lp-t10-blue)">
                  {String(i + 1).padStart(2, '0')}
                </text>
                <text x={lx} y={ly - 4} textAnchor="middle" fontFamily="var(--lp-font-heading)" fontSize={18} fontWeight={700} fill="var(--lp-ink)">
                  {it.name}
                </text>
                <text x={lx} y={ly + 16} textAnchor="middle" fontFamily="var(--lp-font-body)" fontSize={12} fill="var(--lp-ink3)">
                  {it.desc}
                </text>
              </g>
            );
          })}
          <text x={CX} y={CY - 6} textAnchor="middle" fontFamily="var(--lp-font-mono)" fontSize={13} letterSpacing={2} fill="var(--lp-t10-gold)">
            CYCLE
          </text>
          <text x={CX} y={CY + 16} textAnchor="middle" fontFamily="var(--lp-font-heading)" fontSize={15} fontWeight={700} fill="var(--lp-ink)">
            ↻ 持续迭代
          </text>
        </svg>
      </div>
    </Sheet>
  );
}
