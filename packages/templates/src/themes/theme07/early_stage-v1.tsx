// lemonPPT - theme07 早期轮信号行看板
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export type Theme07EarlyStageV1Signal = 'strong' | 'watch' | 'weak';

export interface Theme07EarlyStageV1Row {
  name?: string;
  amount?: string;
  value?: number;
  themes?: string;
  signal?: Theme07EarlyStageV1Signal;
  note?: string;
}

export interface Theme07EarlyStageV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  rows?: Theme07EarlyStageV1Row[];
  showBubble?: boolean;
  showThemes?: boolean;
  showSignal?: boolean;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07EarlyStageV1Meta: LayoutMeta = {
  id: 'theme07_early_stage_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 早期轮信号看板',
  description: '交易流信号行：气泡表示金额量级 + 主题标签 + 信号指示灯',
  needsMedia: true,
  tags: ['early_stage', 'signal', 'bubble', 'chart'],
  contentShape: 'signal-rows',
};

export const theme07EarlyStageV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'EARLY STAGE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '早期轮交易信号' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '气泡大小代表单笔金额量级，指示灯代表跟进优先级' },
    {
      key: 'rows',
      label: '信号行',
      type: 'array',
      minItems: 3,
      maxItems: 6,
      defaultValue: [
        { name: '多模态基座团队', amount: '$24M', value: 24, themes: '基座模型、多模态', signal: 'strong', note: 'A 轮超募' },
        { name: '推理加速引擎', amount: '$16M', value: 16, themes: '推理优化、系统软件', signal: 'strong', note: 'Pre-A 领投确认' },
        { name: '垂直行业智能体', amount: '$9M', value: 9, themes: '智能体、行业应用', signal: 'watch', note: '收入验证中' },
        { name: '数据合成平台', amount: '$4M', value: 4, themes: '数据、合规', signal: 'weak', note: '路径尚待验证' },
      ],
      itemSchema: [
        { key: 'name', label: '项目名称', type: 'text', inlineEditable: true },
        { key: 'amount', label: '金额文本', type: 'text', inlineEditable: true },
        { key: 'value', label: '金额数值', type: 'number' },
        { key: 'themes', label: '主题标签（顿号分隔）', type: 'text', inlineEditable: true },
        {
          key: 'signal',
          label: '信号',
          type: 'select',
          options: [
            { value: 'strong', label: '强（绿）' },
            { value: 'watch', label: '观察（琥珀）' },
            { value: 'weak', label: '弱（红）' },
          ],
        },
        { key: 'note', label: '备注', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'showBubble', label: '显示金额气泡', type: 'boolean', defaultValue: true },
    { key: 'showThemes', label: '显示主题标签', type: 'boolean', defaultValue: true },
    { key: 'showSignal', label: '显示信号灯', type: 'boolean', defaultValue: true },
    { key: 'focusIndex', label: '高亮行', type: 'slider', min: 0, max: 5, defaultValue: 0 },
  ],
};

function splitThemes(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(/[、,，/|]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function Theme07EarlyStageV1(props: Theme07EarlyStageV1Props): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    rows = [],
    showBubble = true,
    showThemes = true,
    showSignal = true,
    focusIndex = 0,
    _slideIdx,
    _editable,
  } = props;

  const validRows = (rows || [])
    .filter((r): r is Theme07EarlyStageV1Row => r != null && !!r.name)
    .slice(0, 6);
  const maxValue = validRows.reduce((acc, r) => Math.max(acc, Number(r.value) || 0), 0) || 1;

  return (
    <div className="lp-slide lp-theme07 lp-theme07-early-rows">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-early-rows-header lp-rise">
        <Theme07IconChip name="target" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      {validRows.length > 0 && (
        <div className="lp-theme07-early-rows-list lp-rise">
          {validRows.map((row, index) => {
            const value = Number(row.value) || 0;
            const ratio = Math.sqrt(value / maxValue);
            const bubbleSize = Math.round(22 + ratio * 40);
            const signal: Theme07EarlyStageV1Signal = row.signal ?? 'watch';
            const isFocus = index === focusIndex;
            return (
              <div
                key={index}
                className={`lp-theme07-early-row ${isFocus ? 'lp-focus' : ''}`}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {isFocus && <span className="lp-focus-lens" aria-hidden="true" />}
                <div className="lp-theme07-early-row-index">{String(index + 1).padStart(2, '0')}</div>
                <div className="lp-theme07-early-row-main">
                  <div className="lp-theme07-early-row-name">
                    <EditableField prop={`rows.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{row.name}</EditableField>
                  </div>
                  {row.note && (
                    <div className="lp-theme07-early-row-note">
                      <EditableField prop={`rows.${index}.note`} slideIdx={_slideIdx} editable={_editable} as="span">{row.note}</EditableField>
                    </div>
                  )}
                </div>
                {showBubble && (
                  <div className="lp-theme07-early-row-bubble-cell">
                    <span
                      className="lp-theme07-early-row-bubble"
                      aria-hidden="true"
                      style={{ width: `${bubbleSize}px`, height: `${bubbleSize}px` }}
                    />
                    {row.amount && (
                      <span className="lp-theme07-early-row-amount">
                        <EditableField prop={`rows.${index}.amount`} slideIdx={_slideIdx} editable={_editable} as="span">{row.amount}</EditableField>
                      </span>
                    )}
                  </div>
                )}
                {showThemes && (
                  <div className="lp-theme07-early-row-themes">
                    {splitThemes(row.themes).map((theme, ti) => (
                      <span key={ti} className="lp-theme07-early-row-pill">{theme}</span>
                    ))}
                  </div>
                )}
                {showSignal && (
                  <div className="lp-theme07-early-row-signal">
                    <span className={`lp-theme07-early-row-signal-dot is-${signal}`} aria-hidden="true" />
                    <span className="lp-theme07-early-row-signal-text">
                      {signal === 'strong' ? '优先跟进' : signal === 'weak' ? '暂缓' : '持续观察'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
