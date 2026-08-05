// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03ClosingV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  leftColumnTitle?: string;
  leftColumnItems?: Array<{ value?: string }>;
  rightColumnTitle?: string;
  rightColumnItems?: Array<{ value?: string }>;
  contact?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ClosingV1Meta: LayoutMeta = {
  id: 'theme03_closing_v1',
  theme: 'theme03',
  role: 'closing',
  displayName: 'Theme 03 编辑风封底',
  description: '深色代码编辑风封底，左侧大标题 + 右侧数据来源/研究提示分栏',
  needsMedia: false,
  tags: ['closing', 'colophon', 'data-source'],
  contentShape: 'title-with-two-columns',
};

export const theme03ClosingV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '数据来源' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'COLOPHON' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '感谢阅读' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'leftColumnTitle', label: '左栏标题', type: 'text', inlineEditable: true, defaultValue: '数据来源' },
    { key: 'leftColumnItems', label: '左栏项目', type: 'array', itemSchema: [{ key: 'value', label: '项目', type: 'text' }] },
    { key: 'rightColumnTitle', label: '右栏标题', type: 'text', inlineEditable: true, defaultValue: '研究提示' },
    { key: 'rightColumnItems', label: '右栏项目', type: 'array', itemSchema: [{ key: 'value', label: '项目', type: 'text' }] },
    { key: 'contact', label: '联系信息', type: 'text', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme03ClosingV1(props: Theme03ClosingV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, leftColumnTitle, leftColumnItems, rightColumnTitle, rightColumnItems, contact, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-closing-v1">
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

      <div className="lp-theme03-closing-main">
        <div className="lp-theme03-closing-head lp-rise">
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme03-closing-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-closing-subtitle">{subtitle}</EditableField>}
          {contact && <EditableField prop="contact" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-closing-contact">{contact}</EditableField>}
        </div>

        <div className="lp-theme03-closing-columns lp-rise">
          <div className="lp-theme03-closing-column">
            {(leftColumnTitle || _editable) && (
              <EditableField prop="leftColumnTitle" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-closing-column-title">
                {leftColumnTitle}
              </EditableField>
            )}
            {leftColumnItems && leftColumnItems.length > 0 && (
              <ul className="lp-theme03-closing-column-list">
                {leftColumnItems.map((item, idx) => (
                  <EditableField
                    key={idx}
                    prop={`leftColumnItems.${idx}.value`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="li"
                  >
                    {typeof item === 'string' ? item : item?.value}
                  </EditableField>
                ))}
              </ul>
            )}
          </div>
          <div className="lp-theme03-closing-column">
            {(rightColumnTitle || _editable) && (
              <EditableField prop="rightColumnTitle" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-closing-column-title">
                {rightColumnTitle}
              </EditableField>
            )}
            {rightColumnItems && rightColumnItems.length > 0 && (
              <ul className="lp-theme03-closing-column-list">
                {rightColumnItems.map((item, idx) => (
                  <EditableField
                    key={idx}
                    prop={`rightColumnItems.${idx}.value`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="li"
                  >
                    {typeof item === 'string' ? item : item?.value}
                  </EditableField>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
