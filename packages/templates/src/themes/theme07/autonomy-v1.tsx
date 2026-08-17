// lemonPPT - theme07 自动驾驶赛道
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

export type Theme07AutonomyV1Props = Theme07SectorLayoutProps;

export const theme07AutonomyV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_autonomy_v1',
  displayName: 'Theme 07 自动驾驶赛道',
  description: '自动驾驶赛道专题页，左文右数据',
  tags: ['autonomy', 'sector', 'vertical', 'research'],
};

export const theme07AutonomyV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'AUTONOMY' };
    if (f.key === 'title') return { ...f, defaultValue: '自动驾驶赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '端到端模型与多传感器融合推动落地进程' };
    return f;
  }),
};

export function Theme07AutonomyV1(props: Theme07AutonomyV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
