// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme05EditorialV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageSide?: 'left' | 'right';
  body: string;
  pullQuote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05EditorialV1Meta: LayoutMeta = {
  id: 'theme05_editorial_v1',
  theme: 'theme05',
  role: 'image',
  displayName: 'Theme 05 杂志跨页',
  description: '左图右文或右图左文的大图跨页布局，含正文与可选引言',
  needsMedia: true,
  mediaSlots: [{ name: '主视觉图', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['image', 'editorial', 'magazine', 'spectrum'],
  contentShape: 'editorial-spread',
};

export const theme05EditorialV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'EDITORIAL' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '深度特写：一场视觉叙事' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '用一张大图与一段引言，传递最有力的观点。' },
    { key: 'imageUrl', label: '主视觉图', type: 'image' },
    {
      key: 'imageSide',
      label: '图片位置',
      type: 'select',
      defaultValue: 'left',
      options: [
        { value: 'left', label: '左侧' },
        { value: 'right', label: '右侧' },
      ],
    },
    { key: 'body', label: '正文', type: 'textarea', inlineEditable: true, defaultValue: '在这里写入正文内容。杂志跨页适合用一段简洁有力的叙述，配合一张高质量大图，帮助受众快速建立情感连接与核心认知。' },
    { key: 'pullQuote', label: '引言', type: 'textarea', inlineEditable: true, defaultValue: '「一张图胜过千言万语，而一句精准的话能让图更有力量。」' },
  ],
};

export function Theme05EditorialV1(props: Theme05EditorialV1Props): ReactNode {
  const { kicker, title, subtitle, imageUrl, imageSide = 'left', body, pullQuote, _slideIdx, _editable } = props;
  const isRight = imageSide === 'right';

  return (
    <div className="lp-slide lp-theme05-editorial">
      <div className={`lp-theme05-editorial-main lp-rise ${isRight ? 'lp-theme05-editorial-main--right' : ''}`}>
        <div className="lp-theme05-editorial-visual">
          <LpEditableImage
            src={imageUrl}
            prop="imageUrl"
            slideIdx={_slideIdx}
            editable={_editable}
            alt={title}
            placeholderClassName="lp-theme05-editorial-image-placeholder"
            placeholderText="点击上传大图"
          />
        </div>

        <div className="lp-theme05-editorial-body">
          <div className="lp-theme05-editorial-head">
            {kicker && (
              <div className="lp-theme05-kicker">
                <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
              </div>
            )}
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">
              {title}
            </EditableField>
            <div className="lp-theme05-underline" />
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>

          {body && (
            <EditableField prop="body" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-editorial-text">
              {body}
            </EditableField>
          )}

          {pullQuote && (
            <div className="lp-theme05-editorial-quote">
              <EditableField prop="pullQuote" slideIdx={_slideIdx} editable={_editable} as="blockquote">
                {pullQuote}
              </EditableField>
            </div>
          )}
        </div>
      </div>

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
