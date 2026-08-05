// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme01SpotlightGridColumn {
  tag?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

export interface Theme01SpotlightGridProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  columns?: Theme01SpotlightGridColumn[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01SpotlightGridMeta: LayoutMeta = {
  id: 'theme01_spotlight_grid',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 主题聚焦网格',
  description: '2~4 列并列展示主题、案例或分论点',
  needsMedia: true,
};

export const theme01SpotlightGridSchema: PropsSchema = {
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
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'columns',
      label: '列内容',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      itemSchema: [
        {
          key: 'tag',
          label: '标签',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'imageUrl',
          label: '图片',
          type: 'image',
          inlineEditable: true,
        },
        {
          key: 'title',
          label: '标题',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'description',
          label: '描述',
          type: 'textarea',
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'footnote',
      label: '脚注',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

export function Theme01SpotlightGrid(props: Theme01SpotlightGridProps): ReactNode {
  const { kicker, title, subtitle, columns = [], footnote, _slideIdx, _editable } = props;
  const safeColumns = columns.slice(0, 4);

  return (
    <div className="lp-slide lp-spotlight-grid">
      <div className="lp-spotlight-grid-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-spotlight-grid-title lp-rise">
            {title}
          </EditableField>
        )}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-spotlight-grid-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className={`lp-spotlight-grid-body lp-spotlight-grid-body--${safeColumns.length}`}>
        {safeColumns.map((column, index) => (
          <div key={index} className="lp-card lp-spotlight-grid-card lp-rise">
            {column.tag && (
              <EditableField
                prop={`columns.${index}.tag`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-spotlight-grid-tag"
              >
                {column.tag}
              </EditableField>
            )}
            <LpEditableImage
              className="lp-spotlight-grid-image"
              src={column.imageUrl}
              alt={column.title || ''}
              slideIdx={_slideIdx}
              editable={_editable}
              prop={`columns.${index}.imageUrl`}
              placeholderClassName="lp-spotlight-grid-image-placeholder"
            />
            <div className="lp-spotlight-grid-card-body">
              <EditableField
                prop={`columns.${index}.title`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="h3"
                className="lp-spotlight-grid-card-title"
              >
                {column.title}
              </EditableField>
              {column.description && (
                <EditableField
                  prop={`columns.${index}.description`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="p"
                  className="lp-spotlight-grid-card-description"
                >
                  {column.description}
                </EditableField>
              )}
            </div>
          </div>
        ))}
      </div>
      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-spotlight-grid-footnote lp-rise">
          {footnote}
        </EditableField>
      )}
    </div>
  );
}
