// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import {
  Blob,
  DottedPattern,
  Folio,
  Headline,
  Masthead,
  Ring,
  Sheet,
} from './shared.js';

export interface Theme01TagsV1Props {
  kicker?: string;
  title?: string;
  titleEn?: string;
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
  description: '关键词标签云墙，色块拼贴风',
  needsMedia: false,
};

export const theme01TagsV1Schema: PropsSchema = {
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
      key: 'titleEn',
      label: '英文标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'tags',
      label: '标签',
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
        {
          key: 'value',
          label: '数值',
          type: 'number',
        },
        {
          key: 'tone',
          label: '色调',
          type: 'select',
          options: [
            { label: '中性', value: 'neutral' },
            { label: '正向', value: 'positive' },
            { label: '负向', value: 'negative' },
            { label: '强调', value: 'accent' },
          ],
        },
      ],
    },
  ],
};

const TONE_COLORS: Record<string, string> = {
  positive: 'green',
  negative: 'red',
  accent: 'amber',
  neutral: 'blue',
};

const TONE_WEIGHT = {
  neutral: 'lg',
  positive: 'xl',
  negative: 'lg',
  accent: '2xl',
} as const;

export function Theme01TagsV1(props: Theme01TagsV1Props): ReactNode {
  const { kicker, title, titleEn, tags = [], _slideIdx, _editable } = props;
  const safeTags = tags.slice(0, 24);

  return (
    <Sheet substrate="tint" tint="pink" frame="grid" className="lp-tags-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />

      <Headline
        cn={title ?? ''}
        en={titleEn}
        slideIdx={_slideIdx}
        editable={_editable}
        propCn="title"
        propEn="titleEn"
        size="large"
        className="lp-tags-v1-headline lp-rise"
      />

      <div className="lp-tags-v1-cloud lp-rise">
        {safeTags.map((tag, index) => {
          const tone = tag.tone ?? 'neutral';
          const color = TONE_COLORS[tone] ?? 'blue';
          const weight = TONE_WEIGHT[tone as keyof typeof TONE_WEIGHT] ?? 'lg';
          return (
            <EditableField
              key={index}
              prop={`tags.${index}.label`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="span"
              className={`lp-tags-v1-tag color-${color} size-${weight}`}
            >
              {tag.label}
              {tag.value !== undefined && tag.value > 0 && (
                <span className="lp-tags-v1-value">{tag.value}</span>
              )}
            </EditableField>
          );
        })}
      </div>

      <Folio page={String(_slideIdx ?? 1).padStart(2, '0')} />

      <Blob
        className="lp-tags-v1-blob"
        style={{ width: 340, height: 340, top: -60, left: -80, background: 'var(--lp-blue)', opacity: 0.16 }}
      />
      <DottedPattern
        className="lp-tags-v1-dots"
        style={{ bottom: 110, right: 100, width: 160, height: 160, opacity: 0.22 }}
      />
      <Ring
        className="lp-tags-v1-ring"
        style={{ width: 90, height: 90, bottom: 130, right: 110, borderColor: 'var(--lp-amber)' }}
      />
    </Sheet>
  );
}
