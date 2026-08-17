// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { T08Frame, T08Footer, commonFields, buildMeta } from './shared.js';
import { T08Header } from './shared.js';


export interface Theme08PullbackProps { kicker?: string; title?: string; subtitle?: string; items?: any[]; footerLeft?: string; footerRight?: string; _slideIdx?: number; _editable?: boolean; [key: string]: unknown; }

const DEFAULT_ITEMS: any[] = [{"label":"模型A","a":"20","b":"40"},{"label":"模型B","a":"25","b":"49"},{"label":"模型C","a":"30","b":"58"},{"label":"模型D","a":"35","b":"67"},{"label":"模型E","a":"40","b":"76"}];

export const theme08PullbackMeta: LayoutMeta = buildMeta({
  id: 'theme08_pullback_v1',
  role: 'pullback',
  displayName: '回落·哑铃',
  description: '回落页：哑铃对照',
  contentShape: 'pullback',
  tags: ['black-gold', 'experimental'],
});

export const theme08PullbackSchema: PropsSchema = {
  fields: [
    ...commonFields({ kicker: 'BLACK GOLD', title: '回落·哑铃', subtitle: '' }),
    ...([{"key":"items","label":"数据","type":"array","itemSchema":[{"key":"label","label":"标签","type":"text"},{"key":"a","label":"起点","type":"text"},{"key":"b","label":"终点","type":"text"}]}] as any),
  ],
};

export function Theme08Pullback(props: Theme08PullbackProps): ReactNode {
  const { kicker, title = '标题', subtitle, items = DEFAULT_ITEMS, footerLeft, footerRight, _slideIdx, _editable } = props;
  
  return (
      <T08Frame className="t08-chart">
        <div className="lp-theme08-sec">
          <T08Header kicker={kicker} title={title} subtitle={subtitle} _slideIdx={_slideIdx} _editable={_editable} />
          <div className="t08-dumbbell">
            {items.map((d, i) => (
              <div key={i} className="t08-dumbbell-row">
                <div className="t08-bar-label"><EditableField prop={'items.' + i + '.label'} slideIdx={_slideIdx} editable={_editable} as="span">{d.label}</EditableField></div>
                <div className="t08-dumbbell-track"><span className="t08-dumbbell-dot a" style={{ left: Math.max(2, (Number(d.a) || 0)) + '%' }} /><span className="t08-dumbbell-dot b" style={{ left: Math.max(2, (Number(d.b) || 0)) + '%' }} /></div>
                <div className="t08-dumbbell-val"><EditableField prop={'items.' + i + '.a'} slideIdx={_slideIdx} editable={_editable} as="span">{d.a}</EditableField>→<EditableField prop={'items.' + i + '.b'} slideIdx={_slideIdx} editable={_editable} as="span">{d.b}</EditableField></div>
              </div>
            ))}
          </div>
          <T08Footer left={footerLeft} right={footerRight} _slideIdx={_slideIdx} _editable={_editable} />
        </div>
      </T08Frame>
  );
}
