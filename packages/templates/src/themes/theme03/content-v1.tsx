// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03ContentV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  columns?: Array<{ title: string; points: Array<{ value?: string }> }>;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ContentV1Meta: LayoutMeta = {
  id: 'theme03_content_v1',
  theme: 'theme03',
  role: 'content',
  displayName: 'Theme 03 编辑风内容页',
  description: '深色代码编辑风内容页，顶部标签 + 多栏要点',
  needsMedia: false,
  tags: ['content', 'multi-column', 'analysis'],
  contentShape: 'multi-column-points',
};

export const theme03ContentV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '研究方法' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'METHOD' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'AI · VENTURE CAPITAL // USA' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '横纵分析法：如何读懂 {{AI}} 融资地图' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'columns',
      label: '内容栏',
      type: 'array',
      itemSchema: [
        { key: 'title', label: '栏目标题', type: 'text' },
        { key: 'points', label: '要点列表', type: 'array', itemSchema: [{ key: 'value', label: '要点', type: 'text' }] },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-content-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return (
            <em key={idx} className="lp-theme03-accent-text">
              {match[1]}
            </em>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03ContentV1(props: Theme03ContentV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, columns, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-content-v1">
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

      <div className="lp-theme03-content-main">
        <div className="lp-theme03-content-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-content-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {columns && columns.length > 0 && (
          <div className="lp-theme03-content-columns lp-rise">
            {columns.map((col, idx) => (
              <div key={idx} className="lp-theme03-content-column">
                <EditableField
                  prop={`columns.${idx}.title`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-theme03-content-column-title"
                >
                  {col.title}
                </EditableField>
                {col.points && col.points.length > 0 && (
                  <ul className="lp-theme03-content-column-list">
                    {col.points.map((point, pidx) => (
                      <EditableField
                        key={pidx}
                        prop={`columns.${idx}.points.${pidx}.value`}
                        slideIdx={_slideIdx}
                        editable={_editable}
                        as="li"
                      >
                        {typeof point === 'string' ? point : point?.value}
                      </EditableField>
                    ))}
                  </ul>
                )}
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
