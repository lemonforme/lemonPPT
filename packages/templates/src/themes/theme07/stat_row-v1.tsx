// lemonPPT - theme07 多数字并列版式
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { CSSProperties, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07StatRowV1Stat {
  value?: string;
  unit?: string;
  label?: string;
  note?: string;
}

export interface Theme07StatRowV1Props {
  imageUrl?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  stats?: Theme07StatRowV1Stat[];
  footnote?: string;
  showDividers?: boolean;
  showNotes?: boolean;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07StatRowV1Meta: LayoutMeta = {
  id: 'theme07_stat_row_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 多数字并列',
  description: '2–4 组大数字横向并列，配单位、标签与补充说明，用于一屏交代多个关键量级',
  needsMedia: true,
  tags: ['stat', 'big-number', 'metrics', 'grid'],
  contentShape: 'grid',
};

export const theme07StatRowV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'AT A GLANCE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '关键量级一览' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '四个维度勾勒本年度 AI 资本市场的整体规模' },
    {
      key: 'stats',
      label: '数字组',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { value: '1,284', unit: '亿美元', label: '融资总额', note: '同比 +62%' },
        { value: '97', unit: '笔', label: '大额交易', note: '单笔 ≥ 5 亿美元' },
        { value: '38', unit: '%', label: '头部毛利率', note: '同比 -9pp' },
        { value: '4.2', unit: '倍', label: '估值中位数', note: '按 ARR 计算' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'note', label: '补充说明', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '注：数据口径为公开披露信息，统计区间为自然年度。' },
    { key: 'showDividers', label: '显示分隔线', type: 'boolean', defaultValue: true },
    { key: 'showNotes', label: '显示补充说明', type: 'boolean', defaultValue: true },
    { key: 'focusIndex', label: '高亮数字', type: 'slider', min: 0, max: 3, defaultValue: 0 },
  ],
};

export function Theme07StatRowV1(props: Theme07StatRowV1Props): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    stats = [],
    footnote,
    showDividers = true,
    showNotes = true,
    focusIndex = 0,
    _slideIdx,
    _editable,
  } = props;

  const validStats = (stats || [])
    .filter((s): s is Theme07StatRowV1Stat => s != null && !!s.value)
    .slice(0, 4);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-stat-row">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-stat-row-header lp-rise">
        <Theme07IconChip name="chart" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        {title && <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>}
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      {validStats.length > 0 && (
        <div
          className={`lp-theme07-stat-row-body lp-rise ${showDividers ? 'has-dividers' : ''}`}
          style={{ '--lp-theme07-stat-count': validStats.length } as CSSProperties}
        >
          {validStats.map((stat, index) => (
            <div
              key={index}
              className={`lp-theme07-stat-row-item ${index === focusIndex ? 'is-focus' : ''}`}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="lp-theme07-stat-row-value">
                <EditableField prop={`stats.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme07-big-number-value">{stat.value}</EditableField>
                {stat.unit && (
                  <EditableField prop={`stats.${index}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme07-big-number-unit">{stat.unit}</EditableField>
                )}
              </div>
              {stat.label && (
                <EditableField prop={`stats.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme07-stat-row-label">{stat.label}</EditableField>
              )}
              {showNotes && stat.note && (
                <EditableField prop={`stats.${index}.note`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme07-stat-row-note">{stat.note}</EditableField>
              )}
            </div>
          ))}
        </div>
      )}
      {footnote && (
        <div className="lp-theme07-stat-row-footnote">
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnote}</EditableField>
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
