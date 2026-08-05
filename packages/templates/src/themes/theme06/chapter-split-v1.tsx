// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06ChapterSplitV1VisualItem {
  label?: string;
  value?: string;
}

export interface Theme06ChapterSplitV1Props {
  imageUrl?: string;
  tag?: string;
  number?: string;
  title: string;
  subtitle?: string;
  visualLabel?: string;
  visualItems?: Theme06ChapterSplitV1VisualItem[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ChapterSplitV1Meta: LayoutMeta = {
  id: 'theme06_chapter_split_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 分栏章节页',
  description: '左侧章节标题 + 右侧 2×2 数据卡片',
  needsMedia: true,
  tags: ['chapter', 'split', 'atlas'],
  contentShape: 'chapter',
};

export const theme06ChapterSplitV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'tag', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CHAPTER' },
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '02' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '竞争格局' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '头部玩家与新进入者的动态博弈' },
    { key: 'visualLabel', label: '视觉区标签', type: 'text', inlineEditable: true, defaultValue: '核心指标' },
    {
      key: 'visualItems',
      label: '视觉区数据',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { label: '市场集中度', value: 'CR5 62%' },
        { label: '新进入者', value: '120+' },
        { label: '年均并购', value: '35 起' },
        { label: '专利增速', value: '+48%' },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme06ChapterSplitV1(props: Theme06ChapterSplitV1Props): ReactNode {
  const { tag, number, title, subtitle, visualLabel, visualItems = [], _slideIdx, _editable } = props;
  const validItems = (visualItems || []).filter((v): v is Theme06ChapterSplitV1VisualItem => v != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-chapter-split">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-chapter-split-main lp-rise">
        {tag && <div className="lp-theme06-kicker">{tag}</div>}
        {number && <div className="lp-theme06-chapter-split-number">{number}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-chapter-split-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-chapter-split-visual lp-rise">
        {visualLabel && <div className="lp-theme06-kicker" style={{ gridColumn: '1 / -1' }}>{visualLabel}</div>}
        {validItems.map((item, index) => (
          <div key={index} className="lp-theme06-chapter-split-visual-cell">
            <div className="lp-theme06-chapter-split-visual-value">{item.value || ''}</div>
            <div className="lp-theme06-chapter-split-visual-label">{item.label || ''}</div>
          </div>
        ))}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
