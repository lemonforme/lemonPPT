// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06ContentNumberedItem {
  number?: string;
  title: string;
  enLabel?: string;
  active?: boolean;
}

export interface Theme06ContentNumberedV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  items?: Theme06ContentNumberedItem[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ContentNumberedV1Meta: LayoutMeta = {
  id: 'theme06_content_numbered_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 编号卡片内容页',
  description: '左侧标题 + 右侧 01/02/03/04 编号卡片列表，支持高亮当前项',
  needsMedia: true,
  tags: ['content', 'numbered-cards', 'atlas'],
  contentShape: 'content',
};

export const theme06ContentNumberedV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'LEAN MANUFACTURING' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '精益智造提质增效' },
    { key: 'titleAccent', label: '标题强调部分', type: 'text', inlineEditable: true, defaultValue: '增效' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '2026 生产基地智能化改造实施方案。以数字化重构制造流程，让每一道工序更轻。' },
    {
      key: 'items',
      label: '编号卡片',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { number: '01', title: '降本', enLabel: 'COST DOWN', active: false },
        { number: '02', title: '提效', enLabel: 'EFFICIENCY', active: false },
        { number: '03', title: '革新', enLabel: 'INNOVATION', active: true },
        { number: '04', title: '突围', enLabel: 'BREAKTHROUGH', active: false },
      ],
      itemSchema: [
        { key: 'number', label: '编号', type: 'text', inlineEditable: true },
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'enLabel', label: '英文标签', type: 'text', inlineEditable: true },
        { key: 'active', label: '高亮', type: 'boolean', defaultValue: false },
      ],
    },
    { key: 'footnote', label: '页脚标注', type: 'text', inlineEditable: true, defaultValue: '智造 · 生产基地智能化改造 · 实施方案 · PLAN / 2026' },
  ],
};

function renderHighlightedTitle(title: string, highlight?: string): ReactNode {
  if (!highlight || !title.includes(highlight)) {
    return title;
  }
  const parts = title.split(highlight);
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 && <span className="lp-theme06-title-accent">{highlight}</span>}
    </span>
  ));
}

export function Theme06ContentNumberedV1(props: Theme06ContentNumberedV1Props): ReactNode {
  const { kicker, title, titleAccent, subtitle, items = [], footnote, _slideIdx, _editable } = props;

  const validItems = items
    .filter((item): item is Theme06ContentNumberedItem => item != null)
    .map((item) => ({
      number: item.number ?? '',
      title: item.title ?? '',
      enLabel: item.enLabel ?? '',
      active: item.active === true,
    }))
    .slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-content-numbered">
      <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-content-numbered-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">
          {renderHighlightedTitle(title, titleAccent)}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme06-content-numbered-aside lp-rise">
        {validItems.map((item, index) => (
          <div
            key={index}
            className={`lp-theme06-content-numbered-card ${item.active ? 'lp-theme06-content-numbered-card--active' : ''}`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <span className="lp-theme06-content-numbered-card-num">{item.number}</span>
            <span className="lp-theme06-content-numbered-card-title">
              <EditableField prop={`items.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{item.title}</EditableField>
            </span>
            {item.enLabel && <span className="lp-theme06-content-numbered-card-en">{item.enLabel}</span>}
          </div>
        ))}
      </div>
      {footnote && (
        <div className="lp-theme06-content-numbered-footnote lp-rise">
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnote}</EditableField>
        </div>
      )}
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
