// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06TriadV1Item {
  title?: string;
  description?: string;
  value?: string;
  accent?: boolean;
}

export interface Theme06TriadV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme06TriadV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06TriadV1Meta: LayoutMeta = {
  id: 'theme06_triad_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 三元对比',
  description: '三列卡片展示三种方案、维度或阶段',
  needsMedia: true,
  tags: ['triad', 'comparison', 'three', 'atlas'],
  contentShape: 'comparison',
};

export const theme06TriadV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'TRIAD' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三种路径对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从成熟度、成本与可控性选择最佳落地方案' },
    {
      key: 'items',
      label: '对比项',
      type: 'array',
      minItems: 3,
      maxItems: 3,
      defaultValue: [
        { title: '自研模型', description: '完全掌控数据与推理链路，投入高、周期长。', value: 'A', accent: true },
        { title: '微调开源', description: '基于开源基座做领域适配，平衡成本与效果。', value: 'B', accent: false },
        { title: 'API 调用', description: '快速上线、按需付费，但依赖第三方能力边界。', value: 'C', accent: false },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
        { key: 'value', label: '编号/数值', type: 'text', inlineEditable: true },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
  ],
};

export function Theme06TriadV1(props: Theme06TriadV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], _slideIdx, _editable } = props;
  const validItems = (items || []).filter((i): i is Theme06TriadV1Item => i != null).slice(0, 3);

  return (
    <div className="lp-slide lp-theme06-triad">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-triad-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-triad-grid lp-rise">
        {validItems.map((item, index) => (
          <div key={index} className={`lp-theme06-triad-cell ${item.accent ? 'accent' : ''}`} style={{ animationDelay: `${index * 80}ms` }}>
            {item.value && <div className="lp-theme06-triad-number">{item.value}</div>}
            <EditableField prop={`items.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-triad-cell-title">{item.title || ''}</EditableField>
            {item.description && (
              <EditableField prop={`items.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-triad-cell-desc">{item.description}</EditableField>
            )}
          </div>
        ))}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
