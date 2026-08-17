// lemonPPT - theme07 开源生态赛道
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

export type Theme07OpenSourceV1Props = Theme07SectorLayoutProps;

export const theme07OpenSourceV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_open_source_v1',
  displayName: 'Theme 07 开源生态赛道',
  description: '开源生态赛道专题页，左文右数据',
  tags: ['open_source', 'sector', 'vertical', 'research'],
};

export const theme07OpenSourceV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'OPEN SOURCE' };
    if (f.key === 'title') return { ...f, defaultValue: 'AI 开源生态赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '开源模型、框架与数据集加速技术民主化' };
    return f;
  }),
};

export function Theme07OpenSourceV1(props: Theme07OpenSourceV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
