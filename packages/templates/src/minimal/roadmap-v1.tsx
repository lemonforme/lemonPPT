import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface RoadmapV1Props {
  kicker?: string;
  title: string;
  phases?: { title?: string; description?: string; status?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const roadmapV1Meta: LayoutMeta = {
  id: 'roadmap_v1',
  theme: 'base',
  role: 'roadmap',
  displayName: '路线图',
  description: '垂直阶段路线图，展示规划与里程碑',
  needsMedia: false,
};

export function RoadmapV1(props: RoadmapV1Props): ReactNode {
  const { kicker, title, phases = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-roadmap-v1">
      <div className="lp-roadmap-v1-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-roadmap-v1-track">
        {phases.map((phase, index) => (
          <div key={index} className="lp-roadmap-v1-phase">
            <div className="lp-roadmap-v1-dot" />
            <div className="lp-roadmap-v1-body">
              <div className="lp-roadmap-v1-top">
                <EditableField
                  prop={`phases.${index}.title`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="h3"
                  className="lp-roadmap-v1-title"
                >
                  {phase.title}
                </EditableField>
                {phase.status && (
                  <EditableField
                    prop={`phases.${index}.status`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                    className="lp-roadmap-v1-status"
                  >
                    {phase.status}
                  </EditableField>
                )}
              </div>
              {phase.description && (
                <EditableField
                  prop={`phases.${index}.description`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="p"
                  className="lp-roadmap-v1-description"
                >
                  {phase.description}
                </EditableField>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
