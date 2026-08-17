// lemonPPT - theme07 地理核心
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import {
  Theme07GeoLayout,
  theme07GeoLayoutSchemaBase,
  theme07GeoLayoutMetaBase,
  type Theme07GeoLayoutProps,
} from './geo-layout.js';

export type Theme07GeoCenterV1Props = Theme07GeoLayoutProps;

export const theme07GeoCenterV1Meta: LayoutMeta = {
  ...theme07GeoLayoutMetaBase,
  id: 'theme07_geo_center_v1',
  displayName: 'Theme 07 地理核心',
  description: 'AI 融资与创新的全球核心城市',
  tags: ['geo_center', 'geo', 'map', 'research'],
};

export const theme07GeoCenterV1Schema: PropsSchema = {
  fields: theme07GeoLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'title') return { ...f, defaultValue: '地理核心' };
    if (f.key === 'subtitle') return { ...f, defaultValue: 'AI 融资与创新的全球核心城市' };
    if (f.key === 'regions') return { ...f, defaultValue: [{"name":"旧金山湾区","percent":38,"value":"380 亿","note":"模型与基础设施集中"},{"name":"纽约","percent":18,"value":"180 亿","note":"金融与媒体应用"},{"name":"伦敦","percent":12,"value":"120 亿","note":"欧洲 AI 中心"},{"name":"北京/上海","percent":16,"value":"160 亿","note":"大模型与应用并重"},{"name":"其他","percent":16,"value":"160 亿","note":"多极化分布"}] };
    return f;
  }),
};

export function Theme07GeoCenterV1(props: Theme07GeoCenterV1Props): ReactNode {
  return <Theme07GeoLayout {...props} />;
}
