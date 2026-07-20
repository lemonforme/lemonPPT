// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface ContentV1Props {
  kicker?: string;
  title: string;
  points?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const contentV1Meta: LayoutMeta = {
  id: 'content_v1',
  theme: 'base',
  role: 'content',
  displayName: '要点内容',
  description: '标题 + bullet points，适合正文页',
  needsMedia: false,
};

export function ContentV1(props: ContentV1Props): ReactNode {
  const { kicker, title, points = [], _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-content-v1">
      <div className="lp-content-inner">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading lp-content-title">
          {title}
        </EditableField>
        {points.length > 0 && (
          <ul className="lp-bullet-list">
            {points.map((point, index) => (
              <li key={index}>
                <EditableField
                  prop={`points.${index}`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="span"
                >
                  {point}
                </EditableField>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
