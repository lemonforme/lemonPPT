// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 论点推演（thesis_v1）
 * 基底：纸 | 骨架：column-3 | 图位：—
 *
 * 论点 → 论据 → 结论三段推演，栏间以专色箭头衔接，底部收口结论带。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Masthead, Sheet } from './shared.js';

export interface Theme09ThesisStep {
  claim?: string;
  evidence?: string;
}

export interface Theme09ThesisV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  steps?: Theme09ThesisStep[];
  conclusion?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ThesisV1Meta: LayoutMeta = {
  id: 'theme09_thesis_v1',
  theme: 'theme09',
  role: 'process',
  displayName: '论点推演',
  description: '论点→论据→结论三段推演，编号圆章 + 专色箭头衔接，纸底',
  needsMedia: false,
  tags: ['process', 'thesis', 'argument', 'logic'],
  contentShape: 'thesis',
};

export const theme09ThesisV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '论点推演' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'THESIS' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '04' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '从产业事实到投资判断的三步推演' },
    {
      key: 'steps',
      label: '推演步骤',
      type: 'array',
      maxItems: 3,
      itemSchema: [
        { key: 'claim', label: '步骤标题', type: 'text' },
        { key: 'evidence', label: '论述正文', type: 'textarea' },
      ],
    },
    {
      key: 'conclusion',
      label: '推演结论',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '因此，本轮配置应向具备交付闭环的应用层倾斜，而非继续加码通用底座。',
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '推演 · 论点' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '19' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_STEPS: Theme09ThesisStep[] = [
  {
    claim: '论点 · 底座产能已过剩',
    evidence: '通用大模型底座的训练算力供给在十二个月内增长 2.4 倍，而调用侧需求仅增长 0.8 倍，供需缺口首次转为正值。',
  },
  {
    claim: '论据 · 溢价迁移到交付',
    evidence: '同一批客户的付费结构中，模型订阅占比由 61% 降至 38%，实施、集成与运维服务占比升至 47%，溢价来源发生位移。',
  },
  {
    claim: '结论 · 押注应用层闭环',
    evidence: '具备行业数据与交付队伍的应用层主体，毛利率高出底座厂商 14 个百分点，且续约率稳定在九成以上。',
  },
];

const DEFAULT_CONCLUSION = '因此，本轮配置应向具备交付闭环的应用层倾斜，而非继续加码通用底座。';

function Arrow(): ReactNode {
  return (
    <span
      aria-hidden="true"
      style={{ flex: 'none', width: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
    >
      <svg width="26" height="14" viewBox="0 0 26 14" role="presentation">
        <path d="M0 7 H19" stroke="var(--lp-accent)" strokeWidth="1.5" fill="none" />
        <path d="M18 1.5 L25 7 L18 12.5 Z" fill="var(--lp-accent)" />
      </svg>
    </span>
  );
}

export function Theme09ThesisV1(props: Theme09ThesisV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    steps = [],
    conclusion,
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (steps.length ? steps : DEFAULT_STEPS).slice(0, 3);
  const text = conclusion ?? DEFAULT_CONCLUSION;

  return (
    <Sheet substrate="paper" frame="column-3" className="lp-theme09-thesis">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 22, padding: '96px 60px 70px' }}>
        {title && (
          <h2
            className="lp-t9-serif"
            style={{ margin: 0, fontSize: 34, fontWeight: 700, lineHeight: 1.24, color: 'var(--lp-ink)', letterSpacing: '0.01em' }}
          >
            <EditableField prop="title" slideIdx={s} editable={e} as="span">
              {title}
            </EditableField>
          </h2>
        )}

        <div style={{ display: 'flex', alignItems: 'stretch', flex: '1 1 auto', minHeight: 0 }}>
          {list.map((step, i) => (
            <Fragment key={i}>
              {i > 0 && <Arrow />}
              <article
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  paddingTop: 4,
                  borderTop: `2px solid ${i === list.length - 1 ? 'var(--lp-accent)' : 'var(--lp-t9-rule-strong)'}`,
                }}
              >
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    border: `1.5px solid ${i === list.length - 1 ? 'var(--lp-accent)' : 'var(--lp-t9-rule-strong)'}`,
                    color: i === list.length - 1 ? 'var(--lp-accent)' : 'var(--lp-ink2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--lp-font-mono)',
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    marginTop: 10,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3
                  className="lp-t9-serif"
                  style={{ margin: 0, fontSize: 20, fontWeight: 700, lineHeight: 1.35, color: 'var(--lp-ink)' }}
                >
                  <EditableField prop={`steps.${i}.claim`} slideIdx={s} editable={e} as="span">
                    {step.claim ?? ''}
                  </EditableField>
                </h3>

                <span style={{ display: 'block', width: 46, height: 1, background: 'var(--lp-t9-rule)' }} aria-hidden="true" />

                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.78, color: 'var(--lp-ink2)', paddingRight: 8 }}>
                  <EditableField prop={`steps.${i}.evidence`} slideIdx={s} editable={e} as="span">
                    {step.evidence ?? ''}
                  </EditableField>
                </p>
              </article>
            </Fragment>
          ))}
        </div>

        <div
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            borderLeft: '4px solid var(--lp-accent)',
            background: 'var(--lp-surface)',
            padding: '18px 24px',
          }}
        >
          <span
            style={{
              flex: 'none',
              fontFamily: 'var(--lp-font-mono)',
              fontSize: 11,
              letterSpacing: '0.2em',
              color: 'var(--lp-accent)',
              writingMode: 'horizontal-tb',
            }}
          >
            Q.E.D.
          </span>
          <p className="lp-t9-serif" style={{ margin: 0, fontSize: 19, lineHeight: 1.5, fontWeight: 600, color: 'var(--lp-ink)' }}>
            <EditableField prop="conclusion" slideIdx={s} editable={e} as="span">
              {text}
            </EditableField>
          </p>
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
