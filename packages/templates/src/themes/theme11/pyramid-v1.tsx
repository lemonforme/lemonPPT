// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 金字塔层级页（pyramid_v1）
 * 情绪：sunset | 骨架：grid
 * 上窄下宽的梯形层级，颜色由冷到暖递进。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11PyramidV1Level {
  title: string;
  description?: string;
  value?: string;
}

export interface Theme11PyramidV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  levels?: Theme11PyramidV1Level[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11PyramidV1Meta: LayoutMeta = {
  id: 'theme11_pyramid_v1',
  theme: 'theme11',
  role: 'process',
  displayName: 'Theme 11 金字塔层级页',
  description: '上窄下宽的梯形层级，颜色递进',
  needsMedia: false,
  tags: ['pyramid', 'hierarchy', 'grid', 'light-stream'],
  contentShape: 'hierarchy',
};

export const theme11PyramidV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '能力金字塔' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从基础数据到智能决策的逐层构建' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'PYRAMID' },
    {
      key: 'levels',
      label: '层级',
      type: 'array',
      maxItems: 5,
      defaultValue: [
        { title: '战略决策', description: 'AI 驱动的业务洞察', value: 'L5' },
        { title: '预测分析', description: '趋势预判与风险预警', value: 'L4' },
        { title: '智能归因', description: '多维度因子拆解', value: 'L3' },
        { title: '数据整合', description: '多源数据统一治理', value: 'L2' },
        { title: '数据采集', description: '全链路实时采集', value: 'L1' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'value', label: '层级标识', type: 'text' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'sunset' },
  ],
};

const tones: Array<'cyan' | 'blue' | 'violet' | 'orange' | 'green'> = ['cyan', 'blue', 'violet', 'orange', 'green'];

export function Theme11PyramidV1(props: Theme11PyramidV1Props): ReactNode {
  const { title, subtitle, eyebrow, levels = [], mood = 'sunset', _slideIdx: s, _editable: e } = props;
  const validLevels = (levels || []).filter((n): n is Theme11PyramidV1Level => n != null).slice(0, 5);

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-pyramid">
      <div className="lp-theme11-pyramid-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="orange"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-pyramid-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-pyramid-stack">
        {validLevels.map((level, i) => {
          const idx = validLevels.length - 1 - i;
          const width = 28 + idx * 18;
          return (
            <div
              key={i}
              className={`lp-theme11-pyramid-level lp-rise lp-theme11-pyramid-level-${tones[idx % tones.length]}`}
              style={{ width: `${width}%`, animationDelay: `${i * 80}ms` }}
            >
              <div className="lp-theme11-pyramid-level-inner">
                <div className="lp-theme11-pyramid-level-main">
                  <EditableField prop={`levels.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme11-pyramid-level-title">{level.title}</EditableField>
                  {level.description && <EditableField prop={`levels.${i}.description`} slideIdx={s} editable={e} as="p" className="lp-theme11-pyramid-level-desc">{level.description}</EditableField>}
                </div>
                {level.value && (
                  <span className="lp-theme11-pyramid-level-badge">
                    <EditableField prop={`levels.${i}.value`} slideIdx={s} editable={e} as="span">{level.value}</EditableField>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}
