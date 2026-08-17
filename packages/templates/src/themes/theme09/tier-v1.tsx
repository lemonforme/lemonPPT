// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Rgba } from './chart-utils.js';

export interface Theme09TierItem {
  label?: string;
  members?: string | string[];
  value?: string | number;
  note?: string;
}

export interface Theme09TierV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  tiers?: Theme09TierItem[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09TierV1Meta: LayoutMeta = {
  id: 'theme09_tier_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '梯队分层',
  description: '三层梯队金字塔 + 每层成员标签，专色分层，纸底',
  needsMedia: false,
  tags: ['chart', 'pyramid', 'tier', 'hierarchy'],
  contentShape: 'tier',
};

export const theme09TierV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '梯队分层' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'TIERS' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '22' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '格局' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资本向 {{第一梯队}} 收敛' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按估值与融资密度划分的三层梯队，宽度代表阵营规模。' },
    {
      key: 'tiers',
      label: '梯队',
      type: 'array',
      itemSchema: [
        { key: 'label', label: '梯队名称', type: 'text' },
        { key: 'members', label: '成员（逗号分隔）', type: 'text' },
        { key: 'value', label: '规模数值', type: 'text' },
        { key: 'note', label: '备注', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_TIERS: Theme09TierItem[] = [
  { label: '第一梯队', members: ['OpenAI', 'Anthropic', 'DeepMind'], value: 38, note: '估值 500 亿$ 以上' },
  { label: '第二梯队', members: ['Mistral', 'Cohere', 'xAI', '零一万物'], value: 66, note: '估值 80–500 亿$' },
  { label: '第三梯队', members: ['Perplexity', 'Groq', 'Scale', 'HuggingFace', 'LangChain'], value: 96, note: '估值 80 亿$ 以下' },
];

function toMembers(v?: string | string[]): string[] {
  if (Array.isArray(v)) return v.filter(Boolean);
  const s = String(v ?? '').trim();
  if (!s) return [];
  return (s.includes('|') ? s.split('|') : s.split(/[,，]/)).map((x) => x.trim()).filter(Boolean);
}

export function Theme09TierV1(props: Theme09TierV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    tiers = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('paper');
  const list = (tiers.length ? tiers : DEFAULT_TIERS).slice(0, 3);
  const values = list.map((t) => t9ParseNumber(t.value) || 1);
  const maxValue = Math.max(...values, 1);

  const VB_W = 980;
  const VB_H = 380;
  const CX = 260;
  const MAX_HALF = 226;
  const TOP = 22;
  const BAND = (VB_H - TOP - 16) / Math.max(list.length, 1);

  const halves = values.map((v) => Math.max(38, (v / maxValue) * MAX_HALF));

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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-tier">
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
            className="lp-theme09-tier-body"
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
                {list.map((tier, i) => {
                  const yTop = TOP + i * BAND;
                  const yBottom = yTop + BAND - 10;
                  const topHalf = i === 0 ? halves[0] * 0.46 : halves[i - 1];
                  const bottomHalf = halves[i];
                  const fill = i === 0 ? c.accent : c.series[(i + 1) % c.series.length];
                  const members = toMembers(tier.members);
                  const yMid = (yTop + yBottom) / 2;
                  return (
                    <g key={i}>
                      <polygon
                        points={[
                          `${CX - topHalf},${yTop}`,
                          `${CX + topHalf},${yTop}`,
                          `${CX + bottomHalf},${yBottom}`,
                          `${CX - bottomHalf},${yBottom}`,
                        ].join(' ')}
                        fill={t9Rgba(fill, i === 0 ? 0.92 : 0.68)}
                        stroke={c.surfaceSolid}
                        strokeWidth={2}
                      />
                      <text
                        x={CX}
                        y={yMid - 4}
                        textAnchor="middle"
                        fontFamily={c.fontHeading}
                        fontSize={20}
                        fontWeight={700}
                        fill={c.surfaceSolid}
                      >
                        {tier.label ?? ''}
                      </text>
                      <text
                        x={CX}
                        y={yMid + 20}
                        textAnchor="middle"
                        fontFamily={c.fontMono}
                        fontSize={13}
                        fill={t9Rgba(c.surfaceSolid, 0.88)}
                      >
                        {`规模 ${values[i]}`}
                      </text>

                      <line x1={560} y1={yTop + 6} x2={VB_W - 20} y2={yTop + 6} stroke={c.rule} strokeWidth={1} />
                      <text x={560} y={yMid - 8} fontFamily={c.fontHeading} fontSize={15} fontWeight={700} fill={fill}>
                        {tier.label ?? ''}
                        {tier.note ? <tspan fontFamily={c.font} fontSize={12} fontWeight={400} fill={c.ink3}>{`　${tier.note}`}</tspan> : null}
                      </text>
                      <text x={560} y={yMid + 16} fontFamily={c.font} fontSize={14} fill={c.ink2}>
                        {members.join(' · ')}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
