// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 记分卡（scorecard_v1）
 * 情绪：daylight | 骨架：grid
 * 左侧总分环形 + 右侧维度进度条。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11ScorecardV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  score?: string;
  scoreLabel?: string;
  dimensions?: { label: string; value: number; max?: number; tone?: 'accent' | 'violet' | 'orange' | 'green' }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ScorecardV1Meta: LayoutMeta = {
  id: 'theme11_scorecard_v1',
  theme: 'theme11',
  role: 'stats',
  displayName: 'Theme 11 记分卡',
  description: '总分环形 + 多维度进度条',
  needsMedia: false,
  tags: ['stats', 'scorecard', 'grid', 'light-stream'],
  contentShape: 'scorecard',
};

const TONE_VARS: Record<string, string> = {
  accent: 'var(--lp-accent)',
  violet: 'var(--lp-violet)',
  orange: 'var(--lp-orange)',
  green: 'var(--lp-green)',
};

export const theme11ScorecardV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'SCORECARD' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '产品成熟度评分' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '五个关键维度的综合评估' },
    { key: 'score', label: '总分', type: 'text', defaultValue: '86' },
    { key: 'scoreLabel', label: '总分标签', type: 'text', defaultValue: '综合得分' },
    {
      key: 'dimensions',
      label: '维度',
      type: 'array',
      maxItems: 5,
      defaultValue: [
        { label: '功能完整性', value: 88, max: 100, tone: 'accent' },
        { label: '用户体验', value: 82, max: 100, tone: 'violet' },
        { label: '性能表现', value: 90, max: 100, tone: 'green' },
        { label: '安全合规', value: 85, max: 100, tone: 'orange' },
        { label: '可扩展性', value: 78, max: 100, tone: 'accent' },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '当前值', type: 'number' },
        { key: 'max', label: '最大值', type: 'number' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'accent', label: 'accent' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }] },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ScorecardV1(props: Theme11ScorecardV1Props): ReactNode {
  const { title, subtitle, eyebrow, score, scoreLabel, dimensions = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const pct = Math.min(100, Math.max(0, Number(score ?? 0)));
  const r = 70;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-scorecard">
      <div className="lp-theme11-scorecard-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-scorecard-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-scorecard-body">
        <Card className="lp-theme11-scorecard-ring-card lp-rise" padding="large">
          <svg viewBox="0 0 180 180" className="lp-theme11-scorecard-ring">
            <circle cx="90" cy="90" r={r} className="lp-theme11-scorecard-ring-bg" />
            <circle cx="90" cy="90" r={r} className="lp-theme11-scorecard-ring-progress" strokeDasharray={`${dash} ${c}`} />
          </svg>
          <div className="lp-theme11-scorecard-ring-center">
            <EditableField prop="score" slideIdx={s} editable={e} as="div" className="lp-theme11-scorecard-score">{score}</EditableField>
            <EditableField prop="scoreLabel" slideIdx={s} editable={e} as="div" className="lp-theme11-scorecard-score-label">{scoreLabel}</EditableField>
          </div>
        </Card>
        <div className="lp-theme11-scorecard-dimensions">
          {dimensions.slice(0, 5).map((d, i) => {
            const max = Math.max(1, Number(d.max ?? 100));
            const val = Math.min(max, Math.max(0, Number(d.value ?? 0)));
            const width = `${(val / max) * 100}%`;
            return (
              <div key={i} className="lp-theme11-scorecard-dimension lp-rise" style={{ animationDelay: `${i * 70}ms` } as React.CSSProperties}>
                <div className="lp-theme11-scorecard-dimension-top">
                  <EditableField prop={`dimensions.${i}.label`} slideIdx={s} editable={e} as="span">{d.label}</EditableField>
                  <span className="lp-theme11-scorecard-dimension-value" style={{ color: TONE_VARS[d.tone ?? 'accent'] }}>{val}/{max}</span>
                </div>
                <div className="lp-theme11-scorecard-bar-bg">
                  <div className="lp-theme11-scorecard-bar-fill" style={{ width, background: TONE_VARS[d.tone ?? 'accent'] } as React.CSSProperties} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Sheet>
  );
}
