// lemonPPT - theme07 合规监管风险
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

export type Theme07ComplianceV1Props = Theme07TableLayoutProps;

export const theme07ComplianceV1Meta: LayoutMeta = {
  ...theme07TableLayoutMetaBase,
  id: 'theme07_compliance_v1',
  displayName: 'Theme 07 合规监管风险',
  description: '全球监管框架快速演进带来的合规成本',
  tags: ['compliance', 'capital', 'table', 'research'],
};

export const theme07ComplianceV1Schema: PropsSchema = {
  fields: theme07TableLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'COMPLIANCE' };
    if (f.key === 'title') return { ...f, defaultValue: '合规监管风险' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '全球监管框架快速演进带来的合规成本' };
    if (f.key === 'headers') return { ...f, defaultValue: ["监管域","紧迫度","应对"] };
    if (f.key === 'rows') return { ...f, defaultValue: [{"cells":["数据隐私","高","合规架构与审计"],"accent":false},{"cells":["内容安全","高","对齐与过滤机制"],"accent":false},{"cells":["版权与训练数据","中","授权与透明化"],"accent":false}] };
    return f;
  }),
};

export function Theme07ComplianceV1(props: Theme07ComplianceV1Props): ReactNode {
  return <Theme07TableLayout {...props} />;
}
