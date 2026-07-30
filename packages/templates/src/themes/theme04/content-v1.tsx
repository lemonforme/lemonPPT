// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04ContentV1Item {
  title: string;
  description?: string;
}

export interface Theme04ContentV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme04ContentV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ContentV1Meta: LayoutMeta = {
  id: 'theme04_content_v1',
  theme: 'theme04',
  role: 'content',
  displayName: 'Theme 04 胶囊高亮内容页',
  description: '左侧标题含胶囊高亮，右侧玻璃卡片要点列表',
  needsMedia: false,
  tags: ['content', 'bullet', 'candy'],
  contentShape: 'title-list',
};

export const theme04ContentV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '研究框架' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{方法论}}：如何解读资本流向' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '通过数据、案例与趋势三条主线，拆解 AI 产业的资本逻辑。' },
    {
      key: 'items',
      label: '要点列表',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { title: '数据筛选', description: '聚焦单笔 ≥1 亿美元的融资事件，排除债权与并购。' },
        { title: '赛道归类', description: '按通用大模型、垂直应用、AI 基础设施、芯片四条主线归类。' },
        { title: '趋势验证', description: '结合季度环比与估值变化，验证资本集中度假设。' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-content-title lp-rise">
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

export function Theme04ContentV1(props: Theme04ContentV1Props): ReactNode {
  const { kicker, title, subtitle, items, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-content">
      <div className="lp-theme04-content-head">
        {kicker && <div className="lp-theme04-kicker lp-rise">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-content-subtitle lp-rise">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-content-body lp-rise">
        {(items ?? []).slice(0, 6).map((item, idx) => (
          <div key={idx} className="lp-theme04-content-item lp-theme04-card">
            <EditableField prop={`items.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-content-item-title">{item.title}</EditableField>
            {item.description && (
              <EditableField prop={`items.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-content-item-desc">{item.description}</EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
