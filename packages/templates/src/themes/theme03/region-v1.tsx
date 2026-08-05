// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03RegionV1Item {
  name?: string;
  value?: string;
  change?: string;
  note?: string;
}

export interface Theme03RegionV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  regions?: Theme03RegionV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03RegionV1Meta: LayoutMeta = {
  id: 'theme03_region_v1',
  theme: 'theme03',
  role: 'content',
  displayName: 'Theme 03 编辑风地区/市场分布',
  description: '深色代码编辑风多地区数据卡片',
  needsMedia: false,
  tags: ['content', 'region', 'cards'],
  contentShape: 'region-cards',
};

export const theme03RegionV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '市场' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'REGION' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{地区}}/市场分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'regions',
      label: 'regions',
      type: 'array',
      maxItems: 6,
      minItems: 1,
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'change', label: '变化', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'note', label: '备注', type: 'textarea', inlineEditable: true },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-region-v1-title lp-rise">
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

export function Theme03RegionV1(props: Theme03RegionV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title = '地区/市场分布', subtitle, regions = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeRegions = regions.slice(0, 6);

  return (
    <div className="lp-slide lp-theme03-region-v1">
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

      <div className="lp-theme03-region-v1-main">
        <div className="lp-theme03-region-v1-head lp-rise">
          {renderTitle(title, _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-region-v1-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {safeRegions.length > 0 && (
          <div className="lp-theme03-region-v1-grid lp-rise">
            {safeRegions.map((region, index) => (
              <div key={index} className="lp-theme03-region-v1-card">
                <div className="lp-theme03-region-v1-top">
                  <EditableField
                    prop={`regions.${index}.name`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="h3"
                    className="lp-theme03-region-v1-name"
                  >
                    {region.name || ''}
                  </EditableField>
                  <span className="lp-theme03-region-v1-change">
                    <EditableField
                      prop={`regions.${index}.change`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                    >
                      {region.change || ''}
                    </EditableField>
                  </span>
                </div>
                <div className="lp-theme03-region-v1-value-wrap">
                  <EditableField
                    prop={`regions.${index}.value`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                    className="lp-theme03-region-v1-value"
                  >
                    {region.value || ''}
                  </EditableField>
                </div>
                {region.note && (
                  <EditableField
                    prop={`regions.${index}.note`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="p"
                    className="lp-theme03-region-v1-note"
                  >
                    {region.note}
                  </EditableField>
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
