// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05ClosingV1Point {
  value: string;
  label: string;
}

export interface Theme05ClosingV1Props {
  kicker?: string;
  claim: string;
  points?: Theme05ClosingV1Point[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ClosingV1Meta: LayoutMeta = {
  id: 'theme05_closing_v1',
  theme: 'theme05',
  role: 'closing',
  displayName: 'Theme 05 结论页',
  description: '核心论断 + 3 个数据要点',
  needsMedia: false,
  tags: ['closing', 'conclusion', 'spectrum'],
  contentShape: 'closing',
};

export const theme05ClosingV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CONCLUSION' },
    { key: 'claim', label: '核心论断', type: 'textarea', inlineEditable: true, defaultValue: 'AI 融资已进入头部集中、场景分化的成熟阶段。' },
    {
      key: 'points',
      label: '数据要点',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '说明', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: 'THANK YOU' },
  ],
};

export function Theme05ClosingV1(props: Theme05ClosingV1Props): ReactNode {
  const { kicker, claim, points = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-closing">
      {kicker && <div className="lp-theme05-kicker lp-rise">{kicker}</div>}
      <EditableField prop="claim" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-closing-claim lp-rise">{claim}</EditableField>
      {points.length > 0 && (
        <div className="lp-theme05-closing-points lp-rise">
          {points.map((p, i) => (
            <div key={i} className="lp-theme05-closing-point" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="lp-theme05-closing-point-value">
                <EditableField prop={`points.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{p.value}</EditableField>
              </div>
              <div className="lp-theme05-closing-point-label">
                <EditableField prop={`points.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{p.label}</EditableField>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left">
          {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        </span>
        <span className="lp-theme05-footer-right">
          {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
        </span>
      </div>
    </div>
  );
}
