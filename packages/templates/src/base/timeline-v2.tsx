// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface TimelineV2Props {
  kicker?: string;
  title: string;
  milestones?: { date?: string; title?: string; description?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const timelineV2Meta: LayoutMeta = {
  id: 'timeline_v2',
  theme: 'base',
  role: 'timeline',
  displayName: '垂直时间线',
  description: '垂直时间线展示关键里程碑，适合发展历程、项目节点',
  needsMedia: false,
};

export function TimelineV2(props: TimelineV2Props): ReactNode {
  const { kicker, title, milestones = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-timeline-v2">
      <div className="lp-timeline-v2-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-timeline-v2-list">
        {milestones.map((milestone, index) => (
          <div key={index} className="lp-timeline-v2-item">
            <div className="lp-timeline-v2-marker">
              <div className="lp-timeline-v2-dot" />
              {index < milestones.length - 1 && <div className="lp-timeline-v2-line" />}
            </div>
            <div className="lp-timeline-v2-body">
              <EditableField
                prop={`milestones.${index}.date`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-timeline-v2-date"
              >
                {milestone.date}
              </EditableField>
              <EditableField
                prop={`milestones.${index}.title`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="h3"
                className="lp-timeline-v2-title"
              >
                {milestone.title}
              </EditableField>
              {milestone.description && (
                <EditableField
                  prop={`milestones.${index}.description`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="p"
                  className="lp-timeline-v2-description"
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
