// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface SplitV1Props {
  kicker?: string;
  title: string;
  points?: string[];
  imageUrl?: string;
  imageAlt?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const splitV1Meta: LayoutMeta = {
  id: 'split_v1',
  theme: 'base',
  role: 'content',
  displayName: '图文分屏',
  description: '左文右图分屏展示，适合产品亮点或场景介绍',
  needsMedia: true,
};

export function SplitV1(props: SplitV1Props): ReactNode {
  const { kicker, title, points = [], imageUrl, imageAlt, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-split-v1">
      <div className="lp-split-v1-content">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading lp-split-v1-title">
          {title}
        </EditableField>
        {points.length > 0 && (
          <ul className="lp-split-v1-points">
            {points.map((point, index) => (
              <li key={index}>
                <EditableField prop={`points.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {point}
                </EditableField>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="lp-split-v1-media">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt || ''}
            data-lp-editable-image="true"
            data-lp-slide-idx={_slideIdx}
            data-lp-prop="imageUrl"
          />
        ) : (
          <div className="lp-split-v1-placeholder" />
        )}
      </div>
    </div>
  );
}
