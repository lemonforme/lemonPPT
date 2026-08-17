// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { T08Frame, T08Footer, footerFields, buildMeta } from './shared.js';


export interface Theme08Quote_manifestoProps { kicker?: string; quote?: string; fieldA?: string; cite?: string; footerLeft?: string; footerRight?: string; _slideIdx?: number; _editable?: boolean; [key: string]: unknown; }

export const theme08Quote_manifestoMeta: LayoutMeta = buildMeta({
  id: 'theme08_quote_manifesto_v1',
  role: 'quote',
  displayName: '金句·宣言',
  description: '金句页：宣言式多行主张',
  contentShape: 'quote',
  tags: ['black-gold', 'experimental'],
});

export const theme08Quote_manifestoSchema: PropsSchema = {
  fields: [
    ...footerFields(),
    ...([{"key":"kicker","label":"顶部标签","type":"text","inlineEditable":true,"defaultValue":"STATEMENT"},{"key":"quote","label":"金句","type":"textarea","inlineEditable":true,"defaultValue":"一句话主张，定义这一页的态度。"},{"key":"fieldA","label":"补充说明","type":"textarea","inlineEditable":true,"defaultValue":""},{"key":"cite","label":"出处","type":"text","inlineEditable":true,"defaultValue":""}] as any),
  ],
};

export function Theme08Quote_manifesto(props: Theme08Quote_manifestoProps): ReactNode {
  const { kicker, quote = '一句话主张。', fieldA, cite, footerLeft, footerRight, _slideIdx, _editable } = props;
  
  return (
      <T08Frame className="t08-quote manifesto">
        <div className="lp-theme08-sec">
          <div className="t08-quote2 manifesto">
            {kicker && (<div className="lp-theme08-sec-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>)}
            <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="div" className="t08-quote2-text">{quote}</EditableField>
            {fieldA && (<EditableField prop="fieldA" slideIdx={_slideIdx} editable={_editable} as="div" className="t08-quote2-field">{fieldA}</EditableField>)}
            {cite && (<EditableField prop="cite" slideIdx={_slideIdx} editable={_editable} as="div" className="t08-quote2-cite">{cite}</EditableField>)}
          </div>
          <T08Footer left={footerLeft} right={footerRight} _slideIdx={_slideIdx} _editable={_editable} />
        </div>
      </T08Frame>
  );
}
