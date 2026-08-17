// lemonPPT - theme07 低代码赛道
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import {
  Theme07SectorLayout,
  theme07SectorLayoutSchemaBase,
  theme07SectorLayoutMetaBase,
  type Theme07SectorLayoutProps,
} from './sector-layout.js';

export type Theme07LowCodeV1Props = Theme07SectorLayoutProps;

export const theme07LowCodeV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_low_code_v1',
  displayName: 'Theme 07 低代码赛道',
  description: '低代码赛道专题页，左文右数据',
  tags: ['low_code', 'sector', 'vertical', 'research'],
};

export const theme07LowCodeV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'LOW CODE' };
    if (f.key === 'title') return { ...f, defaultValue: 'AI 低代码赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '自然语言生成应用与自动化工作流降低开发门槛' };
    return f;
  }),
};

export function Theme07LowCodeV1(props: Theme07LowCodeV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
