// lemonPPT - theme07 AI 芯片赛道
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

export type Theme07ChipV1Props = Theme07SectorLayoutProps;

export const theme07ChipV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_chip_v1',
  displayName: 'Theme 07 AI 芯片赛道',
  description: 'AI 芯片赛道专题页，左文右数据',
  tags: ['chip', 'sector', 'vertical', 'research'],
};

export const theme07ChipV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'CHIP' };
    if (f.key === 'title') return { ...f, defaultValue: 'AI 芯片赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '训练与推理需求推动专用芯片持续迭代' };
    return f;
  }),
};

export function Theme07ChipV1(props: Theme07ChipV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
