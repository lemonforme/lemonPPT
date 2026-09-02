// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Headline, Masthead, Pill, Plus, Ring, Sheet, Slash } from './shared.js';

export interface Theme01RegionV1Item {
  name?: string;
  value?: string;
  change?: string;
  note?: string;
}

export interface Theme01RegionV1Props {
  kicker?: string;
  title?: string;
  regions?: Theme01RegionV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01RegionV1Meta: LayoutMeta = {
  id: 'theme01_region_v1',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 地区/市场分布',
  description: '多地区数据卡片',
  needsMedia: false,
};

export const theme01RegionV1Schema: PropsSchema = {
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
      key: 'regions',
      label: 'regions',
      type: 'array',
      maxItems: 6,
      minItems: 1,
      itemSchema: [
        {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'change',
          label: '变化',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'value',
          label: '数值',
          type: 'number',
          inlineEditable: true,
        },
        {
          key: 'note',
          label: '备注',
          type: 'textarea',
          inlineEditable: true,
        },
      ],
    },
  ],
};

const REGION_COLORS = ['blue', 'green', 'amber', 'red', 'violet', 'cyan'] as const;

function changeColor(change?: string): 'red' | 'green' | 'amber' {
  const v = (change ?? '').toLowerCase();
  if (v.includes('+') || v.includes('↑') || v.includes('增长') || v.includes('上升')) return 'green';
  if (v.includes('-') || v.includes('↓') || v.includes('下降') || v.includes('减少')) return 'red';
  return 'amber';
}

export function Theme01RegionV1(props: Theme01RegionV1Props): ReactNode {
  const { kicker, title = '地区/市场分布', regions = [], _slideIdx, _editable } = props;
  const safeRegions = regions.slice(0, 6);

  return (
    <Sheet substrate="light" frame="grid" className="lp-region-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title} en="REGIONS" size="large" className="lp-region-v1-headline lp-rise" />
      {safeRegions.length > 0 && (
        <div className={`lp-region-v1-grid lp-region-v1-grid--${safeRegions.length} lp-rise`}>
          {safeRegions.map((region, index) => {
            const color = REGION_COLORS[index % REGION_COLORS.length];
            return (
              <div key={index} className={`lp-region-v1-card color-${color}`}>
                <div className="lp-region-v1-card-accent" aria-hidden="true" />
                <div className="lp-region-v1-top">
                  <EditableField
                    prop={`regions.${index}.name`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="h3"
                    className="lp-region-v1-name"
                  >
                    {region.name || ''}
                  </EditableField>
                  {region.change && (
                    <Pill variant="fill" color={changeColor(region.change)} className="lp-region-v1-change">
                      {region.change}
                    </Pill>
                  )}
                </div>
                <div className="lp-region-v1-value-wrap">
                  <EditableField
                    prop={`regions.${index}.value`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                    className="lp-region-v1-value"
                  >
                    {region.value || ''}
                  </EditableField>
                </div>
                {region.note && (
                  <EditableField
                    prop={`regions.${index}.note`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="p"
                    className="lp-region-v1-note"
                  >
                    {region.note}
                  </EditableField>
                )}
              </div>
            );
          })}
        </div>
      )}
      <Blob
        className="lp-region-v1-blob"
        style={{ width: 340, height: 340, bottom: -100, right: -70, background: 'var(--lp-blue)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-region-v1-dots"
        style={{ top: 150, left: 70, width: 180, height: 180, opacity: 0.22 }}
      />
      <Ring
        className="lp-region-v1-ring"
        style={{ bottom: 90, right: 100, width: 64, height: 64, borderColor: 'var(--lp-amber)' }}
      />
      <Slash
        className="lp-region-v1-slash"
        style={{ top: 120, right: 100, height: 60, background: 'var(--lp-green)', opacity: 0.55 }}
      />
      <Plus
        className="lp-region-v1-plus"
        style={{ bottom: 100, left: 90, width: 26, height: 26, color: 'var(--lp-red)' }}
      />
    </Sheet>
  );
}
