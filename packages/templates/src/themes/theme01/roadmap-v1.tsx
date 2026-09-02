// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet, Masthead, Headline, NumberSticker, Blob, DottedPattern, Ring } from './shared.js';

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
  description: '分阶段色块拼贴路线图',
  needsMedia: false,
};

export const theme01RoadmapV1Schema: PropsSchema = {
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
          minItems: 2,
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

const PHASE_COLORS = ['blue', 'green', 'amber', 'red', 'violet', 'cyan'] as const;

export function Theme01RoadmapV1(props: Theme01RoadmapV1Props): ReactNode {
  const { kicker, title, phases = [], _slideIdx, _editable } = props;
  const safePhases = phases.slice(0, 6);

  return (
    <Sheet substrate="light" frame="grid" className="lp-roadmap-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title ?? ''} en="ROADMAP" size="large" className="lp-roadmap-v1-headline lp-rise" />
      <div className="lp-roadmap-v1-grid lp-rise">
        {safePhases.map((phase, index) => {
          const color = PHASE_COLORS[index % PHASE_COLORS.length];
          return (
            <div key={index} className={`lp-roadmap-v1-card color-${color}`}>
              <div className="lp-roadmap-v1-card-head">
                <NumberSticker value={String(index + 1).padStart(2, '0')} />
                <EditableField
                  prop={`phases.${index}.phase`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="h3"
                  className="lp-roadmap-v1-phase-title"
                >
                  {phase.phase}
                </EditableField>
              </div>
              <ul className="lp-roadmap-v1-list">
                {(phase.items ?? []).slice(0, 5).map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <EditableField
                      prop={`phases.${index}.items.${itemIndex}`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                    >
                      {item}
                    </EditableField>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <Blob
        className="lp-roadmap-v1-blob"
        style={{ width: 340, height: 340, bottom: -100, right: -80, background: 'var(--lp-amber)', opacity: 0.18 }}
      />
      <DottedPattern
        className="lp-roadmap-v1-dots"
        style={{ top: 130, left: 70, width: 150, height: 150, opacity: 0.22 }}
      />
      <Ring
        className="lp-roadmap-v1-ring"
        style={{ width: 90, height: 90, bottom: 120, left: 90, borderColor: 'var(--lp-green)' }}
      />
    </Sheet>
  );
}
