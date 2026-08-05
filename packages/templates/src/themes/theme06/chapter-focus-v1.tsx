// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06ChapterFocusV1Props {
  imageUrl?: string;
  tag?: string;
  number?: string;
  title: string;
  subtitle?: string;
  focusValue?: string;
  focusUnit?: string;
  focusLabel?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ChapterFocusV1Meta: LayoutMeta = {
  id: 'theme06_chapter_focus_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 聚焦章节页',
  description: '中央大数字指标 + 章节标题，强调核心数据',
  needsMedia: true,
  tags: ['chapter', 'focus', 'metric', 'atlas'],
  contentShape: 'chapter',
};

export const theme06ChapterFocusV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'tag', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CHAPTER' },
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '03' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '融资热度' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '资本持续向头部模型与基础设施聚集' },
    { key: 'focusValue', label: '聚焦数值', type: 'text', inlineEditable: true, defaultValue: '$97B' },
    { key: 'focusUnit', label: '聚焦单位', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'focusLabel', label: '聚焦标签', type: 'text', inlineEditable: true, defaultValue: '年度投融资总额' },
  ],
};

export function Theme06ChapterFocusV1(props: Theme06ChapterFocusV1Props): ReactNode {
  const { tag, number, title, subtitle, focusValue, focusUnit, focusLabel, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme06-chapter-focus">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-chapter-focus-main lp-rise">
        {tag && <div className="lp-theme06-kicker">{tag}</div>}
        {number && <div className="lp-theme06-chapter-focus-number">{number}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-chapter-focus-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-chapter-focus-hero lp-rise">
        <div className="lp-theme06-chapter-focus-value-wrap">
          {focusValue && (
            <EditableField prop="focusValue" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme06-chapter-focus-value">{focusValue}</EditableField>
          )}
          {focusUnit && (
            <EditableField prop="focusUnit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme06-chapter-focus-unit">{focusUnit}</EditableField>
          )}
        </div>
        {focusLabel && (
          <EditableField prop="focusLabel" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-chapter-focus-label">{focusLabel}</EditableField>
        )}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
