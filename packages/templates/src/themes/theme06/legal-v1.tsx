// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06LegalV1Item {
  title?: string;
  description?: string;
}

export interface Theme06LegalV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme06LegalV1Item[];
  conclusion?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06LegalV1Meta: LayoutMeta = {
  id: 'theme06_legal_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 法律合规框架',
  description: '编号步骤展示法律/合规/监管要点',
  needsMedia: true,
  tags: ['legal', 'compliance', 'framework', 'atlas'],
  contentShape: 'process',
};

export const theme06LegalV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'LEGAL & COMPLIANCE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 产品合规框架' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据、算法到内容输出的关键合规节点' },
    {
      key: 'items',
      label: '合规要点',
      type: 'array',
      minItems: 3,
      maxItems: 6,
      defaultValue: [
        { title: '数据授权与最小化', description: '训练与推理数据需获得合法授权，遵循目的限制与最小必要原则。' },
        { title: '算法透明与可解释', description: '高风险场景提供可解释输出，记录模型版本与决策依据。' },
        { title: '内容安全护栏', description: '建立输入过滤、输出审核与人工复核机制，降低有害内容风险。' },
        { title: '跨境传输评估', description: '涉及个人信息出境时，完成安全评估与标准合同备案。' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '说明', type: 'textarea', inlineEditable: true },
      ],
    },
    { key: 'conclusion', label: '结论', type: 'textarea', inlineEditable: true, defaultValue: '合规不是一次性动作，而是贯穿产品生命周期的持续治理。' },
  ],
};

export function Theme06LegalV1(props: Theme06LegalV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], conclusion, _slideIdx, _editable } = props;
  const validItems = (items || []).filter((i): i is Theme06LegalV1Item => i != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-legal">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-legal-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-legal-body lp-rise">
        <div className="lp-theme06-legal-grid">
          {validItems.map((item, index) => (
            <div key={index} className="lp-theme06-legal-card">
              <div className="lp-theme06-legal-number">{String(index + 1).padStart(2, '0')}</div>
              <EditableField prop={`items.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-legal-card-title">{item.title || ''}</EditableField>
              {item.description && (
                <EditableField prop={`items.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-legal-card-desc">{item.description}</EditableField>
              )}
            </div>
          ))}
        </div>
        {conclusion && (
          <div className="lp-theme06-legal-conclusion">
            <EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="p">{conclusion}</EditableField>
          </div>
        )}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
