// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { T08Frame, T08Footer, footerFields, buildMeta } from './shared.js';


export interface Theme08Chapter_v4Props { chapterNo?: string; title?: string; subtitle?: string; footerLeft?: string; footerRight?: string; _slideIdx?: number; _editable?: boolean; [key: string]: unknown; }

export const theme08Chapter_v4Meta: LayoutMeta = buildMeta({
  id: 'theme08_chapter_v4',
  role: 'chapter',
  displayName: '章节·侧标',
  description: '章节过渡：编号与标题左右并置',
  contentShape: 'chapter',
  tags: ['black-gold', 'experimental'],
});

export const theme08Chapter_v4Schema: PropsSchema = {
  fields: [
    ...footerFields(),
    ...([{"key":"chapterNo","label":"章节编号","type":"text","inlineEditable":true,"defaultValue":"02"},{"key":"title","label":"章节标题","type":"text","inlineEditable":true,"defaultValue":"章节标题"},{"key":"subtitle","label":"副标题","type":"textarea","inlineEditable":true,"defaultValue":""}] as any),
  ],
};

export function Theme08Chapter_v4(props: Theme08Chapter_v4Props): ReactNode {
  const { chapterNo, title = '章节标题', subtitle, footerLeft, footerRight, _slideIdx, _editable } = props;
  
  return (
      <T08Frame className="t08-chapter side">
        <div className="lp-theme08-sec">
          <div className="t08-chapter2 side">
            {chapterNo && (<EditableField prop="chapterNo" slideIdx={_slideIdx} editable={_editable} as="div" className="t08-chapter2-num">{chapterNo}</EditableField>)}
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="t08-chapter2-title">{title}</EditableField>
            {subtitle && (<EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-sec-sub">{subtitle}</EditableField>)}
          </div>
          <T08Footer left={footerLeft} right={footerRight} _slideIdx={_slideIdx} _editable={_editable} />
        </div>
      </T08Frame>
  );
}
