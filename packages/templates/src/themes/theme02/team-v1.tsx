// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02TeamV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  members: Array<{ name: string; role: string; bio?: string; imageUrl?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02TeamV1Meta: LayoutMeta = {
  id: 'theme02_team_v1',
  theme: 'theme02',
  role: 'team',
  displayName: 'Theme 02 霓虹团队',
  description: '团队成员卡片 + 霓虹头像光晕',
  needsMedia: true,
};

export const theme02TeamV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'members',
      label: '成员',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'role', label: '职位', type: 'text', inlineEditable: true },
        { key: 'bio', label: '简介', type: 'textarea', inlineEditable: true },
        { key: 'imageUrl', label: '图片', type: 'image' },
      ],
    },
  ],
};

export function Theme02TeamV1(props: Theme02TeamV1Props): ReactNode {
  const { kicker, title, subtitle, members = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-team-v1">
      <div className="lp-theme02-team-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-team-title lp-rise">
            {title}
          </EditableField>
        )}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-team-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme02-team-grid">
        {members.map((member, index) => (
          <div key={index} className="lp-theme02-team-card lp-rise" style={{ animationDelay: `${index * 80}ms` }}>
            <div className="lp-theme02-team-avatar">
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  data-lp-editable-image="true"
                  data-lp-slide-idx={_slideIdx}
                  data-lp-prop={`members.${index}.imageUrl`}
                />
              ) : (
                <div className="lp-theme02-team-avatar-placeholder">{member.name?.[0] || '?'}</div>
              )}
            </div>
            <EditableField
              prop={`members.${index}.name`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-theme02-team-name"
            >
              {member.name}
            </EditableField>
            <EditableField
              prop={`members.${index}.role`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-theme02-team-role"
            >
              {member.role}
            </EditableField>
            {member.bio && (
              <EditableField
                prop={`members.${index}.bio`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="p"
                className="lp-theme02-team-bio"
              >
                {member.bio}
              </EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
