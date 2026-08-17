// lemonPPT - theme07 资源配置矩阵
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

export type Theme07ResourceV1Props = Theme07TableLayoutProps;

export const theme07ResourceV1Meta: LayoutMeta = {
  ...theme07TableLayoutMetaBase,
  id: 'theme07_resource_v1',
  displayName: 'Theme 07 资源配置矩阵',
  description: '资本、算力与人才在不同赛道的配置',
  tags: ['resource', 'capital', 'table', 'research'],
};

export const theme07ResourceV1Schema: PropsSchema = {
  fields: theme07TableLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'RESOURCE' };
    if (f.key === 'title') return { ...f, defaultValue: '资源配置矩阵' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '资本、算力与人才在不同赛道的配置' };
    if (f.key === 'headers') return { ...f, defaultValue: ["资源","大模型","基础设施","应用层"] };
    if (f.key === 'rows') return { ...f, defaultValue: [{"cells":["资本","43%","32%","25%"],"accent":false},{"cells":["算力","51%","38%","11%"],"accent":false},{"cells":["人才","35%","30%","35%"],"accent":false}] };
    return f;
  }),
};

export function Theme07ResourceV1(props: Theme07ResourceV1Props): ReactNode {
  return <Theme07TableLayout {...props} />;
}
