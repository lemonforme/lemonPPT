import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface TeamV1Props {
  kicker?: string;
  title: string;
  members?: { name?: string; role?: string; bio?: string; imageUrl?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const teamV1Meta: LayoutMeta = {
  id: 'team_v1',
  theme: 'base',
  role: 'team',
  displayName: '团队介绍',
  description: '展示团队成员头像、姓名、职位与简介',
  needsMedia: true,
};

export function TeamV1(props: TeamV1Props): ReactNode {
  const { kicker, title, members = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-team-v1">
      <div className="lp-team-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-team-grid">
        {members.map((member, index) => (
          <div key={index} className="lp-team-card">
            {member.imageUrl ? (
              <img
                className="lp-team-avatar"
                src={member.imageUrl}
                alt={member.name || ''}
                data-lp-editable-image="true"
                data-lp-slide-idx={_slideIdx}
                data-lp-prop={`members.${index}.imageUrl`}
              />
            ) : (
              <div className="lp-team-avatar lp-team-avatar-placeholder" />
            )}
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
