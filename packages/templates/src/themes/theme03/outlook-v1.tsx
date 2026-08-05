// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03OutlookV1Item {
  title?: string;
  trend?: string;
  action?: string;
}

export interface Theme03OutlookV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  items?: Theme03OutlookV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03OutlookV1Meta: LayoutMeta = {
  id: 'theme03_outlook_v1',
  theme: 'theme03',
  role: 'content',
  displayName: 'Theme 03 编辑风投资展望',
  description: '深色代码编辑风标题 + 趋势判断 + 行动建议',
  needsMedia: false,
  tags: ['content', 'outlook', 'trend'],
  contentShape: 'outlook-cards',
};

export const theme03OutlookV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '展望' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'OUTLOOK' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{投资}}展望' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'items',
      label: '目录项',
      type: 'array',
      maxItems: 3,
      minItems: 2,
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'trend', label: '趋势', type: 'text', inlineEditable: true },
        { key: 'action', label: '行动', type: 'textarea', inlineEditable: true },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-outlook-v1-title lp-rise">
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

export function Theme03OutlookV1(props: Theme03OutlookV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title = '投资展望', subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeItems = items.slice(0, 3);

  return (
    <div className="lp-slide lp-theme03-outlook-v1">
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

      <div className="lp-theme03-outlook-v1-main">
        <div className="lp-theme03-outlook-v1-head lp-rise">
          {renderTitle(title, _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-outlook-v1-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {safeItems.length > 0 && (
          <div className="lp-theme03-outlook-v1-list lp-rise">
            {safeItems.map((item, index) => (
              <div key={index} className="lp-theme03-outlook-v1-card">
                <div className="lp-theme03-outlook-v1-step">
                  <span className="lp-theme03-outlook-v1-step-number">{index + 1}</span>
                </div>
                <div className="lp-theme03-outlook-v1-body">
                  <EditableField
                    prop={`items.${index}.title`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="h3"
                    className="lp-theme03-outlook-v1-item-title"
                  >
                    {item.title || ''}
                  </EditableField>
                  <div className="lp-theme03-outlook-v1-row">
                    <span className="lp-theme03-outlook-v1-label">趋势判断</span>
                    <EditableField
                      prop={`items.${index}.trend`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-theme03-outlook-v1-trend"
                    >
                      {item.trend || ''}
                    </EditableField>
                  </div>
                  <div className="lp-theme03-outlook-v1-row">
                    <span className="lp-theme03-outlook-v1-label">行动建议</span>
                    <EditableField
                      prop={`items.${index}.action`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-theme03-outlook-v1-action"
                    >
                      {item.action || ''}
                    </EditableField>
                  </div>
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
