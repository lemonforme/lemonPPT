// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';
import { Sheet, Masthead, Headline, Pill, Blob, DottedPattern, Ring, Plus } from './shared.js';

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
  description: '横向大头像团队展示',
  needsMedia: true,
};

export const theme01TeamV2Schema: PropsSchema = {
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
      key: 'members',
      label: '成员',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      itemSchema: [
        {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'role',
          label: '职位',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'bio',
          label: '简介',
          type: 'textarea',
          inlineEditable: true,
        },
        {
          key: 'imageUrl',
          label: '图片',
          type: 'image',
        },
      ],
    },
  ],
};

const MEMBER_COLORS = ['blue', 'green', 'amber', 'red'] as const;

export function Theme01TeamV2(props: Theme01TeamV2Props): ReactNode {
  const { kicker, title, members = [], _slideIdx, _editable } = props;
  const safeMembers = members.slice(0, 4);

  return (
    <Sheet substrate="light" frame="grid" className="lp-team-v2">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title ?? ''} en="OUR TEAM" size="large" className="lp-team-v2-headline lp-rise" />
      <div className="lp-team-v2-row lp-rise">
        {safeMembers.map((member, index) => {
          const color = MEMBER_COLORS[index % MEMBER_COLORS.length];
          return (
            <div key={index} className={`lp-team-v2-card color-${color}`}>
              <div className="lp-team-v2-card-top">
                <span className="lp-team-v2-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="lp-team-v2-avatar-wrap">
                  <LpEditableImage
                    className="lp-team-v2-avatar"
                    src={member.imageUrl}
                    alt={member.name || ''}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    prop={`members.${index}.imageUrl`}
                    placeholderClassName="lp-team-v2-avatar-placeholder"
                  />
                </div>
              </div>
              <div className="lp-team-v2-card-body">
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
                  <Pill variant="fill" color={color}>{member.role}</Pill>
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
              <div className="lp-team-v2-card-accent" aria-hidden="true" />
            </div>
          );
        })}
      </div>
      <Blob
        className="lp-team-v2-blob"
        style={{ width: 320, height: 320, top: -60, right: -70, background: 'var(--lp-violet)', opacity: 0.14 }}
      />
      <DottedPattern
        className="lp-team-v2-dots"
        style={{ bottom: 100, right: 80, width: 170, height: 170, opacity: 0.22 }}
      />
      <Ring
        className="lp-team-v2-ring"
        style={{ width: 90, height: 90, top: 130, right: 90, borderColor: 'var(--lp-amber)' }}
      />
      <Plus
        className="lp-team-v2-plus"
        style={{ bottom: 120, left: 100, color: 'var(--lp-red)' }}
      />
    </Sheet>
  );
}
