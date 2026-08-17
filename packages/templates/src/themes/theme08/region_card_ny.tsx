// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { T08Frame, T08Footer, commonFields, buildMeta } from './shared.js';
import { T08Header } from './shared.js';
import { T08Card } from './shared.js';


export interface Theme08Region_card_nyProps { kicker?: string; title?: string; subtitle?: string; items?: any[]; footerLeft?: string; footerRight?: string; _slideIdx?: number; _editable?: boolean; [key: string]: unknown; }

const DEFAULT_ITEMS: any[] = [{"title":"纽约","num":"3","unit":"×","label":"能力层级","desc":"以黑金视觉统一表达核心能力"},{"title":"西雅图","num":"6","unit":"×","label":"能力层级","desc":"强调端到端闭环与可复用性"},{"title":"波士顿","num":"9","unit":"×","label":"能力层级","desc":"面向高端发布的实验性叙事"}];

export const theme08Region_card_nyMeta: LayoutMeta = buildMeta({
  id: 'theme08_region_card_ny_v1',
  role: 'region',
  displayName: '地域·城市卡',
  description: '地域页：城市案例卡片',
  contentShape: 'region',
  tags: ['black-gold', 'experimental'],
});

export const theme08Region_card_nySchema: PropsSchema = {
  fields: [
    ...commonFields({ kicker: 'BLACK GOLD', title: '地域·城市卡', subtitle: '' }),
    ...([{"key":"items","label":"条目","type":"array","itemSchema":[{"key":"title","label":"标题","type":"text"},{"key":"num","label":"数字","type":"text"},{"key":"unit","label":"单位","type":"text"},{"key":"label","label":"标签","type":"text"},{"key":"desc","label":"描述","type":"text"}]}] as any),
  ],
};

export function Theme08Region_card_ny(props: Theme08Region_card_nyProps): ReactNode {
  const { kicker, title = '标题', subtitle, items = DEFAULT_ITEMS, footerLeft, footerRight, _slideIdx, _editable } = props;
  const COLS = 3;
  return (
      <T08Frame className="t08-cards cards3">
        <div className="lp-theme08-sec">
          <T08Header kicker={kicker} title={title} subtitle={subtitle} _slideIdx={_slideIdx} _editable={_editable} />
          <div className="t08-cards-grid" style={{ gridTemplateColumns: 'repeat(' + COLS + ', 1fr)' }}>
            {items.map((it, i) => (
              <T08Card key={i} accent={i === 0}>
                <div className="t08-card-title"><EditableField prop={'items.' + i + '.title'} slideIdx={_slideIdx} editable={_editable} as="span">{it.title}</EditableField></div>
                {it.num != null && it.num !== '' && (<div className="t08-card-row"><span className="t08-card-num"><EditableField prop={'items.' + i + '.num'} slideIdx={_slideIdx} editable={_editable} as="span">{it.num}</EditableField>{it.unit && <EditableField prop={'items.' + i + '.unit'} slideIdx={_slideIdx} editable={_editable} as="span">{it.unit}</EditableField>}</span></div>)}
                {it.desc && (<div className="t08-card-desc"><EditableField prop={'items.' + i + '.desc'} slideIdx={_slideIdx} editable={_editable} as="span">{it.desc}</EditableField></div>)}
              </T08Card>
            ))}
          </div>
          <T08Footer left={footerLeft} right={footerRight} _slideIdx={_slideIdx} _editable={_editable} />
        </div>
      </T08Frame>
  );
}
