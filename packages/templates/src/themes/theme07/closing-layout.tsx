// lemonPPT - theme07 通用结尾/金句页骨架
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07DropMedia } from './drop-media-placeholder.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07ClosingLayoutPoint {
  text?: string;
}

export interface Theme07ClosingLayoutProps {
  imageUrl?: string;
  kicker?: string;
  statement: string;
  subtitle?: string;
  points?: Theme07ClosingLayoutPoint[];
  source?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  images?: Array<{ tag?: string; label?: string; url?: string }>;
  imageRatio?: 'portrait' | 'landscape' | 'square' | 'auto';
  variant?: 'points' | 'quote';
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07ClosingLayoutMetaBase: Omit<LayoutMeta, 'id' | 'displayName' | 'description' | 'tags'> = {
  theme: 'theme07',
  role: 'closing',
  needsMedia: true,
  contentShape: 'statement',
};

export const theme07ClosingLayoutSchemaBase: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CLOSING' },
    { key: 'statement', label: '主陈述', type: 'textarea', inlineEditable: true, defaultValue: '核心结论' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '' },
    {
      key: 'points',
      label: '要点列表',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      defaultValue: [],
      itemSchema: [{ key: 'text', label: '要点', type: 'textarea' }],
    },
    { key: 'source', label: '来源/作者', type: 'text', defaultValue: '' },
    { key: 'footnoteLeft', label: '页脚左', type: 'text', defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '页脚右', type: 'text', defaultValue: '' },
    {
      key: 'images',
      label: '右侧图片区域',
      type: 'array',
      minItems: 0,
      maxItems: 3,
      defaultValue: [],
      itemSchema: [
        { key: 'tag', label: '图片标签', type: 'text' },
        { key: 'label', label: '图片说明', type: 'text' },
        { key: 'url', label: '图片地址', type: 'image' },
      ],
    },
    { key: 'imageRatio', label: '图片比例', type: 'select', options: [{ value: 'landscape', label: '横向' }, { value: 'portrait', label: '纵向' }, { value: 'square', label: '方形' }, { value: 'auto', label: '自适应' }], defaultValue: 'landscape' },
  ],
};

export function Theme07ClosingLayout(props: Theme07ClosingLayoutProps): ReactNode {
  const {
    imageUrl,
    kicker,
    statement,
    subtitle,
    points = [],
    source,
    footnoteLeft,
    footnoteRight,
    images = [],
    imageRatio,
    variant,
    _slideIdx,
    _editable,
  } = props;

  const isQuote = (variant ?? 'points') === 'quote';

  // 引语变体：将 [[关键词]] 语法渲染为强调高亮
  const renderQuote = (text: string): ReactNode => {
    const parts = String(text ?? '').split(/(\[\[.+?\]\])/g);
    return parts.map((part, i) => {
      const m = part.match(/^\[\[(.+)\]\]$/);
      if (m) return <span key={i} className="lp-theme07-quote-hl">{m[1]}</span>;
      return <span key={i}>{part}</span>;
    });
  };

  const validPoints = (points || [])
    .map((p) => (typeof p === 'string' ? { text: p } : p))
    .filter((p) => p && p.text)
    .slice(0, 4);

  const validImages = (images || []).slice(0, 3);
  const hasImages = validImages.length > 0;

  return (
    <div className={`lp-slide lp-theme07 lp-theme07-closing ${isQuote ? 'lp-theme07-closing--quote' : ''}`}>
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      {isQuote ? (
        <div className="lp-theme07-closing-quote-wrap lp-rise">
          <div className="lp-theme07-closing-quote-mark" aria-hidden="true">“</div>
          <EditableField prop="statement" slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-theme07-closing-quote-text">{renderQuote(statement)}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-closing-quote-sub">{subtitle}</EditableField>
          )}
          {source && <div className="lp-theme07-closing-quote-source">— {source}</div>}
        </div>
      ) : (
      <div className={`lp-theme07-closing-wrapper ${hasImages ? 'has-images' : ''}`}>
        <div className="lp-theme07-closing-content lp-rise">
        <Theme07IconChip name="flag" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="statement" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-closing-statement">{statement}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-closing-subtitle">{subtitle}</EditableField>
        )}
        {validPoints.length > 0 && (
          <div className="lp-theme07-closing-points">
            {validPoints.map((p, i) => (
              <div key={i} className="lp-theme07-closing-point">
                <div className="lp-theme07-closing-point-dot" />
                <EditableField prop={`points.${i}.text`} slideIdx={_slideIdx} editable={_editable} as="span">{p.text}</EditableField>
              </div>
            ))}
          </div>
        )}
        {source && <div className="lp-theme07-closing-source">— {source}</div>}
        </div>
        {hasImages && (
          <div className="lp-theme07-closing-aside lp-rise">
            {validImages.map((img, i) => (
              <div key={i} className="lp-theme07-closing-image">
                {img.url ? (
                  <img src={img.url} alt={img.label || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--lp-radius-large)' }} />
                ) : (
                  <Theme07DropMedia tag={img.tag} label={img.label} imageRatio={imageRatio} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      )}
      <div className="lp-theme07-closing-footer">
        {footnoteLeft && <span className="lp-theme07-closing-footnote-left">{footnoteLeft}</span>}
        {footnoteRight && <span className="lp-theme07-closing-footnote-right">{footnoteRight}</span>}
      </div>
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
