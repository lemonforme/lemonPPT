// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9Rgba } from './chart-utils.js';

export interface Theme09HeroNumberV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  unit?: string;
  footnote?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09HeroNumberV1Meta: LayoutMeta = {
  id: 'theme09_hero_number_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '核心数字',
  description: '巨型数字 + 单位 + 三行注解，专色分隔线，墨底',
  needsMedia: false,
  tags: ['chart', 'stat', 'single-number', 'hero'],
  contentShape: 'single-stat',
};

export const theme09HeroNumberV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '核心指标' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'HERO NUMBER' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '07' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '关键数' },
    { key: 'title', label: '主数字', type: 'text', inlineEditable: true, defaultValue: '68.4' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '%' },
    {
      key: 'subtitle',
      label: '三行注解（换行分隔）',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '全球企业已将生成式 AI 纳入年度预算\n较去年同期提升 23 个百分点\n样本覆盖 42 个国家 3,800 家企业',
    },
    { key: 'footnote', label: '数字旁注', type: 'text', inlineEditable: true, defaultValue: '同比 +23.1pt' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_TITLE = '68.4';
const DEFAULT_UNIT = '%';
const DEFAULT_NOTES = '全球企业已将生成式 AI 纳入年度预算\n较去年同期提升 23 个百分点\n样本覆盖 42 个国家 3,800 家企业';

export function Theme09HeroNumberV1(props: Theme09HeroNumberV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    unit,
    footnote,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('ink');
  const num = title && title.trim() ? title : DEFAULT_TITLE;
  const u = unit && unit.trim() ? unit : DEFAULT_UNIT;
  const notes = (subtitle && subtitle.trim() ? subtitle : DEFAULT_NOTES)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-hero-number">
      <T9ChartShell
        slideIdx={_slideIdx}
        editable={_editable}
        footnoteLeft={footnoteLeft}
        footnoteRight={footnoteRight}
        head={
          <T9ChartHeader
            section={section}
            sectionEn={sectionEn}
            mark={mark}
            kicker={kicker}
            slideIdx={_slideIdx}
            editable={_editable}
          />
        }
        body={
          <div
            className="lp-theme09-hero-number-body"
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1 1 auto',
              minHeight: 0,
              justifyContent: 'center',
              gap: '22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '18px', lineHeight: 1 }}>
              <div
                style={{
                  fontFamily: c.fontHeading,
                  fontWeight: 700,
                  fontSize: '208px',
                  lineHeight: 0.86,
                  letterSpacing: '-0.045em',
                  color: c.ink,
                }}
              >
                <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="span">
                  {num}
                </EditableField>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  paddingBottom: '26px',
                }}
              >
                <div style={{ fontFamily: c.fontHeading, fontSize: '54px', fontWeight: 700, color: c.accent, lineHeight: 1 }}>
                  <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span">
                    {u}
                  </EditableField>
                </div>
                {footnote && (
                  <div
                    style={{
                      fontFamily: c.fontMono,
                      fontSize: '14px',
                      letterSpacing: '.08em',
                      color: c.ink3,
                      borderTop: `1px solid ${t9Rgba(c.accent, 0.55)}`,
                      paddingTop: '8px',
                    }}
                  >
                    <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">
                      {footnote}
                    </EditableField>
                  </div>
                )}
              </div>
            </div>

            <div style={{ height: '2px', width: '148px', background: c.accent, flex: '0 0 auto' }} />

            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="div">
              <span style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '760px' }}>
                {notes.map((line, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                    <span
                      style={{
                        fontFamily: c.fontMono,
                        fontSize: '12px',
                        color: c.accent,
                        letterSpacing: '.12em',
                        minWidth: '22px',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontFamily: c.font, fontSize: '17px', lineHeight: 1.6, color: c.ink2 }}>{line}</span>
                  </span>
                ))}
              </span>
            </EditableField>
          </div>
        }
      />
    </Sheet>
  );
}
