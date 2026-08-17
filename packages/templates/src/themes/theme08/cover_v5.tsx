// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { T08Frame, T08Footer, footerFields, buildMeta } from './shared.js';


export interface Theme08Cover_v5Props { tag?: string; title?: string; subtitle?: string; stats?: { value: string; unit?: string; label: string }[]; footerLeft?: string; footerRight?: string; _slideIdx?: number; _editable?: boolean; [key: string]: unknown; }

const DEFAULT_ITEMS: any[] = [{"value":"12","unit":"亿","label":"完整版式"},{"value":"24","unit":"亿","label":"融资规模"},{"value":"36","unit":"亿","label":"同比增长"},{"value":"48","unit":"亿","label":"赛道集中度"}];

export const theme08Cover_v5Meta: LayoutMeta = buildMeta({
  id: 'theme08_cover_v5',
  role: 'cover',
  displayName: '黑金封面·指标墙',
  description: '黑金实验封面：整页荧光金指标墙',
  contentShape: 'cover',
  tags: ['black-gold', 'experimental'],
});

export const theme08Cover_v5Schema: PropsSchema = {
  fields: [
    ...footerFields(),
    ...([{"key":"tag","label":"顶部标签","type":"text","inlineEditable":true,"defaultValue":"BLACK GOLD"},{"key":"title","label":"标题","type":"text","inlineEditable":true,"defaultValue":"黑金实验 · 全新一页"},{"key":"subtitle","label":"副标题","type":"textarea","inlineEditable":true,"defaultValue":""},{"key":"stats","label":"指标墙","type":"array","itemSchema":[{"key":"value","label":"数值","type":"text"},{"key":"unit","label":"单位","type":"text"},{"key":"label","label":"标签","type":"text"}]}] as any),
  ],
};

export function Theme08Cover_v5(props: Theme08Cover_v5Props): ReactNode {
  const { tag, title = '黑金实验 · 全新一页', subtitle, stats = DEFAULT_ITEMS, footerLeft, footerRight, _slideIdx, _editable } = props;
  
  return (
      <T08Frame className="t08-cover wall">
        <div className="lp-theme08-sec">
          {tag && (<div className="lp-theme08-sec-kicker"><EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField></div>)}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="t08-cover2-title">{title}</EditableField>
          {subtitle && (<EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="t08-cover2-sub">{subtitle}</EditableField>)}
          <div className="t08-cover2-wall">
            {stats.map((m, i) => (
              <div key={i} className="lp-theme08-card">
                <div className="lp-theme08-stat-value"><EditableField prop={'stats.' + i + '.value'} slideIdx={_slideIdx} editable={_editable} as="span">{m.value}</EditableField><EditableField prop={'stats.' + i + '.unit'} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme08-stat-unit">{m.unit}</EditableField></div>
                <div className="lp-theme08-stat-label"><EditableField prop={'stats.' + i + '.label'} slideIdx={_slideIdx} editable={_editable} as="span">{m.label}</EditableField></div>
              </div>
            ))}
          </div>
          <T08Footer left={footerLeft} right={footerRight} _slideIdx={_slideIdx} _editable={_editable} />
        </div>
      </T08Frame>
  );
}
