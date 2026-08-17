// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme02ImageSplitV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  bullets?: string[];
  image?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ImageSplitV1Meta: LayoutMeta = {
  id: 'theme02_image_split_v1',
  theme: 'theme02',
  role: 'feature',
  displayName: 'Theme 02 图文分栏',
  description: '左文右图分栏布局',
  needsMedia: true,
};

export const theme02ImageSplitV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    {
      key: 'bullets',
      label: '要点',
      type: 'array',
      maxItems: 5,
      minItems: 0,
      itemSchema: [{ key: 'item', label: '要点', type: 'text', inlineEditable: true }],
    },
    { key: 'image', label: '图片', type: 'image' },
  ],
};

export function Theme02ImageSplitV1(props: Theme02ImageSplitV1Props): ReactNode {
  const { kicker, title, subtitle, bullets = [], image, _slideIdx, _editable } = props;

  const safeBullets = bullets.filter((b): b is string => typeof b === 'string');

  return (
    <div className="lp-slide lp-theme02-image-split-v1">
      <div className="lp-orb lp-theme02-orb--cool" />
      <div className="lp-theme02-image-split-inner">
        <div className="lp-theme02-image-split-left">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-image-split-title">
            {title}
          </EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-image-split-subtitle">
              {subtitle}
            </EditableField>
          )}
          <ul className="lp-theme02-image-split-bullets">
            {safeBullets.map((bullet, i) => (
              <li key={i} className="lp-theme02-image-split-bullet">
                <span className="lp-theme02-image-split-check">✓</span>
                <EditableField prop={`bullets.${i}`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-image-split-bullet-text">
                  {bullet}
                </EditableField>
              </li>
            ))}
          </ul>
        </div>
        <div className="lp-theme02-image-split-right">
          <LpEditableImage
            className="lp-theme02-image-split-media"
            src={image ?? ''}
            alt=""
            slideIdx={_slideIdx}
            editable={_editable}
            prop="image"
            placeholderClassName="lp-theme02-image-split-placeholder"
            placeholderText="点击上传图片"
          />
        </div>
      </div>
    </div>
  );
}
