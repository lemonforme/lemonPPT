// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { T08Frame, T08Footer, commonFields, buildMeta } from './shared.js';
import { T08Header } from './shared.js';


export interface Theme08ComputeProps { kicker?: string; title?: string; subtitle?: string; items?: any[]; footerLeft?: string; footerRight?: string; _slideIdx?: number; _editable?: boolean; [key: string]: unknown; }

const DEFAULT_ITEMS: any[] = [{"name":"接入层","desc":"统一入口与多端适配。"},{"name":"调度层","desc":"算力与任务的弹性编排。"},{"name":"模型层","desc":"多模型路由与评测。"},{"name":"数据层","desc":"高质量语料与特征底座。"},{"name":"安全层","desc":"对齐、护栏与审计。"}];

export const theme08ComputeMeta: LayoutMeta = buildMeta({
  id: 'theme08_compute_v1',
  role: 'compute',
  displayName: '算力网格',
  description: '算力页：算力网格节点',
  contentShape: 'compute',
  tags: ['black-gold', 'experimental'],
});

export const theme08ComputeSchema: PropsSchema = {
  fields: [
    ...commonFields({ kicker: 'BLACK GOLD', title: '算力网格', subtitle: '' }),
    ...([{"key":"items","label":"节点","type":"array","itemSchema":[{"key":"name","label":"名称","type":"text"},{"key":"desc","label":"描述","type":"text"}]}] as any),
  ],
};

export function Theme08Compute(props: Theme08ComputeProps): ReactNode {
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
