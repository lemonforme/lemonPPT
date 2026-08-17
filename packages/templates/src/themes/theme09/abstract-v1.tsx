// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 卷首摘要（abstract_v1）
 * 基底：纸 | 骨架：sidebar | 图位：0
 *
 * 刊头 + 首字下沉的双栏摘要正文，右侧专色竖线挂关键数字栏，
 * 底部骑缝页脚。杂志「卷首语 / 内容提要」的标准编辑结构。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Masthead, Sheet, Standfirst } from './shared.js';

export interface Theme09AbstractV1Figure {
  v: string;
  unit?: string;
  k: string;
}

export interface Theme09AbstractV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  standfirst: string;
  figures?: Theme09AbstractV1Figure[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09AbstractV1Meta: LayoutMeta = {
  id: 'theme09_abstract_v1',
  theme: 'theme09',
  role: 'content',
  displayName: 'Theme 09 卷首摘要',
  description: '首字下沉双栏摘要 + 专色关键数字挂栏，适合报告开篇提要',
  needsMedia: false,
  tags: ['abstract', 'summary', 'standfirst', 'editorial'],
  contentShape: 'abstract',
};

export const theme09AbstractV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '卷首' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Abstract' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '本期提要' },
    {
      key: 'standfirst',
      label: '摘要正文',
      type: 'textarea',
      inlineEditable: true,
      defaultValue:
        '这一年我们没有急着扩张，而是把力气花在了两件事上：把产品做薄，把关系做厚。全年完成一百二十场用户对话，落地十二个城市的实地走访，重构了三条核心链路。数据之外更值得记录的，是那些反复推翻自己的时刻——我们第一次意识到，品牌不是被设计出来的，而是被使用出来的。接下来的篇幅里，你会看到方法、争论与真实的失败样本。',
    },
    {
      key: 'figures',
      label: '关键数字',
      type: 'array',
      minItems: 1,
      maxItems: 5,
      defaultValue: [
        { v: '120', unit: '场', k: '深度用户对话' },
        { v: '12', unit: '座', k: '实地走访城市' },
        { v: '3', unit: '条', k: '重构核心链路' },
        { v: '87', unit: '%', k: '主张认知一致率' },
      ],
      itemSchema: [
        { key: 'v', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'k', label: '说明', type: 'text' },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '卷首 · 本期提要' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '02' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme09AbstractV1(props: Theme09AbstractV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, standfirst,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;
  const figures = (props.figures ?? []).slice(0, 5);

  return (
    <Sheet substrate="paper" frame="sidebar" className="lp-theme09-abstract">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-abstract-body">
        <div className="lp-theme09-abstract-main">
          <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme09-abstract-title lp-rise">
            {title}
          </EditableField>
          <div className="lp-theme09-abstract-cols lp-rise" style={{ animationDelay: '70ms' }}>
            <Standfirst text={standfirst} prop="standfirst" slideIdx={s} editable={e} dropCap columns={2} />
          </div>
        </div>

        {figures.length > 0 && (
          <aside className="lp-theme09-abstract-figures lp-rise" style={{ animationDelay: '130ms' }}>
            {figures.map((f, i) => (
              <div key={i} className="lp-theme09-abstract-fig">
                <span className="lp-theme09-abstract-fig-v">
                  <EditableField prop={`figures.${i}.v`} slideIdx={s} editable={e} as="span">
                    {f.v}
                  </EditableField>
                  {f.unit && (
                    <EditableField prop={`figures.${i}.unit`} slideIdx={s} editable={e} as="span" className="unit">
                      {f.unit}
                    </EditableField>
                  )}
                </span>
                <EditableField prop={`figures.${i}.k`} slideIdx={s} editable={e} as="span" className="lp-theme09-abstract-fig-k">
                  {f.k}
                </EditableField>
              </div>
            ))}
          </aside>
        )}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
