// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface RoadmapV2Props {
  kicker?: string;
  title: string;
  phases?: { phase?: string; goals?: string[] }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const roadmapV2Meta: LayoutMeta = {
  id: 'roadmap_v2',
  theme: 'base',
  role: 'roadmap',
  displayName: '阶段路线图',
  description: '按阶段展示产品路线图和关键目标',
  needsMedia: false,
};

export function RoadmapV2(props: RoadmapV2Props): ReactNode {
  const { kicker, title, phases = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-roadmap-v2">
      <div className="lp-roadmap-v2-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-roadmap-v2-track">
        {phases.map((phase, phaseIndex) => (
          <div key={phaseIndex} className="lp-roadmap-v2-phase">
            <div className="lp-roadmap-v2-connector" />
            <EditableField
              prop={`phases.${phaseIndex}.phase`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-roadmap-v2-phase-title"
            >
              {phase.phase}
            </EditableField>
            <ul className="lp-roadmap-v2-goals">
              {(phase.goals ?? []).map((goal, goalIndex) => (
                <li key={goalIndex} className="lp-roadmap-v2-goal-item">
                  <EditableField
                    prop={`phases.${phaseIndex}.goals.${goalIndex}`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                    className="lp-roadmap-v2-goal"
                  >
                    {goal}
                  </EditableField>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
