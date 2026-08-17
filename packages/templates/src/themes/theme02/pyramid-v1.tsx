// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02PyramidV1Level {
  title?: string;
  desc?: string;
}

export interface Theme02PyramidV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  levels?: Theme02PyramidV1Level[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02PyramidV1Meta: LayoutMeta = {
  id: 'theme02_pyramid_v1',
  theme: 'theme02',
  role: 'content',
  displayName: 'Theme 02 金字塔',
  description: '分层金字塔结构',
  needsMedia: false,
};

export const theme02PyramidV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    {
      key: 'levels',
      label: '层级',
      type: 'array',
      maxItems: 5,
      minItems: 2,
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'desc', label: '说明', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

const PY_W = 520;
const PY_H = 420;
const PY_CX = PY_W / 2;
const TOP_Y = 16;
const LEVEL_COLORS = ['var(--lp-accent)', 'var(--lp-accent-cool)', 'var(--lp-accent-2)', 'var(--lp-violet)', 'var(--lp-cyan)'];

function renderPyramid(levels: Theme02PyramidV1Level[]): ReactElement {
  const n = levels.length;
  const levelH = (PY_H - TOP_Y) / n;
  return (
    <svg viewBox={`0 0 ${PY_W} ${PY_H}`} className="lp-theme02-pyramid-svg">
      {levels.map((_, i) => {
        const yTop = TOP_Y + i * levelH;
        const yBot = TOP_Y + (i + 1) * levelH;
        const wTop = (PY_W * (i / n)) * 0.92;
        const wBot = (PY_W * ((i + 1) / n)) * 0.92;
        const color = LEVEL_COLORS[i % LEVEL_COLORS.length];
        const pts = [
          `${PY_CX - wTop / 2},${yTop}`,
          `${PY_CX + wTop / 2},${yTop}`,
          `${PY_CX + wBot / 2},${yBot}`,
          `${PY_CX - wBot / 2},${yBot}`,
        ].join(' ');
        const midY = (yTop + yBot) / 2;
        return (
          <g key={i}>
            <polygon points={pts} fill={color} fillOpacity={0.22} stroke={color} strokeWidth={1.5} className="lp-theme02-pyramid-band" />
            <text x={PY_CX} y={midY + 5} textAnchor="middle" fill="var(--lp-ink)" fontSize={16} fontWeight={800}>
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Theme02PyramidV1(props: Theme02PyramidV1Props): ReactNode {
  const { kicker, title, subtitle, levels = [], _slideIdx, _editable } = props;

  const safeLevels = levels.filter((l) => l && typeof l === 'object');

  return (
    <div className="lp-slide lp-theme02-pyramid-v1">
      <div className="lp-orb lp-theme02-orb--accent" />
      <div className="lp-theme02-pyramid-inner">
        <div className="lp-theme02-pyramid-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-pyramid-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-pyramid-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>
        <div className="lp-theme02-pyramid-body">
          {safeLevels.length >= 2 && renderPyramid(safeLevels)}
          <div className="lp-theme02-pyramid-legend">
            {safeLevels.map((level, i) => (
              <div key={i} className="lp-theme02-pyramid-legend-item">
                <span
                  className="lp-theme02-pyramid-legend-dot"
                  style={{ background: LEVEL_COLORS[i % LEVEL_COLORS.length] }}
                />
                <EditableField prop={`levels.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-pyramid-legend-title">
                  {level.title}
                </EditableField>
                {level.desc && (
                  <EditableField prop={`levels.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-pyramid-legend-desc">
                    {level.desc}
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
