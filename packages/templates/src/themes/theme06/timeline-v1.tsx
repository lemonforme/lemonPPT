// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06TimelineV1Phase {
  date?: string;
  title?: string;
  description?: string;
}

export interface Theme06TimelineV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  phases?: Theme06TimelineV1Phase[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06TimelineV1Meta: LayoutMeta = {
  id: 'theme06_timeline_v1',
  theme: 'theme06',
  role: 'timeline',
  displayName: 'Theme 06 阶段时间线',
  description: '横向时间轴 + 阶段卡片，适合里程碑与策略节奏',
  needsMedia: true,
  tags: ['timeline', 'milestone', 'atlas'],
  contentShape: 'three-phase-timeline',
};

export const theme06TimelineV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'TIMELINE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '关键里程碑' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '未来 18 个月的重点推进节奏。' },
    {
      key: 'phases',
      label: '阶段',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { date: '2026 Q1', title: '产品验证', description: '完成核心场景 MVP 验证，确认 PMF。' },
        { date: '2026 Q2', title: '规模获客', description: '启动 GTM，聚焦种子客户与生态合作。' },
        { date: '2026 Q4', title: '商业化', description: '建立付费转化路径，实现收入闭环。' },
        { date: '2027 Q2', title: '出海准备', description: '验证多语言与区域合规能力。' },
      ],
      itemSchema: [
        { key: 'date', label: '时间', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
      ],
    },
    { key: 'footnote', label: '底部总标注', type: 'text', inlineEditable: true, defaultValue: '4 段 / FLOW' },
  ],
};

function splitBilingual(text?: string): { cn?: string; en?: string } {
  if (!text) return {};
  const parts = text.split(' / ');
  if (parts.length >= 2) return { cn: parts[0], en: parts.slice(1).join(' / ') };
  return { cn: text };
}

export function Theme06TimelineV1(props: Theme06TimelineV1Props): ReactNode {
  const { kicker, title, subtitle, phases = [], footnote, _slideIdx, _editable } = props;
  const validPhases = (phases || []).filter((p): p is Theme06TimelineV1Phase => p != null).slice(0, 4);
  const footnoteParts = splitBilingual(footnote);

  return (
    <div className="lp-slide lp-theme06-timeline">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-timeline-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validPhases.length > 0 && (
        <>
          <div className="lp-theme06-timeline-track lp-rise">
            {validPhases.map((phase, idx) => (
              <div key={idx} className="lp-theme06-timeline-item">
                <div className="lp-theme06-timeline-date">
                  <EditableField prop={`phases.${idx}.date`} slideIdx={_slideIdx} editable={_editable} as="span">{phase.date || ''}</EditableField>
                </div>
                <div className="lp-theme06-timeline-title">
                  <EditableField prop={`phases.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h3">{phase.title || ''}</EditableField>
                </div>
              </div>
            ))}
          </div>
          <div className="lp-theme06-timeline-cards lp-rise">
            {validPhases.map((phase, idx) => (
              <div key={idx} className="lp-theme06-card">
                <div className="lp-theme06-card-label">{String(idx + 1).padStart(2, '0')}</div>
                <div className="lp-theme06-timeline-card-title">
                  <EditableField prop={`phases.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h3">{phase.title || ''}</EditableField>
                </div>
                {phase.description && (
                  <div className="lp-theme06-timeline-card-desc">
                    <EditableField prop={`phases.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p">{phase.description}</EditableField>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        {footnote ? (
          <div className="lp-theme06-footer-bilingual">
            {footnoteParts.cn && (
              <span className="lp-theme06-footer-cn">
                <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteParts.cn}</EditableField>
              </span>
            )}
            {footnoteParts.en && (
              <span className="lp-theme06-footer-en">
                <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteParts.en}</EditableField>
              </span>
            )}
          </div>
        ) : (
          <>
            <span className="lp-theme06-footer-left" />
            <span className="lp-theme06-footer-right" />
          </>
        )}
      </div>
    </div>
  );
}
