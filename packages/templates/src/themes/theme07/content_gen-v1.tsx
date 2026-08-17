// lemonPPT - theme07 内容生成赛道
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

export type Theme07ContentGenV1Props = Theme07SectorLayoutProps;

export const theme07ContentGenV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_content_gen_v1',
  displayName: 'Theme 07 内容生成赛道',
  description: '内容生成赛道专题页，左文右数据',
  tags: ['content_gen', 'sector', 'vertical', 'research'],
};

export const theme07ContentGenV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'CONTENT GEN' };
    if (f.key === 'title') return { ...f, defaultValue: 'AI 内容生成赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '文本、图像、视频与多模态内容生产力工具爆发' };
    return f;
  }),
};

export function Theme07ContentGenV1(props: Theme07ContentGenV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
