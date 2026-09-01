// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 共享版面原语（Light Stream Primitives）。
 *
 * 风格：浅色扁平科技风。禁止使用玻璃拟态（glassmorphism）。
 * 装饰语汇：
 *   <Sheet>       版面容器 —— 承载情绪基底、骨架、细网格
 *   <TopBar>      顶部信号条 —— 左侧标题 / 右侧彩色状态点
 *   <NavDot>      导航色点
 *   <Card>        轻量圆角卡片 —— 白底 + 小阴影
 *   <Panel>       色块面板 —— 浅色灰底/情绪色左侧边条
 *   <SignalLine>  信号线 —— 细渐变线或短线组
 *   <PulseDot>    脉冲点 —— 带阴影的情绪色圆点
 *   <FineGrid>    细网格 —— 1px 浅色网格线
 *   <Tagline>     小标签
 *   <Caption>     说明小字
 *   <EditableField> 可编辑字段（复用全局组件）
 *   <EditorialPhoto> 影像位（复用全局可编辑图片）
 *
 * 每个版式必须声明 frame（版面骨架类型），供 audit-similarity 校验骨架配额。
 */

import type { CSSProperties, ReactElement, ReactNode } from 'react';
import type { PropsField } from '@lemonppt/core';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';
import type { Theme11Mood } from './tokens.js';

export type { Theme11Mood };

/** 版面骨架类型（配额受 audit-similarity 约束）。 */
export type Frame =
  | 'full-bleed'
  | 'split'
  | 'stage'
  | 'column-2'
  | 'column-3'
  | 'sidebar'
  | 'grid'
  | 'chart-canvas';

/* ═══════════════════════════════════════════════════════════════
 * Sheet —— 版面容器
 * ═══════════════════════════════════════════════════════════════ */

export interface SheetProps {
  mood?: Theme11Mood;
  frame: Frame;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}

export function Sheet(props: SheetProps): ReactElement {
  const { mood = 'daylight', frame, className = '', children, style } = props;
  const cls = [
    'lp-slide',
    'lp-theme11',
    `lp-theme11-mood-${mood}`,
    `lp-theme11-frame-${frame}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} data-t11-frame={frame} data-t11-mood={mood} style={style}>
      <div className="lp-theme11-inner">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * TopBar —— 顶部信号条
 * ═══════════════════════════════════════════════════════════════ */

export interface TopBarProps {
  label?: string;
  status?: string;
  slideIdx?: number;
  editable?: boolean;
}

export function TopBar(props: TopBarProps): ReactElement | null {
  const { label, status, slideIdx, editable } = props;
  if (!label && !status) return null;
  return (
    <div className="lp-theme11-topbar">
      {label && (
        <EditableField prop="topbarLabel" slideIdx={slideIdx} editable={editable} as="span" className="lp-theme11-topbar-label">
          {label}
        </EditableField>
      )}
      {status && (
        <div className="lp-theme11-topbar-status">
          <PulseDot size={8} color="var(--lp-accent)" />
          <EditableField prop="topbarStatus" slideIdx={slideIdx} editable={editable} as="span">
            {status}
          </EditableField>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * NavDot —— 导航色点
 * ═══════════════════════════════════════════════════════════════ */

export function NavDot(props: { color?: string; className?: string }): ReactElement {
  return (
    <span
      className={`lp-theme11-navdot ${props.className ?? ''}`.trim()}
      style={{ background: props.color ?? 'var(--lp-accent)' }}
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Card —— 轻量圆角卡片
 * ═══════════════════════════════════════════════════════════════ */

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'large' | 'medium' | 'none';
  mood?: Theme11Mood;
  style?: CSSProperties;
}

export function Card(props: CardProps): ReactElement {
  const { children, className = '', padding = 'large', style } = props;
  const paddingClass = padding === 'large' ? 'lp-theme11-tile-pad-large' : padding === 'medium' ? 'lp-theme11-tile-pad-medium' : '';
  return (
    <div className={`lp-theme11-tile ${paddingClass} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Panel —— 色块面板
 * ═══════════════════════════════════════════════════════════════ */

export interface PanelProps {
  children: ReactNode;
  className?: string;
  tone?: 'neutral' | 'accent' | 'violet' | 'orange' | 'green';
}

export function Panel(props: PanelProps): ReactElement {
  const { children, className = '', tone = 'neutral' } = props;
  return (
    <div className={`lp-theme11-panel lp-theme11-panel-${tone} ${className}`.trim()}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * SignalLine —— 信号线
 * ═══════════════════════════════════════════════════════════════ */

export function SignalLine(props: { className?: string }): ReactElement {
  return <div className={`lp-theme11-signal-line ${props.className ?? ''}`.trim()} aria-hidden="true" />;
}

export function SignalTicks(props: { count?: number; className?: string }): ReactElement {
  const count = props.count ?? 6;
  return (
    <div className={`lp-theme11-signal-ticks ${props.className ?? ''}`.trim()} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * PulseDot —— 脉冲点
 * ═══════════════════════════════════════════════════════════════ */

export function PulseDot(props: { size?: number; color?: string }): ReactElement {
  return (
    <span
      className="lp-theme11-pulse-dot"
      style={{ width: props.size ?? 10, height: props.size ?? 10, background: props.color ?? 'var(--lp-accent)' }}
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
 * FineGrid —— 细网格背景
 * ═══════════════════════════════════════════════════════════════ */

export function FineGrid(props: { className?: string }): ReactElement {
  return <div className={`lp-theme11-fine-grid ${props.className ?? ''}`.trim()} aria-hidden="true" />;
}

/* ═══════════════════════════════════════════════════════════════
 * GradientCard —— 高饱和渐变卡片
 * ═══════════════════════════════════════════════════════════════ */

export type GradientTone = 'blue' | 'violet' | 'orange' | 'green' | 'cyan';

export interface GradientCardProps {
  children: ReactNode;
  className?: string;
  tone?: GradientTone;
  style?: CSSProperties;
}

export function GradientCard(props: GradientCardProps): ReactElement {
  const { children, className = '', tone = 'blue', style } = props;
  return (
    <div className={`lp-theme11-gradient-card lp-theme11-gradient-card-${tone} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * IconChip —— 图标色块
 * ═══════════════════════════════════════════════════════════════ */

export interface IconChipProps {
  icon: ReactNode;
  tone?: GradientTone;
  className?: string;
}

export function IconChip(props: IconChipProps): ReactElement {
  const { icon, tone = 'blue', className = '' } = props;
  return (
    <span className={`lp-theme11-icon-chip lp-theme11-icon-chip-${tone} ${className}`.trim()} aria-hidden="true">
      {icon}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * SectionTitle —— 左侧彩色竖条标题
 * ═══════════════════════════════════════════════════════════════ */

export type SectionTitleTone = 'accent' | 'violet' | 'blue' | 'orange' | 'green';

export interface SectionTitleProps {
  children: ReactNode;
  tone?: SectionTitleTone;
  className?: string;
}

export function SectionTitle(props: SectionTitleProps): ReactElement {
  const { children, tone = 'accent', className = '' } = props;
  return (
    <div className={`lp-theme11-section-title lp-theme11-section-title-${tone} ${className}`.trim()}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Tagline / Caption
 * ═══════════════════════════════════════════════════════════════ */

export function Tagline(props: { children: ReactNode; className?: string }): ReactElement {
  return <span className={`lp-theme11-tagline ${props.className ?? ''}`.trim()}>{props.children}</span>;
}

export function Caption(props: { children: ReactNode; className?: string }): ReactElement {
  return <span className={`lp-theme11-caption ${props.className ?? ''}`.trim()}>{props.children}</span>;
}

/* ═══════════════════════════════════════════════════════════════
 * ChartInsight —— 图表说明性文字面板
 * ═══════════════════════════════════════════════════════════════ */

export interface ChartInsightItem {
  label: string;
  value: string;
  sub?: string;
  tone?: string;
}

export interface ChartInsightProps {
  insightTitle?: string;
  insightMetricValue?: string;
  insightMetricLabel?: string;
  insightItems?: ChartInsightItem[];
  insightNote?: string;
}

export function chartInsightSchema(opts: {
  title?: string;
  metricValue?: string;
  metricLabel?: string;
  items?: ChartInsightItem[];
  note?: string;
}): PropsField[] {
  return [
    { key: 'insightTitle', label: '洞察标题', type: 'text', defaultValue: opts.title ?? '' },
    { key: 'insightMetricValue', label: '核心指标数值', type: 'text', defaultValue: opts.metricValue ?? '' },
    { key: 'insightMetricLabel', label: '核心指标标签', type: 'text', defaultValue: opts.metricLabel ?? '' },
    {
      key: 'insightItems',
      label: '洞察项',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      defaultValue: opts.items ?? [],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'sub', label: '小字', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'accent', label: 'accent' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }, { value: 'cyan', label: 'cyan' }] },
      ],
    },
    { key: 'insightNote', label: '底部说明', type: 'textarea', defaultValue: opts.note ?? '' },
  ];
}

export function ChartInsightPanel(props: {
  title?: string;
  metricValue?: string;
  metricLabel?: string;
  items?: ChartInsightItem[];
  note?: string;
  slideIdx?: number;
  editable?: boolean;
}): ReactElement | null {
  const { title, metricValue, metricLabel, items = [], note, slideIdx, editable } = props;
  if (!title && !metricValue && !items.length && !note) return null;

  const toneMap: Record<string, string> = {
    accent: 'var(--lp-accent)',
    violet: 'var(--lp-violet)',
    orange: 'var(--lp-orange)',
    green: 'var(--lp-green)',
    cyan: 'var(--lp-cyan)',
  };

  return (
    <div className="lp-theme11-chart-side lp-rise">
      {title && (
        <div className="lp-theme11-chart-side-title">
          <EditableField prop="insightTitle" slideIdx={slideIdx} editable={editable} as="span">{title}</EditableField>
        </div>
      )}
      {metricValue && (
        <div className="lp-theme11-chart-metric">
          <div className="lp-theme11-chart-metric-value">
            <EditableField prop="insightMetricValue" slideIdx={slideIdx} editable={editable} as="span">{metricValue}</EditableField>
          </div>
          {metricLabel && (
            <div className="lp-theme11-chart-metric-label">
              <EditableField prop="insightMetricLabel" slideIdx={slideIdx} editable={editable} as="span">{metricLabel}</EditableField>
            </div>
          )}
        </div>
      )}
      {items.length > 0 && (
        <div className="lp-theme11-chart-insight-list">
          {items.map((it, i) => (
            <div key={i} className="lp-theme11-chart-insight-item">
              <span className="lp-theme11-chart-insight-dot" style={{ background: toneMap[it.tone ?? 'accent'] }} />
              <span className="lp-theme11-chart-insight-main">
                <span className="lp-theme11-chart-insight-label">{it.label}</span>
                {it.sub && <span className="lp-theme11-chart-insight-sub">{it.sub}</span>}
              </span>
              <span className="lp-theme11-chart-insight-value">{it.value}</span>
            </div>
          ))}
        </div>
      )}
      {note && (
        <div className="lp-theme11-chart-note">
          <EditableField prop="insightNote" slideIdx={slideIdx} editable={editable} as="span">{note}</EditableField>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * EditableField / EditorialPhoto 别名（保持共享文件内部可维护性）
 * ═══════════════════════════════════════════════════════════════ */

export { EditableField, LpEditableImage };
export const EditorialPhoto = LpEditableImage;
