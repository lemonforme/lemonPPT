// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02SwimlaneV1Lane {
  name?: string;
  items?: string[];
}

export interface Theme02SwimlaneV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  phases?: string[];
  lanes?: Theme02SwimlaneV1Lane[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02SwimlaneV1Meta: LayoutMeta = {
  id: 'theme02_swimlane_v1',
  theme: 'theme02',
  role: 'process',
  displayName: 'Theme 02 泳道图',
  description: '阶段 × 泳道矩阵',
  needsMedia: false,
};

export const theme02SwimlaneV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    {
      key: 'phases',
      label: '阶段',
      type: 'array',
      maxItems: 5,
      minItems: 1,
      itemSchema: [{ key: 'item', label: '阶段', type: 'text', inlineEditable: true }],
    },
    {
      key: 'lanes',
      label: '泳道',
      type: 'array',
      maxItems: 4,
      minItems: 1,
      itemSchema: [
        { key: 'name', label: '泳道名', type: 'text', inlineEditable: true },
        {
          key: 'items',
          label: '条目',
          type: 'array',
          maxItems: 5,
          minItems: 0,
          itemSchema: [{ key: 'item', label: '条目', type: 'text', inlineEditable: true }],
        },
      ],
    },
  ],
};

function LaneRow(props: {
  lane: Theme02SwimlaneV1Lane;
  phaseCount: number;
  laneIndex: number;
  slideIdx?: number;
  editable?: boolean;
}): ReactElement {
  const { lane, phaseCount, laneIndex, slideIdx, editable } = props;
  return (
    <>
      <EditableField
        prop={`lanes.${laneIndex}.name`}
        slideIdx={slideIdx}
        editable={editable}
        as="div"
        className="lp-theme02-swimlane-name"
      >
        {lane.name}
      </EditableField>
      {Array.from({ length: phaseCount }).map((_, pi) => (
        <div key={`cell-${laneIndex}-${pi}`} className="lp-theme02-swimlane-cell">
          {(lane.items ?? []).map((item, ii) => (
            <EditableField
              key={ii}
              prop={`lanes.${laneIndex}.items.${ii}`}
              slideIdx={slideIdx}
              editable={editable}
              as="div"
              className="lp-theme02-swimlane-chip"
            >
              {item}
            </EditableField>
          ))}
        </div>
      ))}
    </>
  );
}

export function Theme02SwimlaneV1(props: Theme02SwimlaneV1Props): ReactNode {
  const { kicker, title, subtitle, phases = [], lanes = [], _slideIdx, _editable } = props;

  const safePhases = phases.filter((p): p is string => typeof p === 'string');
  const safeLanes = lanes.filter((l) => l && typeof l === 'object');

  return (
    <div className="lp-slide lp-theme02-swimlane-v1">
      <div className="lp-orb lp-theme02-orb--accent" />
      <div className="lp-theme02-swimlane-inner">
        <div className="lp-theme02-swimlane-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-swimlane-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-swimlane-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>
        <div
          className="lp-theme02-swimlane-grid"
          style={{ gridTemplateColumns: `180px repeat(${safePhases.length}, 1fr)` }}
        >
          <div className="lp-theme02-swimlane-corner" />
          {safePhases.map((phase, pi) => (
            <EditableField
              key={`phase-${pi}`}
              prop={`phases.${pi}`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-theme02-swimlane-phase"
            >
              {phase}
            </EditableField>
          ))}
          {safeLanes.map((lane, li) => (
            <LaneRow
              key={`lane-${li}`}
              lane={lane}
              phaseCount={safePhases.length}
              laneIndex={li}
              slideIdx={_slideIdx}
              editable={_editable}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
