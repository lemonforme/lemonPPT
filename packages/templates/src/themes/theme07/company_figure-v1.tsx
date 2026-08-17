// lemonPPT - theme07 Figure AI 案例
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

export type Theme07CompanyFigureV1Props = Theme07CompanyLayoutProps;

export const theme07CompanyFigureV1Meta: LayoutMeta = {
  ...theme07CompanyLayoutMetaBase,
  id: 'theme07_company_figure_v1',
  displayName: 'Theme 07 Figure AI 案例',
  description: '具身智能与人形机器人领域的先锋，探索 AI 在物理世界中的落地边界。',
  tags: ['company_figure', 'company', 'case', 'research'],
};

export const theme07CompanyFigureV1Schema: PropsSchema = {
  fields: theme07CompanyLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'name') return { ...f, defaultValue: 'Figure AI' };
    if (f.key === 'tagline') return { ...f, defaultValue: '具身智能与人形机器人' };
    return f;
  }),
};

export function Theme07CompanyFigureV1(props: Theme07CompanyFigureV1Props): ReactNode {
  return <Theme07CompanyLayout {...props} />;
}
