// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme05ProfileV1Fact {
  label: string;
  value: string;
}

export interface Theme05ProfileV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  name: string;
  role: string;
  company: string;
  quote?: string;
  facts?: Theme05ProfileV1Fact[];
  avatarUrl?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ProfileV1Meta: LayoutMeta = {
  id: 'theme05_profile_v1',
  theme: 'theme05',
  role: 'content',
  displayName: 'Theme 05 人物档案卡',
  description: '左侧头像占位 + 右侧人物信息、引言、关键事实',
  needsMedia: true,
  mediaSlots: [{ name: '头像', fieldPath: 'avatarUrl', canPresetMedia: true }],
  tags: ['profile', 'people', 'spectrum'],
  contentShape: 'profile-card',
};

export const theme05ProfileV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'PROFILE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心人物' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '推动本轮融资的关键决策者' },
    { key: 'name', label: '姓名', type: 'text', inlineEditable: true, defaultValue: 'Dario Amodei' },
    { key: 'role', label: '职位', type: 'text', inlineEditable: true, defaultValue: '联合创始人兼 CEO' },
    { key: 'company', label: '公司', type: 'text', inlineEditable: true, defaultValue: 'Anthropic' },
    { key: 'quote', label: '引言', type: 'textarea', inlineEditable: true, defaultValue: '可解释、可控的 AI 系统比单纯追求规模更符合长远利益。' },
    {
      key: 'facts',
      label: '关键事实',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { label: '任职时间', value: '2021 年至今' },
        { label: '前雇主', value: 'OpenAI' },
        { label: '核心贡献', value: 'Constitutional AI' },
        { label: '教育背景', value: '斯坦福、普林斯顿' },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '内容', type: 'text' },
      ],
    },
    { key: 'avatarUrl', label: '头像', type: 'image' },
  ],
};

export function Theme05ProfileV1(props: Theme05ProfileV1Props): ReactNode {
  const { kicker, title, subtitle, name, role, company, quote, facts = [], avatarUrl, _slideIdx, _editable } = props;
  const validFacts = (facts || []).slice(0, 4);

  return (
    <div className="lp-slide lp-theme05-profile">
      <div className="lp-theme05-profile-head lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme05-profile-body lp-rise">
        <div className="lp-theme05-profile-avatar">
          <LpEditableImage prop="avatarUrl" slideIdx={_slideIdx} editable={_editable} src={avatarUrl} alt={name} placeholderText="+ 头像" />
        </div>

        <div className="lp-theme05-profile-main">
          <div className="lp-theme05-profile-name">
            <EditableField prop="name" slideIdx={_slideIdx} editable={_editable} as="h3">{name}</EditableField>
          </div>
          <div className="lp-theme05-profile-meta">
            <EditableField prop="role" slideIdx={_slideIdx} editable={_editable} as="span">{role}</EditableField>
            <span className="lp-theme05-profile-meta-dot" />
            <EditableField prop="company" slideIdx={_slideIdx} editable={_editable} as="span">{company}</EditableField>
          </div>

          {quote && (
            <div className="lp-theme05-profile-quote">
              <span className="lp-theme05-profile-quote-mark">"</span>
              <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="p">{quote}</EditableField>
            </div>
          )}

          {validFacts.length > 0 && (
            <div className="lp-theme05-profile-facts">
              {validFacts.map((fact, idx) => (
                <div key={idx} className="lp-theme05-profile-fact">
                  <div className="lp-theme05-profile-fact-label">
                    <EditableField prop={`facts.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{fact.label}</EditableField>
                  </div>
                  <div className="lp-theme05-profile-fact-value">
                    <EditableField prop={`facts.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{fact.value}</EditableField>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
