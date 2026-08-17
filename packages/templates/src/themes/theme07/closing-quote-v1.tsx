// lemonPPT - theme07 结束页（引语变体）
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

export type Theme07ClosingQuoteV1Props = Theme07ClosingLayoutProps;

export const theme07ClosingQuoteV1Meta: LayoutMeta = {
  ...theme07ClosingLayoutMetaBase,
  id: 'theme07_closing_quote_v1',
  displayName: 'Theme 07 结束页（引语）',
  description: '引语风格结束页：居中大引语 + 引号装饰 + 关键词高亮，覆盖编辑型收尾场景',
  tags: ['closing', 'quote', 'statement', 'research'],
};

export const theme07ClosingQuoteV1Schema: PropsSchema = {
  fields: theme07ClosingLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'CLOSING' };
    if (f.key === 'statement') return { ...f, defaultValue: '2024 年是 AI 产业从[[资本叙事]]转向[[收入兑现]]的关键拐点。' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '核心结论：头部集中、场景分化、兑现为王。' };
    return f;
  }),
};

export function Theme07ClosingQuoteV1(props: Theme07ClosingQuoteV1Props): ReactNode {
  return <Theme07ClosingLayout {...props} variant="quote" />;
}
