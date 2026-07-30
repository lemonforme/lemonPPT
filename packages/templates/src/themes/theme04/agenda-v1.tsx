// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04AgendaV1Item {
  part: string;
  title: string;
  description?: string;
  tone?: 'green' | 'yellow' | 'blue' | 'pink';
}

export interface Theme04AgendaV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  items?: Theme04AgendaV1Item[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04AgendaV1Meta: LayoutMeta = {
  id: 'theme04_agenda_v1',
  theme: 'theme04',
  role: 'tableOfContents',
  displayName: 'Theme 04 研究框架议程',
  description: '顶部标题 + 四列彩色 Part 卡片，适合报告框架/议程',
  needsMedia: false,
  tags: ['agenda', 'framework', 'candy'],
  contentShape: 'four-part-agenda',
};

export const theme04AgendaV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'RESEARCH FRAMEWORK / 调研框架' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '2024 美国大额融资 {{AI 公司}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '' },
    { key: 'badge', label: '徽章', type: 'text', inlineEditable: true, defaultValue: '调研报告' },
    {
      key: 'items',
      label: '议程项',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { part: '<Part01>', title: '市场全景', description: '全年 970 亿美元 · 融资全景', tone: 'green' },
        { part: '<Part02>', title: '行业透视', description: '赛道 / 轮次 / 头部玩家', tone: 'yellow' },
        { part: '<Part03>', title: '产业链分层', description: '上 · 中 · 下游结构透视', tone: 'blue' },
        { part: '<Part04>', title: '品质涌现', description: '从「赌叙事」到「看兑现」', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'part', label: '编号', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'green', label: '绿' }, { value: 'yellow', label: '黄' }, { value: 'blue', label: '蓝' }, { value: 'pink', label: '粉' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'textarea', inlineEditable: true, defaultValue: '横纵分析法 · 在空间维度与时间维度交叉透视同一组数据' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-agenda-title lp-rise">
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

export function Theme04AgendaV1(props: Theme04AgendaV1Props): ReactNode {
  const { kicker, title, subtitle, badge, items, footnote, _slideIdx, _editable } = props;
  const safeItems = (items ?? []).slice(0, 4);

  return (
    <div className="lp-slide lp-theme04-agenda">
      <div className="lp-theme04-agenda-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-agenda-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-agenda-grid lp-rise">
        {safeItems.map((item, idx) => (
          <div key={idx} className={`lp-theme04-agenda-card lp-theme04-card lp-theme04-card--${item.tone ?? 'green'}`}>
            <div className="lp-theme04-agenda-card-top">
              <span className="lp-theme04-agenda-part">{item.part}</span>
              <span className="lp-theme04-agenda-number">{idx + 1}</span>
            </div>
            <EditableField prop={`items.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-agenda-card-title">{item.title}</EditableField>
            {item.description && (
              <EditableField prop={`items.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-agenda-card-desc">{item.description}</EditableField>
            )}
          </div>
        ))}
      </div>

      <div className="lp-theme04-agenda-footnote lp-rise">
        {badge && <span className="lp-theme04-agenda-badge">{badge}</span>}
        {footnote && <span className="lp-theme04-agenda-footnote-text">{footnote}</span>}
      </div>
    </div>
  );
}
