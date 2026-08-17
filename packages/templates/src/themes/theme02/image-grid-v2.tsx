// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme02ImageGridV2Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  images?: string[];
  captions?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ImageGridV2Meta: LayoutMeta = {
  id: 'theme02_image_grid_v2',
  theme: 'theme02',
  role: 'gallery',
  displayName: 'Theme 02 图片网格',
  description: '2x2 图片网格',
  needsMedia: true,
};

export const theme02ImageGridV2Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    {
      key: 'images',
      label: '图片',
      type: 'array',
      maxItems: 4,
      minItems: 1,
      itemSchema: [{ key: 'item', label: '图片', type: 'image' }],
    },
    {
      key: 'captions',
      label: '说明',
      type: 'array',
      maxItems: 4,
      minItems: 0,
      itemSchema: [{ key: 'item', label: '说明', type: 'text', inlineEditable: true }],
    },
  ],
};

const GRID_PROPS = ['images.0', 'images.1', 'images.2', 'images.3'];

export function Theme02ImageGridV2(props: Theme02ImageGridV2Props): ReactNode {
  const { kicker, title, subtitle, images = [], captions = [], _slideIdx, _editable } = props;

  const cells = Array.from({ length: 4 });

  return (
    <div className="lp-slide lp-theme02-image-grid-v2">
      <div className="lp-orb lp-theme02-orb--accent" />
      <div className="lp-theme02-image-grid-v2-inner">
        <div className="lp-theme02-image-grid-v2-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-image-grid-v2-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-image-grid-v2-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>
        <div className="lp-theme02-image-grid-v2-grid">
          {cells.map((_, i) => (
            <div key={i} className="lp-theme02-image-grid-v2-cell">
              <LpEditableImage
                className="lp-theme02-image-grid-v2-media"
                src={images?.[i] ?? ''}
                alt=""
                slideIdx={_slideIdx}
                editable={_editable}
                prop={GRID_PROPS[i]}
                placeholderClassName="lp-theme02-image-grid-v2-placeholder"
                placeholderText="点击上传图片"
              />
              {captions?.[i] && (
                <EditableField prop={`captions.${i}`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-image-grid-v2-caption">
                  {captions[i]}
                </EditableField>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
