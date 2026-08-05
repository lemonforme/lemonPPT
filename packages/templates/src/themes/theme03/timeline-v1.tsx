// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03TimelineV1Milestone {
  date?: string;
  title?: string;
  description?: string;
}

export interface Theme03TimelineV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  milestones?: Theme03TimelineV1Milestone[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03TimelineV1Meta: LayoutMeta = {
  id: 'theme03_timeline_v1',
  theme: 'theme03',
  role: 'timeline',
  displayName: 'Theme 03 编辑风时间轴',
  description: '横向时间轴 + mono 日期节点 + 上下交错卡片',
  needsMedia: false,
  tags: ['timeline', 'milestones', 'history'],
  contentShape: 'horizontal-timeline',
};

export const theme03TimelineV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '发展脉络' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '08' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'AI 编码助手演进 · 2019-2024' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{六年}}：AI 助手从玩具到基础设施' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'milestones',
      label: '里程碑',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        { key: 'date', label: '日期', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-timeline-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03TimelineV1(props: Theme03TimelineV1Props): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    milestones = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validMilestones = (milestones || [])
    .filter((m): m is Theme03TimelineV1Milestone => m != null && !!(m.date || m.title));

  return (
    <div className="lp-slide lp-theme03-timeline-v1">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-timeline-main">
        <div className="lp-theme03-timeline-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-timeline-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {validMilestones.length > 0 && (
          <div className="lp-theme03-timeline-track lp-rise">
            <div className="lp-theme03-timeline-line" />
            {validMilestones.map((milestone, index) => {
              const isTop = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`lp-theme03-timeline-node ${isTop ? 'lp-theme03-timeline-node--top' : 'lp-theme03-timeline-node--bottom'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="lp-theme03-timeline-dot" />
                  <div className="lp-theme03-timeline-card">
                    <EditableField
                      prop={`milestones.${index}.date`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="div"
                      className="lp-theme03-timeline-date"
                    >
                      {milestone.date}
                    </EditableField>
                    <EditableField
                      prop={`milestones.${index}.title`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="h3"
                      className="lp-theme03-timeline-card-title"
                    >
                      {milestone.title}
                    </EditableField>
                    {milestone.description && (
                      <EditableField
                        prop={`milestones.${index}.description`}
                        slideIdx={_slideIdx}
                        editable={_editable}
                        as="p"
                        className="lp-theme03-timeline-description"
                      >
                        {milestone.description}
                      </EditableField>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
