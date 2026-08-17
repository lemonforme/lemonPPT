// lemonPPT - theme07 调研封面
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';
import { Theme07MiniBars, Theme07WatermarkNumber } from './decoration.js';
import { Theme07IconChip } from './theme07-icons.js';

export interface Theme07CoverV1Metric {
  value: string;
  unit?: string;
  label: string;
  accent?: boolean;
}

export interface Theme07CoverV1Props {
  tag?: string;
  enTag?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  metrics?: Theme07CoverV1Metric[];
  tags?: string[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07CoverV1Meta: LayoutMeta = {
  id: 'theme07_cover_v1',
  theme: 'theme07',
  role: 'cover',
  displayName: 'Theme 07 调研封面',
  description: '冷白调研封面：左侧衬线大标题 + 右侧封面图 + 2×2 指标卡 + 底部条码装饰',
  needsMedia: true,
  tags: ['cover', 'research', 'white-paper'],
  contentShape: 'cover',
};

export const theme07CoverV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'RESEARCH BRIEF' },
    { key: 'enTag', label: '英文小标签', type: 'text', inlineEditable: true, defaultValue: 'COLD WHITE RESEARCH' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '2026 全球 AI 产业调研报告' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从技术演进看产业格局与战略机会' },
    { key: 'imageUrl', label: '封面图片', type: 'image' },
    {
      key: 'metrics',
      label: '关键指标',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      defaultValue: [
        { value: '970', unit: '亿美元', label: '全年融资', accent: false },
        { value: '97', unit: '笔', label: '大额事件', accent: true },
        { value: '+41%', unit: '', label: 'Q4 环比', accent: false },
        { value: 'Top 10', unit: '', label: '集中度', accent: false },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
    {
      key: 'tags',
      label: '底部标签',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      defaultValue: ['产业全景', '资本流向', '技术演进', '风险展望'],
      itemSchema: [{ key: 'item', label: '标签', type: 'text', inlineEditable: true }],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '01' },
  ],
};

export function Theme07CoverV1(props: Theme07CoverV1Props): ReactNode {
  const { tag, enTag, title, subtitle, imageUrl, metrics = [], tags = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const normalizedTags = tags
    .map((t) => (typeof t === 'string' ? t : (t as { item?: string }).item ?? ''))
    .filter(Boolean);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-cover">
      <Theme07WatermarkNumber number="01" />
      <div className="lp-theme07-cover-main lp-rise">
        <Theme07IconChip name="globe" />
        {tag && (
          <div className="lp-theme07-kicker">
            <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>
          </div>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme07-cover-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>
        )}
        {normalizedTags.length > 0 && (
          <div className="lp-theme07-cover-tags lp-rise">
            {normalizedTags.map((t, i) => (
              <span key={i} className="lp-theme07-cover-tag">
                <EditableField prop={`tags.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{t}</EditableField>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="lp-theme07-cover-aside lp-rise">
        <div className="lp-theme07-cover-image">
          <LpEditableImage
            prop="imageUrl"
            src={imageUrl}
            slideIdx={_slideIdx}
            editable={_editable}
            className="lp-theme07-cover-image-img"
            placeholderClassName="lp-theme07-cover-image-placeholder"
            placeholderText="点击上传封面主视觉"
          />
        </div>
        {metrics.length > 0 && (
          <div className="lp-theme07-cover-metrics">
            {metrics.map((m, i) => (
              <div key={i} className={`lp-theme07-cover-metric ${m.accent ? 'accent' : ''}`} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="lp-theme07-cover-metric-value">
                  <EditableField prop={`metrics.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{m.value}</EditableField>
                  {m.unit && <EditableField prop={`metrics.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span">{m.unit}</EditableField>}
                </div>
                <div className="lp-theme07-cover-metric-label">
                  <EditableField prop={`metrics.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{m.label}</EditableField>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="lp-theme07-glow-line lp-rise" aria-hidden="true" />
      <div className="lp-theme07-footer">
        <span className="lp-theme07-footer-left">
          {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
          {enTag && <span className="lp-theme07-kicker" style={{ marginLeft: 16 }}>{enTag}</span>}
        </span>
        <span className="lp-theme07-footer-right">
          {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
        </span>
      </div>
      <Theme07MiniBars count={22} />
    </div>
  );
}
