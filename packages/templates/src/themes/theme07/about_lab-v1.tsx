// lemonPPT - theme07 关于实验室
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import {
  Theme07ClosingLayout,
  theme07ClosingLayoutSchemaBase,
  theme07ClosingLayoutMetaBase,
  type Theme07ClosingLayoutProps,
} from './closing-layout.js';

export type Theme07AboutLabV1Props = Theme07ClosingLayoutProps;

export const theme07AboutLabV1Meta: LayoutMeta = {
  ...theme07ClosingLayoutMetaBase,
  id: 'theme07_about_lab_v1',
  displayName: 'Theme 07 关于实验室',
  description: '关于实验室，用于报告收尾',
  tags: ['about_lab', 'closing', 'statement', 'research'],
};

export const theme07AboutLabV1Schema: PropsSchema = {
  fields: theme07ClosingLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'ABOUT LAB' };
    if (f.key === 'statement') return { ...f, defaultValue: 'lemonPPT 产业研究实验室' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '基于公开数据与独立研究，持续追踪 AI 产业资本与技术演进。' };
    return f;
  }),
};

export function Theme07AboutLabV1(props: Theme07AboutLabV1Props): ReactNode {
  return <Theme07ClosingLayout {...props} />;
}
