// lemonPPT - theme07 医疗健康赛道
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

export type Theme07HealthcareV1Props = Theme07SectorLayoutProps;

export const theme07HealthcareV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_healthcare_v1',
  displayName: 'Theme 07 医疗健康赛道',
  description: '医疗健康赛道专题页，左文右数据',
  tags: ['healthcare', 'sector', 'vertical', 'research'],
};

export const theme07HealthcareV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'HEALTHCARE' };
    if (f.key === 'title') return { ...f, defaultValue: 'AI 医疗健康赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '从影像辅助诊断到药物发现的研发与临床路径' };
    return f;
  }),
};

export function Theme07HealthcareV1(props: Theme07HealthcareV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
