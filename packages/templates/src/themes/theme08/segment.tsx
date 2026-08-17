// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { T08Frame, T08Footer, commonFields, buildMeta } from './shared.js';
import { T08Header } from './shared.js';


export interface Theme08SegmentProps { kicker?: string; title?: string; subtitle?: string; items?: any[]; footerLeft?: string; footerRight?: string; _slideIdx?: number; _editable?: boolean; [key: string]: unknown; }

const DEFAULT_ITEMS: any[] = [{"name":"接入层","desc":"统一入口与多端适配。"},{"name":"调度层","desc":"算力与任务的弹性编排。"},{"name":"模型层","desc":"多模型路由与评测。"},{"name":"数据层","desc":"高质量语料与特征底座。"}];

export const theme08SegmentMeta: LayoutMeta = buildMeta({
  id: 'theme08_segment_v1',
  role: 'segment',
  displayName: '赛道·分段',
  description: '赛道页：分段流程节点',
  contentShape: 'segment',
  tags: ['black-gold', 'experimental'],
});

export const theme08SegmentSchema: PropsSchema = {
  fields: [
    ...commonFields({ kicker: 'BLACK GOLD', title: '赛道·分段', subtitle: '' }),
    ...([{"key":"items","label":"节点","type":"array","itemSchema":[{"key":"name","label":"名称","type":"text"},{"key":"desc","label":"描述","type":"text"}]}] as any),
  ],
};

export function Theme08Segment(props: Theme08SegmentProps): ReactNode {
  const { kicker, title = '标题', subtitle, items = DEFAULT_ITEMS, footerLeft, footerRight, _slideIdx, _editable } = props;
  
  return (
      <T08Frame className="t08-arch">
        <div className="lp-theme08-sec">
          <T08Header kicker={kicker} title={title} subtitle={subtitle} _slideIdx={_slideIdx} _editable={_editable} />
          <div className="t08-arch-flow">
            {items.map((nd, i) => (
              <div key={i} className="t08-arch-node">
                <div className="t08-arch-name"><EditableField prop={'items.' + i + '.name'} slideIdx={_slideIdx} editable={_editable} as="span">{nd.name}</EditableField></div>
                <div className="t08-arch-desc"><EditableField prop={'items.' + i + '.desc'} slideIdx={_slideIdx} editable={_editable} as="span">{nd.desc}</EditableField></div>
                {i < items.length - 1 && (<div className="t08-arch-arrow">→</div>)}
              </div>
            ))}
          </div>
          <T08Footer left={footerLeft} right={footerRight} _slideIdx={_slideIdx} _editable={_editable} />
        </div>
      </T08Frame>
  );
}
