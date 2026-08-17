// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 篇章卡（section_card_v1）
 * 基底：纸 | 骨架：sidebar | 图位：0
 *
 * 左侧折页角卡片（顶部专色压条 + 巨号 + 章节名），
 * 右侧三行要点列表（粗规线起首、细规线分隔）。
 * 与 section_v1 构成「墨重 / 纸轻」的一对篇章表达。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Masthead, Sheet } from './shared.js';

export interface Theme09SectionCardV1Point {
  t: string;
  d?: string;
}

export interface Theme09SectionCardV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  num: string;
  name: string;
  nameEn?: string;
  points?: Theme09SectionCardV1Point[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09SectionCardV1Meta: LayoutMeta = {
  id: 'theme09_section_card_v1',
  theme: 'theme09',
  role: 'content',
  displayName: 'Theme 09 篇章卡',
  description: '折页角卡片 + 本章要点列表，纸底轻量篇章页，可与篇章扉页交替使用',
  needsMedia: false,
  tags: ['section', 'chapter', 'card', 'paper'],
  contentShape: 'section-card',
};

export const theme09SectionCardV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '章节导航' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Chapter Card' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: '02 / 08' },
    { key: 'num', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '02' },
    { key: 'name', label: '章节名', type: 'text', inlineEditable: true, defaultValue: '用户田野' },
    { key: 'nameEn', label: '英文名', type: 'text', inlineEditable: true, defaultValue: 'Field Research' },
    {
      key: 'points',
      label: '本章要点',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { t: '走进真实场景', d: '十二座城市、四十六个站点的一线观察，记录未被问卷覆盖的行为。' },
        { t: '让用户主导叙述', d: '把提纲收到最短，把沉默留给对方，最有价值的答案往往出现在第三十分钟后。' },
        { t: '把分歧留在纸上', d: '编码阶段保留全部冲突样本，不做平均化处理，异常值本身就是结论。' },
      ],
      itemSchema: [
        { key: 't', label: '要点标题', type: 'text' },
        { key: 'd', label: '要点说明', type: 'textarea' },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '第二章 · 用户田野' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '14' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'FIELD' },
  ],
};

export function Theme09SectionCardV1(props: Theme09SectionCardV1Props): ReactNode {
  const {
    section, sectionEn, mark, num, name, nameEn,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;
  const points = (props.points ?? []).slice(0, 4);

  return (
    <Sheet substrate="paper" frame="sidebar" className="lp-theme09-seccard">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-seccard-body">
        <div className="lp-theme09-seccard-card lp-theme09-dogear lp-rise">
          <EditableField prop="num" slideIdx={s} editable={e} as="span" className="lp-theme09-seccard-no">
            {num}
          </EditableField>
          <EditableField prop="name" slideIdx={s} editable={e} as="h2" className="lp-theme09-seccard-name">
            {name}
          </EditableField>
          {nameEn && (
            <EditableField prop="nameEn" slideIdx={s} editable={e} as="span" className="lp-theme09-seccard-en">
              {nameEn}
            </EditableField>
          )}
        </div>

        <div className="lp-theme09-seccard-points">
          {points.map((p, i) => (
            <div key={i} className="lp-theme09-seccard-point lp-rise" style={{ animationDelay: `${80 + i * 60}ms` }}>
              <span className="lp-theme09-seccard-point-no">{String(i + 1).padStart(2, '0')}</span>
              <div className="lp-theme09-seccard-point-body">
                <EditableField prop={`points.${i}.t`} slideIdx={s} editable={e} as="span" className="lp-theme09-seccard-point-t">
                  {p.t}
                </EditableField>
                {p.d && (
                  <EditableField prop={`points.${i}.d`} slideIdx={s} editable={e} as="span" className="lp-theme09-seccard-point-d">
                    {p.d}
                  </EditableField>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
