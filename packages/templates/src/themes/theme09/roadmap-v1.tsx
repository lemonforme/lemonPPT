// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 布局路线（roadmap_v1）
 * 基底：纸 | 骨架：stage | 图位：1
 *
 * 横向路线图：节点串在一条主轴上，节点下方挂阶段卡（时间 / 名称 / 状态 / 描述），
 * 主轴终点落一处影像圆窗，作为路线尽头的「目的地」。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09RoadmapStage {
  name?: string;
  time?: string;
  status?: string;
  description?: string;
}

export interface Theme09RoadmapV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  stages?: Theme09RoadmapStage[];
  endImage?: string;
  endCaption?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09RoadmapV1Meta: LayoutMeta = {
  id: 'theme09_roadmap_v1',
  theme: 'theme09',
  role: 'roadmap',
  displayName: '布局路线',
  description: '横向路线图分期节点 + 阶段状态标签 + 终点影像圆窗，纸底',
  needsMedia: true,
  mediaSlots: [{ name: '终点影像', fieldPath: 'endImage', canPresetMedia: true }],
  tags: ['roadmap', 'stages', 'milestone', 'photo'],
  contentShape: 'roadmap-stages',
};

export const theme09RoadmapV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '布局路线' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'ROADMAP' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '44' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '四段路线，通向同一个交付形态' },
    {
      key: 'stages',
      label: '路线节点',
      type: 'array',
      minItems: 3,
      maxItems: 5,
      itemSchema: [
        { key: 'name', label: '阶段名称', type: 'text' },
        { key: 'time', label: '时间', type: 'text' },
        { key: 'status', label: '状态（已完成/进行中/规划中）', type: 'text' },
        { key: 'description', label: '阶段描述', type: 'textarea' },
      ],
    },
    { key: 'endImage', label: '终点影像', type: 'image', defaultValue: '' },
    { key: 'endCaption', label: '终点说明', type: 'text', inlineEditable: true, defaultValue: '2027 · 标准化交付' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '路线 · 分期' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '44' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_STAGES: Theme09RoadmapStage[] = [
  {
    name: '基线摸底',
    time: '26Q1',
    status: '已完成',
    description: '完成七个系统的数据盘点与口径统一，形成可复核的指标基线。',
  },
  {
    name: '场景试点',
    time: '26Q2',
    status: '进行中',
    description: '质检与排产两个场景进入生产环境，按周复盘效果与稳定性。',
  },
  {
    name: '模板沉淀',
    time: '26Q3',
    status: '规划中',
    description: '把试点动作写成行业模板，交付所需人日下降至当前的六成。',
  },
  {
    name: '区域复制',
    time: '27Q1',
    status: '规划中',
    description: '以模板向三个新区域复制，验证跨区域交付的成本与质量一致性。',
  },
];

const DEFAULT_END_CAPTION = '2027 · 标准化交付';

function statusTone(status?: string): { tone: string; filled: boolean } {
  const s = String(status ?? '').trim();
  if (/已完成|完成|done|closed/i.test(s)) return { tone: 'var(--lp-teal)', filled: true };
  if (/进行中|推进|ongoing|active/i.test(s)) return { tone: 'var(--lp-accent)', filled: true };
  return { tone: 'var(--lp-ink3)', filled: false };
}

export function Theme09RoadmapV1(props: Theme09RoadmapV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    stages = [],
    endImage,
    endCaption,
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (stages.length ? stages : DEFAULT_STAGES).slice(0, 5);
  const caption = endCaption ?? DEFAULT_END_CAPTION;

  return (
    <Sheet substrate="paper" frame="stage" className="lp-theme09-roadmap">
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

        <div style={{ display: 'flex', alignItems: 'stretch', gap: 30, flex: '1 1 auto', minHeight: 0 }}>
          {/* 左：横向路线节点 */}
          <div style={{ display: 'flex', gap: 18, flex: '1 1 auto', minWidth: 0 }}>
            {list.map((stage, i) => {
              const st = statusTone(stage.status);
              return (
                <div
                  key={i}
                  className="lp-rise"
                  style={{
                    flex: '1 1 0',
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  {/* 节点 + 连线 */}
                  <div style={{ display: 'flex', alignItems: 'center', flex: 'none', height: 28 }}>
                    <span
                      aria-hidden="true"
                      style={{
                        flex: 'none',
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        border: `2px solid ${st.tone}`,
                        background: st.filled ? st.tone : 'transparent',
                        color: st.filled ? 'var(--lp-on-accent)' : st.tone,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--lp-font-mono)',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        flex: '1 1 auto',
                        height: 1,
                        marginLeft: 8,
                        marginRight: -18,
                        background: st.filled ? st.tone : 'var(--lp-t9-rule)',
                      }}
                    />
                  </div>

                  <span
                    style={{
                      flex: 'none',
                      fontFamily: 'var(--lp-font-mono)',
                      fontSize: 12,
                      letterSpacing: '0.12em',
                      color: 'var(--lp-ink3)',
                    }}
                  >
                    <EditableField prop={`stages.${i}.time`} slideIdx={s} editable={e} as="span">
                      {stage.time ?? ''}
                    </EditableField>
                  </span>

                  <h3
                    className="lp-t9-serif"
                    style={{ margin: 0, fontSize: 20, fontWeight: 700, lineHeight: 1.32, color: 'var(--lp-ink)', flex: 'none' }}
                  >
                    <EditableField prop={`stages.${i}.name`} slideIdx={s} editable={e} as="span">
                      {stage.name ?? ''}
                    </EditableField>
                  </h3>

                  <span
                    style={{
                      flex: 'none',
                      alignSelf: 'flex-start',
                      border: `1px solid ${st.tone}`,
                      color: st.tone,
                      fontFamily: 'var(--lp-font-mono)',
                      fontSize: 11,
                      letterSpacing: '0.1em',
                      padding: '2px 8px',
                    }}
                  >
                    <EditableField prop={`stages.${i}.status`} slideIdx={s} editable={e} as="span">
                      {stage.status ?? '规划中'}
                    </EditableField>
                  </span>

                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.74, color: 'var(--lp-ink2)', paddingRight: 8 }}>
                    <EditableField prop={`stages.${i}.description`} slideIdx={s} editable={e} as="span">
                      {stage.description ?? ''}
                    </EditableField>
                  </p>
                </div>
              );
            })}
          </div>

          {/* 右：终点影像圆窗 */}
          <div style={{ flex: 'none', width: 208, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 'none', height: 28 }}>
              <span aria-hidden="true" style={{ flex: '1 1 auto', height: 1, background: 'var(--lp-accent)' }} />
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style={{ flex: 'none' }}>
                <path d="M0 1 L11 6 L0 11 Z" fill="var(--lp-accent)" />
              </svg>
            </div>

            <InkPhoto
              prop="endImage"
              src={endImage}
              slideIdx={s}
              editable={e}
              ratio="1:1"
              aperture
              hint="上传终点影像"
              style={{ flex: 'none' }}
            />

            <span
              style={{
                flex: 'none',
                textAlign: 'center',
                fontFamily: 'var(--lp-font-mono)',
                fontSize: 11.5,
                letterSpacing: '0.14em',
                color: 'var(--lp-accent)',
              }}
            >
              <EditableField prop="endCaption" slideIdx={s} editable={e} as="span">
                {caption}
              </EditableField>
            </span>
          </div>
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
