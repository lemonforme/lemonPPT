// lemonPPT - theme08 黑金实验 · 产业链分层
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08ChainTag {
  text: string;
}

export interface Theme08ChainLayer {
  icon: string;
  title: string;
  sub?: string;
  tags?: Theme08ChainTag[];
  sideNote?: string;
  dark?: boolean;
}

export interface Theme08ChainV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  layers?: Theme08ChainLayer[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08ChainV1Meta: LayoutMeta = {
  id: 'theme08_chain_v1',
  theme: 'theme08',
  role: 'content',
  displayName: 'Theme 08 产业链',
  description: '上游/中游/下游三层堆叠卡片 + 手绘箭头连接，突出中游',
  needsMedia: false,
  tags: ['chain', 'layer', 'structure', 'black-gold'],
  contentShape: 'chain',
};

export const theme08ChainV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'VALUE CHAIN' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '产业链分层透视' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '上游、中游、下游的资本位置' },
    {
      key: 'layers',
      label: '层级',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { icon: '上', title: '上游 · 基础设施', sub: 'INFRASTRUCTURE', tags: [{ text: '算力' }, { text: 'AI 芯片' }, { text: '数据' }], sideNote: '资本确定性最高', dark: false },
        { icon: '中', title: '中游 · 模型层', sub: 'MODEL LAYER', tags: [{ text: '通用模型' }, { text: '专用模型' }], sideNote: '叙事与估值集中', dark: true },
        { icon: '下', title: '下游 · 应用层', sub: 'APPLICATION', tags: [{ text: '企业应用' }, { text: 'AI 搜索' }, { text: '机器人' }], sideNote: '商业兑现待验证', dark: false },
      ],
      itemSchema: [
        { key: 'icon', label: '图标字', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'sub', label: '英文副标', type: 'text' },
        { key: 'sideNote', label: '右侧备注', type: 'text' },
        { key: 'dark', label: '深色突出', type: 'boolean' },
        { key: 'tags', label: '标签', type: 'array', itemSchema: [{ key: 'text', label: '文字', type: 'text' }] },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '21' },
  ],
};

export function Theme08ChainV1(props: Theme08ChainV1Props): ReactNode {
  const { kicker, title, subtitle, layers = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (layers || []).slice(0, 4);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-chain-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="target" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-chain lp-rise">
            {valid.map((layer, i) => (
              <div key={i} className="lp-theme08-chain-col">
                {i > 0 && (
                  <div className="lp-theme08-chain-arrow" aria-hidden="true">
                    <svg width="22" height="30" viewBox="0 0 22 30" fill="none" stroke="var(--lp-accent)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 2 L11 24 M5 18 L11 26 L17 18" />
                    </svg>
                  </div>
                )}
                <div
                  className={`lp-theme08-chain-layer${layer.dark ? ' dark' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: 18,
                    padding: '16px 20px',
                    borderRadius: 14,
                    border: `1px solid ${layer.dark ? 'transparent' : 'color-mix(in srgb, var(--lp-ink-soft) 22%, transparent)'}`,
                    background: layer.dark ? 'var(--lp-inverse-panel)' : 'color-mix(in srgb, var(--lp-ink-soft) 8%, transparent)',
                    boxShadow: layer.dark ? '0 0 0 1px color-mix(in srgb, var(--lp-accent) 40%, transparent), 0 12px 30px rgba(0,0,0,0.45)' : 'none',
                  }}
                >
                  <div
                    className="lp-theme08-chain-icon"
                    style={{
                      flex: '0 0 64px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: 12,
                      background: 'color-mix(in srgb, var(--lp-accent) 16%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--lp-accent) 50%, transparent)',
                      color: 'var(--lp-accent)',
                      fontSize: 30,
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    <EditableField prop={`layers.${i}.icon`} slideIdx={_slideIdx} editable={_editable} as="span">{layer.icon}</EditableField>
                  </div>
                  <div className="lp-theme08-chain-main" style={{ flex: 1, minWidth: 0 }}>
                    <div className="lp-theme08-chain-title-row" style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ margin: 0, fontSize: 19, fontWeight: 700, color: 'var(--lp-ink)' }}>
                        <EditableField prop={`layers.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme08-chain-title">{layer.title}</EditableField>
                      </div>
                      {layer.sub && (
                        <div style={{ fontSize: 11, letterSpacing: 2, color: 'var(--lp-accent)', textTransform: 'uppercase' }}>
                          <EditableField prop={`layers.${i}.sub`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme08-chain-sub">{layer.sub}</EditableField>
                        </div>
                      )}
                    </div>
                    <div className="lp-theme08-chain-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                      {(layer.tags || []).map((t, j) => (
                        <span
                          key={j}
                          className="lp-theme08-chain-tag"
                          style={{
                            padding: '3px 11px',
                            borderRadius: 999,
                            border: '1px solid color-mix(in srgb, var(--lp-accent) 45%, transparent)',
                            background: 'color-mix(in srgb, var(--lp-accent) 10%, transparent)',
                            color: 'var(--lp-ink)',
                            fontSize: 12,
                          }}
                        >
                          <EditableField prop={`layers.${i}.tags.${j}.text`} slideIdx={_slideIdx} editable={_editable} as="span">{t.text}</EditableField>
                        </span>
                      ))}
                    </div>
                  </div>
                  {layer.sideNote && (
                    <div className="lp-theme08-chain-note" style={{ flex: '0 0 120px', alignSelf: 'center', textAlign: 'right', fontSize: 12, color: 'var(--lp-ink-soft)', lineHeight: 1.5 }}>
                      <EditableField prop={`layers.${i}.sideNote`} slideIdx={_slideIdx} editable={_editable} as="span">{layer.sideNote}</EditableField>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme08-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
