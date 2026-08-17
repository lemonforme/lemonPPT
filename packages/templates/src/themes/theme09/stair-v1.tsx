// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 阶梯递进（stair_v1）
 * 基底：墨 | 骨架：stage | 图位：—
 *
 * 从左下到右上递升的阶梯台阶：每级台阶为一段专色实心踏面，
 * 踏面之上悬挂步骤名与描述，可选图标压在编号旁。纯 CSS 实现。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Masthead, Sheet } from './shared.js';

export interface Theme09StairStep {
  name?: string;
  description?: string;
  icon?: string;
}

export interface Theme09StairV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  steps?: Theme09StairStep[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09StairV1Meta: LayoutMeta = {
  id: 'theme09_stair_v1',
  theme: 'theme09',
  role: 'process',
  displayName: '阶梯递进',
  description: '左下到右上的阶梯台阶 + 步骤名与描述 + 可选图标，纯 CSS，墨底',
  needsMedia: false,
  tags: ['stair', 'process', 'progressive', 'steps'],
  contentShape: 'stair-steps',
};

export const theme09StairV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '阶梯递进' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'STAIRCASE' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '41' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '能力沿四级台阶逐层垫高' },
    {
      key: 'steps',
      label: '台阶',
      type: 'array',
      minItems: 3,
      maxItems: 5,
      itemSchema: [
        { key: 'name', label: '步骤名称', type: 'text' },
        { key: 'description', label: '步骤描述', type: 'textarea' },
        { key: 'icon', label: '图标字符（可选）', type: 'text' },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '递进 · 台阶' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '41' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_STEPS: Theme09StairStep[] = [
  {
    name: '数据打通',
    description: '把散落在七个系统里的业务数据接入统一口径，先让指标能对上账。',
    icon: '◱',
  },
  {
    name: '流程固化',
    description: '将试点跑通的动作写成标准作业手册，交付节奏从依赖个人转为依赖流程。',
    icon: '◲',
  },
  {
    name: '模型嵌入',
    description: '在质检、排产与客服三个高频环节嵌入模型能力，形成可度量的效率增量。',
    icon: '◳',
  },
  {
    name: '规模复制',
    description: '以行业模板向新区域复制，单点经验转为可批量交付的产品化能力。',
    icon: '◰',
  },
];

/** 最低一级踏面高度（px）与每级递增量（px） */
const RISER_BASE = 54;
const RISER_STEP = 40;

export function Theme09StairV1(props: Theme09StairV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    steps = [],
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (steps.length ? steps : DEFAULT_STEPS).slice(0, 5);

  return (
    <Sheet substrate="ink" frame="stage" className="lp-theme09-stair">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 24, padding: '96px 60px 70px' }}>
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

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 16,
            flex: '1 1 auto',
            minHeight: 0,
            borderBottom: '2px solid var(--lp-t9-rule-strong)',
          }}
        >
          {list.map((step, i) => {
            const tone = i === list.length - 1 ? 'var(--lp-accent)' : `var(--lp-series-${(i % 6) + 1})`;
            const riser = RISER_BASE + i * RISER_STEP;
            return (
              <div
                key={i}
                className="lp-rise"
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  gap: 14,
                  animationDelay: `${i * 60}ms`,
                }}
              >
                {/* 台阶上方的说明块 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingRight: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span
                      style={{
                        flex: 'none',
                        fontFamily: 'var(--lp-font-mono)',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        color: tone,
                      }}
                    >
                      {`STEP ${String(i + 1).padStart(2, '0')}`}
                    </span>
                    {step.icon && (
                      <span
                        aria-hidden="true"
                        style={{
                          flex: 'none',
                          width: 22,
                          height: 22,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${tone}`,
                          color: tone,
                          fontSize: 12,
                          lineHeight: 1,
                        }}
                      >
                        {step.icon}
                      </span>
                    )}
                  </div>

                  <h3
                    className="lp-t9-serif"
                    style={{ margin: 0, fontSize: 21, fontWeight: 700, lineHeight: 1.32, color: 'var(--lp-ink)' }}
                  >
                    <EditableField prop={`steps.${i}.name`} slideIdx={s} editable={e} as="span">
                      {step.name ?? ''}
                    </EditableField>
                  </h3>

                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.74, color: 'var(--lp-ink2)' }}>
                    <EditableField prop={`steps.${i}.description`} slideIdx={s} editable={e} as="span">
                      {step.description ?? ''}
                    </EditableField>
                  </p>
                </div>

                {/* 踏面：高度随序号递增，形成左下到右上的阶梯 */}
                <div
                  aria-hidden="true"
                  style={{
                    flex: 'none',
                    height: riser,
                    background: `color-mix(in srgb, ${tone} 22%, transparent)`,
                    borderTop: `3px solid ${tone}`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    padding: '8px 10px 0',
                  }}
                >
                  <span
                    className="lp-t9-serif"
                    style={{
                      fontSize: 34,
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      color: `color-mix(in srgb, ${tone} 72%, var(--lp-ink))`,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
