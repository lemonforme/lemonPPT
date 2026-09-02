// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import {
  Blob,
  DottedPattern,
  Folio,
  Headline,
  IconHeading,
  Pill,
  Plus,
  Ring,
  Sheet,
  Slash,
  normalizeStrings,
} from './shared.js';

export interface Theme01ContentV1Props {
  title?: string;
  bullets?: string[];
  tags?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ContentV1Meta: LayoutMeta = {
  id: 'theme01_content_v1',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 内容页',
  description: '双栏内容：左侧要点 + 右侧标签云',
  needsMedia: false,
  tags: ['content', 'text', 'list', 'light'],
  contentShape: 'content',
};

export const theme01ContentV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    {
      key: 'bullets',
      label: '要点',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'tags',
      label: '标签',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
  ],
};

const TAG_COLORS = ['blue', 'green', 'amber', 'red', 'violet', 'cyan', 'pink'] as const;
const BULLET_COLORS = ['blue', 'green', 'amber', 'red', 'violet'] as const;

export function Theme01ContentV1(props: Theme01ContentV1Props): ReactNode {
  const { title = '', bullets = [], tags = [], _slideIdx, _editable } = props;
  const list = normalizeStrings(bullets);
  const tagList = normalizeStrings(tags);

  return (
    <Sheet substrate="light" frame="split" className="lp-content-v1">
      <Blob
        className="lp-content-v1-blob"
        style={{ width: 360, height: 360, top: -120, right: -80, background: 'var(--lp-amber)', opacity: 0.14 }}
      />
      <DottedPattern
        className="lp-content-v1-dots"
        style={{ bottom: 100, left: 60, width: 180, height: 180, opacity: 0.22 }}
      />
      <Slash
        className="lp-content-v1-slash"
        style={{ top: 110, right: 100, height: 70, background: 'var(--lp-blue)', opacity: 0.55 }}
      />
      <Plus
        className="lp-content-v1-plus"
        style={{ bottom: 90, left: 90, width: 28, height: 28, color: 'var(--lp-green)' }}
      />
      <Ring
        className="lp-content-v1-ring"
        style={{ bottom: 110, right: 120, width: 60, height: 60, borderColor: 'var(--lp-red)' }}
      />

      <div className="lp-content-v1-main lp-rise">
        <Headline cn={title || '内容标题'} size="large" className="lp-content-v1-headline" />
        <ul className="lp-content-v1-list">
          {list.map((bullet, index) => {
            const color = BULLET_COLORS[index % BULLET_COLORS.length];
            return (
              <li key={index} className={`color-${color}`}>
                <span className="lp-content-v1-bullet" aria-hidden="true" />
                <EditableField prop={`bullets.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {bullet}
                </EditableField>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="lp-content-v1-side lp-rise">
        <IconHeading
          icon="●"
          title="标签云"
          subtitle="相关主题胶囊"
          color="blue"
          className="lp-content-v1-side-heading"
        />
        <div className="lp-content-v1-tags">
          {tagList.map((tag, index) => {
            const color = TAG_COLORS[index % TAG_COLORS.length];
            return (
              <Pill key={index} variant="outline" color={color}>
                <EditableField prop={`tags.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {tag}
                </EditableField>
              </Pill>
            );
          })}
        </div>
      </div>

      <Folio
        left="CONTENT"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
