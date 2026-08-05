// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06StatementV1Point {
  text?: string;
}

export interface Theme06StatementV1Props {
  imageUrl?: string;
  kicker?: string;
  statement: string;
  subtitle?: string;
  points?: Theme06StatementV1Point[];
  source?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06StatementV1Meta: LayoutMeta = {
  id: 'theme06_statement_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 核心主张',
  description: '大字号核心主张 + 支撑论点与来源署名',
  needsMedia: true,
  tags: ['statement', 'claim', 'conclusion', 'atlas'],
  contentShape: 'summary',
};

export const theme06StatementV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'STATEMENT' },
    { key: 'statement', label: '核心主张', type: 'textarea', inlineEditable: true, defaultValue: 'AI 基础设施的投资窗口将在未来 18 个月持续收窄。' },
    { key: 'subtitle', label: '补充说明', type: 'textarea', inlineEditable: true, defaultValue: '资本向头部集中、推理成本下降与监管趋严三重力量叠加，尾部玩家生存空间被压缩。' },
    {
      key: 'points',
      label: '支撑论点',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { text: '头部模型训练成本超过 10 亿美元，新进入者难以复制。' },
        { text: '推理价格年均下降 50% 以上，压缩垂直模型溢价。' },
        { text: '全球主要市场同步推进 AI 监管立法。' },
      ],
      itemSchema: [{ key: 'text', label: '论点', type: 'textarea', inlineEditable: true }],
    },
    { key: 'source', label: '来源/署名', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT 研究 · 2026' },
  ],
};

export function Theme06StatementV1(props: Theme06StatementV1Props): ReactNode {
  const { kicker, statement, subtitle, points = [], source, _slideIdx, _editable } = props;
  const validPoints = (points || []).filter((p): p is Theme06StatementV1Point => p != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-statement">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-statement-content lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="statement" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-statement-text">{statement}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}

        {validPoints.length > 0 && (
          <ul className="lp-theme06-statement-points">
            {validPoints.map((item, index) => (
              <li key={index} className="lp-theme06-statement-point">
                <span className="lp-theme06-bullet-marker" />
                <EditableField prop={`points.${index}.text`} slideIdx={_slideIdx} editable={_editable} as="span">{item.text || ''}</EditableField>
              </li>
            ))}
          </ul>
        )}

        {source && <div className="lp-theme06-statement-source">— {source}</div>}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
