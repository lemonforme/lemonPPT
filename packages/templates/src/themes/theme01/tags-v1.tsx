// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01TagsV1Props {
  kicker?: string;
  title?: string;
  tags?: Array<{
  label: string;
  value?: number;
  tone?: 'neutral' | 'positive' | 'negative' | 'accent';
  }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01TagsV1Meta: LayoutMeta = {
  id: 'theme01_tags_v1',
  theme: 'theme01',
  role: 'tags',
  displayName: 'Theme 01 标签墙',
  description: '关键词标签云墙展示',
  needsMedia: false,
};

export const theme01TagsV1Schema: PropsSchema = {
  fields: [
  {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'tags',
      label: 'tags',
      type: 'array',
      maxItems: 24,
      minItems: 1,
      itemSchema: [
    {
          key: 'label',
          label: '名称',
          type: 'text',
          inlineEditable: true
    }
      ]
  },
  {
      key: 'label',
      label: '指标名',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'value',
      label: '数值',
      type: 'number'
  },
  {
      key: 'tone',
      label: 'tone',
      type: 'text',
      inlineEditable: true
  }
  ]
};


export function Theme01TagsV1(props: Theme01TagsV1Props): ReactNode {
  const { kicker, title, tags = [], _slideIdx, _editable } = props;
  const safeTags = tags.slice(0, 24);

  const toneClass = (tone?: string) => {
  switch (tone) {
      case 'positive':
    return 'lp-tags-v1-tag--positive';
      case 'negative':
    return 'lp-tags-v1-tag--negative';
      case 'accent':
    return 'lp-tags-v1-tag--accent';
      default:
    return '';
  }
  };

  return (
  <div className="lp-slide lp-tags-v1">
      <div className="lp-tags-v1-header">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-tags-v1-title lp-rise">
      {title}
          </EditableField>
    )}
      </div>
      <div className="lp-card lp-tags-v1-card lp-rise">
    <div className="lp-tags-v1-cloud">
          {safeTags.map((tag, index) => (
      <EditableField
              key={index}
              prop={`tags.${index}.label`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="span"
              className={`lp-tags-v1-tag ${toneClass(tag.tone)}`}
      >
              {tag.label}
              {tag.value !== undefined && tag.value > 0 && (
        <span className="lp-tags-v1-value">{tag.value}</span>
              )}
      </EditableField>
          ))}
    </div>
      </div>
  </div>
  );
}
