// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03ContentV2Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  leftPoints?: string[];
  rightPoints?: string[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ContentV2Meta: LayoutMeta = {
  id: 'theme03_content_v2',
  theme: 'theme03',
  role: 'content',
  displayName: 'Theme 03 编辑风双栏内容',
  description: '双栏要点并排展示',
  needsMedia: false,
  tags: ['content', 'two-column'],
  contentShape: 'two-column-points',
};

export const theme03ContentV2Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '要点' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'TAKEAWAYS' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'AI · VENTURE CAPITAL // USA' },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '双栏{{对比}}：关键发现' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'leftPoints', label: '左侧要点', type: 'array', maxItems: 6, minItems: 2, itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }] },
    { key: 'rightPoints', label: '右侧要点', type: 'array', maxItems: 6, minItems: 2, itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }] },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme03ContentV2(props: Theme03ContentV2Props): ReactNode {
  const { tag, tagLabel, topRightMeta, kicker, title, subtitle, leftPoints = [], rightPoints = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-content-v2">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-content-v2-main">
        <div className="lp-theme03-content-v2-head lp-rise">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-content-v2-kicker">{kicker}</EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme03-content-v2-title">{title}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-content-v2-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-content-v2-columns">
          <div className="lp-theme03-content-v2-col lp-rise">
            <ul className="lp-theme03-content-v2-list">
              {leftPoints.map((point, index) => (
                <li key={index}>
                  <EditableField prop={`leftPoints.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">{point}</EditableField>
                </li>
              ))}
            </ul>
          </div>
          <div className="lp-theme03-content-v2-col lp-rise">
            <ul className="lp-theme03-content-v2-list">
              {rightPoints.map((point, index) => (
                <li key={index}>
                  <EditableField prop={`rightPoints.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">{point}</EditableField>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
