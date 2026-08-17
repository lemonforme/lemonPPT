// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { T08Frame, T08Footer, commonFields, buildMeta } from './shared.js';
import { T08Header } from './shared.js';


export interface Theme08TrendProps { kicker?: string; title?: string; subtitle?: string; items?: any[]; footerLeft?: string; footerRight?: string; _slideIdx?: number; _editable?: boolean; [key: string]: unknown; }

const DEFAULT_ITEMS: any[] = [{"label":"北美","value":"20"},{"label":"欧洲","value":"31"},{"label":"东亚","value":"42"},{"label":"东南亚","value":"53"},{"label":"拉美","value":"64"},{"label":"中东","value":"75"}];

export const theme08TrendMeta: LayoutMeta = buildMeta({
  id: 'theme08_trend_v1',
  role: 'trend',
  displayName: '趋势·条形',
  description: '趋势页：条形对比',
  contentShape: 'trend',
  tags: ['black-gold', 'experimental'],
});

export const theme08TrendSchema: PropsSchema = {
  fields: [
    ...commonFields({ kicker: 'BLACK GOLD', title: '趋势·条形', subtitle: '' }),
    ...([{"key":"items","label":"数据","type":"array","itemSchema":[{"key":"label","label":"标签","type":"text"},{"key":"value","label":"数值","type":"text"}]}] as any),
  ],
};

export function Theme08Trend(props: Theme08TrendProps): ReactNode {
  const { kicker, title = '标题', subtitle, items = DEFAULT_ITEMS, footerLeft, footerRight, _slideIdx, _editable } = props;
  
  return (
      <T08Frame className="t08-chart">
        <div className="lp-theme08-sec">
          <T08Header kicker={kicker} title={title} subtitle={subtitle} _slideIdx={_slideIdx} _editable={_editable} />
          <div className="t08-bars">
            {items.map((d, i) => (
              <div key={i} className="t08-bar-row">
                <div className="t08-bar-label"><EditableField prop={'items.' + i + '.label'} slideIdx={_slideIdx} editable={_editable} as="span">{d.label}</EditableField></div>
                <div className="t08-bar-track"><div className="t08-bar-fill" style={{ width: Math.max(6, (Number(d.value) || 0)) + '%' }} /></div>
                <div className="t08-bar-val"><EditableField prop={'items.' + i + '.value'} slideIdx={_slideIdx} editable={_editable} as="span">{d.value}</EditableField></div>
              </div>
            ))}
          </div>
          <T08Footer left={footerLeft} right={footerRight} _slideIdx={_slideIdx} _editable={_editable} />
        </div>
      </T08Frame>
  );
}
