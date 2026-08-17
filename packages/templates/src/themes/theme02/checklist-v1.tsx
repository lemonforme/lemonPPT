// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ChecklistV1Item {
  text: string;
  note?: string;
}

export interface Theme02ChecklistV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme02ChecklistV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChecklistV1Meta: LayoutMeta = {
  id: 'theme02_checklist_v1',
  theme: 'theme02',
  role: 'content',
  displayName: 'Theme 02 行动清单',
  description: '带勾选标记的待办 / 行动项列表',
  needsMedia: false,
};

export const theme02ChecklistV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'items',
      label: '清单项',
      type: 'array',
      minItems: 0,
      maxItems: 8,
      itemSchema: [
        { key: 'text', label: '内容', type: 'text', inlineEditable: true },
        { key: 'note', label: '备注', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme02ChecklistV1(props: Theme02ChecklistV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-checklist-v1">
      <div className="lp-card lp-theme02-checklist-card lp-rise">
        <div className="lp-theme02-checklist-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-checklist-title">
            {title}
          </EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-checklist-subtitle">
              {subtitle}
            </EditableField>
          )}
        </div>
        <ul className="lp-theme02-checklist-list">
          {items.map((it, i) => (
            <li key={i} className="lp-theme02-checklist-item lp-rise" style={{ animationDelay: `${i * 50}ms` }}>
              <span className="lp-theme02-checklist-mark">✓</span>
              <div className="lp-theme02-checklist-body">
                <EditableField prop={`items.${i}.text`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-checklist-text">
                  {it.text}
                </EditableField>
                {it.note && (
                  <EditableField prop={`items.${i}.note`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-checklist-note">
                    {it.note}
                  </EditableField>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
