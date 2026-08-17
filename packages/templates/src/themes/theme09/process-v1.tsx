// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 实施路径（process_v1）
 * 基底：纸 | 骨架：stage | 图位：1
 *
 * 五步流程横向排列，步与步之间以专色箭头衔接，
 * 起步处落一处影像圆窗；每步为编号圆 + 名称 + 状态 + 说明。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09ProcessStep {
  name?: string;
  status?: string;
  description?: string;
}

export interface Theme09ProcessV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  steps?: Theme09ProcessStep[];
  startImage?: string;
  startCaption?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ProcessV1Meta: LayoutMeta = {
  id: 'theme09_process_v1',
  theme: 'theme09',
  role: 'process',
  displayName: '实施路径',
  description: '五步流程横向排列 + 步间箭头衔接 + 起步影像圆窗，纸底',
  needsMedia: true,
  mediaSlots: [{ name: '起步影像', fieldPath: 'startImage', canPresetMedia: true }],
  tags: ['process', 'steps', 'implementation', 'photo'],
  contentShape: 'five-step-process',
};

export const theme09ProcessV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '实施路径' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'PROCESS' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '48' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '从立项到复盘的五步走法' },
    {
      key: 'steps',
      label: '流程步骤',
      type: 'array',
      minItems: 3,
      maxItems: 5,
      itemSchema: [
        { key: 'name', label: '步骤名称', type: 'text' },
        { key: 'status', label: '状态', type: 'text' },
        { key: 'description', label: '状态描述', type: 'textarea' },
      ],
    },
    { key: 'startImage', label: '起步影像', type: 'image', defaultValue: '' },
    { key: 'startCaption', label: '起点说明', type: 'text', inlineEditable: true, defaultValue: 'START · 26Q1' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '实施 · 路径' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '48' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_STEPS: Theme09ProcessStep[] = [
  { name: '立项对齐', status: '已完成', description: '目标、口径与验收标准三方签字，避免中途改题。' },
  { name: '数据接入', status: '已完成', description: '七个系统完成接入与清洗，指标基线一次跑通。' },
  { name: '场景试点', status: '进行中', description: '质检与排产两个场景进入生产，按周复盘稳定性。' },
  { name: '规模推广', status: '规划中', description: '以模板向三个区域复制，同步培训本地实施队伍。' },
  { name: '效果复盘', status: '规划中', description: '按季度核对收益与成本，决定是否进入下一轮投入。' },
];

const DEFAULT_CAPTION = 'START · 26Q1';

function statusTone(status?: string): string {
  const s = String(status ?? '').trim();
  if (/已完成|完成|done/i.test(s)) return 'var(--lp-teal)';
  if (/进行中|推进|ongoing/i.test(s)) return 'var(--lp-accent)';
  return 'var(--lp-ink3)';
}

function Arrow(): ReactNode {
  return (
    <span
      aria-hidden="true"
      style={{ flex: 'none', width: 26, display: 'flex', justifyContent: 'center', alignSelf: 'flex-start', marginTop: 12 }}
    >
      <svg width="24" height="13" viewBox="0 0 24 13" role="presentation">
        <path d="M0 6.5 H17" stroke="var(--lp-accent)" strokeWidth="1.4" fill="none" />
        <path d="M16 1.5 L23 6.5 L16 11.5 Z" fill="var(--lp-accent)" />
      </svg>
    </span>
  );
}

export function Theme09ProcessV1(props: Theme09ProcessV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    steps = [],
    startImage,
    startCaption,
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (steps.length ? steps : DEFAULT_STEPS).slice(0, 5);
  const caption = startCaption ?? DEFAULT_CAPTION;

  return (
    <Sheet substrate="paper" frame="stage" className="lp-theme09-process">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 26, padding: '96px 60px 70px' }}>
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

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, flex: '1 1 auto', minHeight: 0 }}>
          {/* 起步影像圆窗 */}
          <div style={{ flex: 'none', width: 172, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <InkPhoto
              prop="startImage"
              src={startImage}
              slideIdx={s}
              editable={e}
              ratio="1:1"
              aperture
              hint="上传起步影像"
              style={{ flex: 'none' }}
            />
            <span
              style={{
                textAlign: 'center',
                fontFamily: 'var(--lp-font-mono)',
                fontSize: 11,
                letterSpacing: '0.16em',
                color: 'var(--lp-accent)',
              }}
            >
              <EditableField prop="startCaption" slideIdx={s} editable={e} as="span">
                {caption}
              </EditableField>
            </span>
          </div>

          <Arrow />

          {list.map((step, i) => {
            const tone = statusTone(step.status);
            return (
              <Fragment key={i}>
                {i > 0 && <Arrow />}
                <article
                  className="lp-rise"
                  style={{
                    flex: '1 1 0',
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    animationDelay: `${i * 55}ms`,
                  }}
                >
                  <span
                    style={{
                      flex: 'none',
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: `1.5px solid ${tone}`,
                      color: tone,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--lp-font-mono)',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <h3
                    className="lp-t9-serif"
                    style={{ margin: 0, fontSize: 19, fontWeight: 700, lineHeight: 1.32, color: 'var(--lp-ink)' }}
                  >
                    <EditableField prop={`steps.${i}.name`} slideIdx={s} editable={e} as="span">
                      {step.name ?? ''}
                    </EditableField>
                  </h3>

                  <span
                    style={{
                      alignSelf: 'flex-start',
                      flex: 'none',
                      border: `1px solid ${tone}`,
                      color: tone,
                      fontFamily: 'var(--lp-font-mono)',
                      fontSize: 10.5,
                      letterSpacing: '0.1em',
                      padding: '2px 7px',
                    }}
                  >
                    <EditableField prop={`steps.${i}.status`} slideIdx={s} editable={e} as="span">
                      {step.status ?? '规划中'}
                    </EditableField>
                  </span>

                  <span style={{ display: 'block', width: 40, height: 1, background: 'var(--lp-t9-rule)', flex: 'none' }} aria-hidden="true" />

                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.72, color: 'var(--lp-ink2)', paddingRight: 4 }}>
                    <EditableField prop={`steps.${i}.description`} slideIdx={s} editable={e} as="span">
                      {step.description ?? ''}
                    </EditableField>
                  </p>
                </article>
              </Fragment>
            );
          })}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
