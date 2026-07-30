// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04LayersV1Layer {
  title: string;
  items?: string[];
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04LayersV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  layers?: Theme04LayersV1Layer[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04LayersV1Meta: LayoutMeta = {
  id: 'theme04_layers_v1',
  theme: 'theme04',
  role: 'process',
  displayName: 'Theme 04 分层架构',
  description: '金字塔/分层架构图，展示层级关系',
  needsMedia: false,
  tags: ['process', 'layers', 'architecture', 'candy'],
  contentShape: 'title-grid',
};

export const theme04LayersV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '技术栈' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{AI 应用}}的完整技术分层' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从基础设施到应用层的四层架构' },
    {
      key: 'layers',
      label: '层级',
      type: 'array',
      minItems: 2,
      maxItems: 5,
      defaultValue: [
        { title: '应用层', items: ['聊天机器人', '编程助手', '搜索增强'], tone: 'green' },
        { title: '编排层', items: ['Agent 框架', 'RAG 管道', '提示工程'], tone: 'blue' },
        { title: '模型层', items: ['大语言模型', '多模态模型', '微调服务'], tone: 'pink' },
        { title: '基础设施层', items: ['算力集群', '向量数据库', '推理加速'], tone: 'yellow' },
      ],
      itemSchema: [
        { key: 'title', label: '层级标题', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
        {
          key: 'items',
          label: '子项',
          type: 'array',
          maxItems: 5,
          itemSchema: [{ key: 'item', label: '子项', type: 'text' }],
        },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-layers-title lp-rise">
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

export function Theme04LayersV1(props: Theme04LayersV1Props): ReactNode {
  const { kicker, title, subtitle, layers, footnote, _slideIdx, _editable } = props;
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };
  const validLayers = (layers || []).slice(0, 5);

  return (
    <div className="lp-slide lp-theme04-layers">
      <div className="lp-theme04-layers-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-layers-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validLayers.length > 0 && (
        <div className="lp-theme04-layers-stack lp-rise">
          {validLayers.map((layer, idx) => (
            <div
              key={idx}
              className={`lp-theme04-layers-layer lp-theme04-card ${toneClass[layer.tone || 'green'] || ''}`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <EditableField prop={`layers.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-layers-layer-title">{layer.title}</EditableField>
              {layer.items && layer.items.length > 0 && (
                <div className="lp-theme04-layers-layer-items">
                  {(layer.items || []).slice(0, 5).map((item, iidx) => (
                    <EditableField
                      key={iidx}
                      prop={`layers.${idx}.items.${iidx}`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-theme04-layers-layer-item"
                    >
                      {item}
                    </EditableField>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-layers-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
