// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme01 共享版面原语（Vivid Pop · 活力波普）。
 *
 * 设计关键词：轻盈、活泼、信息图、色块拼贴、零玻璃、零大卡片。
 * 复用 theme09 的工程方法论（基底 / 骨架 / 可编辑字段 / 图位），但视觉语汇切换为
 * 轻盈信息图风格：IconHeading + 细边框 Pill、VennCircle、HighlightBlock、SwotBadge、
 * DashedLine、Arrow、NumberSticker 等。
 */

import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

/** 基底：light（浅白）/ tint（淡彩晕染）。每个版式预分配，形成翻页节奏。 */
export type Substrate = 'light' | 'tint';

/** 淡彩晕染色调，用于交替翻页节奏。 */
export type TintColor = 'amber' | 'blue' | 'pink' | 'green';

/** 版面骨架类型（与 theme09 同源枚举，兼容 audit-similarity）。 */
export type Frame =
  | 'full-bleed'
  | 'split'
  | 'column-3'
  | 'sidebar'
  | 'grid'
  | 'stage'
  | 'chart-canvas';

/* ═══════════════════════════════════════════════════════════════
 * Sheet —— 版面容器
 * ═══════════════════════════════════════════════════════════════ */

export interface SheetProps {
  substrate?: Substrate;
  tint?: TintColor;
  frame: Frame;
  className?: string;
  children: ReactNode;
}

export function Sheet(props: SheetProps): ReactElement {
  const { substrate = 'light', tint, frame, className = '', children } = props;

  const cls = [
    'lp-slide',
    'lp-theme01',
    substrate === 'tint' ? 'lp-theme01-sub-tint' : 'lp-theme01-sub-light',
    `lp-theme01-frame-${frame}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cls}
      data-t1-frame={frame}
      data-t1-substrate={substrate}
      data-t1-tint={tint}
    >
      {children}
    </div>
  );
}

/**
 * GlassCard —— 旧版卡片兼容容器（零玻璃 / 零大卡片）。
 * 重构期间保留同名导出，避免未覆盖版式编译失败；内部退化为普通块级容器，
 * 由外层版式自行决定背景与边框。
 */
export interface GlassCardProps {
  className?: string;
  children: ReactNode;
}

export function GlassCard(props: GlassCardProps): ReactElement {
  const { className = '', children } = props;
  return <div className={className}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════════════
 * Masthead —— 顶部通栏（logo / 页码 / 标签）
 * ═══════════════════════════════════════════════════════════════ */

export interface MastheadProps {
  section?: string;
  sectionEn?: string;
  mark?: string;
  slideIdx?: number;
  editable?: boolean;
  propPrefix?: string;
}

export function Masthead(props: MastheadProps): ReactElement | null {
  const { section, sectionEn, mark, slideIdx, editable, propPrefix = '' } = props;
  if (!section && !sectionEn && !mark) return null;
  const p = (k: string) => (propPrefix ? `${propPrefix}.${k}` : k);

  return (
    <header className="lp-theme01-masthead">
      <div className="lp-theme01-masthead-left">
        <span className="lp-theme01-masthead-bar" aria-hidden="true" />
        {section && (
          <EditableField
            prop={p('section')}
            slideIdx={slideIdx}
            editable={editable}
            as="span"
            className="lp-theme01-masthead-name"
          >
            {section}
          </EditableField>
        )}
        {sectionEn && (
          <EditableField
            prop={p('sectionEn')}
            slideIdx={slideIdx}
            editable={editable}
            as="span"
            className="lp-theme01-masthead-en"
          >
            {sectionEn}
          </EditableField>
        )}
      </div>
      {mark && (
        <EditableField
          prop={p('mark')}
          slideIdx={slideIdx}
          editable={editable}
          as="span"
          className="lp-theme01-masthead-mark"
        >
          {mark}
        </EditableField>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Folio —— 骑缝（页脚）
 * ═══════════════════════════════════════════════════════════════ */

export interface FolioProps {
  left?: string;
  page?: string;
  right?: string;
  slideIdx?: number;
  editable?: boolean;
  propPrefix?: string;
  inverse?: boolean;
}

export function Folio(props: FolioProps): ReactElement | null {
  const { left, page, right, slideIdx, editable, propPrefix = '', inverse } = props;
  if (!left && !page && !right) return null;
  const p = (k: string) => (propPrefix ? `${propPrefix}.${k}` : k);

  return (
    <footer className={`lp-theme01-folio ${inverse ? 'inverse' : ''}`}>
      <span className="lp-theme01-folio-left">
        {left && (
          <EditableField prop={p('folioLeft')} slideIdx={slideIdx} editable={editable} as="span">
            {left}
          </EditableField>
        )}
      </span>
      <span className="lp-theme01-folio-rule" aria-hidden="true" />
      {page && (
        <span className="lp-theme01-folio-page">
          <EditableField prop={p('folioPage')} slideIdx={slideIdx} editable={editable} as="span">
            {page}
          </EditableField>
        </span>
      )}
      <span className="lp-theme01-folio-rule" aria-hidden="true" />
      <span className="lp-theme01-folio-right">
        {right && (
          <EditableField prop={p('folioRight')} slideIdx={slideIdx} editable={editable} as="span">
            {right}
          </EditableField>
        )}
      </span>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * LpPhoto —— 影像位（可上传图位）
 * ═══════════════════════════════════════════════════════════════ */

export type PhotoRatio = '1:1' | '3:2' | '4:3' | '16:9' | '2:3' | '3:4' | 'fill';

export interface LpPhotoProps {
  prop: string;
  src?: string;
  slideIdx?: number;
  editable?: boolean;
  ratio?: PhotoRatio;
  hint?: string;
  showSpec?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function LpPhoto(props: LpPhotoProps): ReactElement {
  const {
    prop,
    src,
    slideIdx,
    editable,
    ratio = '3:2',
    hint = '点击上传影像',
    showSpec = true,
    className = '',
    style,
    children,
  } = props;

  const cls = ['lp-theme01-photo', `fit-${ratio}`, src ? 'filled' : 'empty', className]
    .filter(Boolean)
    .join(' ');

  const boxStyle: CSSProperties = { ...style };
  if (ratio !== 'fill') {
    boxStyle.aspectRatio = ratio.replace(':', ' / ');
  }

  return (
    <figure
      className={cls}
      style={boxStyle}
      data-t1-photo="true"
      data-t1-ratio={ratio}
      data-lp-image-ratio={ratio}
    >
      <LpEditableImage
        prop={prop}
        src={src}
        slideIdx={slideIdx}
        editable={editable}
        className="lp-theme01-photo-img"
        placeholderClassName="lp-theme01-photo-slot"
        showIcon={false}
        placeholderChildren={
          <>
            <span className="lp-theme01-photo-reg" aria-hidden="true" />
            <span className="lp-theme01-photo-hint">{hint}</span>
            {showSpec && (
              <span className="lp-theme01-photo-spec" aria-hidden="true">
                {ratio === 'fill' ? 'FULL BLEED' : ratio}
              </span>
            )}
          </>
        }
      />
      {children && <figcaption className="lp-theme01-photo-overlay">{children}</figcaption>}
    </figure>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Headline —— 双语标题
 * ═══════════════════════════════════════════════════════════════ */

export interface HeadlineProps {
  cn: string;
  en?: string;
  slideIdx?: number;
  editable?: boolean;
  propCn?: string;
  propEn?: string;
  size?: 'display' | 'large' | 'medium';
  className?: string;
}

export function Headline(props: HeadlineProps): ReactElement {
  const {
    cn,
    en,
    slideIdx,
    editable,
    propCn = 'title',
    propEn = 'titleEn',
    size = 'large',
    className = '',
  } = props;

  return (
    <div className={`lp-theme01-headline size-${size} ${className}`.trim()}>
      {en && (
        <EditableField
          prop={propEn}
          slideIdx={slideIdx}
          editable={editable}
          as="span"
          className="lp-theme01-headline-en"
        >
          {en}
        </EditableField>
      )}
      <EditableField
        prop={propCn}
        slideIdx={slideIdx}
        editable={editable}
        as="h1"
        className="lp-theme01-headline-cn"
      >
        {cn}
      </EditableField>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * 装饰：规线 / 中缝
 * ═══════════════════════════════════════════════════════════════ */

export function Rule(props: { strong?: boolean; className?: string }): ReactElement {
  return (
    <span
      className={`lp-theme01-rule ${props.strong ? 'strong' : ''} ${props.className ?? ''}`.trim()}
      aria-hidden="true"
    />
  );
}

export function Gutter(props: { className?: string }): ReactElement {
  return (
    <span className={`lp-theme01-gutter ${props.className ?? ''}`.trim()} aria-hidden="true" />
  );
}

/** 细虚线分隔（参考图 2 SWOT 矩阵） */
export function DashedLine(props: { vertical?: boolean; className?: string }): ReactElement {
  return (
    <span
      className={`lp-dashed-line ${props.vertical ? 'vertical' : ''} ${props.className ?? ''}`.trim()}
      aria-hidden="true"
    />
  );
}

/** 箭头/时间线连接（参考图 3） */
export function Arrow(props: { direction?: 'right' | 'down'; className?: string }): ReactElement {
  return (
    <span
      className={`lp-arrow direction-${props.direction ?? 'right'} ${props.className ?? ''}`.trim()}
      aria-hidden="true"
    />
  );
}

/** 归一化 array 类型字段（编辑器可能把字符串数组存成 {item} 对象数组） */
export function normalizeStrings(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((t) => (typeof t === 'string' ? t : ((t as { item?: string })?.item ?? '')))
    .filter(Boolean);
}

/** 按 imgCount 生成图位下标序列 */
export function photoSlots(count: number, max = 9): number[] {
  const n = Math.max(0, Math.min(max, Math.floor(count) || 0));
  return Array.from({ length: n }, (_, i) => i);
}

/* ═══════════════════════════════════════════════════════════════
 * Vivid Pop 装饰组件
 * ═══════════════════════════════════════════════════════════════ */

export interface PillProps {
  children: ReactNode;
  className?: string;
  variant?: 'outline' | 'fill';
  color?: 'accent' | 'red' | 'blue' | 'green' | 'amber' | 'violet' | 'cyan' | 'pink';
}

/** 细边框胶囊标签（参考图 1），默认 outline */
export function Pill(props: PillProps): ReactElement {
  const { children, className = '', variant = 'outline', color = 'accent' } = props;
  const cls = ['lp-pill', `variant-${variant}`, color, className].filter(Boolean).join(' ');
  return <span className={cls}>{children}</span>;
}

export interface IconChipProps {
  children: ReactNode;
  className?: string;
  color?: 'accent' | 'blue' | 'green' | 'amber' | 'violet' | 'cyan' | 'pink';
}

export function IconChip(props: IconChipProps): ReactElement {
  const { children, className = '', color = 'accent' } = props;
  const cls = ['lp-icon-chip', color, className].filter(Boolean).join(' ');
  return <span className={cls}>{children}</span>;
}

export interface NumberStickerProps {
  value: ReactNode;
  className?: string;
  outline?: boolean;
}

export function NumberSticker(props: NumberStickerProps): ReactElement {
  const { value, className = '', outline } = props;
  const cls = ['lp-number-sticker', outline && 'outline', className].filter(Boolean).join(' ');
  return <span className={cls}>{value}</span>;
}

/** 图标 + 彩色标题组（替代卡片，参考图 1 / 参考图 2） */
export interface IconHeadingProps {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  color?: 'accent' | 'red' | 'blue' | 'green' | 'amber' | 'violet' | 'cyan' | 'pink';
  className?: string;
}

export function IconHeading(props: IconHeadingProps): ReactElement {
  const { icon, title, subtitle, color = 'accent', className = '' } = props;
  return (
    <div className={`lp-icon-heading color-${color} ${className}`.trim()}>
      {icon && <span className="lp-icon-heading-icon">{icon}</span>}
      <div className="lp-icon-heading-body">
        <div className="lp-icon-heading-title">{title}</div>
        {subtitle && <div className="lp-icon-heading-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}

/** SWOT 彩色徽章（参考图 2） */
export interface SwotBadgeProps {
  letter: string;
  color?: 'blue' | 'red' | 'green' | 'amber' | 'violet';
  className?: string;
}

export function SwotBadge(props: SwotBadgeProps): ReactElement {
  const { letter, color = 'blue', className = '' } = props;
  return (
    <span className={`lp-swot-badge color-${color} ${className}`.trim()} aria-hidden="true">
      {letter}
    </span>
  );
}

/** 彩色大色块强调区（参考图 3），可带卷角 */
export interface HighlightBlockProps {
  children: ReactNode;
  color?: 'accent' | 'red' | 'blue' | 'green' | 'amber' | 'violet';
  curled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function HighlightBlock(props: HighlightBlockProps): ReactElement {
  const { children, color = 'accent', curled, className = '', style } = props;
  const cls = ['lp-highlight-block', `color-${color}`, curled && 'lp-curled-corner', className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}

/** 淡彩半透明维恩圆（参考图 5） */
export interface VennCircleProps {
  label: ReactNode;
  sub?: ReactNode;
  color?: 'red' | 'amber' | 'green' | 'blue' | 'violet' | 'cyan' | 'pink';
  className?: string;
  style?: CSSProperties;
}

export function VennCircle(props: VennCircleProps): ReactElement {
  const { label, sub, color = 'blue', className = '', style } = props;
  return (
    <div className={`lp-venn-circle color-${color} ${className}`.trim()} style={style}>
      <div className="lp-venn-circle-label">{label}</div>
      {sub && <div className="lp-venn-circle-sub">{sub}</div>}
    </div>
  );
}

export interface SectionTitleProps {
  sub?: string;
  title: string;
  slideIdx?: number;
  editable?: boolean;
  propSub?: string;
  propTitle?: string;
  className?: string;
}

export function SectionTitle(props: SectionTitleProps): ReactElement {
  const {
    sub,
    title,
    slideIdx,
    editable,
    propSub = 'sectionSub',
    propTitle = 'sectionTitle',
    className = '',
  } = props;
  return (
    <div className={`lp-section-title ${className}`.trim()}>
      <div>
        {sub && (
          <EditableField
            prop={propSub}
            slideIdx={slideIdx}
            editable={editable}
            as="span"
            className="lp-section-sub"
          >
            {sub}
          </EditableField>
        )}
        <EditableField prop={propTitle} slideIdx={slideIdx} editable={editable} as="h2">
          {title}
        </EditableField>
      </div>
    </div>
  );
}

export interface HighlightProps {
  children: ReactNode;
  className?: string;
}

export function Highlight(props: HighlightProps): ReactElement {
  return (
    <span className={`lp-highlight-marker ${props.className ?? ''}`.trim()}>
      {props.children}
    </span>
  );
}

export function DottedPattern(props: {
  className?: string;
  style?: CSSProperties;
}): ReactElement {
  return <span className={`lp-dotted-pattern ${props.className ?? ''}`.trim()} style={props.style} />;
}

export function Blob(props: {
  className?: string;
  style?: CSSProperties;
}): ReactElement {
  return <span className={`lp-blob ${props.className ?? ''}`.trim()} style={props.style} />;
}

/** 圆环装饰 */
export function Ring(props: {
  className?: string;
  style?: CSSProperties;
}): ReactElement {
  return <span className={`lp-ring ${props.className ?? ''}`.trim()} style={props.style} />;
}

/** 斜线装饰 */
export function Slash(props: {
  className?: string;
  style?: CSSProperties;
}): ReactElement {
  return <span className={`lp-slash ${props.className ?? ''}`.trim()} style={props.style} />;
}

/** 加号装饰 */
export function Plus(props: {
  className?: string;
  style?: CSSProperties;
}): ReactElement {
  return <span className={`lp-plus ${props.className ?? ''}`.trim()} style={props.style} />;
}

/** 方格图案装饰 */
export function GridPattern(props: {
  className?: string;
  style?: CSSProperties;
}): ReactElement {
  return <span className={`lp-grid-pattern ${props.className ?? ''}`.trim()} style={props.style} />;
}

/* 兼容旧 Label / Focus（保留导出，避免破坏引用） */
export type LabelKind = 'number' | 'symbol' | 'keyword';
export interface LabelProps {
  kind?: LabelKind;
  children: ReactNode;
  className?: string;
}
export function Label(props: LabelProps): ReactElement {
  const { kind = 'keyword', children, className = '' } = props;
  return <span className={`lp-theme01-label kind-${kind} ${className}`.trim()}>{children}</span>;
}

export type FocusSide = 'left' | 'right';
export interface FocusProps {
  side?: FocusSide;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}
export function Focus(props: FocusProps): ReactElement {
  const { side = 'left', children, className = '', style } = props;
  return (
    <div className={`lp-theme01-focus side-${side} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
