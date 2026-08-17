// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 目录（contents_v1）
 * 基底：纸 | 骨架：grid | 图位：0
 *
 * 杂志目录结构：粗规线标题带 + 双栏条目，每条「序号 · 篇名 · 摘要 · 引导点 · 页码」，
 * 当前章用专色高亮。页码骑缝右对齐。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Masthead, Sheet } from './shared.js';

export interface Theme09ContentsV1Item {
  name: string;
  desc?: string;
  page?: string;
  current?: boolean;
}

export interface Theme09ContentsV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  titleEn?: string;
  items?: Theme09ContentsV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ContentsV1Meta: LayoutMeta = {
  id: 'theme09_contents_v1',
  theme: 'theme09',
  role: 'tableOfContents',
  displayName: 'Theme 09 目录',
  description: '杂志目录：双栏条目 + 引导点 + 页码骑缝对齐 + 专色当前章高亮',
  needsMedia: false,
  tags: ['contents', 'toc', 'agenda', 'editorial'],
  contentShape: 'contents',
};

export const theme09ContentsV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '目录' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Contents' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '本期目录' },
    { key: 'titleEn', label: '英文标注', type: 'text', inlineEditable: true, defaultValue: 'In This Issue' },
    {
      key: 'items',
      label: '目录条目',
      type: 'array',
      minItems: 2,
      maxItems: 10,
      defaultValue: [
        { name: '卷首 · 本期提要', desc: '一年的重量', page: '02', current: false },
        { name: '研究方法', desc: '我们怎么问问题', page: '05', current: true },
        { name: '用户田野', desc: '十二城走访实录', page: '14', current: false },
        { name: '产品线全景', desc: '原型到量产 400 天', page: '26', current: false },
        { name: '典型案例', desc: '三个被推翻的方案', page: '38', current: false },
        { name: '观点引述', desc: '来自一线的声音', page: '52', current: false },
        { name: '年度大事记', desc: '时间轴上的锚点', page: '64', current: false },
        { name: '附录 · 数据表', desc: '原始样本与口径', page: '78', current: false },
      ],
      itemSchema: [
        { key: 'name', label: '篇名', type: 'text' },
        { key: 'desc', label: '摘要', type: 'text' },
        { key: 'page', label: '页码', type: 'text' },
        { key: 'current', label: '高亮当前', type: 'boolean' },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '墨韵专刊' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '03' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09ContentsV1(props: Theme09ContentsV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, titleEn,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;
  const items = (props.items ?? []).slice(0, 10);

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-contents">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-contents-head lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme09-contents-title">
          {title}
        </EditableField>
        {titleEn && (
          <EditableField prop="titleEn" slideIdx={s} editable={e} as="span" className="lp-theme09-contents-en">
            {titleEn}
          </EditableField>
        )}
      </div>

      <div className="lp-theme09-contents-grid">
        {items.map((it, i) => (
          <div
            key={i}
            className={`lp-theme09-contents-item lp-rise${it.current ? ' current' : ''}`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="lp-theme09-contents-no">{String(i + 1).padStart(2, '0')}</span>
            <EditableField prop={`items.${i}.name`} slideIdx={s} editable={e} as="span" className="lp-theme09-contents-name">
              {it.name}
            </EditableField>
            {it.desc && (
              <EditableField prop={`items.${i}.desc`} slideIdx={s} editable={e} as="span" className="lp-theme09-contents-desc">
                {it.desc}
              </EditableField>
            )}
            <span className="lp-theme09-contents-dots" aria-hidden="true" />
            {it.page && (
              <EditableField prop={`items.${i}.page`} slideIdx={s} editable={e} as="span" className="lp-theme09-contents-page">
                {it.page}
              </EditableField>
            )}
          </div>
        ))}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
