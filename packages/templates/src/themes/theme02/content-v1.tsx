// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ContentV1Props {
  title?: string;
  subtitle?: string;
  kicker?: string;
  bullets?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ContentV1Meta: LayoutMeta = {
  id: 'theme02_content_v1',
  theme: 'theme02',
  role: 'content',
  displayName: 'Theme 02 内容页',
  description: '霓虹标题 + 发光 bullet 列表',
  needsMedia: false,
};

export const theme02ContentV1Schema: PropsSchema = {
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
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'bullets',
      label: '要点',
      type: 'array',
      minItems: 2,
      maxItems: 8,
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

export function Theme02ContentV1(props: Theme02ContentV1Props): ReactNode {
  const { title = '', subtitle, kicker, bullets = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-content-v1">
      <div className="lp-card lp-theme02-content-card lp-rise">
        <div className="lp-theme02-content-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-content-title">
            {title}
          </EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-content-subtitle">
              {subtitle}
            </EditableField>
          )}
        </div>
        <ul className="lp-theme02-bullet-list">
          {bullets.map((bullet, index) => (
            <li key={index} className="lp-rise" style={{ animationDelay: `${index * 60}ms` }}>
              <EditableField prop={`bullets.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">
                {bullet}
              </EditableField>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
