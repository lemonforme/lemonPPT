// lemonPPT - theme07 调研案例（三列网格变体）
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07DropMedia } from './drop-media-placeholder.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07Barcode } from './decoration.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';
import { theme07CaseV1Schema } from './case-v1.js';

export interface Theme07CaseGridV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  description?: string;
  cards?: Array<{
    company?: string;
    tagline?: string;
    tags?: string[];
    metricValue?: string;
    metricLabel?: string;
    accent?: boolean;
    imageUrl?: string;
  }>;
  footnote?: string;
  imageRatio?: 'portrait' | 'landscape' | 'square' | 'auto';
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07CaseGridV1Meta: LayoutMeta = {
  id: 'theme07_case_grid_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 调研案例（三列）',
  description: '三列并排案例卡片：公司名 + 图片 + 标签 + 关键指标，对齐参考案例页网格',
  needsMedia: true,
  tags: ['case', 'study', 'research', 'grid'],
  contentShape: 'case-study',
};

export const theme07CaseGridV1Schema: PropsSchema = {
  fields: theme07CaseV1Schema.fields.map((f) =>
    f.key === 'imageRatio'
      ? { ...f, defaultValue: 'square' }
      : f,
  ),
};

export function Theme07CaseGridV1(props: Theme07CaseGridV1Props): ReactNode {
  const { kicker, title, subtitle, description, cards = [], footnote, imageRatio, _slideIdx, _editable } = props;
  const validCards = (cards || []).slice(0, 3);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-case lp-theme07-case--grid">
      <Theme07SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-case-main lp-rise">
        <Theme07IconChip name="search" />
        {kicker && (
          <div className="lp-theme07-kicker">
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
          </div>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>
        )}
        {description && (
          <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-case-tagline">{description}</EditableField>
        )}
      </div>

      <div className="lp-theme07-case-grid-cols lp-rise">
        {validCards.map((card, idx) => {
          const normalizedTags = (card.tags || [])
            .map((t) => (typeof t === 'string' ? t : (t as { item?: string }).item ?? ''))
            .filter(Boolean);
          return (
            <div key={idx} className={`lp-theme07-case-col-card ${card.accent ? 'accent' : ''}`} style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="lp-theme07-case-col-image">
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt={card.company || ''} className="lp-theme07-case-col-image-img" />
                ) : (
                  <Theme07DropMedia tag={card.accent ? '重点' : undefined} label={card.company} compact imageRatio={imageRatio} />
                )}
              </div>
              <div className="lp-theme07-card-label">案例 {String(idx + 1).padStart(2, '0')}</div>
              {card.company && (
                <EditableField prop={`cards.${idx}.company`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme07-case-company">{card.company}</EditableField>
              )}
              {card.tagline && (
                <EditableField prop={`cards.${idx}.tagline`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-case-tagline">{card.tagline}</EditableField>
              )}
              {normalizedTags.length > 0 && (
                <div className="lp-theme07-cover-tags" style={{ marginTop: 4 }}>
                  {normalizedTags.map((t, i) => (
                    <span key={i} className="lp-theme07-cover-tag">
                      <EditableField prop={`cards.${idx}.tags.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{t}</EditableField>
                    </span>
                  ))}
                </div>
              )}
              {(card.metricValue || card.metricLabel) && (
                <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--lp-border)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div className="lp-theme07-card-value">
                    {card.metricValue && <EditableField prop={`cards.${idx}.metricValue`} slideIdx={_slideIdx} editable={_editable} as="span">{card.metricValue}</EditableField>}
                  </div>
                  <div className="lp-theme07-card-label">
                    {card.metricLabel && <EditableField prop={`cards.${idx}.metricLabel`} slideIdx={_slideIdx} editable={_editable} as="span">{card.metricLabel}</EditableField>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {footnote && (
        <div className="lp-theme07-footer" style={{ width: 'auto', left: 'var(--lp-page-padding)', right: 'auto' }}>
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnote}</EditableField>
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
      <Theme07Barcode count={22} />
    </div>
  );
}
