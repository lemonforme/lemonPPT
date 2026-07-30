// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04VoicesV1Voice {
  quote?: string;
  author?: string;
  role?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04VoicesV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  voices?: Theme04VoicesV1Voice[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04VoicesV1Meta: LayoutMeta = {
  id: 'theme04_voices_v1',
  theme: 'theme04',
  role: 'quote',
  displayName: 'Theme 04 投资人说',
  description: '2-3 段并列引用，展示多方观点与共识',
  needsMedia: false,
  tags: ['quote', 'voices', 'testimonial', 'candy'],
  contentShape: 'quote-grid',
};

export const theme04VoicesV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '投资人说' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{市场}}正在形成新共识' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '来自不同视角的判断，指向同一个方向。' },
    {
      key: 'voices',
      label: '引用',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { quote: '这不是短期泡沫，而是生产力曲线的永久性抬升。', author: 'Sarah Chen', role: 'GP, Horizon Ventures', tone: 'green' },
        { quote: '我们愿意为有数据飞轮的公司支付明显溢价。', author: '李明远', role: '合伙人，光源资本', tone: 'blue' },
        { quote: '通用模型的窗口期正在关闭，垂直场景才刚开始。', author: 'Alex Rao', role: 'MD, Compound', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'quote', label: '引用内容', type: 'textarea' },
        { key: 'author', label: '作者', type: 'text' },
        { key: 'role', label: '职位', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：公开访谈整理 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-voices-title lp-rise">
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

export function Theme04VoicesV1(props: Theme04VoicesV1Props): ReactNode {
  const { kicker, title, subtitle, voices, footnote, _slideIdx, _editable } = props;
  const safeVoices = (voices || []).filter((v) => v != null).slice(0, 3);
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-voices">
      <div className="lp-theme04-voices-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-voices-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-voices-grid">
        {safeVoices.map((voice, idx) => (
          <div
            key={idx}
            className={`lp-theme04-voices-card lp-theme04-card lp-rise ${toneClass[voice.tone || 'green'] || ''}`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <span className="lp-theme04-voices-quote-mark">“</span>
            {voice.quote && (
              <EditableField prop={`voices.${idx}.quote`} slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-theme04-voices-quote">{voice.quote}</EditableField>
            )}
            <div className="lp-theme04-voices-author">
              {voice.author && (
                <EditableField prop={`voices.${idx}.author`} slideIdx={_slideIdx} editable={_editable} as="strong">{voice.author}</EditableField>
              )}
              {voice.role && (
                <EditableField prop={`voices.${idx}.role`} slideIdx={_slideIdx} editable={_editable} as="span">{voice.role}</EditableField>
              )}
            </div>
          </div>
        ))}
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-voices-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
