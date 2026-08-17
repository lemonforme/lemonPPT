// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 共享版面原语（Financial Editorial Primitives）。
 *
 * ⚠️ 反「换色不换版」硬约束：
 * 本主题**禁止**出现 theme07/08/09 的骨架语汇（kicker / glow-line / eyebrow /
 * masthead / gutter / standfirst / folio 之 theme09 变体 / lp-theme08-*）。
 * theme10 的页眉页脚语汇来自金融终端本身：
 *
 *   <Ticker>    行情带 —— 顶部 mono 滚动代码/指数，替代页眉 kicker
 *   <LedgerRule> 账本细线 —— 1px 半透明金线，替代 section-header
 *   <Scale>      刻度尺 —— 重复短线 + mono 标注，原创装饰
 *   <Folio>      页脚三段 —— 栏目 / 页码 / 期号
 *   <Stamp>      来源戳 —— 右下角 mono 小字（数据来源，金融报告惯用）
 *   <EditorialPhoto> 影像位 —— 复用 theme09 上传属性约定，仅换金线皮肤
 *
 * 每个版式必须声明 frame（版面骨架类型），供 audit-similarity 校验骨架配额。
 */

import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';
import type { Theme10Mood } from './tokens.js';

export type { Theme10Mood };

/** 版面骨架类型（配额受 audit-similarity 约束）。 */
export type Frame =
  | 'full-bleed'
  | 'spread'
  | 'column-3'
  | 'sidebar'
  | 'grid'
  | 'stage'
  | 'chart-canvas';

/* ═══════════════════════════════════════════════════════════════
 * Sheet —— 版面容器（承载情绪基底与骨架声明）
 * ═══════════════════════════════════════════════════════════════ */

export interface SheetProps {
  /** 情绪基底：aurora / obsidian / ember（按页预分配，形成翻页节奏） */
  mood?: Theme10Mood;
  frame: Frame;
  /** 额外类名，通常是版式自身的 lp-theme10-xxx */
  className?: string;
  /** 整页强调（冰蓝/金线浓度提升） */
  accent?: boolean;
  children: ReactNode;
}

export function Sheet(props: SheetProps): ReactElement {
  const {
    mood = 'obsidian',
    frame,
    className = '',
    accent,
    children,
  } = props;

  const cls = [
    'lp-slide',
    'lp-theme10',
    `lp-theme10-mood-${mood}`,
    `lp-theme10-frame-${frame}`,
    accent ? 'lp-theme10-accented' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} data-t10-frame={frame} data-t10-mood={mood}>
      <div className="lp-theme10-inner">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Ticker —— 行情带（页眉）
 * 结构：mono 滚动代码/指数，▲ 涨(金) ▼ 跌(铜)
 * ═══════════════════════════════════════════════════════════════ */

export interface TickerItem {
  code: string;
  value?: string;
  delta?: number;
}

export interface TickerProps {
  items?: TickerItem[];
  slideIdx?: number;
  editable?: boolean;
  prop?: string;
}

export function Ticker(props: TickerProps): ReactElement | null {
  const { items } = props;
  if (!items || items.length === 0) return null;

  return (
    <div className="lp-theme10-ticker" aria-hidden="true">
      {items.map((it, i) => (
        <span className="t10-tick" key={i}>
          <b>{it.code}</b>
          {it.value && <span>{it.value}</span>}
          {it.delta !== undefined && (
            <span className={it.delta >= 0 ? 't10-up' : 't10-down'}>
              {it.delta >= 0 ? '▲' : '▼'} {Math.abs(it.delta).toFixed(2)}%
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * LedgerRule —— 账本细线
 * ═══════════════════════════════════════════════════════════════ */

export function LedgerRule(props: { dashed?: boolean; className?: string }): ReactElement {
  return (
    <div
      className={`lp-theme10-ledger ${props.dashed ? 'dashed' : ''} ${props.className ?? ''}`.trim()}
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Scale —— 刻度尺
 * ═══════════════════════════════════════════════════════════════ */

export interface ScaleProps {
  ticks?: number;
  majors?: number[];
  labels?: string[];
}

export function Scale(props: ScaleProps): ReactElement {
  const { ticks = 12, majors = [0, 6, 11], labels = [] } = props;
  return (
    <div className="lp-theme10-scale" aria-hidden="true">
      {Array.from({ length: ticks }).map((_, i) => (
        <span className={`t10-tick ${majors.includes(i) ? 'major' : ''}`} key={i}>
          {majors.includes(i) && labels[majors.indexOf(i)] && (
            <span>{labels[majors.indexOf(i)]}</span>
          )}
        </span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Folio —— 页脚三段式
 * ═══════════════════════════════════════════════════════════════ */

export interface FolioProps {
  left?: string;
  page?: string;
  right?: string;
}

export function Folio(props: FolioProps): ReactElement | null {
  const { left, page, right } = props;
  if (!left && !page && !right) return null;
  return (
    <footer className="lp-theme10-folio">
      {left && <span className="t10-folio-left">{left}</span>}
      {page && (
        <span className="t10-folio-page">
          {page}
        </span>
      )}
      <span className="t10-folio-rule" />
      {right && <span className="t10-folio-right">{right}</span>}
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Stamp —— 数据来源戳
 * ═══════════════════════════════════════════════════════════════ */

export function Stamp(props: { text?: string }): ReactElement | null {
  if (!props.text) return null;
  return <div className="lp-theme10-stamp">{props.text}</div>;
}

/* ═══════════════════════════════════════════════════════════════
 * EditorialPhoto —— 影像位（复用 theme09 上传属性约定，金线皮肤）
 * ═══════════════════════════════════════════════════════════════ */

export type PhotoRatio = '1:1' | '3:2' | '4:3' | '16:9' | '2:3' | '3:4' | 'fill';

export interface EditorialPhotoProps {
  prop: string;
  src?: string;
  slideIdx?: number;
  editable?: boolean;
  ratio?: PhotoRatio;
  fit?: 'cover' | 'contain';
  hint?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function EditorialPhoto(props: EditorialPhotoProps): ReactElement {
  const {
    prop,
    src,
    slideIdx,
    editable,
    ratio = '3:2',
    fit = 'cover',
    hint = '点击上传影像',
    className = '',
    style,
    children,
  } = props;

  const cls = [
    'lp-theme10-photo',
    `fit-${fit}`,
    src ? 'filled' : 'empty',
    className,
  ]
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
      data-t10-photo="true"
      data-t10-ratio={ratio}
      data-lp-image-ratio={ratio}
    >
      <LpEditableImage
        prop={prop}
        src={src}
        slideIdx={slideIdx}
        editable={editable}
        className="lp-theme10-photo-img"
        placeholderClassName="lp-theme10-photo-slot"
        showIcon={false}
        placeholderChildren={
          <>
            <span className="lp-theme10-photo-reg" aria-hidden="true" />
            <span>{hint}</span>
            {ratio !== 'fill' && (
              <span className="lp-theme10-photo-spec" aria-hidden="true">
                {ratio}
              </span>
            )}
          </>
        }
      />
      {children && <figcaption className="lp-theme10-photo-overlay">{children}</figcaption>}
    </figure>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * 辅助
 * ═══════════════════════════════════════════════════════════════ */

export { EditableField };

/** 归一化 array 类型字段（编辑器可能把字符串数组存成 {item} 对象数组） */
export function normalizeStrings(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((t) => (typeof t === 'string' ? t : ((t as { item?: string })?.item ?? '')))
    .filter(Boolean);
}

/** 双语标题（cn + en，金融编辑语法） */
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
    <div className={`lp-theme10-headline size-${size} ${className}`.trim()}>
      {en && (
        <EditableField
          prop={propEn}
          slideIdx={slideIdx}
          editable={editable}
          as="span"
          className="lp-theme10-en"
        >
          {en}
        </EditableField>
      )}
      <EditableField
        prop={propCn}
        slideIdx={slideIdx}
        editable={editable}
        as="h1"
        className="lp-theme10-title"
      >
        {cn}
      </EditableField>
    </div>
  );
}
