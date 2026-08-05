// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03RankingV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  items?: Array<{ rank: string; name: string; category: string; value: string; maxValue?: string }>;
  insightLabel?: string;
  insightText?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03RankingV1Meta: LayoutMeta = {
  id: 'theme03_ranking_v1',
  theme: 'theme03',
  role: 'metric',
  displayName: 'Theme 03 编辑风排名',
  description: '深色代码编辑风排名页，序号 + 名称 + 类别 + 横向进度条 + 数值',
  needsMedia: false,
  tags: ['ranking', 'list', 'comparison'],
  contentShape: 'ranked-list',
};

export const theme03RankingV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '横向透视' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '04' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '单笔最大融资 · 单位：亿美元' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{头部玩家}} 融资排名' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true },
    {
      key: 'items',
      label: '排名项',
      type: 'array',
      itemSchema: [
        { key: 'rank', label: '排名', type: 'text' },
        { key: 'name', label: '名称', type: 'text' },
        { key: 'category', label: '类别', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'maxValue', label: '最大值（用于进度条）', type: 'text' },
      ],
    },
    { key: 'insightLabel', label: '洞察标签', type: 'text', inlineEditable: true, defaultValue: '集中度' },
    { key: 'insightText', label: '洞察文字', type: 'textarea', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-ranking-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03RankingV1(props: Theme03RankingV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, unit, items, insightLabel, insightText, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  const max = items && items.length > 0
    ? Math.max(...items.map((i) => Number(i.maxValue || i.value) || 0))
    : 0;

  return (
    <div className="lp-slide lp-theme03-ranking-v1">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-ranking-main">
        <div className="lp-theme03-ranking-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-ranking-subtitle">{subtitle}</EditableField>}
        </div>

        {items && items.length > 0 && (
          <div className="lp-theme03-ranking-list lp-rise">
            {items.map((item, idx) => {
              const isFirst = idx === 0;
              const pct = max ? ((Number(item.value) || 0) / max) * 100 : 0;
              return (
                <div key={idx} className={`lp-theme03-ranking-row ${isFirst ? 'lp-theme03-ranking-row--top' : ''}`}>
                  <div className="lp-theme03-ranking-meta">
                    <EditableField prop={`items.${idx}.rank`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-ranking-rank">{item.rank}</EditableField>
                    <EditableField prop={`items.${idx}.name`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-ranking-name">{item.name}</EditableField>
                    <EditableField prop={`items.${idx}.category`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-ranking-category">{item.category}</EditableField>
                    <div className="lp-theme03-ranking-value">
                      <EditableField prop={`items.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{item.value}</EditableField>
                      {unit && <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-ranking-unit">{unit}</EditableField>}
                    </div>
                  </div>
                  <div className="lp-theme03-ranking-bar-wrap">
                    <div
                      className="lp-theme03-ranking-bar"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {(insightLabel || insightText || _editable) && (
          <div className="lp-theme03-ranking-insight lp-rise">
            {(insightLabel || _editable) && (
              <EditableField prop="insightLabel" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-ranking-insight-label">{insightLabel}</EditableField>
            )}
            {(insightText || _editable) && (
              <EditableField prop="insightText" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-ranking-insight-text">{insightText}</EditableField>
            )}
          </div>
        )}
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
