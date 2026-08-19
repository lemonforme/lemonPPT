// lemonPPT - theme08 黑金实验 · 双栏对比
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08CompareV1Item {
  side?: 'left' | 'right';
  title: string;
  desc?: string;
}

export interface Theme08CompareV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme08CompareV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08CompareV1Meta: LayoutMeta = {
  id: 'theme08_compare_v1',
  theme: 'theme08',
  role: 'comparison',
  displayName: 'Theme 08 双栏对比',
  description: '左右两栏对照，荧光金/玫红区分，适合对比/权衡',
  needsMedia: false,
  tags: ['compare', 'versus', 'black-gold'],
  contentShape: 'compare',
};

export const theme08CompareV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'TRADE-OFFS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '两种路径的权衡' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '自建体系 vs 生态协同，各有取舍。' },
    {
      key: 'items',
      label: '对比条目',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { side: 'left', title: '完全可控', desc: '数据与训练链路自主，迭代节奏不受外部约束。' },
        { side: 'left', title: '重资产', desc: '前期算力与人才投入高，回收周期长。' },
        { side: 'right', title: '起步快', desc: '复用成熟底座，几周内即可验证场景。' },
        { side: 'right', title: '依赖外部', desc: '核心能力受制于人，毛利被平台分走。' },
      ],
      itemSchema: [
        { key: 'side', label: '侧', type: 'select', options: [{ value: 'left', label: '左' }, { value: 'right', label: '右' }] },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'desc', label: '说明', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '12' },
  ],
};

export function Theme08CompareV1(props: Theme08CompareV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (items || []).slice(0, 8);
  const left = valid.filter((it) => it.side !== 'right');
  const right = valid.filter((it) => it.side === 'right');
  const renderCol = (list: Theme08CompareV1Item[], side: 'left' | 'right') => (
    <div className={`lp-theme08-card lp-theme08-card-pad lp-theme08-compare-col ${side}`}>
      <div className="lp-theme08-compare-head">{side === 'left' ? '路径 A' : '路径 B'}</div>
      <div className="lp-theme08-list">
        {list.map((it, i) => (
          <div key={i} className="lp-theme08-list-item" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="lp-theme08-list-text">
              <div className="lp-theme08-list-title"><EditableField prop={`items.${valid.indexOf(it)}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{it.title}</EditableField></div>
              {it.desc && <div className="lp-theme08-list-desc"><EditableField prop={`items.${valid.indexOf(it)}.desc`} slideIdx={_slideIdx} editable={_editable} as="span">{it.desc}</EditableField></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div className="lp-slide lp-theme08 lp-theme08-compare-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="target" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-compare lp-rise">
            {renderCol(left, 'left')}
            {renderCol(right, 'right')}
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
