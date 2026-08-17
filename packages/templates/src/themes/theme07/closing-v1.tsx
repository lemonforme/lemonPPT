// lemonPPT - theme07 结束页
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

export type Theme07ClosingV1Props = Theme07ClosingLayoutProps;

export const theme07ClosingV1Meta: LayoutMeta = {
  ...theme07ClosingLayoutMetaBase,
  id: 'theme07_closing_v1',
  displayName: 'Theme 07 结束页',
  description: '结束页，用于报告收尾',
  tags: ['closing', 'closing', 'statement', 'research'],
};

export const theme07ClosingV1Schema: PropsSchema = {
  fields: theme07ClosingLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'CLOSING' };
    if (f.key === 'statement') return { ...f, defaultValue: '核心结论：头部集中、场景分化、兑现为王。' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '2024 年是 AI 产业从资本叙事转向收入兑现的关键拐点。' };
    return f;
  }),
};

export function Theme07ClosingV1(props: Theme07ClosingV1Props): ReactNode {
  return <Theme07ClosingLayout {...props} />;
}
