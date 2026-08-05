// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme03SpotlightGridColumn {
  tag?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

export interface Theme03SpotlightGridProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  columns?: Theme03SpotlightGridColumn[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03SpotlightGridMeta: LayoutMeta = {
  id: 'theme03_spotlight_grid',
  theme: 'theme03',
  role: 'content',
  displayName: 'Theme 03 编辑风主题聚焦网格',
  description: '深色代码编辑风 2~4 列并列展示主题、案例或分论点',
  needsMedia: true,
  tags: ['content', 'spotlight', 'grid'],
  contentShape: 'spotlight-grid',
};

export const theme03SpotlightGridSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '聚焦' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'SPOTLIGHT' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{主题}}聚焦网格' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'columns',
      label: '列内容',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      itemSchema: [
        { key: 'tag', label: '标签', type: 'text', inlineEditable: true },
        { key: 'imageUrl', label: '图片', type: 'image', inlineEditable: true },
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-spotlight-grid-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03SpotlightGrid(props: Theme03SpotlightGridProps): ReactNode {
  const { tag, tagLabel, topRightMeta, title = '主题聚焦网格', subtitle, columns = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeColumns = columns.slice(0, 4);

  return (
    <div className="lp-slide lp-theme03-spotlight-grid">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-spotlight-grid-main">
        <div className="lp-theme03-spotlight-grid-head lp-rise">
          {renderTitle(title, _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-spotlight-grid-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {safeColumns.length > 0 && (
          <div className={`lp-theme03-spotlight-grid-body lp-theme03-spotlight-grid-body--${safeColumns.length} lp-rise`}>
            {safeColumns.map((column, index) => (
              <div key={index} className="lp-theme03-spotlight-grid-card">
                {column.tag && (
                  <EditableField
                    prop={`columns.${index}.tag`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="div"
                    className="lp-theme03-spotlight-grid-tag"
                  >
                    {column.tag}
                  </EditableField>
                )}
                <LpEditableImage
                  className="lp-theme03-spotlight-grid-image"
                  src={column.imageUrl}
                  alt={column.title || ''}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  prop={`columns.${index}.imageUrl`}
                  placeholderClassName="lp-theme03-spotlight-grid-image-placeholder"
                />
                <div className="lp-theme03-spotlight-grid-card-body">
                  <EditableField
                    prop={`columns.${index}.title`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="h3"
                    className="lp-theme03-spotlight-grid-card-title"
                  >
                    {column.title || ''}
                  </EditableField>
                  {column.description && (
                    <EditableField
                      prop={`columns.${index}.description`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="p"
                      className="lp-theme03-spotlight-grid-card-description"
                    >
                      {column.description}
                    </EditableField>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
