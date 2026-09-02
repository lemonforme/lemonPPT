// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Headline, Masthead, Pill, Plus, Ring, Sheet } from './shared.js';

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
  description: '色块拼贴趋势判断 + 行动建议',
  needsMedia: false,
};

export const theme01OutlookV1Schema: PropsSchema = {
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
      key: 'items',
      label: '展望项',
      type: 'array',
      maxItems: 3,
      minItems: 2,
      itemSchema: [
        {
          key: 'title',
          label: '标题',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'trend',
          label: '趋势',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'action',
          label: '行动',
          type: 'textarea',
          inlineEditable: true,
        },
      ],
    },
  ],
};

const OUTLOOK_COLORS = ['blue', 'green', 'amber'] as const;

function trendColor(trend?: string): 'red' | 'amber' | 'green' | 'blue' {
  const v = (trend ?? '').toLowerCase();
  if (v.includes('上') || v.includes('增长') || v.includes('积极') || v.includes('看好')) return 'green';
  if (v.includes('下') || v.includes('下降') || v.includes('谨慎') || v.includes('悲观')) return 'red';
  if (v.includes('平') || v.includes('震荡') || v.includes('观望')) return 'amber';
  return 'blue';
}

export function Theme01OutlookV1(props: Theme01OutlookV1Props): ReactNode {
  const { kicker, title = '投资展望', items = [], _slideIdx, _editable } = props;
  const safeItems = items.slice(0, 3);

  return (
    <Sheet substrate="light" frame="grid" className="lp-outlook-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title} en="OUTLOOK" size="large" className="lp-outlook-v1-headline lp-rise" />
      {safeItems.length > 0 && (
        <div className="lp-outlook-v1-grid lp-rise">
          {safeItems.map((item, index) => {
            const color = OUTLOOK_COLORS[index % OUTLOOK_COLORS.length];
            return (
              <article key={index} className={`lp-outlook-v1-card color-${color}`}>
                <div className="lp-outlook-v1-card-header">
                  <span className="lp-outlook-v1-index" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <EditableField
                    prop={`items.${index}.title`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="h3"
                    className="lp-outlook-v1-item-title"
                  >
                    {item.title || ''}
                  </EditableField>
                </div>
                <div className="lp-outlook-v1-card-perforation" aria-hidden="true">
                  <span className="lp-outlook-v1-card-hole left" />
                  <span className="lp-outlook-v1-card-hole right" />
                </div>
                <div className="lp-outlook-v1-card-body">
                  <div className="lp-outlook-v1-row">
                    <span className="lp-outlook-v1-label">趋势判断</span>
                    <Pill variant="fill" color={trendColor(item.trend)}>{item.trend || '-'}</Pill>
                  </div>
                  <div className="lp-outlook-v1-row lp-outlook-v1-action-row">
                    <span className="lp-outlook-v1-label">行动建议</span>
                    <EditableField
                      prop={`items.${index}.action`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="p"
                      className="lp-outlook-v1-action"
                    >
                      {item.action || ''}
                    </EditableField>
                  </div>
                </div>
                <span className="lp-outlook-v1-card-shadow" aria-hidden="true" />
              </article>
            );
          })}
        </div>
      )}
      <Blob
        className="lp-outlook-v1-blob"
        style={{ width: 360, height: 360, bottom: -120, left: -100, background: 'var(--lp-green)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-outlook-v1-dots"
        style={{ top: 140, right: 80, width: 180, height: 180, opacity: 0.22 }}
      />
      <Plus
        className="lp-outlook-v1-plus"
        style={{ top: 120, right: 110, width: 28, height: 28, color: 'var(--lp-amber)' }}
      />
      <Ring
        className="lp-outlook-v1-ring"
        style={{ bottom: 90, right: 100, width: 60, height: 60, borderColor: 'var(--lp-blue)' }}
      />
    </Sheet>
  );
}
