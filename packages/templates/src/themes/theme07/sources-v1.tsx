// lemonPPT - theme07 数据来源
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07MiniBars } from './decoration.js';
import { Theme07IconChip } from './theme07-icons.js';

export interface Theme07SourcesV1Entry {
  name: string;
  url?: string;
  note?: string;
  confidence?: number;
}

export interface Theme07SourcesV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  sampleSize?: { value: string; label: string };
  entries?: Theme07SourcesV1Entry[];
  process?: string[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07SourcesV1Meta: LayoutMeta = {
  id: 'theme07_sources_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 数据来源',
  description: '数据来源页：标题 + 来源条目（可信度条）+ 处理流程 + 脚注',
  needsMedia: false,
  tags: ['sources', 'references', 'research'],
  contentShape: 'sources',
};

export const theme07SourcesV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'DATA & METHODOLOGY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '数据来源与口径' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '本报告以公开披露的 2024 年美国 AI 大额融资事件为样本，统一口径后进行结构化分析。' },
    {
      key: 'sampleSize',
      label: '样本量',
      type: 'object',
      defaultValue: { value: '97', label: '大额融资事件样本量 / 笔' },
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '说明', type: 'text' },
      ],
    },
    {
      key: 'entries',
      label: '来源条目',
      type: 'array',
      minItems: 1,
      maxItems: 16,
      defaultValue: [
        { name: 'CB Insights', url: 'cbinsights.com', note: '全球投融资事件追踪', confidence: 95 },
        { name: 'PitchBook', url: 'pitchbook.com', note: '估值与交易结构数据', confidence: 92 },
        { name: 'Crunchbase', url: 'crunchbase.com', note: '公司轮次与投资人数据', confidence: 90 },
        { name: '企业公开财报', url: '', note: '营收与运营指标', confidence: 88 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'url', label: '链接', type: 'text' },
        { key: 'note', label: '说明', type: 'text' },
        { key: 'confidence', label: '可信度(0-100)', type: 'number' },
      ],
    },
    {
      key: 'process',
      label: '处理流程',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      defaultValue: ['数据采集', '去重核对', '口径统一', '结构化', '交叉复核'],
      itemSchema: [{ key: 'item', label: '步骤', type: 'text', inlineEditable: true }],
    },
    { key: 'footnote', label: '脚注', type: 'textarea', inlineEditable: true, defaultValue: '统计口径：仅含 100 万美元以上披露事件，汇率按报告期末统一折算。' },
  ],
};

export function Theme07SourcesV1(props: Theme07SourcesV1Props): ReactNode {
  const { kicker, title, subtitle, sampleSize, entries = [], process = [], footnote, _slideIdx, _editable } = props;
  const validEntries = (entries || []).slice(0, 16);
  const normalizedProcess = (process || [])
    .map((p) => (typeof p === 'string' ? p : (p as { item?: string }).item ?? ''))
    .filter(Boolean);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-sources">
      <div className="lp-theme07-sources-header lp-rise">
        <Theme07IconChip name="book" />
        {kicker && (
          <div className="lp-theme07-kicker">
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32 }}>
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
            {subtitle && (
              <div style={{ maxWidth: 720, marginTop: 8 }}>
                <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>
              </div>
            )}
          </div>
          {sampleSize?.value && (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div className="lp-theme07-card-value" style={{ fontSize: 'var(--lp-font-size-display-small)' }}>
                <EditableField prop="sampleSize.value" slideIdx={_slideIdx} editable={_editable} as="span">{sampleSize.value}</EditableField>
              </div>
              <div className="lp-theme07-card-label">
                <EditableField prop="sampleSize.label" slideIdx={_slideIdx} editable={_editable} as="span">{sampleSize.label}</EditableField>
              </div>
            </div>
          )}
        </div>
        <div className="lp-theme07-underline" aria-hidden="true" />
      </div>
      {validEntries.length > 0 && (
        <div className="lp-theme07-sources-grid lp-rise">
          {validEntries.map((entry, i) => (
            <div key={i} className="lp-theme07-source-item" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="lp-theme07-source-number">{String(i + 1).padStart(2, '0')}</div>
              <div className="lp-theme07-source-body">
                <div className="lp-theme07-source-name">
                  <EditableField prop={`entries.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{entry.name}</EditableField>
                </div>
                {entry.note && (
                  <div className="lp-theme07-source-note">
                    <EditableField prop={`entries.${i}.note`} slideIdx={_slideIdx} editable={_editable} as="span">{entry.note}</EditableField>
                  </div>
                )}
                {entry.url && (
                  <div className="lp-theme07-source-url">
                    <EditableField prop={`entries.${i}.url`} slideIdx={_slideIdx} editable={_editable} as="span">{entry.url}</EditableField>
                  </div>
                )}
                {typeof entry.confidence === 'number' && (
                  <div className="lp-theme07-source-confidence">
                    <span className="lp-theme07-source-confidence-label">可信度</span>
                    <div className="lp-theme07-source-confidence-bar">
                      <div className="lp-theme07-source-confidence-fill" style={{ width: `${Math.max(0, Math.min(100, entry.confidence))}%` }} />
                    </div>
                    <span className="lp-theme07-source-confidence-label">{entry.confidence}/100</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {normalizedProcess.length > 0 && (
        <div className="lp-rise" style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'center', zIndex: 1 }}>
          {normalizedProcess.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ padding: '8px 16px', background: 'var(--lp-surface-solid)', border: '1px solid var(--lp-border)', borderRadius: 'var(--lp-radius-small)', fontFamily: 'var(--lp-font-mono)', fontSize: 'var(--lp-font-size-caption)', color: 'var(--lp-ink2)' }}>
                <span style={{ color: 'var(--lp-accent)', marginRight: 6 }}>{String(i + 1).padStart(2, '0')}</span>
                <EditableField prop={`process.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{step}</EditableField>
              </div>
              {i < normalizedProcess.length - 1 && <span style={{ color: 'var(--lp-ink3)', fontSize: 12 }}>→</span>}
            </div>
          ))}
        </div>
      )}
      {footnote && (
        <div className="lp-theme07-sources-footnote lp-rise">
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="p">{footnote}</EditableField>
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
      <Theme07MiniBars count={24} />
    </div>
  );
}
