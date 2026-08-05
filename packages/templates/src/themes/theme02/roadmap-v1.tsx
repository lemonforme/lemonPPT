// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02RoadmapV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  phases?: Array<{
    phase?: string;
    items?: string[];
  }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02RoadmapV1Meta: LayoutMeta = {
  id: 'theme02_roadmap_v1',
  theme: 'theme02',
  role: 'roadmap',
  displayName: 'Theme 02 霓虹路线',
  description: '分阶段玻璃卡片路线图 + 霓虹时间轴',
  needsMedia: false,
};

export const theme02RoadmapV1Schema: PropsSchema = {
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
          inlineEditable: true,
        },
        {
          key: 'items',
          label: '子项',
          type: 'array',
          minItems: 1,
          maxItems: 6,
          itemSchema: [
            {
              key: 'item',
              label: '项',
              type: 'text',
              inlineEditable: true,
            },
          ],
        },
      ],
    },
  ],
};

export function Theme02RoadmapV1(props: Theme02RoadmapV1Props): ReactNode {
  const { kicker, title, subtitle, phases = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-roadmap-v1">
      <div className="lp-theme02-roadmap-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-roadmap-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-roadmap-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme02-roadmap-track">
        {phases.map((phase, index) => (
          <div key={index} className="lp-theme02-roadmap-phase lp-rise" style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`lp-theme02-roadmap-marker lp-theme02-roadmap-marker--${['accent', 'cool', 'warm'][index % 3]}`}>
              <span className="lp-theme02-roadmap-number">{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="lp-theme02-roadmap-card">
              <EditableField
                prop={`phases.${index}.phase`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="h3"
                className="lp-theme02-roadmap-phase-title"
              >
                {phase.phase}
              </EditableField>
              <ul className="lp-theme02-roadmap-list">
                {(phase.items ?? []).map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <EditableField prop={`phases.${index}.items.${itemIndex}`} slideIdx={_slideIdx} editable={_editable} as="span">
                      {item}
                    </EditableField>
                  </li>
                ))}
              </ul>
            </div>
            {index < phases.length - 1 && <div className="lp-theme02-roadmap-connector" />}
          </div>
        ))}
      </div>
    </div>
  );
}
