// lemonPPT - theme07 调研案例
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07DropMedia } from './drop-media-placeholder.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07Barcode } from './decoration.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07CaseV1Card {
  company?: string;
  tagline?: string;
  tags?: string[];
  metricValue?: string;
  metricLabel?: string;
  accent?: boolean;
  imageUrl?: string;
}

export interface Theme07CaseV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  description?: string;
  cards?: Theme07CaseV1Card[];
  footnote?: string;
  imageRatio?: 'portrait' | 'landscape' | 'square' | 'auto';
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07CaseV1Meta: LayoutMeta = {
  id: 'theme07_case_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 调研案例',
  description: '三列案例卡片：顶部纹理 + 公司名 + 标签 + 关键指标',
  needsMedia: true,
  tags: ['case', 'study', 'research'],
  contentShape: 'case-study',
};

export const theme07CaseV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CASE STUDIES' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '典型案例' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '三类资本逻辑的代表公司' },
    { key: 'description', label: '说明', type: 'textarea', inlineEditable: true, defaultValue: 'Anthropic、xAI 和 CoreWeave 分别代表安全模型、实时数据生态和算力基础设施三类资本逻辑。' },
    {
      key: 'cards',
      label: '案例卡片',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { company: 'Anthropic', tagline: '安全可靠模型', tags: ['安全对齐', 'Claude'], metricValue: '650+', metricLabel: '亿美元·累计融资', accent: true },
        { company: 'xAI', tagline: '实时数据生态', tags: ['实时数据', '多模态'], metricValue: '50', metricLabel: '亿美元·单笔融资', accent: false },
        { company: 'CoreWeave', tagline: '算力基础设施', tags: ['GPU 云', '算力资源'], metricValue: '110', metricLabel: '亿美元·融资额', accent: false },
      ],
      itemSchema: [
        { key: 'company', label: '公司名', type: 'text' },
        { key: 'tagline', label: '一句话说明', type: 'text' },
        {
          key: 'tags',
          label: '标签',
          type: 'array',
          maxItems: 4,
          itemSchema: [{ key: 'item', label: '标签', type: 'text' }],
        },
        { key: 'metricValue', label: '指标数值', type: 'text' },
        { key: 'metricLabel', label: '指标说明', type: 'text' },
        { key: 'accent', label: '高亮', type: 'boolean' },
        { key: 'imageUrl', label: '卡片图片', type: 'image' },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'textarea', inlineEditable: true, defaultValue: '不同案例共同指向同一个问题：技术优势能否转成可持续收入。' },
    { key: 'imageRatio', label: '图片比例', type: 'select', options: [{ value: 'landscape', label: '横向' }, { value: 'portrait', label: '纵向' }, { value: 'square', label: '方形' }, { value: 'auto', label: '自适应' }], defaultValue: 'landscape' },
  ],
};

export function Theme07CaseV1(props: Theme07CaseV1Props): ReactNode {
  const { kicker, title, subtitle, description, cards = [], footnote, imageRatio, _slideIdx, _editable } = props;
  const validCards = (cards || []).slice(0, 3);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-case">
      <Theme07SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
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

      <div className="lp-theme07-case-aside lp-rise">
        {validCards.map((card, idx) => {
          const normalizedTags = (card.tags || [])
            .map((t) => (typeof t === 'string' ? t : (t as { item?: string }).item ?? ''))
            .filter(Boolean);
          return (
            <div key={idx} className={`lp-theme07-card ${card.accent ? 'accent' : ''}`} style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="lp-theme07-case-card-image">
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt={card.company || ''} className="lp-theme07-case-card-image-img" />
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
                <div className="lp-theme07-cover-tags" style={{ marginTop: 10 }}>
                  {normalizedTags.map((t, i) => (
                    <span key={i} className="lp-theme07-cover-tag">
                      <EditableField prop={`cards.${idx}.tags.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{t}</EditableField>
                    </span>
                  ))}
                </div>
              )}
              {(card.metricValue || card.metricLabel) && (
                <div style={{ marginTop: 'auto', paddingTop: 18, borderTop: '1px solid var(--lp-border)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
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
