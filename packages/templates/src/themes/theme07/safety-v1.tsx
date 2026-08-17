// lemonPPT - theme07 AI 安全赛道
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

export type Theme07SafetyV1Props = Theme07SectorLayoutProps;

export const theme07SafetyV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_safety_v1',
  displayName: 'Theme 07 AI 安全赛道',
  description: 'AI 安全赛道专题页，左文右数据',
  tags: ['safety', 'sector', 'vertical', 'research'],
};

export const theme07SafetyV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'SAFETY' };
    if (f.key === 'title') return { ...f, defaultValue: 'AI 安全赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '对齐、评测与防护成为模型能力上限的重要变量' };
    return f;
  }),
};

export function Theme07SafetyV1(props: Theme07SafetyV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
