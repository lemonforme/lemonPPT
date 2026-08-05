// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme04AuroraBg } from './aurora-bg.js';

export interface Theme04CoverBentoV1Item {
  label: string;
  value: string;
  unit?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
  size?: 'small' | 'medium' | 'large';
}

export interface Theme04CoverBentoV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  items?: Theme04CoverBentoV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04CoverBentoV1Meta: LayoutMeta = {
  id: 'theme04_cover_bento_v1',
  theme: 'theme04',
  role: 'cover',
  displayName: 'Theme 04 Bento 封面',
  description: '居中主题封面 + 底部 2x2 Bento 数据网格',
  needsMedia: false,
  tags: ['cover', 'bento', 'hero', 'candy'],
  contentShape: 'title-metric-footer',
};

export const theme04CoverBentoV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '年度报告' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '2024' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'GLASS CANDY · EDITION 01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资本，正在{{重新分配}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '2024 全球 AI 大额融资 · 全景年鉴' },
    {
      key: 'items',
      label: 'Bento 指标',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { label: '全年总额', value: '970', unit: '亿美元', tone: 'green', size: 'large' },
        { label: '大额事件', value: '97', unit: '笔', tone: 'blue', size: 'medium' },
        { label: '平均单笔', value: '≈10', unit: '亿', tone: 'pink', size: 'medium' },
        { label: 'Q4 环比', value: '+41%', unit: '', tone: 'yellow', size: 'small' },
      ],
      itemSchema: [
        { key: 'label', label: '说明', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
        { key: 'size', label: '尺寸', type: 'select', defaultValue: 'medium', options: [{ value: 'small', label: '小' }, { value: 'medium', label: '中' }, { value: 'large', label: '大' }] },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT 研究出品' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: 'github.com/lemonforme/lemonPPT' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h1" className="lp-theme04-cover-bento-title lp-rise">
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

function bentoGridArea(index: number, count: number): string | undefined {
  // Explicit placement to avoid CSS grid auto-placement bugs.
  // Grid is 4 columns x auto rows; large spans 2x2, medium spans 2 cols, small spans 1 col.
  if (count <= 2) {
    if (index === 0) return '1 / 1 / 3 / 3';
    if (index === 1) return '1 / 3 / 3 / 5';
  }
  if (count === 3) {
    if (index === 0) return '1 / 1 / 3 / 3';
    if (index === 1) return '1 / 3 / 2 / 5';
    if (index === 2) return '2 / 3 / 3 / 5';
  }
  if (count >= 4) {
    if (index === 0) return '1 / 1 / 3 / 3';
    if (index === 1) return '1 / 3 / 2 / 5';
    if (index === 2) return '2 / 3 / 3 / 5';
    if (index === 3) return '3 / 4 / 4 / 5';
  }
  return undefined;
}

export function Theme04CoverBentoV1(props: Theme04CoverBentoV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, items, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };
  const validItems = (items || []).slice(0, 4);

  return (
    <div className="lp-slide lp-theme04-cover-bento lp-theme04-has-aurora">
      <Theme04AuroraBg />
      <div className="lp-theme04-cover-bento-top">
        {(tag || tagLabel) && (
          <div className="lp-theme04-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span>·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-kicker">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme04-cover-bento-hero">
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-cover-bento-subtitle lp-rise">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme04-cover-bento-grid lp-rise">
          {validItems.map((item, idx) => (
            <div
              key={idx}
              className={`lp-theme04-cover-bento-card lp-theme04-card lp-theme04-cover-bento-card--${item.size || 'medium'} ${toneClass[item.tone || 'green'] || ''}`}
              style={{ animationDelay: `${idx * 80}ms`, gridArea: bentoGridArea(idx, validItems.length) }}
            >
              <div className="lp-theme04-cover-bento-card-value">
                <EditableField prop={`items.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{item.value}</EditableField>
                {item.unit && <span className="unit">{item.unit}</span>}
              </div>
              <EditableField prop={`items.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-cover-bento-card-label">{item.label}</EditableField>
            </div>
          ))}
        </div>
      )}

      <div className="lp-theme04-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
