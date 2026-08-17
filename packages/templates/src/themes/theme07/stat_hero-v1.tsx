// lemonPPT - theme07 单数字 Hero 版式
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { CSSProperties, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07StatHeroV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  number?: string;
  unit?: string;
  caption?: string;
  numberSlant?: boolean;
  showRule?: boolean;
  showLens?: boolean;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07StatHeroV1Meta: LayoutMeta = {
  id: 'theme07_stat_hero_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 单数字 Hero',
  description: '整页聚焦单个超大数字：巨号数值 + 单位 + 说明文案，用于强调唯一核心结论',
  needsMedia: true,
  tags: ['stat', 'big-number', 'hero', 'highlight'],
  contentShape: 'stat',
};

export const theme07StatHeroV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'KEY FIGURE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '全年 AI 融资总额' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '覆盖种子轮至 Pre-IPO 的全部披露交易' },
    { key: 'number', label: '核心数字', type: 'text', inlineEditable: true, defaultValue: '1,284' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'caption', label: '数字说明', type: 'textarea', inlineEditable: true, defaultValue: '同比增长 62%，其中基础模型层占比接近六成' },
    { key: 'numberSlant', label: '数字倾斜', type: 'boolean', defaultValue: true },
    { key: 'showRule', label: '显示分隔标尺', type: 'boolean', defaultValue: true },
    { key: 'showLens', label: '数字聚焦镜头', type: 'boolean', defaultValue: true },
  ],
};

/** 标尺刻度密度：纯装饰，用于让巨号数字有度量参照 */
const RULE_TICKS = 24;

export function Theme07StatHeroV1(props: Theme07StatHeroV1Props): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    number = '0',
    unit,
    caption,
    numberSlant = true,
    showRule = true,
    showLens = true,
    _slideIdx,
    _editable,
  } = props;

  return (
    <div className="lp-slide lp-theme07 lp-theme07-stat-hero">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-stat-hero-header lp-rise">
        <Theme07IconChip name="target" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme07-stat-hero-body lp-rise">
        <div className={`lp-theme07-stat-hero-figure ${showLens ? 'lp-focus' : ''}`}>
          {showLens && <span className="lp-focus-lens" aria-hidden="true" />}
          <div
            className="lp-theme07-stat-hero-number"
            style={numberSlant ? ({ transform: 'skewX(-6deg)' } as CSSProperties) : undefined}
          >
            <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme07-big-number-value">{number}</EditableField>
            {unit && <span className="lp-theme07-big-number-unit">{unit}</span>}
          </div>
        </div>
        {showRule && (
          <div className="lp-theme07-stat-hero-rule" aria-hidden="true">
            {Array.from({ length: RULE_TICKS }, (_, index) => (
              <span
                key={index}
                className={`lp-theme07-stat-hero-tick ${index % 4 === 0 ? 'is-major' : ''}`}
              />
            ))}
          </div>
        )}
        {caption && (
          <EditableField prop="caption" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme07-stat-hero-caption">{caption}</EditableField>
        )}
      </div>
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
