// lemonPPT - theme08 黑金实验 · 记分卡
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface ScoreCard {
  label: string;
  value: string;
  change?: string;
  changeDir?: 'up' | 'down';
  desc?: string;
  highlight?: boolean;
}

export interface Theme08ScorecardV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  cards?: ScoreCard[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08ScorecardV1Meta: LayoutMeta = {
  id: 'theme08_scorecard_v1',
  theme: 'theme08',
  role: 'metric',
  displayName: 'Theme 08 记分卡',
  description: '2×2 指标记分卡，大数字 + 变化箭头 + 描述，主指标荧光金高亮',
  needsMedia: false,
  tags: ['scorecard', 'metrics', 'kpi', 'black-gold'],
  contentShape: 'scorecard',
};

export const theme08ScorecardV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SCORECARD' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心指标记分卡' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '' },
    {
      key: 'cards',
      label: '记分卡',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { label: '年度总收入', value: '¥128 亿', change: '+23%', changeDir: 'up', desc: '同比增长主要来自企业端与大模型授权收入', highlight: true },
        { label: '活跃用户', value: '4,200 万', change: '+18%', changeDir: 'up', desc: '移动端增长显著，桌面端保持稳定' },
        { label: '毛利率', value: '67.2%', change: -2.1, changeDir: 'down', desc: '研发投入加大导致毛利略有收窄' },
        { label: 'NPS 评分', value: '72', change: 5, changeDir: 'up', desc: '客户满意度持续提升，支持响应速度获好评' },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'change', label: '变化', type: 'text' },
        { key: 'changeDir', label: '方向', type: 'select', options: [{ value: 'up', label: '升' }, { value: 'down', label: '降' }] },
        { key: 'desc', label: '描述', type: 'textarea' },
        { key: 'highlight', label: '强调', type: 'boolean' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '24' },
  ],
};

export function Theme08ScorecardV1(props: Theme08ScorecardV1Props): ReactNode {
  const { kicker, title, subtitle, cards = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (cards || []).slice(0, 4);
  const fmtChange = (c?: string | number) =>
    typeof c === 'number' ? `${c > 0 ? '+' : ''}${c}` : (c ?? '');
  return (
    <div className="lp-slide lp-theme08 lp-theme08-scorecard-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="target" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body lp-theme08-scorecard-grid">
          {valid.map((c, i) => {
            const dir = c.changeDir === 'down' ? 'down' : 'up';
            const arrow = dir === 'up' ? '↑' : '↓';
            return (
              <div key={i} className={`lp-theme08-scorecard-card lp-rise ${c.highlight ? 'highlight' : ''}`} style={{ animationDelay: `${i * 70}ms` }}>
                <div className="lp-theme08-scorecard-label"><EditableField prop={`cards.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{c.label}</EditableField></div>
                <div className="lp-theme08-scorecard-value"><EditableField prop={`cards.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{c.value}</EditableField></div>
                {c.change !== undefined && c.change !== '' && (
                  <div className={`lp-theme08-scorecard-change ${dir}`}>
                    <span aria-hidden="true">{arrow}</span>
                    <EditableField prop={`cards.${i}.change`} slideIdx={_slideIdx} editable={_editable} as="span">{fmtChange(c.change)}</EditableField>
                  </div>
                )}
                {c.desc && <div className="lp-theme08-scorecard-desc"><EditableField prop={`cards.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="span">{c.desc}</EditableField></div>}
              </div>
            );
          })}
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
