// lemonPPT - theme07 收入模式风险
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import {
  Theme07TableLayout,
  theme07TableLayoutSchemaBase,
  theme07TableLayoutMetaBase,
  type Theme07TableLayoutProps,
} from './table-layout.js';

export type Theme07RevenueV1Props = Theme07TableLayoutProps;

export const theme07RevenueV1Meta: LayoutMeta = {
  ...theme07TableLayoutMetaBase,
  id: 'theme07_revenue_v1',
  displayName: 'Theme 07 收入模式风险',
  description: 'Scaling 收入与单位经济模型的可持续性挑战',
  tags: ['revenue', 'capital', 'table', 'research'],
};

export const theme07RevenueV1Schema: PropsSchema = {
  fields: theme07TableLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'REVENUE' };
    if (f.key === 'title') return { ...f, defaultValue: '收入模式风险' };
    if (f.key === 'subtitle') return { ...f, defaultValue: 'Scaling 收入与单位经济模型的可持续性挑战' };
    if (f.key === 'headers') return { ...f, defaultValue: ["风险项","影响","应对"] };
    if (f.key === 'rows') return { ...f, defaultValue: [{"cells":["API 价格战","高","差异化能力与留存"],"accent":false},{"cells":["企业付费周期长","中","POC 到规模化转化"],"accent":false},{"cells":["推理成本侵蚀毛利","高","模型蒸馏与优化"],"accent":false}] };
    return f;
  }),
};

export function Theme07RevenueV1(props: Theme07RevenueV1Props): ReactNode {
  return <Theme07TableLayout {...props} />;
}
