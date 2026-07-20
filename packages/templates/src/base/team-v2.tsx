// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface TeamV2Props {
  kicker?: string;
  title: string;
  members?: { name?: string; role?: string; bio?: string; avatar?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const teamV2Meta: LayoutMeta = {
  id: 'team_v2',
  theme: 'base',
  role: 'team',
  displayName: '团队介绍墙',
  description: '团队成员头像、职位与简介网格',
  needsMedia: true,
};

export function TeamV2(props: TeamV2Props): ReactNode {
  const { kicker, title, members = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-team-v2">
      <div className="lp-team-v2-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-team-v2-grid">
        {members.map((member, index) => (
          <div key={index} className="lp-team-v2-card">
            <div
              className="lp-team-v2-avatar"
              style={member.avatar ? { backgroundImage: `url(${member.avatar})` } : undefined}
            >
              {!member.avatar && <span className="lp-team-v2-avatar-placeholder">{member.name?.charAt(0) ?? '?'}</span>}
            </div>
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
            <EditableField
              prop={`members.${index}.bio`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="p"
              className="lp-team-v2-bio"
            >
              {member.bio}
            </EditableField>
          </div>
        ))}
      </div>
    </div>
  );
}
