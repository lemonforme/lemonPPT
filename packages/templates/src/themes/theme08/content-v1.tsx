// lemonPPT - theme08 黑金实验 · 内容页
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08ContentV1Item {
  title: string;
  desc?: string;
}

export interface Theme08ContentV1Stat {
  num: string;
  label: string;
}

export interface Theme08ContentV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme08ContentV1Item[];
  stats?: Theme08ContentV1Stat[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08ContentV1Meta: LayoutMeta = {
  id: 'theme08_content_v1',
  theme: 'theme08',
  role: 'content',
  displayName: 'Theme 08 内容要点',
  description: '左要点列表 + 右数字侧栏，适合论据/洞察页',
  needsMedia: false,
  tags: ['content', 'insight', 'black-gold'],
  contentShape: 'content',
};

export const theme08ContentV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'KEY POINTS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三个关键结论' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '本章节提炼了支撑判断的核心论据。' },
    {
      key: 'items',
      label: '要点列表',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { title: '资本向头部集中', desc: '前 10% 项目吸纳七成新增资金，马太效应明显。' },
        { title: '应用层增速最快', desc: 'Agent 与垂直场景的早期交易量同比翻倍。' },
        { title: '退出周期拉长', desc: '平均退出周期延长至 7.4 年，流动性压力上升。' },
      ],
      itemSchema: [
        { key: 'title', label: '要点标题', type: 'text' },
        { key: 'desc', label: '要点说明', type: 'textarea' },
      ],
    },
    {
      key: 'stats',
      label: '右侧数字',
      type: 'array',
      minItems: 0,
      maxItems: 3,
      defaultValue: [
        { num: '+38%', label: '年度同比增长' },
        { num: '7.4y', label: '平均退出周期' },
      ],
      itemSchema: [
        { key: 'num', label: '数字', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '07' },
  ],
};

export function Theme08ContentV1(props: Theme08ContentV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], stats = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 6);
  const validStats = (stats || []).slice(0, 3);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-content">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="doc" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-content-split lp-rise">
            <div className="lp-theme08-list">
              {validItems.map((it, i) => (
                <div key={i} className="lp-theme08-list-item" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="lp-theme08-list-index">{String(i + 1).padStart(2, '0')}</div>
                  <div className="lp-theme08-list-text">
                    <div className="lp-theme08-list-title"><EditableField prop={`items.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{it.title}</EditableField></div>
                    {it.desc && <div className="lp-theme08-list-desc"><EditableField prop={`items.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="span">{it.desc}</EditableField></div>}
                  </div>
                </div>
              ))}
            </div>
            {validStats.length > 0 && (
              <div className="lp-theme08-content-aside">
                {validStats.map((s, i) => (
                  <div key={i} className="lp-theme08-content-aside-stat">
                    <div className="lp-theme08-content-aside-num"><EditableField prop={`stats.${i}.num`} slideIdx={_slideIdx} editable={_editable} as="span">{s.num}</EditableField></div>
                    <div className="lp-theme08-content-aside-label"><EditableField prop={`stats.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{s.label}</EditableField></div>
                  </div>
                ))}
              </div>
            )}
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
