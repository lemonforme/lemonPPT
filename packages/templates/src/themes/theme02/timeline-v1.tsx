// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02TimelineV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  milestones: Array<{ date: string; title: string; description?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02TimelineV1Meta: LayoutMeta = {
  id: 'theme02_timeline_v1',
  theme: 'theme02',
  role: 'timeline',
  displayName: 'Theme 02 霓虹时间轴',
  description: '横向时间轴 + 霓虹节点 + 玻璃卡片',
  needsMedia: false,
};

export const theme02TimelineV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'milestones',
      label: '里程碑',
      type: 'array',
      itemSchema: [
        { key: 'date', label: '日期', type: 'text', inlineEditable: true },
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
      ],
    },
  ],
};

export function Theme02TimelineV1(props: Theme02TimelineV1Props): ReactNode {
  const { kicker, title, subtitle, milestones = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-timeline-v1">
      <div className="lp-theme02-timeline-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-timeline-title lp-rise">
            {title}
          </EditableField>
        )}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-timeline-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme02-timeline-track">
        {milestones.map((milestone, index) => (
          <div key={index} className="lp-theme02-timeline-node lp-rise" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="lp-theme02-timeline-dot" />
            <div className="lp-theme02-timeline-card">
              <EditableField
                prop={`milestones.${index}.date`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-theme02-timeline-date"
              >
                {milestone.date}
              </EditableField>
              <EditableField
                prop={`milestones.${index}.title`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="h3"
                className="lp-theme02-timeline-card-title"
              >
                {milestone.title}
              </EditableField>
              {milestone.description && (
                <EditableField
                  prop={`milestones.${index}.description`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="p"
                  className="lp-theme02-timeline-description"
                >
                  {milestone.description}
                </EditableField>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
