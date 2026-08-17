// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 编年纪事（era_v1）
 * 基底：墨 | 骨架：column-3 | 图位：2
 *
 * 年代分栏：每栏一个年代，栏内是一条纵向时间线，
 * 挂 2–4 条事件条目；首栏与第三栏底部各留一处影像插图位。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { ColorBar, Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09EraEvent {
  title?: string;
  detail?: string;
}

export interface Theme09EraItem {
  year?: string;
  label?: string;
  events?: Theme09EraEvent[];
  image?: string;
}

export interface Theme09EraV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  eras?: Theme09EraItem[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

/** 固定的两处影像插图位所在栏序号 */
const PHOTO_COLUMNS = [0, 2];

export const theme09EraV1Meta: LayoutMeta = {
  id: 'theme09_era_v1',
  theme: 'theme09',
  role: 'timeline',
  displayName: '编年纪事',
  description: '年代分栏纵向时间线 + 每栏 2–4 条事件 + 两处影像插图位，墨底',
  needsMedia: true,
  mediaSlots: PHOTO_COLUMNS.map((i, k) => ({
    name: `年代影像 ${k + 1}`,
    fieldPath: `eras.${i}.image`,
    canPresetMedia: true,
  })),
  tags: ['era', 'timeline', 'chronicle', 'photo'],
  contentShape: 'era-columns',
};

export const theme09EraV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '编年纪事' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'CHRONICLE' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '43' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三个年代，三种做事方式' },
    {
      key: 'eras',
      label: '年代',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      itemSchema: [
        { key: 'year', label: '年代', type: 'text' },
        { key: 'label', label: '年代主题', type: 'text' },
        {
          key: 'events',
          label: '事件（2–4 条）',
          type: 'array',
          maxItems: 4,
          itemSchema: [
            { key: 'title', label: '事件标题', type: 'text' },
            { key: 'detail', label: '事件说明', type: 'text' },
          ],
        },
        { key: 'image', label: '年代影像', type: 'image' },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '纪事 · 年代' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '43' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_ERAS: Theme09EraItem[] = [
  {
    year: '2018—2020',
    label: '工具化',
    events: [
      { title: '单点工具上线', detail: '以脚本与插件形式解决零散重复劳动，尚未沉淀为产品。' },
      { title: '数据仓首次成型', detail: '三条业务线的日志汇入统一仓库，口径开始对齐。' },
      { title: '首个自动化流程', detail: '对账环节实现无人值守，月末结账缩短两个工作日。' },
    ],
  },
  {
    year: '2021—2023',
    label: '平台化',
    events: [
      { title: '中台建设启动', detail: '把重复能力抽成服务，交付周期从按季度改为按迭代。' },
      { title: '模型进入生产', detail: '质检与客服两个场景跑通闭环，效果指标纳入经营看板。' },
      { title: '合规体系落位', detail: '语料授权与备案流程固化，外部审计一次通过。' },
      { title: '伙伴生态成型', detail: '首批十二家实施伙伴接入，交付半径扩展至六个省份。' },
    ],
  },
  {
    year: '2024—2026',
    label: '产品化',
    events: [
      { title: '行业模板发布', detail: '四个行业的标准方案上架，复制成本下降约三成。' },
      { title: '交付闭环成立', detail: '售前、实施与运维同源，续约率稳定在九成以上。' },
      { title: '海外首站落地', detail: '以合规轻量版切入两个市场，验证跨境交付路径。' },
    ],
  },
];

export function Theme09EraV1(props: Theme09EraV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    eras = [],
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (eras.length ? eras : DEFAULT_ERAS).slice(0, 4);

  return (
    <Sheet substrate="ink" frame="column-3" className="lp-theme09-era">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 18, padding: '96px 60px 70px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flex: 'none' }}>
          {title && (
            <h2
              className="lp-t9-serif"
              style={{ margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.26, color: 'var(--lp-ink)' }}
            >
              <EditableField prop="title" slideIdx={s} editable={e} as="span">
                {title}
              </EditableField>
            </h2>
          )}
          <ColorBar count={4} className="lp-theme09-era-bar" />
        </div>

        <div style={{ display: 'flex', gap: 26, alignItems: 'stretch', flex: '1 1 auto', minHeight: 0 }}>
          {list.map((era, i) => {
            const tone = i === 0 ? 'var(--lp-accent)' : `var(--lp-series-${(i % 6) + 1})`;
            const events = (era.events ?? []).slice(0, 4);
            const withPhoto = PHOTO_COLUMNS.includes(i);
            return (
              <article
                key={i}
                className="lp-rise"
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  borderTop: `2px solid ${tone}`,
                  paddingTop: 12,
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flex: 'none' }}>
                  <span
                    className="lp-t9-serif"
                    style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1, color: 'var(--lp-ink)', letterSpacing: '-0.01em' }}
                  >
                    <EditableField prop={`eras.${i}.year`} slideIdx={s} editable={e} as="span">
                      {era.year ?? ''}
                    </EditableField>
                  </span>
                  {era.label && (
                    <span
                      style={{
                        flex: 'none',
                        fontFamily: 'var(--lp-font-mono)',
                        fontSize: 11,
                        letterSpacing: '0.14em',
                        color: tone,
                        border: `1px solid ${tone}`,
                        padding: '2px 7px',
                      }}
                    >
                      <EditableField prop={`eras.${i}.label`} slideIdx={s} editable={e} as="span">
                        {era.label}
                      </EditableField>
                    </span>
                  )}
                </div>

                {/* 纵向时间线：左侧一条轴，事件挂在轴上 */}
                <ul
                  style={{
                    margin: 0,
                    padding: '2px 0 2px 18px',
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    borderLeft: '1px solid var(--lp-t9-rule)',
                    flex: '1 1 auto',
                    minHeight: 0,
                  }}
                >
                  {events.map((ev, k) => (
                    <li key={k} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          left: -22,
                          top: 7,
                          width: 7,
                          height: 7,
                          background: tone,
                          borderRadius: '50%',
                        }}
                      />
                      <h3
                        className="lp-t9-serif"
                        style={{ margin: 0, fontSize: 16.5, fontWeight: 700, lineHeight: 1.36, color: 'var(--lp-ink)' }}
                      >
                        <EditableField prop={`eras.${i}.events.${k}.title`} slideIdx={s} editable={e} as="span">
                          {ev.title ?? ''}
                        </EditableField>
                      </h3>
                      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: 'var(--lp-ink2)' }}>
                        <EditableField prop={`eras.${i}.events.${k}.detail`} slideIdx={s} editable={e} as="span">
                          {ev.detail ?? ''}
                        </EditableField>
                      </p>
                    </li>
                  ))}
                </ul>

                {withPhoto && (
                  <InkPhoto
                    prop={`eras.${i}.image`}
                    src={era.image}
                    slideIdx={s}
                    editable={e}
                    ratio="3:2"
                    hint="上传年代影像"
                    style={{ flex: 'none' }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--lp-font-mono)',
                        fontSize: 10.5,
                        letterSpacing: '0.18em',
                        color: 'var(--lp-ink)',
                      }}
                    >
                      {`ERA-${String(i + 1).padStart(2, '0')}`}
                    </span>
                  </InkPhoto>
                )}
              </article>
            );
          })}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
