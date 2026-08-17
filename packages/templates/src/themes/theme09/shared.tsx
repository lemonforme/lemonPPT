// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 共享版面原语（Editorial Primitives）。
 *
 * ⚠️ 反「换色不换版」硬约束：
 * 本主题**禁止**出现 theme07/08 的骨架语汇（kicker / glow-line / eyebrow /
 * section-header / watermark-number / cover-main / cover-aside / cover-metrics）。
 * theme09 的页眉页脚语汇来自印刷品本身：
 *
 *   <Masthead>    刊头   —— 栏目名 + 专色短杠 + 双语副名
 *   <Folio>       骑缝   —— 页脚三段式（栏目 / 页码 / 期号）
 *   <Standfirst>  导语   —— 首字下沉的衬线导语块
 *   <InkPhoto>    影像位 —— 可上传图位，空态为印刷占位符
 *   <ColorBar>    色标条 —— 印刷色标方块序列
 *
 * 每个版式还必须声明 frame（版面骨架类型），由 <Sheet> 落到 DOM 上，
 * 供 scripts/audit-similarity.mjs 校验骨架配额。
 */

import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

/** 基底：纸 / 墨。每个版式预分配，形成翻页节奏。 */
export type Substrate = 'paper' | 'ink';

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
 * Sheet —— 版面容器（承载基底与骨架声明）
 * ═══════════════════════════════════════════════════════════════ */

export interface SheetProps {
  substrate?: Substrate;
  frame: Frame;
  /** 额外类名，通常是版式自身的 lp-theme09-xxx */
  className?: string;
  /** 整页强调（专色浓度提升） */
  accent?: boolean;
  /** 是否绘制四角裁切线 */
  cropMarks?: boolean;
  /** 是否铺纸纤维 / 墨面噪点 */
  grain?: boolean;
  children: ReactNode;
}

export function Sheet(props: SheetProps): ReactElement {
  const {
    substrate = 'paper',
    frame,
    className = '',
    accent,
    cropMarks,
    grain = true,
    children,
  } = props;

  const cls = [
    'lp-slide',
    'lp-theme09',
    substrate === 'ink' ? 'lp-theme09-sub-ink' : 'lp-theme09-sub-paper',
    `lp-theme09-frame-${frame}`,
    accent ? 'lp-theme09-accented' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} data-t9-frame={frame} data-t9-substrate={substrate}>
      {grain && <div className="lp-theme09-grain" aria-hidden="true" />}
      {cropMarks && (
        <div className="lp-theme09-cropmarks" aria-hidden="true">
          <i /><i /><i /><i />
        </div>
      )}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Masthead —— 刊头（页眉）
 * 结构：专色短杠 ▍ + 栏目名 + 英文副名，右侧可挂期号
 * ═══════════════════════════════════════════════════════════════ */

export interface MastheadProps {
  /** 栏目名（中文） */
  section?: string;
  /** 英文副名 */
  sectionEn?: string;
  /** 右上角标记（期号 / 日期 / 分类） */
  mark?: string;
  slideIdx?: number;
  editable?: boolean;
  /** props 前缀，默认直接用 section / sectionEn / mark */
  propPrefix?: string;
  /** 变体：rule 底部加规线；bare 无线 */
  variant?: 'rule' | 'bare';
}

export function Masthead(props: MastheadProps): ReactElement | null {
  const {
    section,
    sectionEn,
    mark,
    slideIdx,
    editable,
    propPrefix = '',
    variant = 'rule',
  } = props;
  if (!section && !sectionEn && !mark) return null;
  const p = (k: string) => (propPrefix ? `${propPrefix}.${k}` : k);

  return (
    <header className={`lp-theme09-masthead ${variant === 'bare' ? 'bare' : ''}`}>
      <div className="lp-theme09-masthead-left">
        <span className="lp-theme09-masthead-bar" aria-hidden="true" />
        {section && (
          <EditableField
            prop={p('section')}
            slideIdx={slideIdx}
            editable={editable}
            as="span"
            className="lp-theme09-masthead-name"
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
            className="lp-theme09-masthead-en"
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
          className="lp-theme09-masthead-mark"
        >
          {mark}
        </EditableField>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Folio —— 骑缝（页脚三段式）
 * 结构：栏目名 ── 页码（专色方块）── 期号
 * ═══════════════════════════════════════════════════════════════ */

export interface FolioProps {
  /** 左：栏目 / 出处 */
  left?: string;
  /** 中：页码（专色底衬） */
  page?: string;
  /** 右：期号 / 日期 */
  right?: string;
  slideIdx?: number;
  editable?: boolean;
  propPrefix?: string;
  /** 反白（压在深色影像上时） */
  inverse?: boolean;
}

export function Folio(props: FolioProps): ReactElement | null {
  const { left, page, right, slideIdx, editable, propPrefix = '', inverse } = props;
  if (!left && !page && !right) return null;
  const p = (k: string) => (propPrefix ? `${propPrefix}.${k}` : k);

  return (
    <footer className={`lp-theme09-folio ${inverse ? 'inverse' : ''}`}>
      <span className="lp-theme09-folio-left">
        {left && (
          <EditableField prop={p('folioLeft')} slideIdx={slideIdx} editable={editable} as="span">
            {left}
          </EditableField>
        )}
      </span>
      <span className="lp-theme09-folio-rule" aria-hidden="true" />
      {page && (
        <span className="lp-theme09-folio-page">
          <EditableField prop={p('folioPage')} slideIdx={slideIdx} editable={editable} as="span">
            {page}
          </EditableField>
        </span>
      )}
      <span className="lp-theme09-folio-rule" aria-hidden="true" />
      <span className="lp-theme09-folio-right">
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
 * Standfirst —— 导语块（首字下沉 + 衬线体）
 * ═══════════════════════════════════════════════════════════════ */

export interface StandfirstProps {
  text: string;
  slideIdx?: number;
  editable?: boolean;
  prop?: string;
  /** 首字下沉 */
  dropCap?: boolean;
  /** 分栏数（杂志导语常用 2 栏） */
  columns?: 1 | 2 | 3;
  className?: string;
}

export function Standfirst(props: StandfirstProps): ReactElement | null {
  const {
    text,
    slideIdx,
    editable,
    prop = 'standfirst',
    dropCap = true,
    columns = 1,
    className = '',
  } = props;
  if (!text) return null;

  const cls = [
    'lp-theme09-standfirst',
    dropCap ? 'dropcap' : '',
    columns > 1 ? `cols-${columns}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <EditableField prop={prop} slideIdx={slideIdx} editable={editable} as="p" className={cls}>
      {text}
    </EditableField>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * ColorBar —— 印刷色标条
 * ═══════════════════════════════════════════════════════════════ */

export interface ColorBarProps {
  /** 色块数量，默认 6（对应六个专色序列） */
  count?: number;
  /** 排列方向 */
  direction?: 'row' | 'column';
  /** 是否标注色号（C/M/Y/K 风格编号） */
  labeled?: boolean;
  className?: string;
}

const SPOT_VARS = [
  'var(--lp-series-1)',
  'var(--lp-series-2)',
  'var(--lp-series-3)',
  'var(--lp-series-4)',
  'var(--lp-series-5)',
  'var(--lp-series-6)',
];

export function ColorBar(props: ColorBarProps): ReactElement {
  const { count = 6, direction = 'row', labeled, className = '' } = props;
  const n = Math.max(2, Math.min(12, count));

  return (
    <div
      className={`lp-theme09-colorbar ${direction === 'column' ? 'vertical' : ''} ${className}`.trim()}
      aria-hidden="true"
    >
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          className="lp-theme09-colorbar-chip"
          style={{ background: SPOT_VARS[i % SPOT_VARS.length] }}
        >
          {labeled && <i className="lp-theme09-colorbar-code">{String(i + 1).padStart(2, '0')}</i>}
        </span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * InkPhoto —— 影像位（theme09 的差异化核心）
 *
 * 与 theme07/08 的「死占位符」不同：InkPhoto 渲染出的元素**始终**带
 * data-lp-editable-image，点击即可上传。支持数组下标 prop（images.0），
 * 因为 editor-script 的 setProp 已支持点号路径自动建数组。
 *
 * 空态不是灰块，而是印刷占位符：网点底 + 中央十字定位线 + 尺寸标注。
 * ═══════════════════════════════════════════════════════════════ */

export type PhotoRatio = '1:1' | '3:2' | '4:3' | '16:9' | '2:3' | '3:4' | 'fill';

export interface InkPhotoProps {
  /** props 路径，多图版式用 images.0 / images.1 … */
  prop: string;
  src?: string;
  slideIdx?: number;
  editable?: boolean;
  ratio?: PhotoRatio;
  /** 图片填充方式 */
  fit?: 'cover' | 'contain';
  /** 空态提示文字 */
  hint?: string;
  /** 空态是否显示尺寸标注 */
  showSpec?: boolean;
  /** 装饰：胶带贴角 */
  tape?: boolean;
  /** 装饰：胶片齿孔边 */
  sprockets?: boolean;
  /** 形状：圆窗 */
  aperture?: boolean;
  /** 压暗蒙版（用于图上压字） */
  scrim?: 'none' | 'bottom' | 'full';
  /** 网点半调处理（人物头像常用） */
  halftone?: boolean;
  className?: string;
  style?: CSSProperties;
  /** 叠在图上的内容（图说 / 编号 / 标题） */
  children?: ReactNode;
}

export function InkPhoto(props: InkPhotoProps): ReactElement {
  const {
    prop,
    src,
    slideIdx,
    editable,
    ratio = '3:2',
    fit = 'cover',
    hint = '点击上传影像',
    showSpec = true,
    tape,
    sprockets,
    aperture,
    scrim = 'none',
    halftone,
    className = '',
    style,
    children,
  } = props;

  const cls = [
    'lp-theme09-photo',
    `fit-${fit}`,
    aperture ? 'aperture' : '',
    sprockets ? 'sprockets' : '',
    halftone ? 'halftone' : '',
    scrim !== 'none' ? `scrim-${scrim}` : '',
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
      data-t9-photo="true"
      data-t9-ratio={ratio}
      data-lp-image-ratio={ratio}
    >
      <LpEditableImage
        prop={prop}
        src={src}
        slideIdx={slideIdx}
        editable={editable}
        className="lp-theme09-photo-img"
        placeholderClassName="lp-theme09-photo-slot"
        showIcon={false}
        placeholderChildren={
          <>
            <span className="lp-theme09-photo-reg" aria-hidden="true" />
            <span className="lp-theme09-photo-hint">{hint}</span>
            {showSpec && (
              <span className="lp-theme09-photo-spec" aria-hidden="true">
                {ratio === 'fill' ? 'FULL BLEED' : ratio}
              </span>
            )}
          </>
        }
      />
      {tape && <span className="lp-theme09-tape" aria-hidden="true" />}
      {children && <figcaption className="lp-theme09-photo-overlay">{children}</figcaption>}
    </figure>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * 辅助：双语标题（headCn + headEn，杂志编辑语法）
 * ═══════════════════════════════════════════════════════════════ */

export interface HeadlineProps {
  cn: string;
  en?: string;
  slideIdx?: number;
  editable?: boolean;
  propCn?: string;
  propEn?: string;
  /** 尺寸档 */
  size?: 'display' | 'large' | 'medium';
  /** 竖排（篇章页常用） */
  vertical?: boolean;
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
    vertical,
    className = '',
  } = props;

  return (
    <div
      className={`lp-theme09-headline size-${size} ${vertical ? 'vertical' : ''} ${className}`.trim()}
    >
      {en && (
        <EditableField
          prop={propEn}
          slideIdx={slideIdx}
          editable={editable}
          as="span"
          className="lp-theme09-headline-en"
        >
          {en}
        </EditableField>
      )}
      <EditableField
        prop={propCn}
        slideIdx={slideIdx}
        editable={editable}
        as="h1"
        className="lp-theme09-headline-cn"
      >
        {cn}
      </EditableField>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * 辅助：规线（杂志分栏线）
 * ═══════════════════════════════════════════════════════════════ */

export function Rule(props: { strong?: boolean; className?: string }): ReactElement {
  return (
    <span
      className={`lp-theme09-rule ${props.strong ? 'strong' : ''} ${props.className ?? ''}`.trim()}
      aria-hidden="true"
    />
  );
}

/** 装订线（跨页版式的中缝） */
export function Gutter(props: { className?: string }): ReactElement {
  return (
    <span className={`lp-theme09-gutter ${props.className ?? ''}`.trim()} aria-hidden="true" />
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
