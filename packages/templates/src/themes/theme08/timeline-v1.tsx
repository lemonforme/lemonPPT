// lemonPPT - theme08 黑金实验 · 时间轴
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08TimelineV1Item {
  year: string;
  title: string;
  desc?: string;
}

export interface Theme08TimelineV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme08TimelineV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08TimelineV1Meta: LayoutMeta = {
  id: 'theme08_timeline_v1',
  theme: 'theme08',
  role: 'timeline',
  displayName: 'Theme 08 时间轴',
  description: '纵向年度时间轴 + 节点卡片，适合历程/里程碑',
  needsMedia: false,
  tags: ['timeline', 'milestone', 'black-gold'],
  contentShape: 'timeline',
};

export const theme08TimelineV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'MILESTONES' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '关键里程碑' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '三年三步，从原型到规模化的跃迁。' },
    {
      key: 'items',
      label: '时间节点',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { year: '2023', title: '原型验证', desc: '完成首版训练栈与最小可用产品。' },
        { year: '2024', title: '规模扩张', desc: '算力规模扩大 5 倍，客户破百。' },
        { year: '2025', title: '商业闭环', desc: 'ARR 突破亿美元，毛利率转正。' },
        { year: '2026', title: '生态输出', desc: '开放平台，构建第三方开发者网络。' },
      ],
      itemSchema: [
        { key: 'year', label: '年份', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'desc', label: '说明', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '73' },
  ],
};

export function Theme08TimelineV1(props: Theme08TimelineV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (items || []).slice(0, 6);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-timeline-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="bolt" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-timeline lp-rise">
            <div className="lp-theme08-timeline-track" aria-hidden="true" />
            {valid.map((it, i) => (
              <div key={i} className="lp-theme08-timeline-row" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="lp-theme08-timeline-year"><EditableField prop={`items.${i}.year`} slideIdx={_slideIdx} editable={_editable} as="span">{it.year}</EditableField></div>
                <div className="lp-theme08-timeline-card">
                  <div className="lp-theme08-timeline-title"><EditableField prop={`items.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{it.title}</EditableField></div>
                  {it.desc && <div className="lp-theme08-timeline-desc"><EditableField prop={`items.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="span">{it.desc}</EditableField></div>}
                </div>
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
