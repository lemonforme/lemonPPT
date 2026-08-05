// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme03TeamV2Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  members?: Array<{ name?: string; role?: string; bio?: string; imageUrl?: string }>;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03TeamV2Meta: LayoutMeta = {
  id: 'theme03_team_v2',
  theme: 'theme03',
  role: 'team',
  displayName: 'Theme 03 编辑风团队 v2',
  description: '横向大卡片团队成员展示',
  needsMedia: true,
  tags: ['team', 'members'],
  contentShape: 'team-cards',
};

export const theme03TeamV2Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '团队' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'TEAM' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'FOUNDING TEAM' },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心{{团队}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'members',
      label: '成员',
      type: 'array',
      maxItems: 3,
      minItems: 1,
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'role', label: '职位', type: 'text', inlineEditable: true },
        { key: 'bio', label: '简介', type: 'textarea', inlineEditable: true },
        { key: 'imageUrl', label: '图片', type: 'image' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme03TeamV2(props: Theme03TeamV2Props): ReactNode {
  const { tag, tagLabel, topRightMeta, kicker, title, subtitle, members = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeMembers = members.slice(0, 3);

  return (
    <div className="lp-slide lp-theme03-team-v2">
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

      <div className="lp-theme03-team-v2-main">
        <div className="lp-theme03-team-v2-head lp-rise">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-team-v2-kicker">{kicker}</EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme03-team-v2-title">{title}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-team-v2-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-team-v2-grid">
          {safeMembers.map((member, index) => (
            <div key={index} className="lp-theme03-team-v2-card lp-rise">
              <LpEditableImage
                className="lp-theme03-team-v2-avatar"
                src={member.imageUrl}
                alt={member.name || ''}
                slideIdx={_slideIdx}
                editable={_editable}
                prop={`members.${index}.imageUrl`}
                placeholderClassName="lp-editable-image-placeholder lp-theme03-team-v2-avatar-placeholder"
                showIcon={false}
                placeholderText=""
                placeholderChildren={member.name?.charAt(0) ?? '?'}
              />
              <EditableField prop={`members.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme03-team-v2-name">{member.name}</EditableField>
              <EditableField prop={`members.${index}.role`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-team-v2-role">{member.role}</EditableField>
              {member.bio && (
                <EditableField prop={`members.${index}.bio`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-team-v2-bio">{member.bio}</EditableField>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
