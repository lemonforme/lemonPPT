// lemonPPT - theme08 黑金实验 · 摘要 / Overview
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08OverviewV1Item {
  num: string;
  label: string;
  desc?: string;
}

export interface Theme08OverviewV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme08OverviewV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08OverviewV1Meta: LayoutMeta = {
  id: 'theme08_overview_v1',
  theme: 'theme08',
  role: 'stats',
  displayName: 'Theme 08 摘要总览',
  description: '顶部标题 + 三栏数字摘要卡，适合开篇概览',
  needsMedia: false,
  tags: ['overview', 'summary', 'black-gold'],
  contentShape: 'overview',
};

export const theme08OverviewV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'EXECUTIVE SUMMARY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一页看懂核心结论' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '三条主线贯穿全年：资本集中、应用爆发、生态重排。' },
    {
      key: 'items',
      label: '摘要条目',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { num: '70%', label: '资金集中度', desc: '前 10% 项目吸纳七成新增资金' },
        { num: '2.1x', label: '应用层增速', desc: 'Agent 与垂直场景交易量同比' },
        { num: 'Top 3', label: '生态位', desc: '通用大模型占据榜单核心位置' },
      ],
      itemSchema: [
        { key: 'num', label: '数字', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'desc', label: '说明', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '06' },
  ],
};

export function Theme08OverviewV1(props: Theme08OverviewV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (items || []).slice(0, 6);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-overview">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="bolt" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-overview-grid lp-rise">
            {valid.map((it, i) => (
              <div key={i} className="lp-theme08-card lp-theme08-card-pad lp-theme08-overview-card" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="lp-theme08-overview-num"><EditableField prop={`items.${i}.num`} slideIdx={_slideIdx} editable={_editable} as="span">{it.num}</EditableField></div>
                <div className="lp-theme08-overview-label"><EditableField prop={`items.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{it.label}</EditableField></div>
                {it.desc && <div className="lp-theme08-overview-desc"><EditableField prop={`items.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="span">{it.desc}</EditableField></div>}
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
