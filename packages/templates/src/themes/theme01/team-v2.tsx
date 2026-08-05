// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme01TeamV2Props {
  kicker?: string;
  title?: string;
  members?: Array<{ name?: string; role?: string; bio?: string; imageUrl?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01TeamV2Meta: LayoutMeta = {
  id: 'theme01_team_v2',
  theme: 'theme01',
  role: 'team',
  displayName: 'Theme 01 团队页 v2',
  description: '横向大卡片团队成员展示',
  needsMedia: true,
};

export const theme01TeamV2Schema: PropsSchema = {
  fields: [
  {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'members',
      label: '成员',
      type: 'array',
      maxItems: 3,
      minItems: 1,
      itemSchema: [
    {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'role',
          label: '职位',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'bio',
          label: '简介',
          type: 'textarea',
          inlineEditable: true
    },
    {
          key: 'imageUrl',
          label: '图片',
          type: 'image'
    }
      ]
  }
  ]
};


export function Theme01TeamV2(props: Theme01TeamV2Props): ReactNode {
  const { kicker, title, members = [], _slideIdx, _editable } = props;
  const safeMembers = members.slice(0, 3);

  return (
  <div className="lp-slide lp-team-v2">
      <div className="lp-team-v2-header">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-team-v2-title lp-rise">
          {title}
    </EditableField>
      </div>
      <div className="lp-team-v2-grid">
    {safeMembers.map((member, index) => (
          <div key={index} className="lp-card lp-team-v2-card lp-rise">
      <LpEditableImage
              className="lp-team-v2-avatar"
              src={member.imageUrl}
              alt={member.name || ''}
              slideIdx={_slideIdx}
              editable={_editable}
              prop={`members.${index}.imageUrl`}
              placeholderClassName="lp-team-v2-avatar-placeholder"
              showIcon={false}
              placeholderText=""
              placeholderChildren={member.name?.charAt(0) ?? '?'}
            />
      <EditableField
              prop={`members.${index}.name`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-team-v2-name"
      >
              {member.name}
      </EditableField>
      <EditableField
              prop={`members.${index}.role`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-team-v2-role"
      >
              {member.role}
      </EditableField>
      {member.bio && (
              <EditableField
        prop={`members.${index}.bio`}
        slideIdx={_slideIdx}
        editable={_editable}
        as="p"
        className="lp-team-v2-bio"
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
