// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01OutlookV1Item {
  title?: string;
  trend?: string;
  action?: string;
}

export interface Theme01OutlookV1Props {
  kicker?: string;
  title?: string;
  items?: Theme01OutlookV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01OutlookV1Meta: LayoutMeta = {
  id: 'theme01_outlook_v1',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 投资展望',
  description: '标题 + 趋势判断 + 行动建议',
  needsMedia: false,
};

export const theme01OutlookV1Schema: PropsSchema = {
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
      key: 'items',
      label: '目录项',
      type: 'array',
      maxItems: 3,
      minItems: 2,
      itemSchema: [
    {
          key: 'title',
          label: '标题',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'trend',
          label: '趋势',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'action',
          label: '行动',
          type: 'textarea',
          inlineEditable: true
    }
      ]
  }
  ]
};


export function Theme01OutlookV1(props: Theme01OutlookV1Props): ReactNode {
  const { kicker, title = '投资展望', items = [], _slideIdx, _editable } = props;
  const safeItems = items.slice(0, 3);

  return (
  <div className="lp-slide lp-outlook-v1">
      <div className="lp-outlook-v1-inner">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-outlook-v1-title lp-rise">
          {title}
    </EditableField>
    {safeItems.length > 0 && (
          <div className="lp-outlook-v1-list lp-rise">
      {safeItems.map((item, index) => (
              <div key={index} className="lp-card lp-outlook-v1-card">
        <div className="lp-outlook-v1-step">
                  <span className="lp-outlook-v1-step-number">{index + 1}</span>
        </div>
        <div className="lp-outlook-v1-body">
                  <EditableField
          prop={`items.${index}.title`}
          slideIdx={_slideIdx}
          editable={_editable}
          as="h3"
          className="lp-outlook-v1-item-title"
                  >
          {item.title || ''}
                  </EditableField>
                  <div className="lp-outlook-v1-row">
          <span className="lp-outlook-v1-label">趋势判断</span>
          <EditableField
                      prop={`items.${index}.trend`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-outlook-v1-trend"
          >
                      {item.trend || ''}
          </EditableField>
                  </div>
                  <div className="lp-outlook-v1-row">
          <span className="lp-outlook-v1-label">行动建议</span>
          <EditableField
                      prop={`items.${index}.action`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-outlook-v1-action"
          >
                      {item.action || ''}
          </EditableField>
                  </div>
        </div>
              </div>
      ))}
          </div>
    )}
      </div>
  </div>
  );
}
