// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04DiptychV1Item {
  label?: string;
  description?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04DiptychV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  statement?: string;
  imageUrl?: string;
  items?: Theme04DiptychV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04DiptychV1Meta: LayoutMeta = {
  id: 'theme04_diptych_v1',
  theme: 'theme04',
  role: 'content',
  displayName: 'Theme 04 叙事对兑现',
  description: '左侧观点陈述，右侧图文证据，形成叙事与兑现的对开页',
  needsMedia: true,
  mediaSlots: [{ name: '证据图', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['diptych', 'content', 'candy'],
  contentShape: 'split-narrative',
};

export const theme04DiptychV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '叙事 · 对兑现' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{钱正在}}重新定价风险' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '当融资规模与收入增速脱钩，市场开始用新的坐标系给 AI 公司估值。' },
    { key: 'statement', label: '核心论断', type: 'textarea', inlineEditable: true, defaultValue: '「估值不是过去 12 个月收入的倍数，而是未来 36 个月共识的折现。」' },
    { key: 'imageUrl', label: '证据图', type: 'image' },
    {
      key: 'items',
      label: '论据列表',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { label: '共识', description: '头部基金对 AI Infra 的偏好高度一致', tone: 'green' },
        { label: '折现', description: '远期现金流预期取代短期盈利指标', tone: 'blue' },
        { label: '风险', description: '未形成护城河的模型公司承受折价', tone: 'pink' },
        { label: '机会', description: '垂直场景应用获得超额估值溢价', tone: 'yellow' },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT 研究出品' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: '叙事对兑现' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-diptych-title lp-rise">
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

export function Theme04DiptychV1(props: Theme04DiptychV1Props): ReactNode {
  const { kicker, title, subtitle, statement, imageUrl, items, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeItems = (items || []).filter((i) => i != null).slice(0, 4);
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-diptych">
      <div className="lp-theme04-diptych-left lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-diptych-subtitle">{subtitle}</EditableField>
        )}
        {statement && (
          <div className="lp-theme04-diptych-statement lp-theme04-card">
            <span className="lp-theme04-diptych-quote-mark">“</span>
            <EditableField prop="statement" slideIdx={_slideIdx} editable={_editable} as="blockquote">{statement}</EditableField>
          </div>
        )}
      </div>

      <div className="lp-theme04-diptych-right lp-rise">
        {imageUrl && (
          <div className="lp-theme04-diptych-image-wrap">
            <LpEditableImage
              className="lp-theme04-diptych-image"
              src={imageUrl}
              alt={title}
              slideIdx={_slideIdx}
              editable={_editable}
              prop="imageUrl"
              placeholderClassName="lp-editable-image-placeholder lp-theme04-diptych-image-placeholder"
              placeholderText="证据图"
            />
          </div>
        )}
        <div className="lp-theme04-diptych-items">
          {safeItems.map((item, idx) => (
            <div
              key={idx}
              className={`lp-theme04-diptych-item lp-theme04-card lp-rise ${toneClass[item.tone || 'green'] || ''}`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {item.label && (
                <EditableField prop={`items.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-diptych-item-label">{item.label}</EditableField>
              )}
              {item.description && (
                <EditableField prop={`items.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-diptych-item-desc">{item.description}</EditableField>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lp-theme04-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
