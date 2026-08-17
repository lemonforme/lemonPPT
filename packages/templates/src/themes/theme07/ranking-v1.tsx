// lemonPPT - theme07 调研排名
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07MiniBars } from './decoration.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07RankingV1Entry {
  name: string;
  value: string;
  note?: string;
  accent?: boolean;
  progress?: number;
  category?: string;
}

export interface Theme07RankingV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  entries?: Theme07RankingV1Entry[];
  legend?: { label: string; color: string }[];
  footnote?: string;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07RankingV1Meta: LayoutMeta = {
  id: 'theme07_ranking_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 调研排名',
  description: '衬线标题 + 纵向排名条目，每条带进度条/数值/说明/图例',
  needsMedia: false,
  tags: ['ranking', 'list', 'research'],
  contentShape: 'ranking',
};

export const theme07RankingV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'TOP FUNDED COMPANIES' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'Top 10 融资公司' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '头部公司融资额显著领先，通用大模型占据榜单上方位置。' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'entries',
      label: '排名条目',
      type: 'array',
      minItems: 1,
      maxItems: 10,
      defaultValue: [
        { name: 'OpenAI', value: '66', note: '通用大模型', accent: true, progress: 100, category: '通用大模型' },
        { name: 'Anthropic', value: '65', note: '通用大模型', accent: true, progress: 98, category: '通用大模型' },
        { name: 'xAI', value: '50', note: '通用大模型', accent: true, progress: 76, category: '通用大模型' },
        { name: 'CoreWeave', value: '11', note: '基础设施', accent: false, progress: 17, category: '基础设施' },
        { name: 'SSI', value: '10', note: '通用大模型', accent: false, progress: 15, category: '通用大模型' },
        { name: 'Scale AI', value: '10', note: '基础设施', accent: false, progress: 15, category: '基础设施' },
        { name: 'Figure AI', value: '6.8', note: '具身智能', accent: false, progress: 10, category: '具身智能' },
        { name: 'Perplexity', value: '5.2', note: '垂直应用', accent: false, progress: 8, category: '垂直应用' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'note', label: '说明', type: 'text' },
        { key: 'accent', label: '高亮', type: 'boolean' },
        { key: 'progress', label: '进度(0-100)', type: 'number' },
        { key: 'category', label: '分类', type: 'text' },
      ],
    },
    {
      key: 'legend',
      label: '图例',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      defaultValue: [
        { label: '通用大模型', color: 'var(--lp-accent)' },
        { label: '基础设施', color: 'var(--lp-ink3)' },
        { label: '具身智能', color: 'var(--lp-accent-cool)' },
        { label: '垂直应用', color: 'var(--lp-accent-2)' },
      ],
      itemSchema: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'color', label: '颜色', type: 'text' },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'textarea', inlineEditable: true, defaultValue: '口径：以最大单笔融资计，单位亿美元。' },
    { key: 'focusIndex', label: '高亮序号', type: 'slider', min: 0, max: 9, defaultValue: 0 },
  ],
};

export function Theme07RankingV1(props: Theme07RankingV1Props): ReactNode {
  const { kicker, title, subtitle, unit, entries = [], legend = [], footnote, focusIndex = 0, _slideIdx, _editable } = props;
  const validEntries = (entries || []).slice(0, 10);
  const maxValue = Math.max(1, ...validEntries.map((e) => parseFloat(e.value) || 0));

  return (
    <div className="lp-slide lp-theme07 lp-theme07-ranking">
      <Theme07DecoNodes />
      <div className="lp-theme07-ranking-header lp-rise">
        <Theme07IconChip name="target" />
        {kicker && (
          <div className="lp-theme07-kicker">
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
          </div>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme07-underline" aria-hidden="true" />
      </div>
      <div className="lp-theme07-ranking-list lp-rise">
        {validEntries.map((entry, i) => {
          const progress = entry.progress ?? Math.round(((parseFloat(entry.value) || 0) / maxValue) * 100);
          return (
            <div key={i} className={`lp-theme07-rank-row ${(entry.accent || i === focusIndex) ? 'lp-focus accent' : ''}`} style={{ '--lp-rank-progress': `${progress}%`, animationDelay: `${i * 50}ms` } as React.CSSProperties}>
              {(entry.accent || i === focusIndex) && <span className="lp-focus-lens" aria-hidden="true" />}
              <div className="lp-theme07-rank-number">{String(i + 1).padStart(2, '0')}</div>
              <div className="lp-theme07-rank-name">
                <EditableField prop={`entries.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{entry.name}</EditableField>
                {entry.note && (
                  <span className="lp-theme07-rank-note">
                    <EditableField prop={`entries.${i}.note`} slideIdx={_slideIdx} editable={_editable} as="span">{entry.note}</EditableField>
                  </span>
                )}
              </div>
              <div className="lp-theme07-rank-value">
                <EditableField prop={`entries.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{entry.value}</EditableField>
                {unit && <span className="lp-theme07-rank-unit">{unit}</span>}
              </div>
            </div>
          );
        })}
      </div>
      {legend.length > 0 && (
        <div className="lp-theme07-ranking-legend lp-rise">
          {legend.map((item, i) => (
            <span key={i} className="lp-theme07-ranking-legend-item">
              <span className="lp-theme07-ranking-legend-dot" style={{ background: item.color }} />
              <EditableField prop={`legend.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{item.label}</EditableField>
            </span>
          ))}
        </div>
      )}
      {footnote && (
        <div className="lp-theme07-footer" style={{ width: 'auto', left: 'var(--lp-page-padding)', right: 'auto' }}>
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnote}</EditableField>
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
      <Theme07MiniBars count={24} />
    </div>
  );
}
