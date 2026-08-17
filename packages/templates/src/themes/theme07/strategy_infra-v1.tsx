// lemonPPT - theme07 基础设施策略
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

export type Theme07StrategyInfraV1Props = Theme07TableLayoutProps;

export const theme07StrategyInfraV1Meta: LayoutMeta = {
  ...theme07TableLayoutMetaBase,
  id: 'theme07_strategy_infra_v1',
  displayName: 'Theme 07 基础设施策略',
  description: '算力、数据与工具链的前瞻布局',
  tags: ['strategy_infra', 'capital', 'table', 'research'],
};

export const theme07StrategyInfraV1Schema: PropsSchema = {
  fields: theme07TableLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'STRATEGY INFRA' };
    if (f.key === 'title') return { ...f, defaultValue: '基础设施策略' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '算力、数据与工具链的前瞻布局' };
    if (f.key === 'headers') return { ...f, defaultValue: ["方向","优先级","行动"] };
    if (f.key === 'rows') return { ...f, defaultValue: [{"cells":["算力多元化","高","多云与备选芯片"],"accent":false},{"cells":["数据资产化","高","构建专有数据集"],"accent":false},{"cells":["工具链标准化","中","统一训练与推理平台"],"accent":false}] };
    return f;
  }),
};

export function Theme07StrategyInfraV1(props: Theme07StrategyInfraV1Props): ReactNode {
  return <Theme07TableLayout {...props} />;
}
