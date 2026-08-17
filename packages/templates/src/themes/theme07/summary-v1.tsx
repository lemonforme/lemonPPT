// lemonPPT - theme07 调研摘要
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07MiniBars } from './decoration.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07SummaryV1Point {
  text: string;
}

export interface Theme07SummaryV1Metric {
  value: string;
  label: string;
}

export interface Theme07SummaryV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  points?: Theme07SummaryV1Point[];
  metrics?: Theme07SummaryV1Metric[];
  conclusion?: string;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07SummaryV1Meta: LayoutMeta = {
  id: 'theme07_summary_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 调研摘要',
  description: '左侧要点列表 + 右侧数据指标卡 + 结论面板，适合报告摘要',
  needsMedia: false,
  tags: ['summary', 'conclusion', 'research'],
  contentShape: 'summary',
};

export const theme07SummaryV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'EXECUTIVE SUMMARY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '报告摘要' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '2024 年美国 AI 初创公司融资全景回顾' },
    {
      key: 'points',
      label: '要点列表',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { text: '全年 AI 初创公司吸纳约 970 亿美元风险投资，单笔 ≥1 亿美元的大额融资事件达 97 笔。' },
        { text: '资本向头部集中，前 10 家公司占据全市场近 1/4 融资额。' },
        { text: '通用大模型赛道融资占比 43.3%，垂直应用与基础设施紧随其后。' },
        { text: '退出周期拉长，早期项目生存窗口收窄，商业模式验证成为核心门槛。' },
      ],
      itemSchema: [{ key: 'text', label: '要点', type: 'textarea', inlineEditable: true }],
    },
    {
      key: 'metrics',
      label: '关键指标',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      defaultValue: [
        { value: '970', label: '亿美元·全年融资' },
        { value: '97', label: '笔·大额事件' },
        { value: '≈10', label: '亿美元·平均单笔' },
        { value: '43.3%', label: '通用大模型占比' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '说明', type: 'text' },
      ],
    },
    { key: 'conclusion', label: '结论', type: 'textarea', inlineEditable: true, defaultValue: '2024 年是 AI 产业从「叙事驱动」转向「兑现驱动」的关键拐点。' },
    { key: 'footnote', label: '脚注', type: 'textarea', inlineEditable: true, defaultValue: '数据来源：CB Insights、PitchBook、Crunchbase 公开数据整理。' },
  ],
};

export function Theme07SummaryV1(props: Theme07SummaryV1Props): ReactNode {
  const { kicker, title, subtitle, points = [], metrics = [], conclusion, footnote, _slideIdx, _editable } = props;
  const validPoints = (points || []).slice(0, 6);
  const validMetrics = (metrics || []).slice(0, 4);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-summary">
      <Theme07DecoNodes />
      <div className="lp-theme07-summary-points lp-rise">
        <Theme07IconChip name="bulb" />
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
        <div className="lp-theme07-summary-list">
          {validPoints.map((p, i) => (
            <div key={i} className="lp-theme07-summary-point" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="lp-theme07-summary-point-dot" aria-hidden="true" />
              <EditableField prop={`points.${i}.text`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-summary-point-text">{p.text}</EditableField>
            </div>
          ))}
        </div>
      </div>
      <div className="lp-theme07-summary-aside lp-rise">
        {validMetrics.length > 0 && (
          <div className="lp-theme07-summary-metrics">
            {validMetrics.map((m, i) => (
              <div key={i} className="lp-theme07-summary-metric" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="lp-theme07-summary-metric-value">
                  <EditableField prop={`metrics.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{m.value}</EditableField>
                </div>
                <div className="lp-theme07-summary-metric-label">
                  <EditableField prop={`metrics.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{m.label}</EditableField>
                </div>
              </div>
            ))}
          </div>
        )}
        {conclusion && (
          <div className="lp-theme07-summary-conclusion">
            <div className="lp-theme07-kicker lp-theme07-kicker-accent">CONCLUSION</div>
            <EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-summary-conclusion-text">{conclusion}</EditableField>
          </div>
        )}
      </div>
      {footnote && (
        <div className="lp-theme07-footer" style={{ width: 'auto', left: 'var(--lp-page-padding)', right: 'auto' }}>
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnote}</EditableField>
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
      <Theme07MiniBars count={20} />
    </div>
  );
}
