// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04TriptychV1Panel {
  imageUrl?: string;
  label?: string;
  title?: string;
  description?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04TriptychV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  panels?: Theme04TriptychV1Panel[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04TriptychV1Meta: LayoutMeta = {
  id: 'theme04_triptych_v1',
  theme: 'theme04',
  role: 'gallery',
  displayName: 'Theme 04 全幅三联',
  description: '三张大图全幅并列，适合案例三联/产品三件套展示',
  needsMedia: true,
  mediaSlots: [
    { name: '左图', fieldPath: 'panels.0.imageUrl', canPresetMedia: true },
    { name: '中图', fieldPath: 'panels.1.imageUrl', canPresetMedia: true },
    { name: '右图', fieldPath: 'panels.2.imageUrl', canPresetMedia: true },
  ],
  tags: ['triptych', 'gallery', 'candy'],
  contentShape: 'three-panel-gallery',
};

export const theme04TriptychV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '全幅三联' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'TRIPTYCH' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'GLASS CANDY · EDITION 01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '从{{数据}}到{{决策}}的三级跳' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '每一步都对应柠檬 PPT 的核心能力' },
    {
      key: 'panels',
      label: '面板',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      defaultValue: [
        { label: '01', title: 'AI 生成大纲', description: '输入一句话，自动生成完整大纲', tone: 'green' },
        { label: '02', title: '主题一键切换', description: '多主题实时预览，风格秒变', tone: 'blue' },
        { label: '03', title: 'PPTX 导出', description: '可编辑源文件，本地二次创作', tone: 'yellow' },
      ],
      itemSchema: [
        { key: 'imageUrl', label: '图片', type: 'image' },
        { key: 'label', label: '编号', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT 产品能力' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: 'NO. 01' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-triptych-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme04TriptychV1(props: Theme04TriptychV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, panels, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safePanels = (panels || []).filter((p) => p != null).slice(0, 3);
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-triptych">
      <div className="lp-theme04-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme04-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span>·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme04-triptych-main">
        <div className="lp-theme04-triptych-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-triptych-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className={`lp-theme04-triptych-grid lp-theme04-triptych-grid--${safePanels.length}`}>
          {safePanels.map((panel, idx) => (
            <div
              key={idx}
              className={`lp-theme04-triptych-card lp-theme04-card lp-rise ${toneClass[panel.tone || 'green'] || ''}`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="lp-theme04-triptych-image-wrap">
                <LpEditableImage
                  className="lp-theme04-triptych-image"
                  src={panel.imageUrl}
                  alt={panel.title || ''}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  prop={`panels.${idx}.imageUrl`}
                  placeholderClassName="lp-editable-image-placeholder lp-theme04-triptych-image-placeholder"
                  placeholderText="图片"
                />
                {panel.label && (
                  <EditableField prop={`panels.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-triptych-card-label">{panel.label}</EditableField>
                )}
              </div>
              <div className="lp-theme04-triptych-card-body">
                {panel.title && (
                  <EditableField prop={`panels.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h4" className="lp-theme04-triptych-card-title">{panel.title}</EditableField>
                )}
                {panel.description && (
                  <EditableField prop={`panels.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-triptych-card-desc">{panel.description}</EditableField>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lp-theme04-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
