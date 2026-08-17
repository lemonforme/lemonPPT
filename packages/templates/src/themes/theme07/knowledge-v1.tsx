// lemonPPT - theme07 知识管理赛道
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

export type Theme07KnowledgeV1Props = Theme07SectorLayoutProps;

export const theme07KnowledgeV1Meta: LayoutMeta = {
  ...theme07SectorLayoutMetaBase,
  id: 'theme07_knowledge_v1',
  displayName: 'Theme 07 知识管理赛道',
  description: '知识管理赛道专题页，左文右数据',
  tags: ['knowledge', 'sector', 'vertical', 'research'],
};

export const theme07KnowledgeV1Schema: PropsSchema = {
  fields: theme07SectorLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'kicker') return { ...f, defaultValue: 'KNOWLEDGE' };
    if (f.key === 'title') return { ...f, defaultValue: 'AI 知识管理赛道' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '企业知识库与智能检索正成为新的入口级应用' };
    return f;
  }),
};

export function Theme07KnowledgeV1(props: Theme07KnowledgeV1Props): ReactNode {
  return <Theme07SectorLayout {...props} />;
}
