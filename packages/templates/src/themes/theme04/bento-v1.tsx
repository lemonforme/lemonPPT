// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04BentoV1Item {
  label?: string;
  value?: string;
  unit?: string;
  size?: 'small' | 'medium' | 'large';
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04BentoV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  items?: Theme04BentoV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04BentoV1Meta: LayoutMeta = {
  id: 'theme04_bento_v1',
  theme: 'theme04',
  role: 'bento',
  displayName: 'Theme 04 糖果 Bento',
  description: '杂志化 Bento 数据网格，支持大小卡片与糖果色调',
  needsMedia: false,
  tags: ['bento', 'metrics', 'candy'],
  contentShape: 'bento-grid',
};

export const theme04BentoV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '数据看板' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'BENTO' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'GLASS CANDY · EDITION 01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{增长}}引擎一览' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '核心指标模块化呈现，快速定位关键数据' },
    {
      key: 'items',
      label: '数据项',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { label: '年度总额', value: '970', unit: '亿美元', size: 'large', tone: 'green' },
        { label: '大额事件', value: '97', unit: '笔', size: 'medium', tone: 'blue' },
        { label: '平均单笔', value: '≈10', unit: '亿', size: 'medium', tone: 'pink' },
        { label: 'Q4 环比', value: '+41%', unit: '', size: 'small', tone: 'yellow' },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'size', label: '尺寸', type: 'select', defaultValue: 'medium', options: [{ value: 'small', label: '小' }, { value: 'medium', label: '中' }, { value: 'large', label: '大' }] },
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
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-bento-title lp-rise">
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

export function Theme04BentoV1(props: Theme04BentoV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, items, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validItems = (items || []).filter((i) => i != null).slice(0, 6);
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-bento">
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

      <div className="lp-theme04-bento-main">
        <div className="lp-theme04-bento-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-bento-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {validItems.length > 0 && (
          <div className="lp-theme04-bento-grid">
            {validItems.map((item, idx) => (
              <div
                key={idx}
                className={`lp-theme04-bento-card lp-theme04-card lp-rise lp-theme04-bento-card--${item.size || 'medium'} ${toneClass[item.tone || 'green'] || ''}`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="lp-theme04-bento-card-value">
                  <EditableField prop={`items.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{item.value}</EditableField>
                  {item.unit && (
                    <EditableField prop={`items.${idx}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-bento-card-unit">{item.unit}</EditableField>
                  )}
                </div>
                <EditableField prop={`items.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-bento-card-label">{item.label}</EditableField>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme04-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
