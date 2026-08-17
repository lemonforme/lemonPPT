// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 设计系统标本页（specimen_v1）
 * 基底：纸 | 骨架：grid | 图位：2
 *
 * 一页排版「墨韵专色 · 杂志印刷风」的全部原语：
 * 刊头 Masthead / 骑缝 Folio / 专色色标 ColorBar / 影像位 InkPhoto /
 * 导语 Standfirst / 规线 Rule / 装订线 Gutter / 折角 dogear / 裁切线 cropmarks。
 * 用于设计评审、组件库展示与 Agent 选版参考。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { ColorBar, Folio, InkPhoto, Masthead, Rule, Sheet, Standfirst } from './shared.js';

export interface Theme09SpecimenV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  lead?: string;
  imgA?: string;
  imgB?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09SpecimenV1Meta: LayoutMeta = {
  id: 'theme09_specimen_v1',
  theme: 'theme09',
  role: 'content',
  displayName: 'Theme 09 设计系统标本',
  description: '一页展示墨韵专色主题的全部印刷原语：刊头/骑缝/色标/影像位/导语/规线/装订线/折角',
  needsMedia: true,
  mediaSlots: [
    { name: '影像位 A', fieldPath: 'imgA', canPresetMedia: true },
    { name: '影像位 B（圆窗）', fieldPath: 'imgB', canPresetMedia: true },
  ],
  tags: ['specimen', 'components', 'system', 'showcase'],
  contentShape: 'specimen',
};

export const theme09SpecimenV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '设计系统' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Specimen Sheet' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'INK EDITORIAL' },
    {
      key: 'lead',
      label: '导语',
      type: 'textarea',
      inlineEditable: true,
      defaultValue:
        '墨韵专色是一本可以印刷的杂志。它用纸与墨两种基底、六专色序列，以及刊头、骑缝、色标、影像位等印刷原语，把数据讲成有质感的编辑故事。',
    },
    { key: 'imgA', label: '影像位 A', type: 'image', defaultValue: '' },
    { key: 'imgB', label: '影像位 B', type: 'image', defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '设计系统 · 标本页' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '00' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'INK EDITORIAL' },
  ],
};

export function Theme09SpecimenV1(props: Theme09SpecimenV1Props): ReactNode {
  const {
    section, sectionEn, mark, lead,
    imgA, imgB, folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-specimen" cropMarks>
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-specimen-body">
        <section className="lp-theme09-specimen-block lp-theme09-specimen-type">
          <h3 className="lp-theme09-specimen-h">字体层级 / Type</h3>
          <p className="lp-theme09-specimen-display">墨韵 Display</p>
          <p className="lp-theme09-specimen-h1">标题 H1 衡文体</p>
          <p className="lp-theme09-specimen-h2">标题 H2 副标题</p>
          <p className="lp-theme09-specimen-body">
            正文 Body —— 衬线导语与无衬线说明并存，靠字重与字距拉开层次。
          </p>
          <p className="lp-theme09-specimen-mono">MONO 1234567890 / ISSUE 09</p>
          <div className="lp-theme09-specimen-tags">
            <span className="lp-theme09-specimen-tag">栏目</span>
            <span className="lp-theme09-specimen-tag">专色</span>
            <span className="lp-theme09-specimen-tag">影像</span>
          </div>
        </section>

        <section className="lp-theme09-specimen-block lp-theme09-specimen-color">
          <h3 className="lp-theme09-specimen-h">专色序列 / Spot</h3>
          <ColorBar count={6} labeled />
          <Rule strong />
          <div className="lp-theme09-specimen-gutter-demo" aria-hidden="true">
            <span>装订线 Gutter</span>
          </div>
        </section>

        <section className="lp-theme09-specimen-block lp-theme09-specimen-photos">
          <h3 className="lp-theme09-specimen-h">影像位 / InkPhoto</h3>
          <div className="lp-theme09-specimen-photos-row">
            <InkPhoto prop="imgA" src={imgA} slideIdx={s} editable={e} ratio="4:3" hint="4:3 影像" />
            <InkPhoto prop="imgB" src={imgB} slideIdx={s} editable={e} ratio="1:1" aperture hint="圆窗 1:1" />
          </div>
        </section>

        <section className="lp-theme09-specimen-block lp-theme09-specimen-text">
          <h3 className="lp-theme09-specimen-h">导语 / Standfirst</h3>
          <Standfirst
            text={lead ?? ''}
            prop="lead"
            slideIdx={s}
            editable={e}
            dropCap
            columns={1}
          />
          <div className="lp-theme09-specimen-dogear-demo lp-theme09-dogear" aria-hidden="true">
            折角 dogear
          </div>
        </section>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
