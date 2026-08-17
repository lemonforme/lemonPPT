// lemonPPT - theme07 客户服务赛道
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

export type Theme07SupportV1Props = Theme07SectorLayoutProps;

export const theme07SupportV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_support_v1',
  displayName: 'Theme 07 客户服务赛道',
  description: '客户服务赛道专题页，左文右数据',
  tags: ['support', 'sector', 'vertical', 'research'],
};

export const theme07SupportV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'SUPPORT' };
    if (f.key === 'title') return { ...f, defaultValue: 'AI 客户服务赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '智能客服、工单处理与情感分析进入规模化应用' };
    return f;
  }),
};

export function Theme07SupportV1(props: Theme07SupportV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
