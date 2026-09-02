// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Headline, Masthead, Pill, Plus, Ring, Sheet, Slash } from './shared.js';

export interface Theme01RiskV1Item {
  risk?: string;
  impact?: string;
  response?: string;
}

export interface Theme01RiskV1Props {
  kicker?: string;
  title?: string;
  items?: Theme01RiskV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01RiskV1Meta: LayoutMeta = {
  id: 'theme01_risk_v1',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 风险研判',
  description: '色块拼贴风险列表 + 影响程度 + 应对策略',
  needsMedia: false,
};

export const theme01RiskV1Schema: PropsSchema = {
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
      label: '风险项',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      itemSchema: [
        {
          key: 'risk',
          label: '风险',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'impact',
          label: '影响程度',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'response',
          label: '应对策略',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
  ],
};

const RISK_COLORS = ['red', 'amber', 'blue', 'violet'] as const;

function impactColor(impact?: string): 'red' | 'amber' | 'blue' | 'green' {
  const v = (impact ?? '').toLowerCase();
  if (v.includes('高') || v.includes('严重') || v.includes('重大')) return 'red';
  if (v.includes('中')) return 'amber';
  if (v.includes('低') || v.includes('轻微')) return 'blue';
  return 'green';
}

export function Theme01RiskV1(props: Theme01RiskV1Props): ReactNode {
  const { kicker, title = '风险研判', items = [], _slideIdx, _editable } = props;
  const safeItems = items.slice(0, 4);

  return (
    <Sheet substrate="light" frame="grid" className="lp-risk-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title} en="RISK" size="large" className="lp-risk-v1-headline lp-rise" />
      {safeItems.length > 0 && (
        <div className="lp-risk-v1-grid lp-rise">
          {safeItems.map((item, index) => {
            const color = RISK_COLORS[index % RISK_COLORS.length];
            return (
              <div key={index} className={`lp-risk-v1-card color-${color}`}>
                <div className="lp-risk-v1-card-accent" aria-hidden="true" />
                <div className="lp-risk-v1-header">
                  <EditableField
                    prop={`items.${index}.risk`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="h3"
                    className="lp-risk-v1-risk"
                  >
                    {item.risk || ''}
                  </EditableField>
                  <span className="lp-risk-v1-index">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="lp-risk-v1-body">
                  <div className="lp-risk-v1-row">
                    <span className="lp-risk-v1-label">影响程度</span>
                    <Pill variant="fill" color={impactColor(item.impact)}>{item.impact || '-'}</Pill>
                  </div>
                  <div className="lp-risk-v1-row">
                    <span className="lp-risk-v1-label">应对策略</span>
                    <EditableField
                      prop={`items.${index}.response`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-risk-v1-response"
                    >
                      {item.response || ''}
                    </EditableField>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Blob
        className="lp-risk-v1-blob"
        style={{ width: 340, height: 340, bottom: -110, right: -80, background: 'var(--lp-red)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-risk-v1-dots"
        style={{ top: 150, left: 70, width: 180, height: 180, opacity: 0.22 }}
      />
      <Ring
        className="lp-risk-v1-ring"
        style={{ bottom: 90, right: 100, width: 64, height: 64, borderColor: 'var(--lp-amber)' }}
      />
      <Slash
        className="lp-risk-v1-slash"
        style={{ top: 120, right: 100, height: 60, background: 'var(--lp-blue)', opacity: 0.55 }}
      />
      <Plus
        className="lp-risk-v1-plus"
        style={{ bottom: 100, left: 90, width: 26, height: 26, color: 'var(--lp-green)' }}
      />
    </Sheet>
  );
}
