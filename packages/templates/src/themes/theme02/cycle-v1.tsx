// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02CycleV1Step {
  title?: string;
  desc?: string;
}

export interface Theme02CycleV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  steps?: Theme02CycleV1Step[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02CycleV1Meta: LayoutMeta = {
  id: 'theme02_cycle_v1',
  theme: 'theme02',
  role: 'process',
  displayName: 'Theme 02 循环图',
  description: '环形循环流程',
  needsMedia: false,
};

export const theme02CycleV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    {
      key: 'steps',
      label: '步骤',
      type: 'array',
      maxItems: 6,
      minItems: 2,
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'desc', label: '说明', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

const RING_SIZE = 360;
const CX = RING_SIZE / 2;
const CY = RING_SIZE / 2;
const RING_R = 132;

function renderRing(steps: Theme02CycleV1Step[]): ReactElement {
  const n = steps.length;
  const pos = (i: number) => {
    const a = (-90 + (360 / n) * i) * (Math.PI / 180);
    return { x: CX + RING_R * Math.cos(a), y: CY + RING_R * Math.sin(a) };
  };

  return (
    <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className="lp-theme02-cycle-ring">
      <defs>
        <marker id="theme02-cycle-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--lp-accent)" />
        </marker>
      </defs>
      {steps.map((_, i) => {
        const p1 = pos(i);
        const p2 = pos((i + 1) % n);
        const large = 360 / n > 180 ? 1 : 0;
        return (
          <path
            key={i}
            d={`M ${p1.x} ${p1.y} A ${RING_R} ${RING_R} 0 ${large} 1 ${p2.x} ${p2.y}`}
            fill="none"
            stroke="var(--lp-accent)"
            strokeWidth={2}
            strokeOpacity={0.55}
            strokeDasharray="2 8"
            markerEnd="url(#theme02-cycle-arrow)"
          />
        );
      })}
      {steps.map((_, i) => {
        const p = pos(i);
        return (
          <g key={`node-${i}`}>
            <circle cx={p.x} cy={p.y} r={26} fill="var(--lp-surface)" stroke="var(--lp-accent)" strokeWidth={2} />
            <text x={p.x} y={p.y + 6} textAnchor="middle" fill="var(--lp-accent)" fontSize={18} fontWeight={800}>
              {i + 1}
            </text>
          </g>
        );
      })}
      <text x={CX} y={CY - 6} textAnchor="middle" fill="var(--lp-ink)" fontSize={20} fontWeight={800}>
        循环
      </text>
      <text x={CX} y={CY + 18} textAnchor="middle" fill="var(--lp-ink2)" fontSize={12} fontFamily="var(--lp-font-mono)">
        CYCLE
      </text>
    </svg>
  );
}

export function Theme02CycleV1(props: Theme02CycleV1Props): ReactNode {
  const { kicker, title, subtitle, steps = [], _slideIdx, _editable } = props;

  const safeSteps = steps.filter((s) => s && typeof s === 'object');

  return (
    <div className="lp-slide lp-theme02-cycle-v1">
      <div className="lp-orb lp-theme02-orb--cool" />
      <div className="lp-theme02-cycle-inner">
        <div className="lp-theme02-cycle-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-cycle-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-cycle-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>
        <div className="lp-theme02-cycle-body">
          {safeSteps.length >= 2 && renderRing(safeSteps)}
          <div className="lp-theme02-cycle-steps">
            {safeSteps.map((step, i) => (
              <div key={i} className="lp-theme02-cycle-step">
                <div className="lp-theme02-cycle-step-no">{i + 1}</div>
                <EditableField prop={`steps.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-cycle-step-title">
                  {step.title}
                </EditableField>
                {step.desc && (
                  <EditableField prop={`steps.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-cycle-step-desc">
                    {step.desc}
                  </EditableField>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
