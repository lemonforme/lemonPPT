// lemonPPT - theme07 重定价时间线页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07RepricingV1Phase {
  date?: string;
  title?: string;
  description?: string;
}

export interface Theme07RepricingV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  phases?: Theme07RepricingV1Phase[];
  footnote?: string;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07RepricingV1Meta: LayoutMeta = {
  id: 'theme07_repricing_v1',
  theme: 'theme07',
  role: 'timeline',
  displayName: 'Theme 07 重定价时间线',
  description: '横向时间线展示估值重定价或周期阶段',
  needsMedia: true,
  tags: ['timeline', 'repricing', 'valuation'],
  contentShape: 'three-phase-timeline',
};

export const theme07RepricingV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'REPRICING' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '估值重定价周期' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从高点到再平衡的典型阶段' },
    {
      key: 'phases',
      label: '阶段',
      type: 'array',
      minItems: 2,
      maxItems: 5,
      defaultValue: [
        { date: '2021', title: '估值高点', description: '宽松资金环境下估值快速膨胀' },
        { date: '2022', title: '估值修正', description: '利率上升导致一级市场估值回调' },
        { date: '2023', title: '分化阶段', description: '收入可见性高的公司维持估值' },
        { date: '2024', title: '再平衡', description: '市场定价回归基本面与单位经济模型' },
      ],
      itemSchema: [
        { key: 'date', label: '时间', type: 'text', inlineEditable: true },
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
      ],
    },
    { key: 'footnote', label: '页脚说明', type: 'textarea', inlineEditable: true, defaultValue: '估值重定价节奏因赛道与阶段而异，以上为市场平均水平。' },
    { key: 'focusIndex', label: '高亮阶段', type: 'slider', min: 0, max: 4, defaultValue: 0 },
  ],
};

export function Theme07RepricingV1(props: Theme07RepricingV1Props): ReactNode {
  const { imageUrl, kicker, title, subtitle, phases = [], footnote, focusIndex = 0, _slideIdx, _editable } = props;
  const validPhases = (phases || []).filter((p): p is Theme07RepricingV1Phase => p != null).slice(0, 5);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-timeline">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-timeline-header lp-rise">
        <Theme07IconChip name="scale" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      {validPhases.length > 0 && (
        <div className="lp-theme07-timeline-track lp-rise">
          {validPhases.map((phase, index) => (
            <div key={index} className="lp-theme07-timeline-item">
              <div className="lp-theme07-timeline-dot" />
              {phase.date && <div className="lp-theme07-timeline-date">{phase.date}</div>}
              {phase.title && <div className="lp-theme07-timeline-title"><EditableField prop={`phases.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{phase.title}</EditableField></div>}
            </div>
          ))}
        </div>
      )}
      {validPhases.length > 0 && (
        <div className="lp-theme07-timeline-cards lp-rise">
          {validPhases.map((phase, index) => (
            <div key={index} className={`lp-theme07-card lp-theme07-timeline-card ${index === focusIndex ? 'lp-focus' : ''}`}>
              {index === focusIndex && <span className="lp-focus-lens" aria-hidden="true" />}
              <div className="lp-theme07-timeline-card-date">{phase.date}</div>
              {phase.title && <div className="lp-theme07-timeline-card-title"><EditableField prop={`phases.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{phase.title}</EditableField></div>}
              {phase.description && <div className="lp-theme07-timeline-card-desc"><EditableField prop={`phases.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="span">{phase.description}</EditableField></div>}
            </div>
          ))}
        </div>
      )}
      {footnote && <div className="lp-theme07-timeline-footnote lp-rise"><EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnote}</EditableField></div>}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
