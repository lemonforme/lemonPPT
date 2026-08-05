// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

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
      inlineEditable: true
  },
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
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
          inlineEditable: true
    },
    {
          key: 'change',
          label: '变化',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'value',
          label: '数值',
          type: 'number',
          inlineEditable: true
    },
    {
          key: 'note',
          label: '备注',
          type: 'textarea',
          inlineEditable: true
    }
      ]
  }
  ]
};


export function Theme01RegionV1(props: Theme01RegionV1Props): ReactNode {
  const { kicker, title = '地区/市场分布', regions = [], _slideIdx, _editable } = props;
  const safeRegions = regions.slice(0, 6);

  return (
  <div className="lp-slide lp-region-v1">
      <div className="lp-region-v1-inner">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-region-v1-title lp-rise">
          {title}
    </EditableField>
    {safeRegions.length > 0 && (
          <div className="lp-region-v1-grid lp-rise">
      {safeRegions.map((region, index) => (
              <div key={index} className="lp-card lp-region-v1-card">
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
                  <span className="lp-region-v1-change">
          <EditableField
                      prop={`regions.${index}.change`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
          >
                      {region.change || ''}
          </EditableField>
                  </span>
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
      ))}
          </div>
    )}
      </div>
  </div>
  );
}
