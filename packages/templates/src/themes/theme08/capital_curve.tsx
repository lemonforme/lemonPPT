// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { T08Frame, T08Footer, commonFields, buildMeta } from './shared.js';
import { T08Header } from './shared.js';


export interface Theme08Capital_curveProps { kicker?: string; title?: string; subtitle?: string; items?: any[]; footerLeft?: string; footerRight?: string; _slideIdx?: number; _editable?: boolean; [key: string]: unknown; }

const DEFAULT_ITEMS: any[] = [{"label":"Q1","value":"10"},{"label":"Q2","value":"27"},{"label":"Q3","value":"44"},{"label":"Q4","value":"61"},{"label":"Q5","value":"78"},{"label":"Q6","value":"95"},{"label":"Q7","value":"22"},{"label":"Q8","value":"39"},{"label":"Q9","value":"56"},{"label":"Q10","value":"73"}];

export const theme08Capital_curveMeta: LayoutMeta = buildMeta({
  id: 'theme08_capital_curve_v1',
  role: 'capital_curve',
  displayName: '资本曲线',
  description: '资本页：累计曲线',
  contentShape: 'capital_curve',
  tags: ['black-gold', 'experimental'],
});

export const theme08Capital_curveSchema: PropsSchema = {
  fields: [
    ...commonFields({ kicker: 'BLACK GOLD', title: '资本曲线', subtitle: '' }),
    ...([{"key":"items","label":"数据","type":"array","itemSchema":[{"key":"label","label":"标签","type":"text"},{"key":"value","label":"数值","type":"text"}]}] as any),
  ],
};

export function Theme08Capital_curve(props: Theme08Capital_curveProps): ReactNode {
  const { kicker, title = '标题', subtitle, items = DEFAULT_ITEMS, footerLeft, footerRight, _slideIdx, _editable } = props;
  
  return (
      <T08Frame className="t08-chart">
        <div className="lp-theme08-sec">
          <T08Header kicker={kicker} title={title} subtitle={subtitle} _slideIdx={_slideIdx} _editable={_editable} />
          <div className="t08-line">
            {items.map((d, i) => (
              <div key={i} className="t08-line-col">
                <div className="t08-line-bar" style={{ height: Math.max(8, (Number(d.value) || 0)) + '%' }} />
                <div className="t08-line-x"><EditableField prop={'items.' + i + '.label'} slideIdx={_slideIdx} editable={_editable} as="span">{d.label}</EditableField></div>
              </div>
            ))}
          </div>
          <T08Footer left={footerLeft} right={footerRight} _slideIdx={_slideIdx} _editable={_editable} />
        </div>
      </T08Frame>
  );
}
