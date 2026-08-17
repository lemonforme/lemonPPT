// lemonPPT - theme07 区域集群
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

export type Theme07RegionClusterV1Props = Theme07GeoLayoutProps;

export const theme07RegionClusterV1Meta: LayoutMeta = {
  ...theme07GeoLayoutMetaBase,
  id: 'theme07_region_cluster_v1',
  displayName: 'Theme 07 区域集群',
  description: '资本聚集形成的区域创新集群',
  tags: ['region_cluster', 'geo', 'map', 'research'],
};

export const theme07RegionClusterV1Schema: PropsSchema = {
  fields: theme07GeoLayoutSchemaBase.fields.map((f) => {
    if (f.key === 'title') return { ...f, defaultValue: '区域集群' };
    if (f.key === 'subtitle') return { ...f, defaultValue: '资本聚集形成的区域创新集群' };
    if (f.key === 'regions') return { ...f, defaultValue: [{"name":"北美西海岸","percent":42,"value":"420 亿","note":"技术与资本双密集"},{"name":"北美东海岸","percent":16,"value":"160 亿","note":"金融与应用"},{"name":"中国京津冀/长三角","percent":20,"value":"200 亿","note":"大模型主战场"},{"name":"欧洲西部","percent":14,"value":"140 亿","note":"监管先行"},{"name":"其他","percent":8,"value":"80 亿","note":"中东、东南亚"}] };
    return f;
  }),
};

export function Theme07RegionClusterV1(props: Theme07RegionClusterV1Props): ReactNode {
  return <Theme07GeoLayout {...props} />;
}
