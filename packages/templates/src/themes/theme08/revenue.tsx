// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { T08Frame, T08Footer, commonFields, buildMeta } from './shared.js';
import { T08Header } from './shared.js';


export interface Theme08RevenueProps { kicker?: string; title?: string; subtitle?: string; items?: any[]; footerLeft?: string; footerRight?: string; _slideIdx?: number; _editable?: boolean; [key: string]: unknown; }

const DEFAULT_ITEMS: any[] = [{"name":"收入兑现","note":"将发布承诺转化为可验证的营收曲线，避免停留在演示层面。"},{"name":"合规台账","note":"建立可追溯的合规记录，覆盖数据与模型全生命周期。"},{"name":"壁垒压缩","note":"警惕同质化竞争对单位经济模型的挤压。"}];

export const theme08RevenueMeta: LayoutMeta = buildMeta({
  id: 'theme08_revenue_v1',
  role: 'revenue',
  displayName: '收入兑现',
  description: '风险页：收入兑现面板',
  contentShape: 'revenue',
  tags: ['black-gold', 'experimental'],
});

export const theme08RevenueSchema: PropsSchema = {
  fields: [
    ...commonFields({ kicker: 'BLACK GOLD', title: '收入兑现', subtitle: '' }),
    ...([{"key":"items","label":"面板","type":"array","itemSchema":[{"key":"name","label":"名称","type":"text"},{"key":"note","label":"说明","type":"text"}]}] as any),
  ],
};

export function Theme08Revenue(props: Theme08RevenueProps): ReactNode {
  const { kicker, title = '标题', subtitle, items = DEFAULT_ITEMS, footerLeft, footerRight, _slideIdx, _editable } = props;
  
  return (
      <T08Frame className="t08-panel">
        <div className="lp-theme08-sec">
          <T08Header kicker={kicker} title={title} subtitle={subtitle} _slideIdx={_slideIdx} _editable={_editable} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, justifyContent: 'center' }}>
            {items.map((it, i) => (
              <div key={i} className="t08-panel-row">
                <div className="t08-panel-name"><EditableField prop={'items.' + i + '.name'} slideIdx={_slideIdx} editable={_editable} as="span">{it.name}</EditableField></div>
                <div className="t08-panel-note"><EditableField prop={'items.' + i + '.note'} slideIdx={_slideIdx} editable={_editable} as="span">{it.note}</EditableField></div>
              </div>
            ))}
          </div>
          <T08Footer left={footerLeft} right={footerRight} _slideIdx={_slideIdx} _editable={_editable} />
        </div>
      </T08Frame>
  );
}
