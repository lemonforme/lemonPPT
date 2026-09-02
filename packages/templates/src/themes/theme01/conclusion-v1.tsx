// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Folio, Headline, NumberSticker, Pill, Plus, Ring, Sheet } from './shared.js';

export interface Theme01ConclusionV1Props {
  title?: string;
  subtitle?: string;
  points?: Array<{ item?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ConclusionV1Meta: LayoutMeta = {
  id: 'theme01_conclusion_v1',
  theme: 'theme01',
  role: 'closing',
  displayName: 'Theme 01 结论页',
  description: '标题 + 彩色序号核心结论卡片',
  needsMedia: false,
};

export const theme01ConclusionV1Schema: PropsSchema = {
  fields: [
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
      key: 'points',
      label: '要点',
      type: 'array',
      maxItems: 4,
      minItems: 2,
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
};

const cardColors = ['blue', 'green', 'amber', 'violet'] as const;

export function Theme01ConclusionV1(props: Theme01ConclusionV1Props): ReactNode {
  const { title = '结论', subtitle, points = [], _slideIdx, _editable } = props;
  const safePoints = points.slice(0, 4);

  return (
    <Sheet substrate="tint" tint="green" frame="grid" className="lp-conclusion-v1">
      <Blob
        className="lp-conclusion-v1-blob"
        style={{ width: 420, height: 420, bottom: -160, right: -120, background: 'var(--lp-green)', opacity: 0.14 }}
      />
      <DottedPattern
        className="lp-conclusion-v1-dots"
        style={{ top: 90, left: 80, width: 220, height: 220, opacity: 0.18 }}
      />
      <Ring
        className="lp-conclusion-v1-ring"
        style={{ width: 130, height: 130, top: 100, right: 100, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-conclusion-v1-plus"
        style={{ bottom: 120, left: 120, width: 34, height: 34, color: 'var(--lp-red)' }}
      />

      <div className="lp-conclusion-v1-content">
        <div className="lp-conclusion-v1-header lp-rise">
          {subtitle && (
            <div className="lp-conclusion-v1-kicker">
              <Pill variant="outline" color="green">
                {subtitle}
              </Pill>
            </div>
          )}
          <Headline cn={title} size="large" slideIdx={_slideIdx} editable={_editable} propCn="title" />
        </div>

        {safePoints.length > 0 && (
          <div className="lp-conclusion-v1-grid">
            {safePoints.map((point, index) => (
              <div
                key={index}
                className={`lp-conclusion-v1-card lp-conclusion-v1-card--${cardColors[index % cardColors.length]} lp-rise`}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <NumberSticker value={String(index + 1).padStart(2, '0')} />
                <EditableField
                  prop={`points.${index}.item`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="p"
                  className="lp-conclusion-v1-text"
                >
                  {point?.item ?? ''}
                </EditableField>
              </div>
            ))}
          </div>
        )}
      </div>

      <Folio
        left="CONCLUSION"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
