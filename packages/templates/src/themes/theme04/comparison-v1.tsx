// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04ComparisonV1Item {
  title: string;
  description?: string;
}

export interface Theme04ComparisonV1Side {
  label: string;
  tone: 'green' | 'pink';
  icon: 'check' | 'cross';
  title: string;
  items: Theme04ComparisonV1Item[];
}

export interface Theme04ComparisonV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  sides?: Theme04ComparisonV1Side[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ComparisonV1Meta: LayoutMeta = {
  id: 'theme04_comparison_v1',
  theme: 'theme04',
  role: 'comparison',
  displayName: 'Theme 04 双栏策略对比',
  description: '左右两栏糖果色玻璃卡片，适合投资策略/优劣对比',
  needsMedia: false,
  tags: ['comparison', 'strategy', 'candy'],
  contentShape: 'two-column-compare',
};

export const theme04ComparisonV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '投资展望 · 策略对比' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '退潮之后，谁能{{留在牌桌}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从确定性、估值泡沫与商业闭环三个维度，划分机会与风险。' },
    {
      key: 'sides',
      label: '对比项',
      type: 'array',
      minItems: 2,
      maxItems: 2,
      defaultValue: [
        {
          label: '看好方向',
          tone: 'green',
          icon: 'check',
          title: '有商业闭环 · 确定性强',
          items: [
            { title: '垂直应用', description: '商业模式清晰、已验证 PMF，如 Glean、Harvey。' },
            { title: '基础设施中游', description: '数据标注、向量数据库等"卖铲子"环节，如 Scale AI、Pinecone。' },
            { title: '具身智能', description: '人形机器人、自动驾驶等长周期硬科技，如 Figure AI。' },
          ],
        },
        {
          label: '谨慎对待',
          tone: 'pink',
          icon: 'cross',
          title: '泡沫高 · 壁垒低',
          items: [
            { title: '高估值无收入纯模型', description: '烧钱速度快、竞争壁垒低、估值泡沫大。' },
            { title: '跟风的"AI 包装"项目', description: '仅在传统业务上加一层 LLM 调用，无核心壁垒。' },
            { title: '无数据护城河的消费应用', description: '用户迁移成本低，易被大厂直接复制。' },
          ],
        },
      ],
      itemSchema: [
        { key: 'label', label: '栏目标题', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }] },
        { key: 'icon', label: '图标', type: 'select', options: [{ value: 'check', label: '对勾' }, { value: 'cross', label: '叉号' }] },
        { key: 'title', label: '副标题', type: 'text' },
        {
          key: 'items',
          label: '条目',
          type: 'array',
          minItems: 1,
          maxItems: 5,
          itemSchema: [
            { key: 'title', label: '标题', type: 'text' },
            { key: 'description', label: '说明', type: 'textarea' },
          ],
        },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-comparison-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconCross() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function Theme04ComparisonV1(props: Theme04ComparisonV1Props): ReactNode {
  const { kicker, title, subtitle, sides, _slideIdx, _editable } = props;
  const safeSides = (sides ?? []).slice(0, 2);

  return (
    <div className="lp-slide lp-theme04-comparison">
      <div className="lp-theme04-comparison-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-comparison-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-comparison-grid lp-rise">
        {safeSides.map((side, sideIdx) => (
          <div key={sideIdx} className={`lp-theme04-comparison-card lp-theme04-card lp-theme04-card--${side.tone ?? 'green'}`}>
            <div className="lp-theme04-comparison-card-header">
              <span className={`lp-theme04-comparison-icon lp-theme04-comparison-icon--${side.icon ?? 'check'}`}>
                {side.icon === 'cross' ? <IconCross /> : <IconCheck />}
              </span>
              <div className="lp-theme04-comparison-card-titles">
                <EditableField prop={`sides.${sideIdx}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-comparison-card-label">{side.label}</EditableField>
                <EditableField prop={`sides.${sideIdx}.title`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-comparison-card-subtitle">{side.title}</EditableField>
              </div>
            </div>
            <div className="lp-theme04-comparison-items">
              {(side.items ?? []).slice(0, 5).map((item, itemIdx) => (
                <div key={itemIdx} className="lp-theme04-comparison-item">
                  <span className="lp-theme04-comparison-bullet" />
                  <div>
                    <EditableField prop={`sides.${sideIdx}.items.${itemIdx}.title`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-comparison-item-title">{item.title}</EditableField>
                    {item.description && (
                      <EditableField prop={`sides.${sideIdx}.items.${itemIdx}.description`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-comparison-item-desc">{item.description}</EditableField>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
