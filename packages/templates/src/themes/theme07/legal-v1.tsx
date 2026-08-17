// lemonPPT - theme07 法律科技赛道
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

export type Theme07LegalV1Props = Theme07SectorLayoutProps;

export const theme07LegalV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_legal_v1',
  displayName: 'Theme 07 法律科技赛道',
  description: '法律科技赛道专题页，左文右数据',
  tags: ['legal', 'sector', 'vertical', 'research'],
};

export const theme07LegalV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'LEGAL' };
    if (f.key === 'title') return { ...f, defaultValue: 'AI 法律科技赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '合同审查、案例检索与合规自动化加速渗透' };
    return f;
  }),
};

export function Theme07LegalV1(props: Theme07LegalV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
