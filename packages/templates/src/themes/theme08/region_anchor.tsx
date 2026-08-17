// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { T08Frame, T08Footer, commonFields, buildMeta } from './shared.js';
import { T08Header } from './shared.js';


export interface Theme08Region_anchorProps { kicker?: string; title?: string; subtitle?: string; items?: any[]; footerLeft?: string; footerRight?: string; _slideIdx?: number; _editable?: boolean; [key: string]: unknown; }

const DEFAULT_ITEMS: any[] = [{"value":"12","unit":"亿","label":"核心锚点"}];

export const theme08Region_anchorMeta: LayoutMeta = buildMeta({
  id: 'theme08_region_anchor_v1',
  role: 'region',
  displayName: '地域·大数字',
  description: '地域页：锚点大数字 + 说明',
  contentShape: 'region',
  tags: ['black-gold', 'experimental'],
});

export const theme08Region_anchorSchema: PropsSchema = {
  fields: [
    ...commonFields({ kicker: 'BLACK GOLD', title: '地域·大数字', subtitle: '' }),
    ...([{"key":"items","label":"指标","type":"array","itemSchema":[{"key":"value","label":"数值","type":"text"},{"key":"unit","label":"单位","type":"text"},{"key":"label","label":"标签","type":"text"}]}] as any),
  ],
};

export function Theme08Region_anchor(props: Theme08Region_anchorProps): ReactNode {
  const { kicker, title = '标题', subtitle, items = DEFAULT_ITEMS, footerLeft, footerRight, _slideIdx, _editable } = props;
  
  return (
      <T08Frame className="t08-statwall">
        <div className="lp-theme08-sec">
          <T08Header kicker={kicker} title={title} subtitle={subtitle} _slideIdx={_slideIdx} _editable={_editable} />
          <div className="t08-statwall-grid ">
            {items.map((it, i) => (
              <div key={i} className="lp-theme08-card">
                <div className="lp-theme08-stat-value"><EditableField prop={'items.' + i + '.value'} slideIdx={_slideIdx} editable={_editable} as="span">{it.value}</EditableField><EditableField prop={'items.' + i + '.unit'} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme08-stat-unit">{it.unit}</EditableField></div>
                <div className="lp-theme08-stat-label"><EditableField prop={'items.' + i + '.label'} slideIdx={_slideIdx} editable={_editable} as="span">{it.label}</EditableField></div>
              </div>
            ))}
          </div>
          <T08Footer left={footerLeft} right={footerRight} _slideIdx={_slideIdx} _editable={_editable} />
        </div>
      </T08Frame>
  );
}
