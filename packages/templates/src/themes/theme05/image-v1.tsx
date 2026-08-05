// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme05ImageV1Annotation {
  value?: string;
  label?: string;
}

export interface Theme05ImageV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  image?: string;
  annotation?: Theme05ImageV1Annotation;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ImageV1Meta: LayoutMeta = {
  id: 'theme05_image_v1',
  theme: 'theme05',
  role: 'image',
  displayName: 'Theme 05 图文页',
  description: '半幅图片 + 数据标注',
  needsMedia: true,
  tags: ['image', 'spectrum', 'data'],
  contentShape: 'image-text',
};

export const theme05ImageV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SPOTLIGHT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一张图讲清市场格局' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '上传高清大图，用数据标注突出关键信息。' },
    { key: 'image', label: '图片', type: 'image' },
    {
      key: 'annotation',
      label: '数据标注',
      type: 'object',
      defaultValue: { value: '43%', label: '头部企业市占率' },
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '说明', type: 'text' },
      ],
    },
  ],
};

export function Theme05ImageV1(props: Theme05ImageV1Props): ReactNode {
  const { kicker, title, subtitle, image, annotation, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-image">
      <div className="lp-theme05-image-visual lp-rise">
        <LpEditableImage
          src={image}
          prop="image"
          slideIdx={_slideIdx}
          editable={_editable}
          placeholderClassName="lp-theme05-image-placeholder"
          placeholderText="点击上传图片"
        />
        {annotation && (annotation.value || annotation.label) && (
          <div className="lp-theme05-image-annotation">
            {annotation.value && <div className="lp-theme05-image-annotation-value"><EditableField prop="annotation.value" slideIdx={_slideIdx} editable={_editable} as="span">{annotation.value}</EditableField></div>}
            {annotation.label && <div className="lp-theme05-image-annotation-label"><EditableField prop="annotation.label" slideIdx={_slideIdx} editable={_editable} as="span">{annotation.label}</EditableField></div>}
          </div>
        )}
      </div>
      <div className="lp-theme05-content-body lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        <div className="lp-theme05-underline" />
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
