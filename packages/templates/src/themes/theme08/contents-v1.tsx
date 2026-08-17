// lemonPPT - theme08 黑金实验 · 结构 / 目录
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08ContentsV1Item {
  title: string;
}

export interface Theme08ContentsV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme08ContentsV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08ContentsV1Meta: LayoutMeta = {
  id: 'theme08_contents_v1',
  theme: 'theme08',
  role: 'tableOfContents',
  displayName: 'Theme 08 结构目录',
  description: '编号目录列表，双列排布，适合议程/结构页',
  needsMedia: false,
  tags: ['contents', 'agenda', 'black-gold'],
  contentShape: 'contents',
};

export const theme08ContentsV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CONTENTS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '本场内容结构' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '四大板块，从趋势洞察到落地路线图。' },
    {
      key: 'items',
      label: '目录条目',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { title: '市场全景与趋势' },
        { title: '产业链与技术架构' },
        { title: '资本与生态格局' },
        { title: '风险与落地路线' },
        { title: '典型案例拆解' },
        { title: '区域分布与团队' },
      ],
      itemSchema: [{ key: 'title', label: '标题', type: 'text' }],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '03' },
  ],
};

export function Theme08ContentsV1(props: Theme08ContentsV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (items || []).slice(0, 8);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-contents-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="target" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-contents lp-rise">
            {valid.map((it, i) => (
              <div key={i} className="lp-theme08-contents-item" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="lp-theme08-contents-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="lp-theme08-contents-title"><EditableField prop={`items.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{it.title}</EditableField></div>
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
