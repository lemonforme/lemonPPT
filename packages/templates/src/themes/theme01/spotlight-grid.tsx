// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Folio, Headline, Pill, Plus, Ring, Sheet, Slash, LpPhoto } from './shared.js';

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

const tagColors = ['blue', 'green', 'amber', 'violet'] as const;

export function Theme01SpotlightGrid(props: Theme01SpotlightGridProps): ReactNode {
  const { kicker, title, subtitle, columns = [], footnote, _slideIdx, _editable } = props;
  const safeColumns = columns.slice(0, 4);

  return (
    <Sheet substrate="light" frame="grid" className="lp-spotlight-grid">
      <Blob
        className="lp-spotlight-grid-blob"
        style={{ width: 360, height: 360, top: -130, left: -90, background: 'var(--lp-pink)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-spotlight-grid-dots"
        style={{ bottom: 90, right: 80, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-spotlight-grid-slash"
        style={{ top: 110, right: 100, height: 70, background: 'var(--lp-amber)', opacity: 0.45 }}
      />
      <Ring
        className="lp-spotlight-grid-ring"
        style={{ width: 120, height: 120, bottom: 100, left: 80, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-spotlight-grid-plus"
        style={{ top: 140, right: 100, width: 30, height: 30, color: 'var(--lp-red)' }}
      />

      <div className="lp-spotlight-grid-content">
        <div className="lp-spotlight-grid-header lp-rise">
          {kicker && (
            <div className="lp-spotlight-grid-kicker">
              <Pill variant="outline" color="pink">
                {kicker}
              </Pill>
            </div>
          )}
          {title && (
            <Headline cn={title} size="large" slideIdx={_slideIdx} editable={_editable} propCn="title" />
          )}
          {subtitle && (
            <EditableField
              prop="subtitle"
              slideIdx={_slideIdx}
              editable={_editable}
              as="p"
              className="lp-spotlight-grid-subtitle"
            >
              {subtitle}
            </EditableField>
          )}
        </div>

        <div className={`lp-spotlight-grid-body lp-spotlight-grid-body--${safeColumns.length}`}>
          {safeColumns.map((column, index) => (
            <div
              key={index}
              className={`lp-spotlight-grid-card lp-spotlight-grid-card--${tagColors[index % tagColors.length]} lp-rise`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              {column.tag && (
                <Pill variant="outline" color={tagColors[index % tagColors.length]} className="lp-spotlight-grid-tag">
                  <EditableField
                    prop={`columns.${index}.tag`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                  >
                    {column.tag}
                  </EditableField>
                </Pill>
              )}
              <LpPhoto
                prop={`columns.${index}.imageUrl`}
                src={column.imageUrl}
                slideIdx={_slideIdx}
                editable={_editable}
                ratio="16:9"
                className="lp-spotlight-grid-image"
                hint="点击上传"
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
          <EditableField
            prop="footnote"
            slideIdx={_slideIdx}
            editable={_editable}
            as="div"
            className="lp-spotlight-grid-footnote lp-rise"
          >
            {footnote}
          </EditableField>
        )}
      </div>

      <Folio
        left="SPOTLIGHT"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
