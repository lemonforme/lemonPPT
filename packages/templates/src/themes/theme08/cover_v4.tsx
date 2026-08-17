// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { T08Frame, T08Footer, footerFields, buildMeta } from './shared.js';


export interface Theme08Cover_v4Props { tag?: string; title?: string; subtitle?: string; stats?: { value: string; unit?: string; label: string }[]; footerLeft?: string; footerRight?: string; _slideIdx?: number; _editable?: boolean; [key: string]: unknown; }

export const theme08Cover_v4Meta: LayoutMeta = buildMeta({
  id: 'theme08_cover_v4',
  role: 'cover',
  displayName: '黑金封面·左右',
  description: '黑金实验封面：左文右视觉的左右分栏',
  contentShape: 'cover',
  tags: ['black-gold', 'experimental'],
});

export const theme08Cover_v4Schema: PropsSchema = {
  fields: [
    ...footerFields(),
    ...([{"key":"tag","label":"顶部标签","type":"text","inlineEditable":true,"defaultValue":"BLACK GOLD"},{"key":"title","label":"标题","type":"text","inlineEditable":true,"defaultValue":"黑金实验 · 全新一页"},{"key":"subtitle","label":"副标题","type":"textarea","inlineEditable":true,"defaultValue":""},{"key":"stats","label":"指标墙","type":"array","itemSchema":[{"key":"value","label":"数值","type":"text"},{"key":"unit","label":"单位","type":"text"},{"key":"label","label":"标签","type":"text"}]}] as any),
  ],
};

export function Theme08Cover_v4(props: Theme08Cover_v4Props): ReactNode {
  const { tag, title = '黑金实验 · 全新一页', subtitle, footerLeft, footerRight, _slideIdx, _editable } = props;
  
  return (
      <T08Frame className="t08-cover split">
        <div className="lp-theme08-sec">
          {tag && (<div className="lp-theme08-sec-kicker"><EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField></div>)}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="t08-cover2-title">{title}</EditableField>
          {subtitle && (<EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="t08-cover2-sub">{subtitle}</EditableField>)}
          
          <T08Footer left={footerLeft} right={footerRight} _slideIdx={_slideIdx} _editable={_editable} />
        </div>
      </T08Frame>
  );
}
