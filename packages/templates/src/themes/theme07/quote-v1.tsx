// lemonPPT - theme07 金句页
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

export type Theme07QuoteV1Props = Theme07ClosingLayoutProps;

export const theme07QuoteV1Meta: LayoutMeta = {
  ...theme07ClosingLayoutMetaBase,
  id: 'theme07_quote_v1',
  displayName: 'Theme 07 金句页',
  description: '金句页，用于报告收尾',
  tags: ['quote', 'closing', 'statement', 'research'],
};

export const theme07QuoteV1Schema: PropsSchema = {
  fields: theme07ClosingLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'QUOTE' };
    if (f.key === 'statement') return { ...f, defaultValue: 'AI 产业正在从「叙事驱动」进入「兑现驱动」的新阶段。' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '资本、技术与市场的共识正在重新凝聚。' };
    return f;
  }),
};

export function Theme07QuoteV1(props: Theme07QuoteV1Props): ReactNode {
  return <Theme07ClosingLayout {...props} />;
}
