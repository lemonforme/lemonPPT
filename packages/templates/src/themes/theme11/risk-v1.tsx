// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 风险矩阵页（risk_v1）
 * 情绪：sunset | 骨架：grid
 * 5×5 风险矩阵 + 风险项卡片，颜色标识等级。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11RiskV1Item {
  name: string;
  likelihood: number;
  impact: number;
  level?: string;
}

export interface Theme11RiskV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: Theme11RiskV1Item[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11RiskV1Meta: LayoutMeta = {
  id: 'theme11_risk_v1',
  theme: 'theme11',
  role: 'metric',
  displayName: 'Theme 11 风险矩阵页',
  description: '5×5 风险矩阵 + 风险项卡片',
  needsMedia: false,
  tags: ['risk', 'matrix', 'grid', 'light-stream'],
  contentShape: 'matrix',
};

export const theme11RiskV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '项目风险评估' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按发生概率与影响程度定位关键风险' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'RISK MATRIX' },
    {
      key: 'items',
      label: '风险项',
      type: 'array',
      maxItems: 8,
      defaultValue: [
        { name: '需求变更', likelihood: 4, impact: 4, level: '高' },
        { name: '资源不足', likelihood: 3, impact: 4, level: '高' },
        { name: '第三方延期', likelihood: 4, impact: 3, level: '中高' },
        { name: '技术债务', likelihood: 3, impact: 3, level: '中' },
        { name: '合规审查', likelihood: 2, impact: 5, level: '高' },
        { name: '用户流失', likelihood: 2, impact: 2, level: '低' },
      ],
      itemSchema: [
        { key: 'name', label: '风险', type: 'text' },
        { key: 'likelihood', label: '可能性 1-5', type: 'number' },
        { key: 'impact', label: '影响 1-5', type: 'number' },
        { key: 'level', label: '等级', type: 'text' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'sunset' },
  ],
};

function riskColor(l: number, i: number): string {
  const score = (l ?? 0) * (i ?? 0);
  if (score >= 12) return 'var(--lp-red)';
  if (score >= 8) return 'var(--lp-orange)';
  if (score >= 4) return 'var(--lp-accent)';
  return 'var(--lp-green)';
}

export function Theme11RiskV1(props: Theme11RiskV1Props): ReactNode {
  const { title, subtitle, eyebrow, items = [], mood = 'sunset', _slideIdx: s, _editable: e } = props;
  const validItems = (items || []).filter((n): n is Theme11RiskV1Item => n != null).slice(0, 8);

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-risk">
      <div className="lp-theme11-risk-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="orange"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-risk-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-risk-body">
        <div className="lp-theme11-risk-matrix lp-rise">
          <div className="lp-theme11-risk-axis-y">影响程度</div>
          <div className="lp-theme11-risk-grid">
            {[5, 4, 3, 2, 1].map((y) => (
              <div key={y} className="lp-theme11-risk-row">
                <span className="lp-theme11-risk-y-label">{y}</span>
                {[1, 2, 3, 4, 5].map((x) => {
                  const hits = validItems.filter((it) => it.impact === y && it.likelihood === x);
                  return (
                    <div key={x} className="lp-theme11-risk-cell" style={{ background: `color-mix(in srgb, ${riskColor(x, y)} 12%, transparent)` }}>
                      {hits.map((it, idx) => (
                        <span key={idx} className="lp-theme11-risk-chip" style={{ background: riskColor(it.likelihood, it.impact) }}>
                          {it.name}
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="lp-theme11-risk-x-labels">
              <span />{[1, 2, 3, 4, 5].map((x) => <span key={x} className="lp-theme11-risk-x-label">{x}</span>)}
            </div>
          </div>
          <div className="lp-theme11-risk-axis-x">发生概率</div>
        </div>
        <div className="lp-theme11-risk-list">
          {validItems.map((item, i) => (
            <Card key={i} className="lp-theme11-risk-card lp-rise" padding="medium" style={{ animationDelay: `${i * 70}ms`, borderTop: `4px solid ${riskColor(item.likelihood, item.impact)}` }}>
              <EditableField prop={`items.${i}.name`} slideIdx={s} editable={e} as="h4" className="lp-theme11-risk-card-name">{item.name}</EditableField>
              <div className="lp-theme11-risk-card-meta">
                <span>概率 <EditableField prop={`items.${i}.likelihood`} slideIdx={s} editable={e} as="span">{item.likelihood}</EditableField></span>
                <span>影响 <EditableField prop={`items.${i}.impact`} slideIdx={s} editable={e} as="span">{item.impact}</EditableField></span>
                <span className="lp-theme11-risk-card-level" style={{ color: riskColor(item.likelihood, item.impact) }}>
                  <EditableField prop={`items.${i}.level`} slideIdx={s} editable={e} as="span">{item.level}</EditableField>
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
