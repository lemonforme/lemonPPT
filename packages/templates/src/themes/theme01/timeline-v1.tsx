// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet, Masthead, Headline, NumberSticker, Arrow, Blob, DottedPattern } from './shared.js';

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
  description: '横向色块拼贴时间轴',
  needsMedia: false,
};

export const theme01TimelineV1Schema: PropsSchema = {
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
          inlineEditable: true,
        },
        {
          key: 'title',
          label: '标题',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'description',
          label: '描述',
          type: 'textarea',
          inlineEditable: true,
        },
      ],
    },
  ],
};

export function Theme01TimelineV1(props: Theme01TimelineV1Props): ReactNode {
  const { kicker, title, events = [], _slideIdx, _editable } = props;
  const safeEvents = events.slice(0, 6);

  return (
    <Sheet substrate="light" frame="grid" className="lp-timeline-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title ?? ''} en="TIMELINE" size="large" className="lp-timeline-v1-headline lp-rise" />
      <div className="lp-timeline-v1-track lp-rise">
        {safeEvents.map((event, index) => (
          <div key={index} className="lp-timeline-v1-item">
            <div className="lp-timeline-v1-card">
              <div className="lp-timeline-v1-date">
                <NumberSticker value={String(index + 1).padStart(2, '0')} outline />
                <EditableField
                  prop={`events.${index}.date`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="span"
                >
                  {event.date}
                </EditableField>
              </div>
              <EditableField
                prop={`events.${index}.title`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="h3"
                className="lp-timeline-v1-event-title"
              >
                {event.title}
              </EditableField>
              <EditableField
                prop={`events.${index}.description`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="p"
                className="lp-timeline-v1-description"
              >
                {event.description}
              </EditableField>
            </div>
            {index < safeEvents.length - 1 && <Arrow className="lp-timeline-v1-arrow" />}
          </div>
        ))}
      </div>
      <Blob
        className="lp-timeline-v1-blob"
        style={{ width: 320, height: 320, top: -80, left: -60, background: 'var(--lp-green)', opacity: 0.16 }}
      />
      <DottedPattern
        className="lp-timeline-v1-dots"
        style={{ bottom: 90, right: 80, width: 160, height: 160, opacity: 0.22 }}
      />
    </Sheet>
  );
}
