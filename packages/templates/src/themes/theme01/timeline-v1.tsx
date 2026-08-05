// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
export interface Theme01TimelineV1Props {
  kicker?: string;
  title?: string;
  events?: Array<{
    date?: string;
    title?: string;
    description?: string;
  }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01TimelineV1Meta: LayoutMeta = {
  id: 'theme01_timeline_v1',
  theme: 'theme01',
  role: 'timeline',
  displayName: 'Theme 01 时间轴',
  description: '横向玻璃卡片时间轴',
  needsMedia: false,
};
export const theme01TimelineV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'events',
      label: '里程碑',
      type: 'array',
      maxItems: 8,
      minItems: 1,
      itemSchema: [
        {
          key: 'date',
          label: '日期',
          type: 'text',
          inlineEditable: true
        },
        {
          key: 'title',
          label: '标题',
          type: 'text',
          inlineEditable: true
        },
        {
          key: 'description',
          label: '描述',
          type: 'textarea',
          inlineEditable: true
        }
      ]
    }
  ]
};
export function Theme01TimelineV1(props: Theme01TimelineV1Props): ReactNode {
  const { kicker, title, events = [], _slideIdx, _editable } = props;
  return (<div className="lp-slide lp-timeline-v1">
      <div className="lp-timeline-header">
    {kicker && (<EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>)}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-timeline-title lp-rise">
          {title}
    </EditableField>
      </div>
      <div className="lp-timeline-track">
    {events.map((event, index) => (<div key={index} className="lp-timeline-item lp-rise">
      <div className="lp-timeline-dot"/>
      <div className="lp-card lp-timeline-card">
              <EditableField prop={`events.${index}.date`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-timeline-date">
        {event.date}
              </EditableField>
              <EditableField prop={`events.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-timeline-event-title">
        {event.title}
              </EditableField>
              <EditableField prop={`events.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-timeline-description">
        {event.description}
              </EditableField>
      </div>
          </div>))}
      </div>
  </div>);
}
