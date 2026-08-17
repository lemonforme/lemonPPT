// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme01 共享版面原语（Editorial Primitives）。
 *
 * 按 theme09 的「工程方法论」平移到 theme01，但**翻成 theme01 的暖炭暗色编辑风**
 * （espresso 基底 + 陶土 terracotta 签名强调 + 奶油 cream 文字），
 * 不复制 theme09 的纸/墨印刷语汇或红线色值（#46e3c6 / #4a86ff / bg-deep / bg-blue）。
 *
 *   <Sheet>     版面容器 —— 承载基底（light / tint）与骨架（frame）声明，
 *               并把 substrate / frame 落到 DOM 的 data-t1-* 属性，供
 *               scripts/audit-similarity.mjs 校验骨架配额与跨主题骨架签名。
 *   <Masthead>  刊头 —— 栏目名 + 强调短杠 + 可选期号（编辑胶囊式）
 *   <Folio>     骑缝 —— 页脚三段式（栏目 / 页码 / 出处）
 *   <GlassCard> 卡片 —— 统一 surface + border + shadow（暗面）
 *   <LpPhoto>   影像位 —— 可上传图位，空态为占位符（非死灰块）
 *   <Headline>  双语标题
 *   <Rule>/<Gutter> 装饰规线 / 中缝
 *   <Label>     编辑语汇标签（number / symbol / keyword 三型，对齐 theme09 标签三选一）
 *   <Focus>     聚光切换（left / right，对齐 theme09 Focus 左右切换）
 *
 * 复用 theme09 的 7 种 frame 枚举以兼容 audit-similarity 的骨架配额。
 */

import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

/** 基底：浅玻璃 / 浅着色。每个版式预分配，形成翻页节奏（非 light/dark 切换）。 */
export type Substrate = 'light' | 'tint';

/** 版面骨架类型（配额受 audit-similarity 约束，与 theme09 同源枚举）。 */
export type Frame =
  | 'full-bleed'
  | 'spread'
  | 'column-3'
  | 'sidebar'
  | 'grid'
  | 'stage'
  | 'chart-canvas';

/* ═══════════════════════════════════════════════════════════════
 * Sheet —— 版面容器（承载基底与骨架声明）
 * ═══════════════════════════════════════════════════════════════ */

export interface SheetProps {
  substrate?: Substrate;
  frame: Frame;
  /** 额外类名，通常是版式自身的 lp-xxx-v1 */
  className?: string;
  children: ReactNode;
}

export function Sheet(props: SheetProps): ReactElement {
  const { substrate = 'light', frame, className = '', children } = props;

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
    <div className={cls} data-t1-frame={frame} data-t1-substrate={substrate}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Masthead —— 刊头（页眉）
 * 结构：强调短杠 ▍ + 栏目名 + 可选英文副名，右侧可挂期号
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
 * Folio —— 骑缝（页脚三段式）
 * 结构：栏目名 ── 页码 ── 出处
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
 * GlassCard —— 玻璃卡片
 * ═══════════════════════════════════════════════════════════════ */

export interface GlassCardProps {
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}

export function GlassCard(props: GlassCardProps): ReactElement {
  const { className = '', children, style } = props;
  return (
    <div className={`lp-card lp-theme01-card ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * LpPhoto —— 影像位（theme01 玻璃风可上传图位）
 *
 * 渲染出的元素始终带 data-lp-editable-image，点击即可上传。
 * 支持数组下标 prop（images.0），驱动多图版式。
 * 空态不是灰块，而是玻璃占位符（虚线胶囊 + 提示文案 + 比例标注）。
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
 * Label —— 编辑语汇标签（number / symbol / keyword 三型）
 * 对齐 theme09 的「标签类型三选一」方法论，但用 theme01 的陶土/奶油编辑语汇。
 * ═══════════════════════════════════════════════════════════════ */

export type LabelKind = 'number' | 'symbol' | 'keyword';

export interface LabelProps {
  kind?: LabelKind;
  children: ReactNode;
  className?: string;
}

export function Label(props: LabelProps): ReactElement {
  const { kind = 'keyword', children, className = '' } = props;
  return (
    <span className={`lp-theme01-label kind-${kind} ${className}`.trim()}>{children}</span>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Focus —— 聚光切换（left / right）
 * 对齐 theme09 的「Focus 左右切换」方法论：在暗色编辑风里制造聚光晕偏移。
 * ═══════════════════════════════════════════════════════════════ */

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
