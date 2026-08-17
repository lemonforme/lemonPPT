// lemonPPT - theme07 资源三角
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07ResourceTriadV1Pillar {
  name?: string;
  value?: string;
  note?: string;
}

export interface Theme07ResourceTriadV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  pillars?: Theme07ResourceTriadV1Pillar[];
  centerText?: string;
  source?: string;
  showPillars?: boolean;
  showQuoteMark?: boolean;
  showSource?: boolean;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07ResourceTriadV1Meta: LayoutMeta = {
  id: 'theme07_resource_triad_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 资源三角',
  description: '人才 / 资本 / 算力三支柱等边三角结构，中心引述与来源行',
  needsMedia: true,
  tags: ['resource_triad', 'triangle', 'pillars', 'chart'],
  contentShape: 'triad',
};

/** 等边三角形三个顶点（百分比坐标），顶点在上 */
const TRIAD_POSITIONS = [
  { x: 50, y: 15 },
  { x: 16, y: 82 },
  { x: 84, y: 82 },
];

export const theme07ResourceTriadV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'RESOURCE TRIAD' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资源三角' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '人才、资本与算力三者互相牵引，缺一不可' },
    {
      key: 'pillars',
      label: '三支柱',
      type: 'array',
      minItems: 3,
      maxItems: 3,
      defaultValue: [
        { name: '人才', value: '20%', note: '全球流动，头部团队高度稀缺' },
        { name: '资本', value: '45%', note: '风险投资集中于少数枢纽' },
        { name: '算力', value: '35%', note: 'GPU 与数据中心供给受限' },
      ],
      itemSchema: [
        { key: 'name', label: '支柱名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '权重', type: 'text', inlineEditable: true },
        { key: 'note', label: '说明', type: 'textarea', inlineEditable: true },
      ],
    },
    { key: 'centerText', label: '中心引述', type: 'textarea', inlineEditable: true, defaultValue: '三角任一顶点失衡，整体产能即被最短板锁定。' },
    { key: 'source', label: '来源', type: 'text', inlineEditable: true, defaultValue: '来源：公开融资数据与产业访谈整理' },
    { key: 'showPillars', label: '显示支柱卡片', type: 'boolean', defaultValue: true },
    { key: 'showQuoteMark', label: '显示引号标记', type: 'boolean', defaultValue: true },
    { key: 'showSource', label: '显示来源行', type: 'boolean', defaultValue: true },
    { key: 'focusIndex', label: '高亮支柱', type: 'slider', min: 0, max: 2, defaultValue: 0 },
  ],
};

export function Theme07ResourceTriadV1(props: Theme07ResourceTriadV1Props): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    pillars = [],
    centerText,
    source,
    showPillars = true,
    showQuoteMark = true,
    showSource = true,
    focusIndex = 0,
    _slideIdx,
    _editable,
  } = props;

  const validPillars = (pillars || [])
    .filter((p): p is Theme07ResourceTriadV1Pillar => p != null && !!p.name)
    .slice(0, 3);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-triad">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-triad-header lp-rise">
        <Theme07IconChip name="compass" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme07-triad-stage lp-rise">
        <svg
          className="lp-theme07-triad-frame"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon
            points={TRIAD_POSITIONS.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="color-mix(in srgb, var(--lp-accent) 6%, transparent)"
            stroke="var(--lp-accent)"
            strokeWidth="1.4"
            strokeDasharray="6 4"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.6"
          />
          {TRIAD_POSITIONS.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="1.1"
              fill={i === focusIndex ? 'var(--lp-accent)' : 'var(--lp-accent-2)'}
              opacity="0.85"
            />
          ))}
        </svg>
        <div className="lp-theme07-triad-center">
          {showQuoteMark && <span className="lp-theme07-triad-quote-mark" aria-hidden="true">“</span>}
          {centerText && (
            <EditableField prop="centerText" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-triad-center-text">{centerText}</EditableField>
          )}
        </div>
        {showPillars && validPillars.map((pillar, index) => {
          const pos = TRIAD_POSITIONS[index] ?? { x: 50, y: 50 };
          const isFocus = index === focusIndex;
          return (
            <div
              key={index}
              className={`lp-theme07-card lp-theme07-triad-pillar ${isFocus ? 'lp-focus' : ''}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, animationDelay: `${index * 90}ms` }}
            >
              {isFocus && <span className="lp-focus-lens" aria-hidden="true" />}
              <div className="lp-theme07-card-accent-bar" />
              <div className="lp-theme07-triad-pillar-head">
                <span className="lp-theme07-triad-pillar-name">
                  <EditableField prop={`pillars.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{pillar.name}</EditableField>
                </span>
                {pillar.value && (
                  <span className="lp-theme07-triad-pillar-value">
                    <EditableField prop={`pillars.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{pillar.value}</EditableField>
                  </span>
                )}
              </div>
              {pillar.note && (
                <div className="lp-theme07-triad-pillar-note">
                  <EditableField prop={`pillars.${index}.note`} slideIdx={_slideIdx} editable={_editable} as="span">{pillar.note}</EditableField>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showSource && source && (
        <div className="lp-theme07-triad-source">
          <EditableField prop="source" slideIdx={_slideIdx} editable={_editable} as="span">{source}</EditableField>
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
