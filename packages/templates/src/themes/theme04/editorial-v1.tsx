// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04EditorialV1Item {
  label?: string;
  title?: string;
  description?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04EditorialV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  quote?: string;
  author?: string;
  imageUrl?: string;
  items?: Theme04EditorialV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04EditorialV1Meta: LayoutMeta = {
  id: 'theme04_editorial_v1',
  theme: 'theme04',
  role: 'content',
  displayName: 'Theme 04 杂志跨页',
  description: '左侧大图+引言，右侧玻璃卡片列表，杂志化跨页排版',
  needsMedia: true,
  mediaSlots: [{ name: '主视觉图', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['editorial', 'magazine', 'candy'],
  contentShape: 'editorial-spread',
};

export const theme04EditorialV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '深度特写' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'EDITORIAL' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'GLASS CANDY · EDITION 01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{Anthropic}} 估值登顶之路' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从追赶到反超，它如何在一年内把估值推向 6150 亿美元？' },
    { key: 'quote', label: '引言', type: 'textarea', inlineEditable: true, defaultValue: '「安全可控」不是一句口号，而是打开机构付费意愿的钥匙。' },
    { key: 'author', label: '引言作者', type: 'text', inlineEditable: true, defaultValue: '— 研究主编' },
    { key: 'imageUrl', label: '主视觉图', type: 'image' },
    {
      key: 'items',
      label: '要点卡片',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { label: '01', title: ' Constitutional AI', description: '用可解释约束替代黑盒对齐', tone: 'green' },
        { label: '02', title: '企业级渗透', description: '金融与医疗客户付费意愿最高', tone: 'blue' },
        { label: '03', title: '融资节奏', description: '一年内完成三轮大额融资', tone: 'yellow' },
        { label: '04', title: 'IPO 预期', description: '预计 2026 年递交上市申请', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'label', label: '编号', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT 研究出品' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: '案例研究' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-editorial-title lp-rise">
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

export function Theme04EditorialV1(props: Theme04EditorialV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, quote, author, imageUrl, items, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeItems = (items || []).filter((i) => i != null).slice(0, 4);
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-editorial">
      <div className="lp-theme04-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme04-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span>·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme04-editorial-main">
        <div className="lp-theme04-editorial-left lp-rise">
          <div className="lp-theme04-editorial-head">
            {renderTitle(title || '', _slideIdx, _editable)}
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-editorial-subtitle">{subtitle}</EditableField>
            )}
          </div>

          {imageUrl && (
            <div className="lp-theme04-editorial-image-wrap">
              <LpEditableImage
                className="lp-theme04-editorial-image"
                src={imageUrl}
                alt={title}
                slideIdx={_slideIdx}
                editable={_editable}
                prop="imageUrl"
                placeholderClassName="lp-editable-image-placeholder lp-theme04-editorial-image-placeholder"
                placeholderText="主视觉图"
              />
            </div>
          )}

          {quote && (
            <div className="lp-theme04-editorial-quote">
              <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote">{quote}</EditableField>
              {author && (
                <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="cite">{author}</EditableField>
              )}
            </div>
          )}
        </div>

        <div className="lp-theme04-editorial-right">
          {safeItems.map((item, idx) => (
            <div
              key={idx}
              className={`lp-theme04-editorial-card lp-theme04-card lp-rise ${toneClass[item.tone || 'green'] || ''}`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="lp-theme04-editorial-card-head">
                {item.label && (
                  <EditableField prop={`items.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-editorial-card-label">{item.label}</EditableField>
                )}
                {item.title && (
                  <EditableField prop={`items.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h4" className="lp-theme04-editorial-card-title">{item.title}</EditableField>
                )}
              </div>
              {item.description && (
                <EditableField prop={`items.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-editorial-card-desc">{item.description}</EditableField>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lp-theme04-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
