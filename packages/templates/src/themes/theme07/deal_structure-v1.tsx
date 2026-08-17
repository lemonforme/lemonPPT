// lemonPPT - theme07 交易结构堆叠条
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { CSSProperties, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07DealStructureV1Segment {
  label?: string;
  value?: number;
  amount?: string;
  note?: string;
}

export interface Theme07DealStructureV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  segments?: Theme07DealStructureV1Segment[];
  showStats?: boolean;
  axisLabel?: string;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07DealStructureV1Meta: LayoutMeta = {
  id: 'theme07_deal_structure_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 交易结构堆叠',
  description: '横向堆叠结构条：披露/未披露/战略/其他分段占比与调用统计',
  needsMedia: true,
  tags: ['deal_structure', 'stack', 'chart', 'capital'],
  contentShape: 'stacked-bar',
};

/** 分段配色统一取自 theme07 数据系列 token，避免硬编码色值 */
const SEGMENT_COLORS = [
  'var(--lp-series-1)',
  'var(--lp-series-2)',
  'var(--lp-series-3)',
  'var(--lp-series-4)',
  'var(--lp-series-5)',
  'var(--lp-series-6)',
];

export const theme07DealStructureV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'DEAL STRUCTURE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '交易结构分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按披露程度与出资性质拆解的轮次结构占比' },
    {
      key: 'segments',
      label: '结构分段',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { label: '已披露轮次', value: 41, amount: '$12.4B', note: '公开条款与估值' },
        { label: '未披露轮次', value: 27, amount: '$8.1B', note: '仅披露参与方' },
        { label: '战略投资', value: 21, amount: '$6.3B', note: '产业方直投' },
        { label: '其他结构', value: 11, amount: '$3.2B', note: '可转债与 SAFE' },
      ],
      itemSchema: [
        { key: 'label', label: '分段名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '占比数值', type: 'number' },
        { key: 'amount', label: '金额', type: 'text', inlineEditable: true },
        { key: 'note', label: '说明', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'showStats', label: '显示统计块', type: 'boolean', defaultValue: true },
    { key: 'axisLabel', label: '坐标说明', type: 'text', defaultValue: '占全部交易金额比例 →' },
    { key: 'focusIndex', label: '高亮分段', type: 'slider', min: 0, max: 5, defaultValue: 0 },
  ],
};

export function Theme07DealStructureV1(props: Theme07DealStructureV1Props): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    segments = [],
    showStats = true,
    axisLabel,
    focusIndex = 0,
    _slideIdx,
    _editable,
  } = props;

  const validSegments = (segments || [])
    .filter((s): s is Theme07DealStructureV1Segment => s != null && !!s.label)
    .slice(0, 6);
  const total = validSegments.reduce((acc, s) => acc + (Number(s.value) || 0), 0) || 1;

  return (
    <div className="lp-slide lp-theme07 lp-theme07-deal-stack">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-deal-stack-header lp-rise">
        <Theme07IconChip name="scale" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      {validSegments.length > 0 && (
        <div className="lp-theme07-deal-stack-chart lp-rise">
          <div className="lp-theme07-deal-stack-bar">
            {validSegments.map((segment, index) => {
              const pct = ((Number(segment.value) || 0) / total) * 100;
              const isFocus = index === focusIndex;
              return (
                <div
                  key={index}
                  className={`lp-theme07-deal-stack-seg ${isFocus ? 'is-focus' : ''}`}
                  style={{
                    width: `${pct}%`,
                    '--lp-theme07-seg-color': SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                  } as CSSProperties}
                >
                  <span className="lp-theme07-deal-stack-seg-value">{Math.round(pct)}%</span>
                </div>
              );
            })}
          </div>
          {axisLabel && <div className="lp-theme07-deal-stack-axis">{axisLabel}</div>}
          <div className="lp-theme07-deal-stack-legend">
            {validSegments.map((segment, index) => (
              <div key={index} className="lp-theme07-deal-stack-legend-item">
                <span
                  className="lp-theme07-deal-stack-legend-swatch"
                  aria-hidden="true"
                  style={{ background: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
                />
                <EditableField prop={`segments.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{segment.label}</EditableField>
              </div>
            ))}
          </div>
        </div>
      )}
      {showStats && validSegments.length > 0 && (
        <div className="lp-theme07-deal-stack-stats lp-rise">
          {validSegments.map((segment, index) => {
            const isFocus = index === focusIndex;
            return (
              <div
                key={index}
                className={`lp-theme07-card lp-theme07-deal-stack-stat ${isFocus ? 'lp-focus' : ''}`}
                style={{
                  '--lp-theme07-seg-color': SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                  animationDelay: `${index * 70}ms`,
                } as CSSProperties}
              >
                {isFocus && <span className="lp-focus-lens" aria-hidden="true" />}
                <div className="lp-theme07-deal-stack-stat-value">
                  <EditableField prop={`segments.${index}.amount`} slideIdx={_slideIdx} editable={_editable} as="span">{segment.amount || `${segment.value ?? 0}%`}</EditableField>
                </div>
                <div className="lp-theme07-deal-stack-stat-label">
                  <EditableField prop={`segments.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{segment.label}</EditableField>
                </div>
                {segment.note && (
                  <div className="lp-theme07-deal-stack-stat-note">
                    <EditableField prop={`segments.${index}.note`} slideIdx={_slideIdx} editable={_editable} as="span">{segment.note}</EditableField>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
