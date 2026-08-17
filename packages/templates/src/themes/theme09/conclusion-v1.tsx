// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 核心结论（conclusion_v1）
 * 基底：纸 | 骨架：spread | 图位：—
 *
 * 顶部通栏色标带 + 编号结论列，每条为「巨号编号 + 标题 + 一句话说明」。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { ColorBar, Folio, Masthead, Sheet } from './shared.js';

export interface Theme09ConclusionItem {
  title?: string;
  summary?: string;
}

export interface Theme09ConclusionV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  conclusions?: Theme09ConclusionItem[];
  showBand?: boolean;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ConclusionV1Meta: LayoutMeta = {
  id: 'theme09_conclusion_v1',
  theme: 'theme09',
  role: 'content',
  displayName: '核心结论',
  description: '顶部通栏色标带 + 编号结论列（3–5 条），纸底',
  needsMedia: false,
  tags: ['conclusion', 'summary', 'numbered', 'takeaway'],
  contentShape: 'conclusion-list',
};

export const theme09ConclusionV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '核心结论' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'KEY CONCLUSIONS' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '08' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '四条可执行的核心结论' },
    {
      key: 'conclusions',
      label: '结论条目',
      type: 'array',
      maxItems: 5,
      itemSchema: [
        { key: 'title', label: '结论标题', type: 'text' },
        { key: 'summary', label: '一句话说明', type: 'textarea' },
      ],
    },
    { key: 'showBand', label: '显示顶部色带', type: 'boolean', defaultValue: true },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '结论 · 要点' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '29' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_CONCLUSIONS: Theme09ConclusionItem[] = [
  { title: '底座不再是稀缺项', summary: '通用底座供给过剩，继续加码的边际回报快速衰减。' },
  { title: '溢价迁移至交付侧', summary: '实施与运维收入占比升至 47%，交付能力成为定价核心。' },
  { title: '现金流优先于规模', summary: '经营性现金流为正的主体，估值波动率低于同行三成。' },
  { title: '合规是入场券', summary: '语料授权与备案完成度，直接决定能否进入政企采购名录。' },
];

export function Theme09ConclusionV1(props: Theme09ConclusionV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    conclusions = [],
    showBand = true,
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (conclusions.length ? conclusions : DEFAULT_CONCLUSIONS).slice(0, 5);

  return (
    <Sheet substrate="paper" frame="spread" className="lp-theme09-conclusion">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 18, padding: '92px 60px 70px' }}>
        {showBand !== false && <ColorBar count={10} />}

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flex: 'none' }}>
          {title && (
            <h2 className="lp-t9-serif" style={{ margin: 0, fontSize: 34, fontWeight: 700, lineHeight: 1.22, color: 'var(--lp-ink)' }}>
              <EditableField prop="title" slideIdx={s} editable={e} as="span">
                {title}
              </EditableField>
            </h2>
          )}
          <span style={{ flex: 'none', fontFamily: 'var(--lp-font-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--lp-ink3)', paddingBottom: 6 }}>
            {`${String(list.length).padStart(2, '0')} POINTS`}
          </span>
        </div>

        <ol
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            minHeight: 0,
          }}
        >
          {list.map((it, i) => (
            <li
              key={i}
              style={{
                flex: '1 1 0',
                minHeight: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                borderTop: i === 0 ? '2px solid var(--lp-t9-rule-strong)' : '1px solid var(--lp-t9-rule)',
                padding: '10px 0',
              }}
            >
              <span
                className="lp-t9-serif"
                style={{
                  flex: 'none',
                  width: 86,
                  fontSize: 52,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  color: i === 0 ? 'var(--lp-accent)' : 'var(--lp-t9-rule-strong)',
                }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h3 className="lp-t9-serif" style={{ margin: 0, fontSize: 21, fontWeight: 700, color: 'var(--lp-ink)', lineHeight: 1.3 }}>
                  <EditableField prop={`conclusions.${i}.title`} slideIdx={s} editable={e} as="span">
                    {it.title ?? ''}
                  </EditableField>
                </h3>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: 'var(--lp-ink2)' }}>
                  <EditableField prop={`conclusions.${i}.summary`} slideIdx={s} editable={e} as="span">
                    {it.summary ?? ''}
                  </EditableField>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
