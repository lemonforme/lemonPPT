// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
export interface Theme01RoadmapV1Props {
  kicker?: string;
  title?: string;
  phases?: Array<{
    phase?: string;
    items?: string[];
  }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01RoadmapV1Meta: LayoutMeta = {
  id: 'theme01_roadmap_v1',
  theme: 'theme01',
  role: 'roadmap',
  displayName: 'Theme 01 路线图',
  description: '分阶段玻璃卡片路线图',
  needsMedia: false,
};
export const theme01RoadmapV1Schema: PropsSchema = {
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
      key: 'phases',
      label: '阶段',
      type: 'array',
      maxItems: 6,
      minItems: 1,
      itemSchema: [
        {
          key: 'phase',
          label: '阶段',
          type: 'text',
          inlineEditable: true
        },
        {
          key: 'items',
          label: '子项',
          type: 'array',
          minItems: 2,
          maxItems: 6,
          itemSchema: [
            {
              key: 'item',
              label: '项',
              type: 'text',
              inlineEditable: true
            }
          ]
        }
      ]
    }
  ]
};
export function Theme01RoadmapV1(props: Theme01RoadmapV1Props): ReactNode {
  const { kicker, title, phases = [], _slideIdx, _editable } = props;
  return (<div className="lp-slide lp-roadmap-v1">
      <div className="lp-roadmap-header">
    {kicker && (<EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>)}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-roadmap-title lp-rise">
          {title}
    </EditableField>
      </div>
      <div className="lp-roadmap-grid">
    {phases.map((phase, index) => (<div key={index} className="lp-card lp-roadmap-card lp-rise">
      <div className="lp-roadmap-phase-number">{String(index + 1).padStart(2, '0')}</div>
      <EditableField prop={`phases.${index}.phase`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-roadmap-phase-title">
              {phase.phase}
      </EditableField>
      <ul className="lp-roadmap-list">
              {(phase.items ?? []).map((item, itemIndex) => (<li key={itemIndex}>
                  <EditableField prop={`phases.${index}.items.${itemIndex}`} slideIdx={_slideIdx} editable={_editable} as="span">
          {item}
                  </EditableField>
        </li>))}
      </ul>
          </div>))}
      </div>
  </div>);
}
