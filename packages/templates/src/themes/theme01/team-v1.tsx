// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme01TeamV1Props {
  kicker?: string;
  title?: string;
  members?: Array<{ name?: string; role?: string; bio?: string; imageUrl?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01TeamV1Meta: LayoutMeta = {
  id: 'theme01_team_v1',
  theme: 'theme01',
  role: 'team',
  displayName: 'Theme 01 团队页',
  description: '玻璃卡片团队成员展示',
  needsMedia: true,
};

export const theme01TeamV1Schema: PropsSchema = {
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
      minItems: 2,
      maxItems: 6,
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


export function Theme01TeamV1(props: Theme01TeamV1Props): ReactNode {
  const { kicker, title, members = [], _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-team-v1">
      <div className="lp-team-header">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-team-title lp-rise">
          {title}
    </EditableField>
      </div>
      <div className="lp-team-grid">
    {members.map((member, index) => (
          <div key={index} className="lp-card lp-team-card lp-rise">
      <LpEditableImage
              className="lp-team-avatar"
              src={member.imageUrl}
              alt={member.name || ''}
              slideIdx={_slideIdx}
              editable={_editable}
              prop={`members.${index}.imageUrl`}
              placeholderClassName="lp-team-avatar-placeholder"
            />
      <EditableField
              prop={`members.${index}.name`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-team-name"
      >
              {member.name}
      </EditableField>
      <EditableField
              prop={`members.${index}.role`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-team-role"
      >
              {member.role}
      </EditableField>
      {member.bio && (
              <EditableField
        prop={`members.${index}.bio`}
        slideIdx={_slideIdx}
        editable={_editable}
        as="p"
        className="lp-team-bio"
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
