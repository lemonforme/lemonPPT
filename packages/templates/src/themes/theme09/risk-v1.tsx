// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 风险研判（risk_v1）
 * 基底：墨 | 骨架：grid | 图位：—
 *
 * 影响 × 概率 2×2 风险矩阵，四象限落风险条目，等级徽章用专色分档。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Masthead, Sheet } from './shared.js';

export interface Theme09RiskItem {
  name?: string;
  level?: string;
  impact?: string | number;
  probability?: string | number;
  mitigation?: string;
}

export interface Theme09RiskV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  risks?: Theme09RiskItem[];
  axisImpact?: string;
  axisProbability?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09RiskV1Meta: LayoutMeta = {
  id: 'theme09_risk_v1',
  theme: 'theme09',
  role: 'swot',
  displayName: '风险研判',
  description: '影响×概率四象限风险矩阵 + 等级徽章 + 应对措施，墨底',
  needsMedia: false,
  tags: ['risk', 'matrix', 'quadrant', 'assessment'],
  contentShape: 'risk-matrix',
};

export const theme09RiskV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '风险研判' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'RISK MATRIX' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '06' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '四类风险的影响与概率坐标' },
    {
      key: 'risks',
      label: '风险条目',
      type: 'array',
      maxItems: 8,
      itemSchema: [
        { key: 'name', label: '风险名称', type: 'text' },
        { key: 'level', label: '等级（高/中/低）', type: 'text' },
        { key: 'impact', label: '影响（高/低 或 0-100）', type: 'text' },
        { key: 'probability', label: '概率（高/低 或 0-100）', type: 'text' },
        { key: 'mitigation', label: '应对措施', type: 'text' },
      ],
    },
    { key: 'axisImpact', label: '纵轴名', type: 'text', inlineEditable: true, defaultValue: '影响程度' },
    { key: 'axisProbability', label: '横轴名', type: 'text', inlineEditable: true, defaultValue: '发生概率' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '研判 · 风险' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '27' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_RISKS: Theme09RiskItem[] = [
  { name: '算力交付延期', level: '高', impact: '高', probability: '高', mitigation: '双供应商锁量，预留 20% 弹性租赁额度' },
  { name: '合规口径收紧', level: '高', impact: '高', probability: '低', mitigation: '提前完成语料授权与备案，建立合规台账' },
  { name: '核心团队流失', level: '中', impact: '低', probability: '高', mitigation: '关键岗位双备份，绑定三年期激励' },
  { name: '汇率与关税波动', level: '低', impact: '低', probability: '低', mitigation: '季度对冲，采购合同锁定本币结算' },
];

const QUADRANTS = [
  { key: 'hi-lo', label: '高影响 · 低概率', note: '应急预案', impact: true, prob: false },
  { key: 'hi-hi', label: '高影响 · 高概率', note: '优先处置', impact: true, prob: true },
  { key: 'lo-lo', label: '低影响 · 低概率', note: '常规观察', impact: false, prob: false },
  { key: 'lo-hi', label: '低影响 · 高概率', note: '流程消化', impact: false, prob: true },
] as const;

function isHigh(v?: string | number): boolean {
  if (typeof v === 'number') return v >= 50;
  const s = String(v ?? '').trim();
  if (!s) return false;
  if (/^[0-9.]+$/.test(s)) return parseFloat(s) >= 50;
  return /高|大|强|high/i.test(s);
}

function levelTone(level?: string): string {
  const s = String(level ?? '').trim();
  if (/高|high/i.test(s)) return 'var(--lp-accent)';
  if (/中|mid|medium/i.test(s)) return 'var(--lp-amber)';
  return 'var(--lp-teal)';
}

export function Theme09RiskV1(props: Theme09RiskV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    risks = [],
    axisImpact = '影响程度',
    axisProbability = '发生概率',
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (risks.length ? risks : DEFAULT_RISKS).slice(0, 8);

  return (
    <Sheet substrate="ink" frame="grid" className="lp-theme09-risk">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 16, padding: '96px 60px 70px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flex: 'none' }}>
          {title && (
            <h2 className="lp-t9-serif" style={{ margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.24, color: 'var(--lp-ink)' }}>
              <EditableField prop="title" slideIdx={s} editable={e} as="span">
                {title}
              </EditableField>
            </h2>
          )}
          <div style={{ display: 'flex', gap: 16, flex: 'none', paddingBottom: 4 }}>
            {[
              { label: '高', tone: 'var(--lp-accent)' },
              { label: '中', tone: 'var(--lp-amber)' },
              { label: '低', tone: 'var(--lp-teal)' },
            ].map((lg) => (
              <span key={lg.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--lp-ink3)' }}>
                <span style={{ width: 12, height: 12, background: lg.tone, display: 'inline-block' }} aria-hidden="true" />
                {lg.label}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: '24px 1fr 1fr',
            gridTemplateRows: '1fr 1fr 24px',
            gap: 10,
          }}
        >
          <div
            style={{
              gridColumn: '1 / 2',
              gridRow: '1 / 3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                transform: 'rotate(180deg)',
                writingMode: 'vertical-rl',
                fontFamily: 'var(--lp-font-mono)',
                fontSize: 11,
                letterSpacing: '0.22em',
                color: 'var(--lp-ink3)',
                whiteSpace: 'nowrap',
              }}
            >
              <EditableField prop="axisImpact" slideIdx={s} editable={e} as="span">
                {`${axisImpact} →`}
              </EditableField>
            </span>
          </div>

          {QUADRANTS.map((q) => {
            const cell = list.filter((r) => isHigh(r.impact) === q.impact && isHigh(r.probability) === q.prob);
            const hot = q.impact && q.prob;
            return (
              <div
                key={q.key}
                style={{
                  border: `1px solid ${hot ? 'var(--lp-accent)' : 'var(--lp-border)'}`,
                  background: hot ? 'var(--lp-card-accent)' : 'var(--lp-surface)',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                  minHeight: 0,
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flex: 'none' }}>
                  <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: 11, letterSpacing: '0.14em', color: hot ? 'var(--lp-accent)' : 'var(--lp-ink3)' }}>
                    {q.label}
                  </span>
                  <span className="lp-t9-serif" style={{ fontSize: 13, color: 'var(--lp-ink2)', fontWeight: 600 }}>
                    {q.note}
                  </span>
                </div>

                {cell.map((risk) => {
                  const idx = list.indexOf(risk);
                  const tone = levelTone(risk.level);
                  return (
                    <article key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 3, borderTop: '1px solid var(--lp-t9-rule)', paddingTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            flex: 'none',
                            background: tone,
                            color: 'var(--lp-on-accent)',
                            fontFamily: 'var(--lp-font-mono)',
                            fontSize: 10.5,
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            padding: '2px 6px',
                          }}
                        >
                          <EditableField prop={`risks.${idx}.level`} slideIdx={s} editable={e} as="span">
                            {risk.level ?? '低'}
                          </EditableField>
                        </span>
                        <span className="lp-t9-serif" style={{ fontSize: 16, fontWeight: 700, color: 'var(--lp-ink)', minWidth: 0 }}>
                          <EditableField prop={`risks.${idx}.name`} slideIdx={s} editable={e} as="span">
                            {risk.name ?? ''}
                          </EditableField>
                        </span>
                      </div>
                      {risk.mitigation && (
                        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: 'var(--lp-ink3)' }}>
                          <EditableField prop={`risks.${idx}.mitigation`} slideIdx={s} editable={e} as="span">
                            {`应对：${risk.mitigation}`}
                          </EditableField>
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            );
          })}

          <div style={{ gridColumn: '2 / 4', gridRow: '3 / 4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--lp-font-mono)', fontSize: 11, letterSpacing: '0.22em', color: 'var(--lp-ink3)' }}>
              <EditableField prop="axisProbability" slideIdx={s} editable={e} as="span">
                {`${axisProbability} →`}
              </EditableField>
            </span>
          </div>
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
