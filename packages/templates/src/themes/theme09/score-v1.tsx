// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 赛道评分（score_v1）
 * 基底：墨 | 骨架：chart-canvas | 图位：—
 *
 * 评分条列：每条评估项一根横向评分条，条前挂权重标注，
 * 底部收口一条加权总分带（权重×得分自动折算）。纯 HTML/CSS。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Rgba } from './chart-utils.js';

export interface Theme09ScoreCriterion {
  name?: string;
  /** 权重，支持 `25%` / `25` / `0.25` */
  weight?: string | number;
  score?: string | number;
  maxScore?: string | number;
}

export interface Theme09ScoreV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  criteria?: Theme09ScoreCriterion[];
  totalScore?: string | number;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ScoreV1Meta: LayoutMeta = {
  id: 'theme09_score_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '赛道评分',
  description: '评分条列 + 权重标注 + 加权总分自动折算，纯 CSS 条形，墨底',
  needsMedia: false,
  tags: ['score', 'rating', 'weighted', 'evaluation'],
  contentShape: 'weighted-score',
};

export const theme09ScoreV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '赛道评分' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'SCORECARD' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '45' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '评分' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '六项打分之后，这条赛道值 {{8.1 分}}' },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '每项按十分制打分，权重之和为 100%，总分为加权折算结果。',
    },
    {
      key: 'criteria',
      label: '评估项',
      type: 'array',
      minItems: 3,
      maxItems: 7,
      itemSchema: [
        { key: 'name', label: '评估项名称', type: 'text' },
        { key: 'weight', label: '权重', type: 'text' },
        { key: 'score', label: '得分', type: 'text' },
        { key: 'maxScore', label: '满分', type: 'text' },
      ],
    },
    { key: 'totalScore', label: '总分（留空自动折算）', type: 'text', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: '评分口径：投委会三轮打分取均值' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: 'SCORECARD / 45' },
  ],
};

const DEFAULT_CRITERIA: Theme09ScoreCriterion[] = [
  { name: '市场空间', weight: '25%', score: 8.6, maxScore: 10 },
  { name: '技术壁垒', weight: '20%', score: 7.4, maxScore: 10 },
  { name: '交付能力', weight: '20%', score: 8.8, maxScore: 10 },
  { name: '客户黏性', weight: '15%', score: 8.2, maxScore: 10 },
  { name: '竞争格局', weight: '12%', score: 6.9, maxScore: 10 },
  { name: '合规风险', weight: '8%', score: 7.6, maxScore: 10 },
];

/** 把权重归一化为百分数（支持 0.25 / 25 / '25%' 三种写法） */
function normalizeWeights(list: Theme09ScoreCriterion[]): number[] {
  const raw = list.map((it) => t9ParseNumber(it.weight));
  const sum = raw.reduce((a, b) => a + b, 0);
  if (sum > 0 && sum <= 1.5) return raw.map((w) => w * 100);
  return raw;
}

export function Theme09ScoreV1(props: Theme09ScoreV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    criteria = [],
    totalScore,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('ink');
  const list = (criteria.length ? criteria : DEFAULT_CRITERIA).slice(0, 7);
  const weights = normalizeWeights(list);
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1;

  const maxOf = (it: Theme09ScoreCriterion): number => {
    const m = t9ParseNumber(it.maxScore);
    return m > 0 ? m : 10;
  };

  const computed =
    list.reduce((acc, it, i) => acc + (weights[i] ?? 0) * (t9ParseNumber(it.score) / maxOf(it)), 0) / weightSum;
  const scaleMax = maxOf(list[0] ?? {});
  const totalText =
    totalScore !== undefined && String(totalScore).trim() !== ''
      ? String(totalScore)
      : (computed * scaleMax).toFixed(1);

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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-score">
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: '1 1 auto', minHeight: 0 }}>
            {title && renderTitle(title)}
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}

            <div
              className="lp-theme09-chart-area"
              style={{ flexDirection: 'column', justifyContent: 'space-between', gap: 8 }}
            >
              {list.map((it, i) => {
                const max = maxOf(it);
                const score = t9ParseNumber(it.score);
                const pct = Math.max(2, Math.min(100, Math.round((score / max) * 1000) / 10));
                const tone = i === 0 ? c.accent : c.series[i % c.series.length];
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span
                      className="lp-t9-serif"
                      style={{
                        width: 112,
                        flex: 'none',
                        fontSize: 16,
                        fontWeight: 700,
                        color: c.ink,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <EditableField prop={`criteria.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">
                        {it.name ?? ''}
                      </EditableField>
                    </span>

                    <span
                      style={{
                        width: 62,
                        flex: 'none',
                        textAlign: 'center',
                        border: `1px solid ${t9Rgba(tone, 0.5)}`,
                        color: tone,
                        fontFamily: c.fontMono,
                        fontSize: 11,
                        letterSpacing: '0.06em',
                        padding: '2px 0',
                      }}
                    >
                      <EditableField prop={`criteria.${i}.weight`} slideIdx={_slideIdx} editable={_editable} as="span">
                        {String(it.weight ?? '')}
                      </EditableField>
                    </span>

                    <span
                      style={{
                        flex: '1 1 auto',
                        minWidth: 0,
                        height: 18,
                        background: t9Rgba(c.ink, 0.09),
                        position: 'relative',
                        display: 'block',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: 0,
                          width: `${pct}%`,
                          background: t9Rgba(tone, 0.86),
                          display: 'block',
                        }}
                      />
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: '60%',
                          width: 1,
                          background: t9Rgba(c.ink, 0.22),
                          display: 'block',
                        }}
                      />
                    </span>

                    <span
                      style={{
                        width: 76,
                        flex: 'none',
                        textAlign: 'right',
                        fontFamily: c.fontMono,
                        fontSize: 14,
                        fontWeight: 700,
                        color: tone,
                      }}
                    >
                      <EditableField prop={`criteria.${i}.score`} slideIdx={_slideIdx} editable={_editable} as="span">
                        {String(it.score ?? '')}
                      </EditableField>
                      <span style={{ color: c.ink3, fontWeight: 500 }}>{` / ${max}`}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 加权总分带 */}
            <div
              style={{
                flex: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                borderTop: `2px solid ${c.accent}`,
                paddingTop: 12,
              }}
            >
              <span style={{ fontFamily: c.fontMono, fontSize: 11, letterSpacing: '0.2em', color: c.accent }}>
                WEIGHTED TOTAL
              </span>
              <span style={{ fontFamily: c.font, fontSize: 13, color: c.ink3 }}>
                {`权重合计 ${Math.round(weightSum)}% · 共 ${list.length} 项`}
              </span>
              <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'flex-end', gap: 8 }}>
                <span
                  className="lp-t9-serif"
                  style={{ fontSize: 52, fontWeight: 700, lineHeight: 0.92, letterSpacing: '-0.03em', color: c.accent }}
                >
                  <EditableField prop="totalScore" slideIdx={_slideIdx} editable={_editable} as="span">
                    {totalText}
                  </EditableField>
                </span>
                <span style={{ fontFamily: c.fontMono, fontSize: 14, color: c.ink3, paddingBottom: 6 }}>
                  {`/ ${scaleMax}`}
                </span>
              </span>
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
