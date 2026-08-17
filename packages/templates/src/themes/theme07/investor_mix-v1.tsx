// lemonPPT - theme07 投资人结构
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

export type Theme07InvestorMixV1Props = Theme07TableLayoutProps;

export const theme07InvestorMixV1Meta: LayoutMeta = {
  ...theme07TableLayoutMetaBase,
  id: 'theme07_investor_mix_v1',
  displayName: 'Theme 07 投资人结构',
  description: '财务投资人与战略方在不同轮次的分布',
  tags: ['investor_mix', 'capital', 'table', 'research'],
};

export const theme07InvestorMixV1Schema: PropsSchema = {
  fields: theme07TableLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'INVESTOR MIX' };
    if (f.key === 'title') return { ...f, defaultValue: '投资人结构' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '财务投资人与战略方在不同轮次的分布' };
    if (f.key === 'headers') return { ...f, defaultValue: ["类型","早期占比","后期占比","代表"] };
    if (f.key === 'rows') return { ...f, defaultValue: [{"cells":["VC","62%","28%","a16z / Sequoia"],"accent":false},{"cells":["Growth","18%","45%","Thrive"],"accent":false},{"cells":["战略","20%","27%","NVIDIA / Microsoft"],"accent":false}] };
    return f;
  }),
};

export function Theme07InvestorMixV1(props: Theme07InvestorMixV1Props): ReactNode {
  return <Theme07TableLayout {...props} />;
}
