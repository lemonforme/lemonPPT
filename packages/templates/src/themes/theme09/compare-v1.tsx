// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 多维对比（compare_v1）
 * 基底：纸 | 骨架：spread | 图位：2
 *
 * 跨页式双列对比：左右两栏顶部各一处影像，中缝走装订线，
 * 下方按维度逐行对照，占优一侧以专色高亮。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Gutter, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09CompareDimension {
  name?: string;
  leftValue?: string;
  rightValue?: string;
  /** 占优一侧：left / right，留空表示持平 */
  winner?: string;
}

export interface Theme09CompareV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  leftTitle?: string;
  rightTitle?: string;
  leftImage?: string;
  rightImage?: string;
  dimensions?: Theme09CompareDimension[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09CompareV1Meta: LayoutMeta = {
  id: 'theme09_compare_v1',
  theme: 'theme09',
  role: 'comparison',
  displayName: '多维对比',
  description: '双列对比 + 两处顶部影像 + 逐维对照行 + 占优侧专色高亮，纸底',
  needsMedia: true,
  mediaSlots: [
    { name: '左侧影像', fieldPath: 'leftImage', canPresetMedia: true },
    { name: '右侧影像', fieldPath: 'rightImage', canPresetMedia: true },
  ],
  tags: ['comparison', 'spread', 'dimensions', 'photo'],
  contentShape: 'two-column-compare',
};

export const theme09CompareV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '多维对比' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'COMPARE' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '47' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '两条技术路线，六个维度上的取舍' },
    { key: 'leftTitle', label: '左栏标题', type: 'text', inlineEditable: true, defaultValue: '自建底座' },
    { key: 'rightTitle', label: '右栏标题', type: 'text', inlineEditable: true, defaultValue: '外采底座' },
    { key: 'leftImage', label: '左栏影像', type: 'image', defaultValue: '' },
    { key: 'rightImage', label: '右栏影像', type: 'image', defaultValue: '' },
    {
      key: 'dimensions',
      label: '对比维度',
      type: 'array',
      minItems: 3,
      maxItems: 7,
      itemSchema: [
        { key: 'name', label: '维度名称', type: 'text' },
        { key: 'leftValue', label: '左栏取值', type: 'text' },
        { key: 'rightValue', label: '右栏取值', type: 'text' },
        { key: 'winner', label: '占优侧（left/right）', type: 'text' },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '对比 · 取舍' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '47' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_DIMENSIONS: Theme09CompareDimension[] = [
  { name: '首年投入', leftValue: '1.8 亿元', rightValue: '4200 万元', winner: 'right' },
  { name: '上线周期', leftValue: '11 个月', rightValue: '3 个月', winner: 'right' },
  { name: '定制深度', leftValue: '可改到底层', rightValue: '受接口约束', winner: 'left' },
  { name: '数据留存', leftValue: '全部在域内', rightValue: '需签出域协议', winner: 'left' },
  { name: '迭代速度', leftValue: '受自有团队限制', rightValue: '跟随供应商节奏', winner: '' },
  { name: '长期成本', leftValue: '三年后转为摊薄', rightValue: '随用量线性上涨', winner: 'left' },
];

export function Theme09CompareV1(props: Theme09CompareV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    leftTitle,
    rightTitle,
    leftImage,
    rightImage,
    dimensions = [],
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (dimensions.length ? dimensions : DEFAULT_DIMENSIONS).slice(0, 7);
  const lTitle = leftTitle && leftTitle.trim() ? leftTitle : '自建底座';
  const rTitle = rightTitle && rightTitle.trim() ? rightTitle : '外采底座';

  const isWin = (w: string | undefined, side: 'left' | 'right'): boolean =>
    String(w ?? '').trim().toLowerCase() === side;

  const valueStyle = (win: boolean, align: 'right' | 'left') => ({
    flex: '1 1 0',
    minWidth: 0,
    textAlign: align,
    fontSize: win ? 15.5 : 14.5,
    fontWeight: win ? 700 : 500,
    lineHeight: 1.5,
    color: win ? 'var(--lp-accent)' : 'var(--lp-ink2)',
  });

  return (
    <Sheet substrate="paper" frame="spread" className="lp-theme09-compare">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />
      <Gutter />

      <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 10, padding: '72px 60px 46px' }}>
        {title && (
          <h2
            className="lp-t9-serif"
            style={{ margin: 0, fontSize: 23, fontWeight: 700, lineHeight: 1.26, color: 'var(--lp-ink)', flex: 'none' }}
          >
            <EditableField prop="title" slideIdx={s} editable={e} as="span">
              {title}
            </EditableField>
          </h2>
        )}

        {/* 顶部：左右影像 + 栏标题 */}
        <div style={{ display: 'flex', gap: 56, flex: 'none' }}>
          {([
            { key: 'left', img: leftImage, name: lTitle, prop: 'leftImage', titleProp: 'leftTitle' },
            { key: 'right', img: rightImage, name: rTitle, prop: 'rightImage', titleProp: 'rightTitle' },
          ] as const).map((col, ci) => (
            <div key={col.key} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <InkPhoto
                prop={col.prop}
                src={col.img}
                slideIdx={s}
                editable={e}
                ratio="16:9"
                hint={ci === 0 ? '上传左侧影像' : '上传右侧影像'}
                style={{ flex: 'none' }}
              />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
                <span
                  aria-hidden="true"
                  style={{ flex: 'none', width: 4, height: 15, background: ci === 0 ? 'var(--lp-accent)' : 'var(--lp-series-3)' }}
                />
                <h3
                  className="lp-t9-serif"
                  style={{ margin: 0, fontSize: 21, fontWeight: 700, lineHeight: 1.3, color: 'var(--lp-ink)' }}
                >
                  <EditableField prop={col.titleProp} slideIdx={s} editable={e} as="span">
                    {col.name}
                  </EditableField>
                </h3>
                <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--lp-ink3)' }}>
                  {ci === 0 ? 'SIDE A' : 'SIDE B'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 对比维度行 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: '1 1 auto',
            minHeight: 0,
            borderTop: '2px solid var(--lp-t9-rule-strong)',
          }}
        >
          {list.map((dim, i) => {
            const winL = isWin(dim.winner, 'left');
            const winR = isWin(dim.winner, 'right');
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  borderBottom: '1px solid var(--lp-t9-rule)',
                  padding: '4px 0',
                }}
              >
                <span style={valueStyle(winL, 'right')}>
                  <EditableField prop={`dimensions.${i}.leftValue`} slideIdx={s} editable={e} as="span">
                    {dim.leftValue ?? ''}
                  </EditableField>
                  {winL && <span aria-hidden="true" style={{ marginLeft: 6, fontSize: 11 }}>◆</span>}
                </span>

                <span
                  style={{
                    flex: 'none',
                    width: 132,
                    textAlign: 'center',
                    fontFamily: 'var(--lp-font-mono)',
                    fontSize: 11.5,
                    letterSpacing: '0.1em',
                    color: 'var(--lp-ink3)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <EditableField prop={`dimensions.${i}.name`} slideIdx={s} editable={e} as="span">
                    {dim.name ?? ''}
                  </EditableField>
                </span>

                <span style={valueStyle(winR, 'left')}>
                  {winR && <span aria-hidden="true" style={{ marginRight: 6, fontSize: 11 }}>◆</span>}
                  <EditableField prop={`dimensions.${i}.rightValue`} slideIdx={s} editable={e} as="span">
                    {dim.rightValue ?? ''}
                  </EditableField>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
