// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme03TeamV1Member {
  name?: string;
  role?: string;
  bio?: string;
  image?: string;
}

export interface Theme03TeamV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  members?: Theme03TeamV1Member[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03TeamV1Meta: LayoutMeta = {
  id: 'theme03_team_v1',
  theme: 'theme03',
  role: 'team',
  displayName: 'Theme 03 编辑风团队',
  description: '深色代码编辑风团队页，头像 + 姓名 + 职位 + 简介卡片',
  needsMedia: true,
  tags: ['team', 'members', 'people'],
  contentShape: 'team-cards',
};

export const theme03TeamV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '团队' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'TEAM' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心{{团队}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'members',
      label: '成员',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        { key: 'name', label: '姓名', type: 'text' },
        { key: 'role', label: '职位', type: 'text' },
        { key: 'bio', label: '简介', type: 'textarea' },
        { key: 'image', label: '头像', type: 'image' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-team-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03TeamV1(props: Theme03TeamV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, members, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validMembers = (members || []).filter((m) => m != null);

  return (
    <div className="lp-slide lp-theme03-team-v1">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-team-main">
        <div className="lp-theme03-team-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-team-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {validMembers.length > 0 && (
          <div className="lp-theme03-team-grid lp-rise">
            {validMembers.map((member, idx) => (
              <div key={idx} className="lp-theme03-team-card">
                <div className="lp-theme03-team-avatar-wrap">
                  {member.image ? (
                    <img className="lp-theme03-team-avatar" src={member.image} alt={member.name || ''} />
                  ) : (
                    <LpEditableImage
                      className="lp-theme03-team-avatar"
                      src={member.image}
                      alt={member.name || ''}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      prop={`members.${idx}.image`}
                      placeholderClassName="lp-editable-image-placeholder lp-theme03-team-avatar-placeholder"
                      placeholderText="头像"
                    />
                  )}
                </div>
                <EditableField prop={`members.${idx}.name`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-team-name">{member.name}</EditableField>
                <EditableField prop={`members.${idx}.role`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-team-role">{member.role}</EditableField>
                {member.bio && (
                  <EditableField prop={`members.${idx}.bio`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-team-bio">{member.bio}</EditableField>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
