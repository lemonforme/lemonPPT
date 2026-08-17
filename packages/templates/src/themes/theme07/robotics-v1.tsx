// lemonPPT - theme07 具身智能赛道
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

export type Theme07RoboticsV1Props = Theme07SectorLayoutProps;

export const theme07RoboticsV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_robotics_v1',
  displayName: 'Theme 07 具身智能赛道',
  description: '具身智能赛道专题页，左文右数据',
  tags: ['robotics', 'sector', 'vertical', 'research'],
};

export const theme07RoboticsV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'ROBOTICS' };
    if (f.key === 'title') return { ...f, defaultValue: '具身智能赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '机器人、自动驾驶与智能硬件的感知决策一体化' };
    return f;
  }),
};

export function Theme07RoboticsV1(props: Theme07RoboticsV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
