// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04TrioV1Item {
  name: string;
  role?: string;
  description: string;
  image?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04TrioV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme04TrioV1Item[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04TrioV1Meta: LayoutMeta = {
  id: 'theme04_trio_v1',
  theme: 'theme04',
  role: 'content',
  displayName: 'Theme 04 三强卡片页',
  description: '三个 contender/产品/人物卡片，含图片、名称与描述',
  needsMedia: true,
  tags: ['content', 'trio', 'cards', 'candy'],
  contentShape: 'title-grid',
};

export const theme04TrioV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '头部玩家' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{TOP 3}} 赛道领跑者' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '资本、技术与落地能力的三重较量' },
    {
      key: 'items',
      label: '卡片项',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      defaultValue: [
        { name: 'OpenAI', role: '基础模型', description: 'GPT 系列引领生成式 AI 浪潮，估值与融资规模均居首位。', tone: 'green' },
        { name: 'Anthropic', role: '安全对齐', description: '以 AI 安全为核心差异化，持续获得大额战略投资。', tone: 'blue' },
        { name: 'xAI', role: '新兴力量', description: '依托算力与数据优势快速扩张， late-stage 融资势头强劲。', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'role', label: '角色/标签', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
        { key: 'image', label: '图片', type: 'image' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-trio-title lp-rise">
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

export function Theme04TrioV1(props: Theme04TrioV1Props): ReactNode {
  const { kicker, title, subtitle, items, footnote, _slideIdx, _editable } = props;
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };
  const validItems = (items || []).slice(0, 3);

  return (
    <div className="lp-slide lp-theme04-trio">
      <div className="lp-theme04-trio-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-trio-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className={`lp-theme04-trio-grid lp-theme04-trio-grid--${validItems.length} lp-rise`}>
          {validItems.map((item, idx) => (
            <div key={idx} className={`lp-theme04-trio-card lp-theme04-card ${toneClass[item.tone ?? 'green'] || ''}`} style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="lp-theme04-trio-image-wrap">
                <LpEditableImage
                  className="lp-theme04-trio-image"
                  src={item.image}
                  alt={item.name}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  prop={`items.${idx}.image`}
                  placeholderClassName="lp-editable-image-placeholder lp-theme04-trio-image-placeholder"
                  placeholderText="图片"
                  showIcon={true}
                />
              </div>
              <div className="lp-theme04-trio-card-body">
                {item.role && (
                  <EditableField prop={`items.${idx}.role`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-trio-role">{item.role}</EditableField>
                )}
                <EditableField prop={`items.${idx}.name`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-trio-name">{item.name}</EditableField>
                <EditableField prop={`items.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-trio-desc">{item.description}</EditableField>
              </div>
            </div>
          ))}
        </div>
      )}

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-trio-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
