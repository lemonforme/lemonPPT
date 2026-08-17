// lemonPPT - theme07 通用公司案例页骨架
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07DropMedia } from './drop-media-placeholder.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07CompanyLayoutMetric {
  value?: string;
  label?: string;
}

export interface Theme07CompanyLayoutProps {
  imageUrl?: string;
  imageTag?: string;
  kicker?: string;
  name: string;
  tagline?: string;
  description?: string;
  tags?: string[];
  metrics?: Theme07CompanyLayoutMetric[];
  quote?: string;
  author?: string;
  footnote?: string;
  imageRatio?: 'portrait' | 'landscape' | 'square' | 'auto';
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07CompanyLayoutMetaBase: Omit<LayoutMeta, 'id' | 'displayName' | 'description' | 'tags'> = {
  theme: 'theme07',
  role: 'content',
  needsMedia: true,
  contentShape: 'case',
};

export const theme07CompanyLayoutSchemaBase: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'imageTag', label: '图片区域标签', type: 'text', defaultValue: '' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CASE STUDY' },
    { key: 'name', label: '公司名称', type: 'text', inlineEditable: true, defaultValue: 'OpenAI' },
    { key: 'tagline', label: '一句话定位', type: 'text', inlineEditable: true, defaultValue: '通用大模型与 AI 平台' },
    { key: 'description', label: '公司描述', type: 'textarea', inlineEditable: true, defaultValue: '' },
    {
      key: 'tags',
      label: '标签',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      defaultValue: [],
      itemSchema: [{ key: 'item', label: '标签', type: 'text' }],
    },
    {
      key: 'metrics',
      label: '关键指标',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      defaultValue: [],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
      ],
    },
    { key: 'quote', label: '引言', type: 'textarea', defaultValue: '' },
    { key: 'author', label: '引言作者', type: 'text', defaultValue: '' },
    { key: 'footnote', label: '页脚注释', type: 'textarea', defaultValue: '' },
    { key: 'imageRatio', label: '图片比例', type: 'select', options: [{ value: 'landscape', label: '横向' }, { value: 'portrait', label: '纵向' }, { value: 'square', label: '方形' }, { value: 'auto', label: '自适应' }], defaultValue: 'landscape' },
  ],
};

export function Theme07CompanyLayout(props: Theme07CompanyLayoutProps): ReactNode {
  const {
    imageUrl,
    imageTag,
    kicker,
    name,
    tagline,
    description,
    tags = [],
    metrics = [],
    quote,
    author,
    footnote,
    imageRatio,
    _slideIdx,
    _editable,
  } = props;

  const validTags = (tags || [])
    .map((t) => (typeof t === 'string' ? t : (t as { item?: string }).item))
    .filter((t): t is string => !!t)
    .slice(0, 6);
  const validMetrics = (metrics || []).filter((m) => m && (m.value || m.label)).slice(0, 4);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-company">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-company-main lp-rise">
        <Theme07IconChip name="network" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="name" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-company-name">{name}</EditableField>
        {tagline && (
          <EditableField prop="tagline" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-company-tagline">{tagline}</EditableField>
        )}
        {description && (
          <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-company-desc">{description}</EditableField>
        )}
        {validTags.length > 0 && (
          <div className="lp-theme07-company-tags">
            {validTags.map((tag, i) => (
              <span key={i} className="lp-theme07-company-tag">{tag}</span>
            ))}
          </div>
        )}
        {validMetrics.length > 0 && (
          <div className="lp-theme07-company-metrics">
            {validMetrics.map((m, i) => (
              <div key={i} className="lp-theme07-company-metric">
                {m.value && <div className="lp-theme07-company-metric-value">{m.value}</div>}
                {m.label && <div className="lp-theme07-company-metric-label">{m.label}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="lp-theme07-company-aside lp-rise">
        <div className="lp-theme07-company-image">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="lp-theme07-company-image-img" />
          ) : (
            <Theme07DropMedia tag={imageTag} label={name} imageRatio={imageRatio} />
          )}
        </div>
        {quote && (
          <div className="lp-theme07-company-quote">
            <div className="lp-theme07-company-quote-text">“{quote}”</div>
            {author && <div className="lp-theme07-company-quote-author">— {author}</div>}
          </div>
        )}
      </div>
      <div className="lp-theme07-company-footer">
        {footnote && <span className="lp-theme07-company-footnote">{footnote}</span>}
      </div>
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
