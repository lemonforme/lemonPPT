// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02TagsV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  tags?: Array<{
    label: string;
    value?: number;
    tone?: 'neutral' | 'positive' | 'negative' | 'accent';
  }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02TagsV1Meta: LayoutMeta = {
  id: 'theme02_tags_v1',
  theme: 'theme02',
  role: 'tags',
  displayName: 'Theme 02 霓虹标签墙',
  description: '深色背景 + 霓虹发光关键词标签云',
  needsMedia: false,
};

export const theme02TagsV1Schema: PropsSchema = {
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
      key: 'tags',
      label: '关键词',
      type: 'array',
      maxItems: 24,
      minItems: 1,
      itemSchema: [
        {
          key: 'label',
          label: '名称',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
  ],
};

export function Theme02TagsV1(props: Theme02TagsV1Props): ReactNode {
  const { kicker, title, subtitle, tags = [], _slideIdx, _editable } = props;
  const safeTags = tags.slice(0, 24);

  const toneClass = (tone?: string) => {
    switch (tone) {
      case 'positive':
        return 'lp-theme02-tags-v1-tag--positive';
      case 'negative':
        return 'lp-theme02-tags-v1-tag--negative';
      case 'accent':
        return 'lp-theme02-tags-v1-tag--accent';
      default:
        return '';
    }
  };

  return (
    <div className="lp-slide lp-theme02-tags-v1">
      <div className="lp-theme02-tags-v1-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-tags-v1-title lp-rise">
            {title}
          </EditableField>
        )}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-tags-v1-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme02-tags-v1-card lp-rise">
        <div className="lp-theme02-tags-v1-cloud">
          {safeTags.map((tag, index) => (
            <EditableField
              key={index}
              prop={`tags.${index}.label`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="span"
              className={`lp-theme02-tags-v1-tag ${toneClass(tag.tone)}`}
            >
              {tag.label}
              {tag.value !== undefined && tag.value > 0 && <span className="lp-theme02-tags-v1-value">{tag.value}</span>}
            </EditableField>
          ))}
        </div>
      </div>
    </div>
  );
}
