import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface TimelineV1Props {
  kicker?: string;
  title: string;
  milestones?: { date?: string; title?: string; description?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const timelineV1Meta: LayoutMeta = {
  id: 'timeline_v1',
  theme: 'base',
  role: 'timeline',
  displayName: '时间线',
  description: '水平时间线展示关键里程碑',
  needsMedia: false,
};

export function TimelineV1(props: TimelineV1Props): ReactNode {
  const { kicker, title, milestones = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-timeline-v1">
      <div className="lp-timeline-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-timeline-track">
        {milestones.map((milestone, index) => (
          <div key={index} className="lp-timeline-item">
            <div className="lp-timeline-dot" />
            <EditableField
              prop={`milestones.${index}.date`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-timeline-date"
            >
              {milestone.date}
            </EditableField>
            <EditableField
              prop={`milestones.${index}.title`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-timeline-title"
            >
              {milestone.title}
            </EditableField>
            {milestone.description && (
              <EditableField
                prop={`milestones.${index}.description`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="p"
                className="lp-timeline-description"
              >
                {milestone.description}
              </EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
