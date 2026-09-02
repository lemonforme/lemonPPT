// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet, Masthead, Headline, Blob, DottedPattern, NumberSticker } from './shared.js';

export interface Theme01ComparisonV2Props {
  kicker?: string;
  title?: string;
  cards?: Array<{ label?: string; score?: number; max?: number; note?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ComparisonV2Meta: LayoutMeta = {
  id: 'theme01_comparison_v2',
  theme: 'theme01',
  role: 'comparison',
  displayName: 'Theme 01 评分卡对比',
  description: '多维度评分卡并排对比，色块拼贴风',
  needsMedia: false,
};

export const theme01ComparisonV2Schema: PropsSchema = {
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
      key: 'cards',
      label: '卡片',
      type: 'array',
      maxItems: 4,
      minItems: 2,
      itemSchema: [
        {
          key: 'label',
          label: '名称',
          type: 'text',
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

const CARD_COLORS = ['red', 'blue', 'green', 'amber'] as const;

export function Theme01ComparisonV2(props: Theme01ComparisonV2Props): ReactNode {
  const { kicker, title, cards = [], _slideIdx, _editable } = props;
  const safeCards = cards.slice(0, 4);

  return (
    <Sheet substrate="light" frame="grid" className="lp-comparison-v2">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title ?? ''} en="SCORECARD" size="large" className="lp-comparison-v2-headline lp-rise" />
      <div className="lp-comparison-v2-grid lp-rise">
        {safeCards.map((card, index) => {
          const color = CARD_COLORS[index % CARD_COLORS.length];
          const score = typeof card.score === 'number' ? card.score : Number(card.score) || 0;
          const max = (typeof card.max === 'number' && card.max > 0) ? card.max : Number(card.max) || 100;
          const pct = Math.min(100, Math.max(0, (score / max) * 100));
          return (
            <div key={index} className={`lp-comparison-v2-card color-${color}`}>
              <div className="lp-comparison-v2-card-head">
                <NumberSticker value={String(index + 1).padStart(2, '0')} />
                <EditableField
                  prop={`cards.${index}.label`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="h3"
                  className="lp-comparison-v2-label"
                >
                  {card.label}
                </EditableField>
              </div>
              <div className="lp-comparison-v2-score-row">
                <EditableField
                  prop={`cards.${index}.score`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="span"
                  fieldType="number"
                  className="lp-comparison-v2-score"
                >
                  {score}
                </EditableField>
                <span className="lp-comparison-v2-max">/ {max}</span>
              </div>
              <div className="lp-comparison-v2-bar">
                <div className="lp-comparison-v2-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <EditableField
                prop={`cards.${index}.note`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="p"
                className="lp-comparison-v2-note"
              >
                {card.note || ''}
              </EditableField>
            </div>
          );
        })}
      </div>
      <Blob
        className="lp-comparison-v2-blob"
        style={{ width: 320, height: 320, top: -80, right: -60, background: 'var(--lp-green)', opacity: 0.16 }}
      />
      <DottedPattern
        className="lp-comparison-v2-dots"
        style={{ bottom: 100, left: 80, width: 160, height: 160, opacity: 0.22 }}
      />
    </Sheet>
  );
}
