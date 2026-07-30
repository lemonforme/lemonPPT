// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04ShowcaseV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  caption?: string;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ShowcaseV1Meta: LayoutMeta = {
  id: 'theme04_showcase_v1',
  theme: 'theme04',
  role: 'image',
  displayName: 'Theme 04 焦点机位',
  description: '大幅中心图片展示，配合聚光灯效果与图注',
  needsMedia: true,
  mediaSlots: [{ name: '焦点图', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['image', 'showcase', 'spotlight', 'candy'],
  contentShape: 'image-focus',
};

export const theme04ShowcaseV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '焦点机位' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{这一刻}}，决定下一程' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '用一张核心画面定格产品价值。' },
    { key: 'imageUrl', label: '焦点图', type: 'image' },
    { key: 'caption', label: '图注', type: 'textarea', inlineEditable: true, defaultValue: '图注：产品核心场景实拍' },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：公司内部资料 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-showcase-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme04ShowcaseV1(props: Theme04ShowcaseV1Props): ReactNode {
  const { kicker, title, subtitle, imageUrl, caption, footnote, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-showcase">
      <div className="lp-theme04-showcase-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-showcase-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-showcase-stage lp-rise">
        <div className="lp-theme04-showcase-frame">
          <LpEditableImage
            className="lp-theme04-showcase-image"
            src={imageUrl}
            alt={caption || title}
            slideIdx={_slideIdx}
            editable={_editable}
            prop="imageUrl"
            placeholderClassName="lp-editable-image-placeholder lp-theme04-showcase-image-placeholder"
            placeholderText="焦点图"
            showIcon={true}
          />
          <div className="lp-theme04-showcase-vignette" />
          {caption && (
            <EditableField prop="caption" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-showcase-caption">{caption}</EditableField>
          )}
        </div>
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-showcase-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
