// lemonPPT - theme07 财团/联合投资页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07SyndicateV1Point {
  text?: string;
}

export interface Theme07SyndicateV1Props {
  imageUrl?: string;
  kicker?: string;
  statement: string;
  subtitle?: string;
  points?: Theme07SyndicateV1Point[];
  source?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07SyndicateV1Meta: LayoutMeta = {
  id: 'theme07_syndicate_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 财团联合投资',
  description: '核心主张 + 要点论证 + 来源',
  needsMedia: true,
  tags: ['syndicate', 'statement', 'summary'],
  contentShape: 'summary',
};

export const theme07SyndicateV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SYNDICATE' },
    { key: 'statement', label: '核心主张', type: 'textarea', inlineEditable: true, defaultValue: '大额交易 increasingly 由财团联合领投，单一基金难以承担后期估值。' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '联合投资成为后期项目的标配结构' },
    {
      key: 'points',
      label: '支撑要点',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { text: '后期单笔金额攀升，单一 LP 暴露受限' },
        { text: '战略方与财务投资人互补，降低尽调成本' },
        { text: '联合领投提升定价公信力与后续轮融资顺畅度' },
      ],
      itemSchema: [{ key: 'text', label: '要点', type: 'textarea', inlineEditable: true }],
    },
    { key: 'source', label: '来源', type: 'text', inlineEditable: true, defaultValue: '— lemonPPT 产业研究' },
  ],
};

export function Theme07SyndicateV1(props: Theme07SyndicateV1Props): ReactNode {
  const { imageUrl, kicker, statement, subtitle, points = [], source, _slideIdx, _editable } = props;
  const validPoints = (points || []).filter((p): p is Theme07SyndicateV1Point => p != null && !!p.text).slice(0, 4);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-statement">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-statement-content lp-rise">
        <Theme07IconChip name="network" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="statement" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{statement}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
        {validPoints.length > 0 && (
          <ul className="lp-theme07-statement-points">
            {validPoints.map((item, index) => (
              <li key={index} className="lp-theme07-statement-point">
                <span className="lp-theme07-summary-point-dot" />
                <EditableField prop={`points.${index}.text`} slideIdx={_slideIdx} editable={_editable} as="span">{item.text}</EditableField>
              </li>
            ))}
          </ul>
        )}
        {source && <div className="lp-theme07-statement-source">{source}</div>}
      </div>
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
