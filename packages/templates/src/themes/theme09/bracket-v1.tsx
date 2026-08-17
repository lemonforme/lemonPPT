// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 归纳括弧（bracket_v1）
 * 基底：纸 | 骨架：stage | 图位：—
 *
 * 上方多项并列词条，中间巨型括弧收拢，下方落一句归纳。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Masthead, Sheet, normalizeStrings } from './shared.js';

export interface Theme09BracketV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  items?: Array<string | { item?: string }>;
  summary?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09BracketV1Meta: LayoutMeta = {
  id: 'theme09_bracket_v1',
  theme: 'theme09',
  role: 'content',
  displayName: '归纳括弧',
  description: '多项并列词条 + 巨型括弧收拢 + 一句归纳，纸底',
  needsMedia: false,
  tags: ['summary', 'bracket', 'induction', 'converge'],
  contentShape: 'bracket',
};

export const theme09BracketV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '归纳括弧' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'INDUCTION' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '09' },
    {
      key: 'items',
      label: '并列项',
      type: 'array',
      maxItems: 6,
      itemSchema: [{ key: 'item', label: '关键词 / 短语', type: 'text' }],
    },
    {
      key: 'summary',
      label: '归纳句',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '五条分散的产业变化，指向同一件事：价值正在从造模型迁移到用模型。',
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '归纳 · 收拢' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '32' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_ITEMS = ['算力价格回落', '交付服务提价', '行业语料稀缺', '合规成本定型', '客户预算前移'];

const DEFAULT_SUMMARY = '五条分散的产业变化，指向同一件事：价值正在从造模型迁移到用模型。';

/** 内容区宽度 = 1280 - 2 × 60 页边距 */
const BRACE_W = 1160;
const BRACE_H = 62;

function bracePath(): string {
  const mid = BRACE_W / 2;
  const r = 22;
  const top = 2;
  const arm = 30;
  const tip = BRACE_H - 4;
  return [
    `M ${top} ${top}`,
    `V ${arm - r}`,
    `Q ${top} ${arm} ${top + r} ${arm}`,
    `H ${mid - r}`,
    `Q ${mid} ${arm} ${mid} ${tip}`,
    `Q ${mid} ${arm} ${mid + r} ${arm}`,
    `H ${BRACE_W - top - r}`,
    `Q ${BRACE_W - top} ${arm} ${BRACE_W - top} ${arm - r}`,
    `V ${top}`,
  ].join(' ');
}

export function Theme09BracketV1(props: Theme09BracketV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    items = [],
    summary,
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const raw = normalizeStrings(items);
  const list = (raw.length ? raw : DEFAULT_ITEMS).slice(0, 6);
  const text = summary ?? DEFAULT_SUMMARY;

  return (
    <Sheet substrate="paper" frame="stage" className="lp-theme09-bracket">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 6,
          padding: '104px 60px 78px',
        }}
      >
        {/* 上：并列词条 */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'stretch', flex: 'none' }}>
          {list.map((it, i) => (
            <div
              key={i}
              style={{
                flex: '1 1 0',
                minWidth: 0,
                border: '1px solid var(--lp-border)',
                borderTop: `3px solid var(--lp-series-${(i % 6) + 1})`,
                background: 'var(--lp-surface-solid)',
                padding: '18px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'flex-start',
                justifyContent: 'center',
                minHeight: 108,
              }}
            >
              <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--lp-ink3)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="lp-t9-serif" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, color: 'var(--lp-ink)' }}>
                <EditableField prop={`items.${i}`} slideIdx={s} editable={e} as="span">
                  {it}
                </EditableField>
              </span>
            </div>
          ))}
        </div>

        {/* 中：巨型括弧 */}
        <svg
          width="100%"
          height={BRACE_H}
          viewBox={`0 0 ${BRACE_W} ${BRACE_H}`}
          preserveAspectRatio="none"
          role="presentation"
          aria-hidden="true"
          style={{ flex: 'none', display: 'block' }}
        >
          <path d={bracePath()} fill="none" stroke="var(--lp-accent)" strokeWidth={2} strokeLinecap="round" />
        </svg>

        {/* 下：归纳句 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, flex: 'none', paddingTop: 6 }}>
          <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: 11, letterSpacing: '0.22em', color: 'var(--lp-accent)' }}>
            IN SUM
          </span>
          <p
            className="lp-t9-serif"
            style={{
              margin: 0,
              maxWidth: 900,
              textAlign: 'center',
              fontSize: 30,
              fontWeight: 700,
              lineHeight: 1.46,
              color: 'var(--lp-ink)',
              letterSpacing: '0.01em',
            }}
          >
            <EditableField prop="summary" slideIdx={s} editable={e} as="span">
              {text}
            </EditableField>
          </p>
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
