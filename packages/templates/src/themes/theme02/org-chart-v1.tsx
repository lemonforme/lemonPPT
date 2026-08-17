// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02OrgChartV1Node {
  title?: string;
  sub?: string;
}

export interface Theme02OrgChartV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  root?: Theme02OrgChartV1Node;
  children?: Theme02OrgChartV1Node[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02OrgChartV1Meta: LayoutMeta = {
  id: 'theme02_org_chart_v1',
  theme: 'theme02',
  role: 'content',
  displayName: 'Theme 02 组织结构图',
  description: '根节点 + 子节点树形结构',
  needsMedia: false,
};

export const theme02OrgChartV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    {
      key: 'root',
      label: '根节点',
      type: 'object',
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'sub', label: '副标题', type: 'text', inlineEditable: true },
      ],
    },
    {
      key: 'children',
      label: '子节点',
      type: 'array',
      maxItems: 5,
      minItems: 1,
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'sub', label: '副标题', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme02OrgChartV1(props: Theme02OrgChartV1Props): ReactNode {
  const { kicker, title, subtitle, root, children = [], _slideIdx, _editable } = props;

  const safeChildren = children.filter((c) => c && typeof c === 'object');

  return (
    <div className="lp-slide lp-theme02-org-chart-v1">
      <div className="lp-orb lp-theme02-orb--cool" />
      <div className="lp-theme02-org-chart-inner">
        <div className="lp-theme02-org-chart-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-org-chart-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-org-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>
        <div className="lp-theme02-org-chart-tree">
          <div className="lp-theme02-org-chart-root">
            <EditableField prop="root.title" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-org-chart-node-title">
              {root?.title}
            </EditableField>
            {root?.sub && (
              <EditableField prop="root.sub" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-org-chart-node-sub">
                {root.sub}
              </EditableField>
            )}
          </div>
          <div className="lp-theme02-org-chart-connector" />
          <div className="lp-theme02-org-chart-children">
            {safeChildren.map((child, i) => (
              <div key={i} className="lp-theme02-org-chart-node">
                <EditableField prop={`children.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-org-chart-node-title">
                  {child.title}
                </EditableField>
                {child.sub && (
                  <EditableField prop={`children.${i}.sub`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-org-chart-node-sub">
                    {child.sub}
                  </EditableField>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
