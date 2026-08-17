// lemonPPT - theme07 金融科技赛道
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

export type Theme07FinanceV1Props = Theme07SectorLayoutProps;

export const theme07FinanceV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_finance_v1',
  displayName: 'Theme 07 金融科技赛道',
  description: '金融科技赛道专题页，左文右数据',
  tags: ['finance', 'sector', 'vertical', 'research'],
};

export const theme07FinanceV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'FINANCE' };
    if (f.key === 'title') return { ...f, defaultValue: 'AI 金融科技赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '风控、投研与客户服务的智能化重构' };
    return f;
  }),
};

export function Theme07FinanceV1(props: Theme07FinanceV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
