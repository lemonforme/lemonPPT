// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme04AuroraBg } from './aurora-bg.js';

export interface Theme04CoverIndexV1Item {
  number: string;
  title: string;
  description?: string;
  tone?: 'green' | 'yellow' | 'blue' | 'pink';
}

export interface Theme04CoverIndexV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  items?: Theme04CoverIndexV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04CoverIndexV1Meta: LayoutMeta = {
  id: 'theme04_cover_index_v1',
  theme: 'theme04',
  role: 'cover',
  displayName: 'Theme 04 索引导读封面',
  description: '左侧大标题 + 右侧四列彩色目录卡片封面',
  needsMedia: false,
  tags: ['cover', 'index', 'candy'],
  contentShape: 'cover-index',
};

export const theme04CoverIndexV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '封面故事' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'COVER STORY' },
    { key: 'topRightMeta', label: '右上角元信息', type: 'text', inlineEditable: true, defaultValue: 'NO. 04 2024 年刊' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '谁在{{改写}}估值规则' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '头部玩家、资本流向与一年翻倍的独角兽流水线' },
    {
      key: 'items',
      label: '目录项',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { number: '01', title: '算力霸权', description: '芯片 · 数据中心 · 谁卡住咽喉', tone: 'green' },
        { number: '02', title: '模型军备', description: '基础模型三强 · 烧钱与护城河', tone: 'blue' },
        { number: '03', title: '应用突围', description: '从 Demo 到收入 · 谁先跑通', tone: 'yellow' },
        { number: '04', title: '资本退潮', description: '热钱之后 · 谁会被留在沙滩上', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'number', label: '编号', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'green', label: '绿' }, { value: 'yellow', label: '黄' }, { value: 'blue', label: '蓝' }, { value: 'pink', label: '粉' }] },
      ],
    },
    { key: 'footnoteLeft', label: '左下角脚注', type: 'text', inlineEditable: true, defaultValue: 'AI CAPITAL 资本观察 · 特别报告' },
    { key: 'footnoteRight', label: '右下角脚注', type: 'text', inlineEditable: true, defaultValue: '' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h1" className="lp-theme04-cover-index-title lp-rise">
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

export function Theme04CoverIndexV1(props: Theme04CoverIndexV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, items, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeItems = (items ?? []).slice(0, 4);

  return (
    <div className="lp-slide lp-theme04-cover-index lp-theme04-has-aurora">
      <Theme04AuroraBg />
      <div className="lp-theme04-cover-index-top lp-rise">
        <div className="lp-theme04-cover-index-tag">
          {tag && <span className="lp-theme04-cover-index-tag-main">{tag}</span>}
          {tagLabel && <span className="lp-theme04-cover-index-tag-label">{tagLabel}</span>}
        </div>
        {topRightMeta && <div className="lp-theme04-cover-index-meta">{topRightMeta}</div>}
      </div>

      <div className="lp-theme04-cover-index-body">
        <div className="lp-theme04-cover-index-hero lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-cover-index-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme04-cover-index-list lp-rise">
          {safeItems.map((item, idx) => (
            <div key={idx} className={`lp-theme04-cover-index-card lp-theme04-card lp-theme04-card--${item.tone ?? 'green'}`}>
              <div className="lp-theme04-cover-index-card-head">
                <span className="lp-theme04-cover-index-number">{item.number}</span>
              </div>
              <EditableField prop={`items.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-cover-index-card-title">{item.title}</EditableField>
              {item.description && (
                <EditableField prop={`items.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-cover-index-card-desc">{item.description}</EditableField>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lp-theme04-cover-index-footer lp-rise">
        {footnoteLeft && <span>{footnoteLeft}</span>}
        {footnoteRight && <span>{footnoteRight}</span>}
      </div>
    </div>
  );
}
