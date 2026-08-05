// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme04AuroraBg } from './aurora-bg.js';

export interface Theme04CoverGhostV1Metric {
  value: string;
  unit?: string;
  label: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04CoverGhostV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  ghostNumber: string;
  title: string;
  subtitle?: string;
  metrics?: Theme04CoverGhostV1Metric[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04CoverGhostV1Meta: LayoutMeta = {
  id: 'theme04_cover_ghost_v1',
  theme: 'theme04',
  role: 'cover',
  displayName: 'Theme 04 幽灵数字封面',
  description: '超大幽灵数字背景 + 前景标题的糖果风封面',
  needsMedia: false,
  tags: ['cover', 'ghost', 'candy'],
  contentShape: 'title-metric-footer',
};

export const theme04CoverGhostV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '年度报告' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '2024' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'GLASS CANDY · EDITION 01' },
    { key: 'ghostNumber', label: '幽灵数字', type: 'text', defaultValue: '01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 产业{{新格局}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从叙事驱动到兑现驱动的关键转折' },
    {
      key: 'metrics',
      label: '底部指标',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { value: '970', unit: '亿美元', label: '全年总额', tone: 'green' },
        { value: '97', unit: '笔', label: '大额事件', tone: 'blue' },
        { value: '+41%', unit: '', label: 'Q4 环比', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '说明', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT 研究出品' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: 'github.com/lemonforme/lemonPPT' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h1" className="lp-theme04-cover-ghost-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return (
            <em key={idx} className="lp-theme04-pill">
              {match[1]}
            </em>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme04CoverGhostV1(props: Theme04CoverGhostV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, ghostNumber, title, subtitle, metrics, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-pill--green',
    pink: 'lp-theme04-pill--pink',
    blue: 'lp-theme04-pill--blue',
    yellow: 'lp-theme04-pill--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-cover-ghost lp-theme04-has-aurora">
      <Theme04AuroraBg />
      <div className="lp-theme04-cover-ghost-top">
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

      <div className="lp-theme04-cover-ghost-main">
        <div className="lp-theme04-cover-ghost-bg" aria-hidden="true">
          <EditableField prop="ghostNumber" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-cover-ghost-number">{ghostNumber || ''}</EditableField>
        </div>
        <div className="lp-theme04-cover-ghost-hero lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-cover-ghost-subtitle">{subtitle}</EditableField>
          )}
        </div>
      </div>

      <div className="lp-theme04-cover-ghost-metrics lp-rise">
        {(metrics ?? []).slice(0, 3).map((m, idx) => (
          <div key={idx} className={`lp-theme04-cover-ghost-metric lp-theme04-card ${toneClass[m.tone ?? 'green'] ?? ''}`}>
            <div className="lp-theme04-cover-ghost-metric-value">
              <EditableField prop={`metrics.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{m.value}</EditableField>
              {m.unit && <span className="unit">{m.unit}</span>}
            </div>
            <EditableField prop={`metrics.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-cover-ghost-metric-label">{m.label}</EditableField>
          </div>
        ))}
      </div>

      <div className="lp-theme04-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
