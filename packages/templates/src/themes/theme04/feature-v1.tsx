// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04FeatureV1Item {
  title: string;
  description?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04FeatureV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme04FeatureV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04FeatureV1Meta: LayoutMeta = {
  id: 'theme04_feature_v1',
  theme: 'theme04',
  role: 'feature',
  displayName: 'Theme 04 糖果特性页',
  description: '顶部标题 + 三列糖果色特性卡片',
  needsMedia: false,
  tags: ['feature', 'highlights', 'candy'],
  contentShape: 'title-grid',
};

export const theme04FeatureV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '产品特性' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '为什么选择 {{柠檬 PPT}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从生成到交付，每个环节都更高效' },
    {
      key: 'items',
      label: '特性列表',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { title: 'AI 一键生成', description: '基于大模型自动理解需求，生成完整大纲与页面。', tone: 'green' },
        { title: '主题系统', description: '深色霓虹、浅色玻璃等多种风格，全局一键切换。', tone: 'blue' },
        { title: '数据可视化', description: '内置 SVG 图表与洞察面板，数据表达更聚焦。', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-feature-title lp-rise">
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

export function Theme04FeatureV1(props: Theme04FeatureV1Props): ReactNode {
  const { kicker, title, subtitle, items, _slideIdx, _editable } = props;
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-feature">
      <div className="lp-theme04-feature-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-feature-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-feature-grid lp-rise">
        {(items ?? []).slice(0, 6).map((item, idx) => (
          <div key={idx} className={`lp-theme04-feature-card lp-theme04-card ${toneClass[item.tone ?? 'green'] ?? ''}`}>
            <span className="lp-theme04-feature-number">{String(idx + 1).padStart(2, '0')}</span>
            <EditableField prop={`items.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-feature-card-title">{item.title}</EditableField>
            {item.description && (
              <EditableField prop={`items.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-feature-card-desc">{item.description}</EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
