// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 色标封面（cover_colorbar_v1）
 * 基底：纸 | 骨架：grid | 图位：0
 *
 * 顶部 8 格印刷色标阵列作视觉锚（带色号标注），
 * 下方大字明朝体标题 + 右侧规格表，底部裁切标注收口。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';

export interface Theme09CoverColorbarV1Spec {
  k: string;
  v: string;
}

export interface Theme09CoverColorbarV1Props {
  title: string;
  subtitle?: string;
  specs?: Theme09CoverColorbarV1Spec[];
  footLeft?: string;
  footRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

/** 8 格色标：六个专色序列 + 墨 + 纸，模拟印厂色卡 */
const CELL_COLORS = [
  'var(--lp-series-1)',
  'var(--lp-series-2)',
  'var(--lp-series-3)',
  'var(--lp-series-4)',
  'var(--lp-series-5)',
  'var(--lp-series-6)',
  'var(--lp-ink)',
  'var(--lp-ink3)',
];

const CELL_CODES = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'K100', 'K40'];

export const theme09CoverColorbarV1Meta: LayoutMeta = {
  id: 'theme09_cover_colorbar_v1',
  theme: 'theme09',
  role: 'cover',
  displayName: 'Theme 09 色标封面',
  description: '印刷色标阵列 + 大字明朝体标题 + 规格表，适合设计年鉴/品牌手册',
  needsMedia: false,
  tags: ['cover', 'colorbar', 'swatch', 'paper'],
  contentShape: 'cover-colorbar',
};

export const theme09CoverColorbarV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '主标题', type: 'text', inlineEditable: true, defaultValue: '色彩即语言' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '一套专色系统如何在三年里，把品牌的性格印进每一次触点。' },
    {
      key: 'specs',
      label: '规格表',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { k: 'Edition', v: '第三版' },
        { k: 'Format', v: '210 × 285 mm' },
        { k: 'Paper', v: '本白胶版 128g' },
        { k: 'Ink', v: '专色 + 四色叠印' },
        { k: 'Issued', v: '2026.08' },
      ],
      itemSchema: [
        { key: 'k', label: '项', type: 'text' },
        { key: 'v', label: '值', type: 'text' },
      ],
    },
    { key: 'footLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT · BRAND SYSTEM' },
    { key: 'footRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: 'PROOF 01' },
  ],
};

export function Theme09CoverColorbarV1(props: Theme09CoverColorbarV1Props): ReactNode {
  const { title, subtitle, footLeft, footRight, _slideIdx: s, _editable: e } = props;
  const specs = (props.specs ?? []).slice(0, 6);

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-covercb" cropMarks>
      <div className="lp-theme09-covercb-grid lp-rise" aria-hidden="true">
        {CELL_COLORS.map((c, i) => (
          <div key={i} className="lp-theme09-covercb-cell" style={{ background: c, animationDelay: `${i * 30}ms` }}>
            <span>{CELL_CODES[i]}</span>
          </div>
        ))}
      </div>

      <div className="lp-theme09-covercb-main">
        <div>
          <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-covercb-title lp-rise">
            {title}
          </EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme09-covercb-sub lp-rise">
              {subtitle}
            </EditableField>
          )}
        </div>

        {specs.length > 0 && (
          <div className="lp-theme09-covercb-specs lp-rise" style={{ animationDelay: '140ms' }}>
            {specs.map((sp, i) => (
              <div key={i} className="lp-theme09-covercb-spec">
                <EditableField prop={`specs.${i}.k`} slideIdx={s} editable={e} as="span" className="lp-theme09-covercb-spec-k">
                  {sp.k}
                </EditableField>
                <EditableField prop={`specs.${i}.v`} slideIdx={s} editable={e} as="span" className="lp-theme09-covercb-spec-v">
                  {sp.v}
                </EditableField>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme09-covercb-foot">
        {footLeft && (
          <EditableField prop="footLeft" slideIdx={s} editable={e} as="span">
            {footLeft}
          </EditableField>
        )}
        {footRight && (
          <EditableField prop="footRight" slideIdx={s} editable={e} as="span">
            {footRight}
          </EditableField>
        )}
      </div>
    </Sheet>
  );
}
