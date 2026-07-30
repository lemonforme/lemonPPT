// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04ImageV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  image?: string;
  caption?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ImageV1Meta: LayoutMeta = {
  id: 'theme04_image_v1',
  theme: 'theme04',
  role: 'image',
  displayName: 'Theme 04 图文焦点页',
  description: '半幅大图 + 文字叠加，杂志化排版',
  needsMedia: true,
  tags: ['image', 'spotlight', 'candy'],
  contentShape: 'image-with-caption',
};

export const theme04ImageV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '焦点特写' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{算力基建}}：资本涌入的新战场' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从芯片到云服务，基础设施层正在成为 AI 投资的最大吸金点。' },
    { key: 'image', label: '主图', type: 'image' },
    { key: 'caption', label: '图注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 内部统计 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-image-title lp-rise">
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

export function Theme04ImageV1(props: Theme04ImageV1Props): ReactNode {
  const { kicker, title, subtitle, image, caption, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-image">
      <div className="lp-theme04-image-visual lp-theme04-card lp-rise">
        <LpEditableImage
          className=""
          src={image}
          alt=""
          slideIdx={_slideIdx}
          editable={_editable}
          prop="image"
          placeholderClassName="lp-editable-image-placeholder"
          placeholderText="点击上传焦点图片"
          showIcon={true}
        />
        <div className="lp-theme04-image-overlay" aria-hidden="true" />
      </div>

      <div className="lp-theme04-image-content">
        {kicker && <div className="lp-theme04-kicker lp-rise">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-image-subtitle lp-rise">{subtitle}</EditableField>
        )}
        {caption && (
          <EditableField prop="caption" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-image-caption lp-rise">{caption}</EditableField>
        )}
      </div>
    </div>
  );
}
