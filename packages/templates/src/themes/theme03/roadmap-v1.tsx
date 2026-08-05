// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03RoadmapV1Phase {
  phase?: string;
  items?: Array<{ value?: string }>;
}

export interface Theme03RoadmapV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  phases?: Theme03RoadmapV1Phase[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03RoadmapV1Meta: LayoutMeta = {
  id: 'theme03_roadmap_v1',
  theme: 'theme03',
  role: 'roadmap',
  displayName: 'Theme 03 编辑风路线图',
  description: '分阶段横向路线图 + mono 编号节点 + 子项清单',
  needsMedia: false,
  tags: ['roadmap', 'phases', 'planning'],
  contentShape: 'horizontal-phases',
};

export const theme03RoadmapV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '产品路线' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '09' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'ROADMAP // 2025-2026' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{未来 12 个月}}：从工具到平台' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'phases',
      label: '阶段',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        { key: 'phase', label: '阶段标题', type: 'text' },
        {
          key: 'items',
          label: '子项',
          type: 'array',
          minItems: 1,
          maxItems: 6,
          itemSchema: [{ key: 'value', label: '内容', type: 'textarea' }],
        },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-roadmap-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03RoadmapV1(props: Theme03RoadmapV1Props): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    phases = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validPhases = (phases || [])
    .filter((p): p is Theme03RoadmapV1Phase => p != null && !!(p.phase || (p.items && p.items.length > 0)));

  return (
    <div className="lp-slide lp-theme03-roadmap-v1">
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

      <div className="lp-theme03-roadmap-main">
        <div className="lp-theme03-roadmap-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-roadmap-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {validPhases.length > 0 && (
          <div className="lp-theme03-roadmap-track">
            <div className="lp-theme03-roadmap-line" />
            {validPhases.map((phase, index) => (
              <div
                key={index}
                className="lp-theme03-roadmap-phase lp-rise"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="lp-theme03-roadmap-marker">
                  <span className="lp-theme03-roadmap-number">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="lp-theme03-roadmap-card">
                  <EditableField
                    prop={`phases.${index}.phase`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="h3"
                    className="lp-theme03-roadmap-phase-title"
                  >
                    {phase.phase}
                  </EditableField>
                  <ul className="lp-theme03-roadmap-list">
                    {(phase.items ?? []).map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <EditableField
                          prop={`phases.${index}.items.${itemIndex}.value`}
                          slideIdx={_slideIdx}
                          editable={_editable}
                          as="span"
                        >
                          {item.value}
                        </EditableField>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
