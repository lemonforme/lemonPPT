// lemonPPT - theme07 教育科技赛道
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

export type Theme07EducationV1Props = Theme07SectorLayoutProps;

export const theme07EducationV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_education_v1',
  displayName: 'Theme 07 教育科技赛道',
  description: '教育科技赛道专题页，左文右数据',
  tags: ['education', 'sector', 'vertical', 'research'],
};

export const theme07EducationV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'EDUCATION' };
    if (f.key === 'title') return { ...f, defaultValue: 'AI 教育科技赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '个性化学习、智能答疑与内容生成重塑教学场景' };
    return f;
  }),
};

export function Theme07EducationV1(props: Theme07EducationV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
