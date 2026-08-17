// lemonPPT - theme07 SSI 案例
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import {
  Theme07CompanyLayout,
  theme07CompanyLayoutSchemaBase,
  theme07CompanyLayoutMetaBase,
  type Theme07CompanyLayoutProps,
} from './company-layout.js';

export type Theme07CompanySsiV1Props = Theme07CompanyLayoutProps;

export const theme07CompanySsiV1Meta: LayoutMeta = {
  ...theme07CompanyLayoutMetaBase,
  id: 'theme07_company_ssi_v1',
  displayName: 'Theme 07 SSI 案例',
  description: '安全超级智能研究公司，专注于构建安全、可扩展的超级智能系统。',
  tags: ['company_ssi', 'company', 'case', 'research'],
};

export const theme07CompanySsiV1Schema: PropsSchema = {
  fields: theme07CompanyLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'name') return { ...f, defaultValue: 'Safe Superintelligence' };
    if (f.key === 'tagline') return { ...f, defaultValue: '安全超级智能研究' };
    return f;
  }),
};

export function Theme07CompanySsiV1(props: Theme07CompanySsiV1Props): ReactNode {
  return <Theme07CompanyLayout {...props} />;
}
