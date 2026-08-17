// lemonPPT - theme07 垂直场景策略
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

export type Theme07StrategyVerticalV1Props = Theme07TableLayoutProps;

export const theme07StrategyVerticalV1Meta: LayoutMeta = {
  ...theme07TableLayoutMetaBase,
  id: 'theme07_strategy_vertical_v1',
  displayName: 'Theme 07 垂直场景策略',
  description: '从通用能力到行业Know-how的落地路径',
  tags: ['strategy_vertical', 'capital', 'table', 'research'],
};

export const theme07StrategyVerticalV1Schema: PropsSchema = {
  fields: theme07TableLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'STRATEGY VERTICAL' };
    if (f.key === 'title') return { ...f, defaultValue: '垂直场景策略' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '从通用能力到行业Know-how的落地路径' };
    if (f.key === 'headers') return { ...f, defaultValue: ["阶段","重点","目标"] };
    if (f.key === 'rows') return { ...f, defaultValue: [{"cells":["场景选择","高","高价值、可验证"],"accent":false},{"cells":["产品化","高","工作流嵌入"],"accent":false},{"cells":["规模化","中","跨客户复制"],"accent":false}] };
    return f;
  }),
};

export function Theme07StrategyVerticalV1(props: Theme07StrategyVerticalV1Props): ReactNode {
  return <Theme07TableLayout {...props} />;
}
