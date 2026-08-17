// lemonPPT - theme07 资本生态系统
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

export type Theme07EcosystemV1Props = Theme07TableLayoutProps;

export const theme07EcosystemV1Meta: LayoutMeta = {
  ...theme07TableLayoutMetaBase,
  id: 'theme07_ecosystem_v1',
  displayName: 'Theme 07 资本生态系统',
  description: '基金、企业与政府资本共同塑造的融资环境',
  tags: ['ecosystem', 'capital', 'table', 'research'],
};

export const theme07EcosystemV1Schema: PropsSchema = {
  fields: theme07TableLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'ECOSYSTEM' };
    if (f.key === 'title') return { ...f, defaultValue: '资本生态系统' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '基金、企业与政府资本共同塑造的融资环境' };
    if (f.key === 'headers') return { ...f, defaultValue: ["参与方","贡献占比","偏好阶段","趋势"] };
    if (f.key === 'rows') return { ...f, defaultValue: [{"cells":["传统 VC","48%","全阶段","头部集中"],"accent":false},{"cells":["企业战投","31%","中后期","增加"],"accent":false},{"cells":["主权基金","12%","后期","活跃"],"accent":false},{"cells":["政府基金","9%","早期/基建","上升"],"accent":false}] };
    return f;
  }),
};

export function Theme07EcosystemV1(props: Theme07EcosystemV1Props): ReactNode {
  return <Theme07TableLayout {...props} />;
}
