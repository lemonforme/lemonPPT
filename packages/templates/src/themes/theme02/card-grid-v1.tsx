// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02CardGridV1Card {
  title: string;
  desc?: string;
  tag?: string;
}

export interface Theme02CardGridV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  cards?: Theme02CardGridV1Card[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02CardGridV1Meta: LayoutMeta = {
  id: 'theme02_card_grid_v1',
  theme: 'theme02',
  role: 'content',
  displayName: 'Theme 02 通用卡片网格',
  description: '自适应卡片网格，每张卡含标签 + 标题 + 描述',
  needsMedia: false,
};

export const theme02CardGridV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'cards',
      label: '卡片',
      type: 'array',
      minItems: 0,
      maxItems: 9,
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'desc', label: '描述', type: 'text', inlineEditable: true },
        { key: 'tag', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme02CardGridV1(props: Theme02CardGridV1Props): ReactNode {
  const { kicker, title, subtitle, cards = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-card-grid-v1">
      <div className="lp-card lp-theme02-card-grid-card lp-rise">
        <div className="lp-theme02-card-grid-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-card-grid-title">
            {title}
          </EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-card-grid-subtitle">
              {subtitle}
            </EditableField>
          )}
        </div>
        <div className="lp-theme02-card-grid-items">
          {cards.map((c, i) => (
            <div key={i} className="lp-theme02-card-grid-item lp-rise" style={{ animationDelay: `${i * 50}ms` }}>
              {c.tag && (
                <EditableField prop={`cards.${i}.tag`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-card-grid-tag">
                  {c.tag}
                </EditableField>
              )}
              <EditableField prop={`cards.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme02-card-grid-item-title">
                {c.title}
              </EditableField>
              {c.desc && (
                <EditableField prop={`cards.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-card-grid-item-desc">
                  {c.desc}
                </EditableField>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
