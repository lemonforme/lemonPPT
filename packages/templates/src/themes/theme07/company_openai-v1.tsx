// lemonPPT - theme07 OpenAI 案例
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

export type Theme07CompanyOpenaiV1Props = Theme07CompanyLayoutProps;

export const theme07CompanyOpenaiV1Meta: LayoutMeta = {
  ...theme07CompanyLayoutMetaBase,
  id: 'theme07_company_openai_v1',
  displayName: 'Theme 07 OpenAI 案例',
  description: '通用大模型与 AI 平台的代表，持续引领生成式 AI 的技术与商业化进程。',
  tags: ['company_openai', 'company', 'case', 'research'],
};

export const theme07CompanyOpenaiV1Schema: PropsSchema = {
  fields: theme07CompanyLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'name') return { ...f, defaultValue: 'OpenAI' };
    if (f.key === 'tagline') return { ...f, defaultValue: '通用大模型与 AI 平台' };
    return f;
  }),
};

export function Theme07CompanyOpenaiV1(props: Theme07CompanyOpenaiV1Props): ReactNode {
  return <Theme07CompanyLayout {...props} />;
}
