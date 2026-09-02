// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';
import { Sheet, Masthead, Headline, Pill, Blob, DottedPattern, Ring, Slash } from './shared.js';

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
  description: '色块拼贴风团队成员展示',
  needsMedia: true,
};

export const theme01TeamV1Schema: PropsSchema = {
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
      maxItems: 6,
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

const MEMBER_COLORS = ['red', 'blue', 'green', 'amber', 'violet', 'cyan'] as const;

export function Theme01TeamV1(props: Theme01TeamV1Props): ReactNode {
  const { kicker, title, members = [], _slideIdx, _editable } = props;
  const safeMembers = members.slice(0, 6);

  return (
    <Sheet substrate="light" frame="grid" className="lp-team-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title ?? ''} en="OUR TEAM" size="large" className="lp-team-v1-headline lp-rise" />
      <div className="lp-team-v1-grid lp-rise">
        {safeMembers.map((member, index) => {
          const color = MEMBER_COLORS[index % MEMBER_COLORS.length];
          const tilt = index % 2 === 0 ? '-1.2deg' : '1.2deg';
          return (
            <div key={index} className={`lp-team-v1-card color-${color}`} style={{ ['--lp-card-tilt' as string]: tilt }}>
              <div className="lp-team-v1-card-accent" aria-hidden="true" />
              <div className="lp-team-v1-card-head">
                <div className="lp-team-v1-avatar-wrap">
                  <LpEditableImage
                    className="lp-team-v1-avatar"
                    src={member.imageUrl}
                    alt={member.name || ''}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    prop={`members.${index}.imageUrl`}
                    placeholderClassName="lp-team-v1-avatar-placeholder"
                  />
                  <span className="lp-team-v1-index">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="lp-team-v1-card-meta">
                  <EditableField
                    prop={`members.${index}.name`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="h3"
                    className="lp-team-v1-name"
                  >
                    {member.name}
                  </EditableField>
                  <EditableField
                    prop={`members.${index}.role`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="div"
                    className="lp-team-v1-role"
                  >
                    <Pill variant="outline" color={color}>{member.role}</Pill>
                  </EditableField>
                </div>
              </div>
              {member.bio && (
                <EditableField
                  prop={`members.${index}.bio`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="p"
                  className="lp-team-v1-bio"
                >
                  {member.bio}
                </EditableField>
              )}
            </div>
          );
        })}
      </div>
      <Blob
        className="lp-team-v1-blob"
        style={{ width: 380, height: 380, bottom: -120, right: -100, background: 'var(--lp-violet)', opacity: 0.14 }}
      />
      <DottedPattern
        className="lp-team-v1-dots"
        style={{ top: 150, left: 60, width: 160, height: 160, opacity: 0.22 }}
      />
      <Ring
        className="lp-team-v1-ring"
        style={{ width: 100, height: 100, bottom: 140, right: 120, borderColor: 'var(--lp-amber)' }}
      />
      <Slash
        className="lp-team-v1-slash"
        style={{ top: 140, right: 90, height: 70, background: 'var(--lp-cyan)' }}
      />
    </Sheet>
  );
}
