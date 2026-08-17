// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02LogoWallV1Logo {
  name?: string;
  sub?: string;
}

export interface Theme02LogoWallV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  logos?: Theme02LogoWallV1Logo[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02LogoWallV1Meta: LayoutMeta = {
  id: 'theme02_logo_wall_v1',
  theme: 'theme02',
  role: 'partners',
  displayName: 'Theme 02 合作伙伴墙',
  description: '合作伙伴 / 客户 logo 网格',
  needsMedia: false,
};

export const theme02LogoWallV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    {
      key: 'logos',
      label: 'Logo',
      type: 'array',
      maxItems: 8,
      minItems: 1,
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'sub', label: '说明', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme02LogoWallV1(props: Theme02LogoWallV1Props): ReactNode {
  const { kicker, title, subtitle, logos = [], _slideIdx, _editable } = props;

  const safeLogos = logos.filter((l) => l && typeof l === 'object');
  const cols = Math.min(4, Math.max(2, Math.ceil(safeLogos.length / 2)));

  return (
    <div className="lp-slide lp-theme02-logo-wall-v1">
      <div className="lp-orb lp-theme02-orb--cool" />
      <div className="lp-theme02-logo-wall-inner">
        <div className="lp-theme02-logo-wall-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-logo-wall-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-logo-wall-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>
        <div className="lp-theme02-logo-wall-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {safeLogos.map((logo, i) => (
            <div key={i} className="lp-theme02-logo-wall-card">
              <EditableField prop={`logos.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-logo-wall-name">
                {logo.name}
              </EditableField>
              {logo.sub && (
                <EditableField prop={`logos.${i}.sub`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-logo-wall-sub">
                  {logo.sub}
                </EditableField>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
