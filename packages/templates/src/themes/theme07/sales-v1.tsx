// lemonPPT - theme07 销售科技赛道
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

export type Theme07SalesV1Props = Theme07SectorLayoutProps;

export const theme07SalesV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_sales_v1',
  displayName: 'Theme 07 销售科技赛道',
  description: '销售科技赛道专题页，左文右数据',
  tags: ['sales', 'sector', 'vertical', 'research'],
};

export const theme07SalesV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'SALES' };
    if (f.key === 'title') return { ...f, defaultValue: 'AI 销售科技赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '线索筛选、话术辅助与成交预测提升销售效率' };
    return f;
  }),
};

export function Theme07SalesV1(props: Theme07SalesV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
