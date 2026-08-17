// lemonPPT - theme07 对齐研究赛道
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import {
  Theme07SectorLayout,
  theme07SectorLayoutSchemaBase,
  theme07SectorLayoutMetaBase,
  type Theme07SectorLayoutProps,
} from './sector-layout.js';

export type Theme07AlignmentV1Props = Theme07SectorLayoutProps;

export const theme07AlignmentV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_alignment_v1',
  displayName: 'Theme 07 对齐研究赛道',
  description: '对齐研究赛道专题页，左文右数据',
  tags: ['alignment', 'sector', 'vertical', 'research'],
};

export const theme07AlignmentV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'ALIGNMENT' };
    if (f.key === 'title') return { ...f, defaultValue: 'AI 对齐研究赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '可解释、可控与价值对齐是长期安全的基础' };
    return f;
  }),
};

export function Theme07AlignmentV1(props: Theme07AlignmentV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
