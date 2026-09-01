// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 流程图页（process_v1）
 * 情绪：daylight | 骨架：grid
 * 顶部标题 + 横向流程节点 + 连接线。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11ProcessV1Node {
  title: string;
  description?: string;
}

export interface Theme11ProcessV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  nodes?: Theme11ProcessV1Node[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ProcessV1Meta: LayoutMeta = {
  id: 'theme11_process_v1',
  theme: 'theme11',
  role: 'process',
  displayName: 'Theme 11 流程图页',
  description: '顶部标题 + 横向流程节点',
  needsMedia: false,
  tags: ['process', 'flow', 'grid', 'light-stream'],
  contentShape: 'process',
};

export const theme11ProcessV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '产品流程' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从需求到交付的完整链路' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'PROCESS' },
    {
      key: 'nodes',
      label: '流程节点',
      type: 'array',
      maxItems: 5,
      defaultValue: [
        { title: '需求输入', description: '收集业务目标与受众信息' },
        { title: '内容生成', description: 'AI 自动构建大纲与文案' },
        { title: '视觉排版', description: '匹配版式并生成视觉稿' },
        { title: '团队协作', description: '在线审阅与实时调整' },
        { title: '导出交付', description: '多格式一键输出' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '说明', type: 'textarea', inlineEditable: true },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11ProcessV1(props: Theme11ProcessV1Props): ReactNode {
  const { title, subtitle, eyebrow, nodes = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const validNodes = (nodes || []).filter((n): n is Theme11ProcessV1Node => n != null).slice(0, 5);

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-process">
      <div className="lp-theme11-process-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-process-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-process-track">
        {validNodes.map((node, i) => (
          <div key={i} className={`lp-theme11-process-node-wrap lp-rise ${i % 2 === 1 ? 'lp-theme11-process-node-wrap-lower' : ''}`} style={{ animationDelay: `${i * 80}ms` }}>
            <Card className="lp-theme11-process-node" padding="medium">
              <span className="lp-theme11-process-node-number">0{i + 1}</span>
              <EditableField prop={`nodes.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme11-process-node-title">{node.title}</EditableField>
              {node.description && <EditableField prop={`nodes.${i}.description`} slideIdx={s} editable={e} as="p" className="lp-theme11-process-node-desc">{node.description}</EditableField>}
            </Card>
            {i < validNodes.length - 1 && (
              <div className="lp-theme11-process-connector" aria-hidden="true">
                <span className="lp-theme11-process-connector-line" />
                <span className="lp-theme11-process-connector-dot" />
              </div>
            )}
          </div>
        ))}
      </div>
    </Sheet>
  );
}
