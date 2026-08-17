// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 方案对照（plans_v1）
 * 基底：纸 | 骨架：column-3 | 图位：—
 *
 * 三方案对照卡片横排：标题 + 要点列表，推荐项以专色描边 + 角标标记，
 * 底部落一条对比结论栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Masthead, Sheet, normalizeStrings } from './shared.js';

export interface Theme09PlanItem {
  name?: string;
  summary?: string;
  points?: Array<string | { item?: string }>;
  recommended?: boolean;
}

export interface Theme09PlansV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  plans?: Theme09PlanItem[];
  conclusion?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09PlansV1Meta: LayoutMeta = {
  id: 'theme09_plans_v1',
  theme: 'theme09',
  role: 'comparison',
  displayName: '方案对照',
  description: '三方案对照卡 + 要点列表 + 推荐项专色描边 + 底部结论栏，纸底',
  needsMedia: false,
  tags: ['plans', 'comparison', 'options', 'recommendation'],
  contentShape: 'plan-compare',
};

export const theme09PlansV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '方案对照' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'PLANS' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '19' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三套推进方案，取舍在速度与确定性之间' },
    {
      key: 'plans',
      label: '方案',
      type: 'array',
      maxItems: 3,
      itemSchema: [
        { key: 'name', label: '方案名称', type: 'text' },
        { key: 'summary', label: '一句话定位', type: 'text' },
        { key: 'points', label: '要点（多条）', type: 'array', itemSchema: [{ key: 'item', label: '要点', type: 'text' }] },
        { key: 'recommended', label: '是否推荐', type: 'boolean' },
      ],
    },
    {
      key: 'conclusion',
      label: '对比结论',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '在预算不变的前提下，方案 B 用一个季度的额外准备期，换来交付风险与人力峰值的同时下降。',
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '方案 · 取舍' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '39' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_PLANS: Theme09PlanItem[] = [
  {
    name: '快速上线',
    summary: '两个月内跑通首批场景',
    points: ['沿用现成模型与既有流程', '人力峰值高，需借调三名工程师', '交付风险集中在数据打通环节', '首年可见收益最快'],
  },
  {
    name: '分期推进',
    summary: '先固化标准，再规模复制',
    points: ['首季度完成数据与流程治理', '第二季度起按行业模板复制', '人力曲线平缓，无需外部借调', '整体交付风险最低'],
    recommended: true,
  },
  {
    name: '外包托管',
    summary: '把交付整体交给伙伴',
    points: ['内部投入最小，只保留验收职责', '单位成本高出约 22%', '核心数据需出域，合规审批周期长', '能力不沉淀在自有团队'],
  },
];

const DEFAULT_CONCLUSION =
  '在预算不变的前提下，方案 B 用一个季度的额外准备期，换来交付风险与人力峰值的同时下降。';

export function Theme09PlansV1(props: Theme09PlansV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    plans = [],
    conclusion,
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (plans.length ? plans : DEFAULT_PLANS).slice(0, 3);
  const text = conclusion ?? DEFAULT_CONCLUSION;
  const recommended = list.find((p) => p.recommended);

  return (
    <Sheet substrate="paper" frame="column-3" className="lp-theme09-plans">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 20, padding: '96px 60px 70px' }}>
        {title && (
          <h2
            className="lp-t9-serif"
            style={{ margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.26, color: 'var(--lp-ink)', flex: 'none' }}
          >
            <EditableField prop="title" slideIdx={s} editable={e} as="span">
              {title}
            </EditableField>
          </h2>
        )}

        <div style={{ display: 'flex', gap: 22, alignItems: 'stretch', flex: '1 1 auto', minHeight: 0 }}>
          {list.map((plan, i) => {
            const on = !!plan.recommended;
            const points = normalizeStrings(plan.points).slice(0, 5);
            return (
              <article
                key={i}
                style={{
                  position: 'relative',
                  flex: '1 1 0',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  border: on ? '2px solid var(--lp-accent)' : '1px solid var(--lp-border)',
                  background: on ? 'var(--lp-surface-solid)' : 'transparent',
                  padding: on ? '20px 20px 22px' : '21px 21px 23px',
                }}
              >
                {on && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -1,
                      right: -1,
                      background: 'var(--lp-accent)',
                      color: 'var(--lp-on-accent)',
                      fontFamily: 'var(--lp-font-mono)',
                      fontSize: 10.5,
                      letterSpacing: '0.16em',
                      padding: '4px 9px',
                    }}
                  >
                    推荐
                  </span>
                )}

                <span
                  style={{
                    fontFamily: 'var(--lp-font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    color: on ? 'var(--lp-accent)' : 'var(--lp-ink3)',
                    flex: 'none',
                  }}
                >
                  {`PLAN ${String.fromCharCode(65 + i)}`}
                </span>

                <h3
                  className="lp-t9-serif"
                  style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.3, color: 'var(--lp-ink)', flex: 'none' }}
                >
                  <EditableField prop={`plans.${i}.name`} slideIdx={s} editable={e} as="span">
                    {plan.name ?? ''}
                  </EditableField>
                </h3>

                {plan.summary && (
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--lp-ink3)', flex: 'none' }}>
                    <EditableField prop={`plans.${i}.summary`} slideIdx={s} editable={e} as="span">
                      {plan.summary}
                    </EditableField>
                  </p>
                )}

                <span style={{ display: 'block', height: 1, background: on ? 'var(--lp-accent)' : 'var(--lp-t9-rule)', flex: 'none' }} aria-hidden="true" />

                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {points.map((pt, k) => (
                    <li key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                      <span
                        aria-hidden="true"
                        style={{
                          flex: 'none',
                          width: 5,
                          height: 5,
                          marginTop: 8,
                          background: on ? 'var(--lp-accent)' : 'var(--lp-ink3)',
                        }}
                      />
                      <span style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--lp-ink2)', minWidth: 0 }}>
                        <EditableField prop={`plans.${i}.points.${k}`} slideIdx={s} editable={e} as="span">
                          {pt}
                        </EditableField>
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* 底部：对比结论 */}
        <div
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            borderLeft: '4px solid var(--lp-accent)',
            background: 'var(--lp-surface)',
            padding: '16px 22px',
          }}
        >
          <span
            style={{
              flex: 'none',
              fontFamily: 'var(--lp-font-mono)',
              fontSize: 11,
              letterSpacing: '0.2em',
              color: 'var(--lp-accent)',
            }}
          >
            VERDICT
          </span>
          <p className="lp-t9-serif" style={{ margin: 0, fontSize: 16.5, fontWeight: 600, lineHeight: 1.6, color: 'var(--lp-ink)' }}>
            <EditableField prop="conclusion" slideIdx={s} editable={e} as="span">
              {text}
            </EditableField>
          </p>
          {recommended?.name && (
            <span
              style={{
                marginLeft: 'auto',
                flex: 'none',
                fontFamily: 'var(--lp-font-mono)',
                fontSize: 11,
                letterSpacing: '0.12em',
                color: 'var(--lp-ink3)',
                whiteSpace: 'nowrap',
              }}
            >
              {`选定：${recommended.name}`}
            </span>
          )}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
