// lemonPPT - theme08 黑金实验 · 四象限
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08QuadrantV1Cell {
  label: string;
  title: string;
  desc?: string;
}

export interface Theme08QuadrantV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme08QuadrantV1Cell[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08QuadrantV1Meta: LayoutMeta = {
  id: 'theme08_quadrant_v1',
  theme: 'theme08',
  role: 'swot',
  displayName: 'Theme 08 四象限',
  description: '2x2 象限矩阵 + 十字分隔，适合定位/分类',
  needsMedia: false,
  tags: ['quadrant', 'matrix', 'black-gold'],
  contentShape: 'quadrant',
};

export const theme08QuadrantV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'POSITIONING' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '能力 × 价值 矩阵' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '横轴价值，纵轴能力，定位最优象限。' },
    {
      key: 'items',
      label: '象限单元',
      type: 'array',
      minItems: 4,
      maxItems: 4,
      defaultValue: [
        { label: 'Q1 领先区', title: '核心业务', desc: '高价值高能力，重点投入。' },
        { label: 'Q2 培育区', title: '战略前瞻', desc: '高价值待提升，持续培育。' },
        { label: 'Q3 观察区', title: '辅助能力', desc: '能力高价值中，按需协同。' },
        { label: 'Q4 收缩区', title: '低效区', desc: '低价值低能力，逐步收缩。' },
      ],
      itemSchema: [
        { key: 'label', label: '象限标签', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'desc', label: '说明', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '14' },
  ],
};

export function Theme08QuadrantV1(props: Theme08QuadrantV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const cells = (items || []).slice(0, 4);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-quadrant-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="target" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-quadrant lp-rise">
            {cells.map((c, i) => (
              <div key={i} className="lp-theme08-card lp-theme08-card-pad lp-theme08-quad-cell" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="lp-theme08-quad-label"><EditableField prop={`items.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{c.label}</EditableField></div>
                <div className="lp-theme08-card-title"><EditableField prop={`items.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{c.title}</EditableField></div>
                {c.desc && <div className="lp-theme08-card-desc"><EditableField prop={`items.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="span">{c.desc}</EditableField></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme08-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
