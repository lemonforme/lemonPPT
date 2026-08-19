// lemonPPT - theme08 黑金实验风 / 共享版式原型库（原创，不复制 third-party 实现）
// 供 theme08 全部变体版式复用，统一黑金视觉、双外观适配与防溢出排版。

import type { LayoutMeta, PropsSchema, SlideRole } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

/* ============ 基础图元 ============ */

export interface T08BaseProps {
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

/** 区块标题：kicker + 标题（限定宽度防溢出）+ 副标题。 */
export function T08Header(props: {
  kicker?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  _slideIdx?: number;
  _editable?: boolean;
  align?: 'left' | 'center';
}): ReactNode {
  const { kicker, title, subtitle, icon, _slideIdx, _editable, align = 'left' } = props;
  return (
    <header className={`lp-theme08-sec-head ${align === 'center' ? 'center' : ''}`}>
      {icon && (
        <div className="lp-theme08-sec-icon">
          <Theme08IconChip name={icon as never} size={36} />
        </div>
      )}
      {kicker && (
        <div className="lp-theme08-sec-kicker">
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
        </div>
      )}
      {title && (
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-sec-title">{title}</EditableField>
      )}
      {subtitle && (
        <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-sec-sub">{subtitle}</EditableField>
      )}
    </header>
  );
}

/** 页脚：左右角标。 */
export function T08Footer(props: { left?: string; right?: string; _slideIdx?: number; _editable?: boolean }): ReactNode {
  const { left, right, _slideIdx, _editable } = props;
  return (
    <div className="lp-theme08-footer">
      <span className="lp-theme08-footer-left">
        {left && <EditableField prop="footerLeft" slideIdx={_slideIdx} editable={_editable} as="span">{left}</EditableField>}
      </span>
      <span className="lp-theme08-footer-right">
        {right && <EditableField prop="footerRight" slideIdx={_slideIdx} editable={_editable} as="span">{right}</EditableField>}
      </span>
    </div>
  );
}

/** 卡片容器。 */
export function T08Card(props: { children: ReactNode; className?: string; accent?: boolean }): ReactNode {
  const { children, className = '', accent } = props;
  return <div className={`lp-theme08-card ${accent ? 'accent' : ''} ${className}`}>{children}</div>;
}

/** 指标块：大数字 + 单位 + 标签。 */
export function T08Stat(props: {
  value: string;
  unit?: string;
  label?: string;
  accent?: boolean;
  _slideIdx?: number;
  _editable?: boolean;
  base?: string;
}): ReactNode {
  const { value, unit, label, accent, _slideIdx, _editable, base = 'stat' } = props;
  return (
    <div className={`lp-theme08-stat ${accent ? 'accent' : ''}`}>
      <div className="lp-theme08-stat-value">
        <EditableField prop={`${base}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{value}</EditableField>
        {unit && <EditableField prop={`${base}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme08-stat-unit">{unit}</EditableField>}
      </div>
      {label && <div className="lp-theme08-stat-label"><EditableField prop={`${base}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{label}</EditableField></div>}
    </div>
  );
}

/** 标签胶囊。 */
export function T08Tag(props: { children: ReactNode; _slideIdx?: number; _editable?: boolean; base?: string; accent?: boolean }): ReactNode {
  const { children, _slideIdx, _editable, base = 'tags', accent } = props;
  return (
    <span className={`lp-theme08-tag ${accent ? 'accent' : ''}`}>
      <EditableField prop={base} slideIdx={_slideIdx} editable={_editable} as="span">{children}</EditableField>
    </span>
  );
}

/** 网格容器。 */
export function T08Grid(props: { cols: number; children: ReactNode; className?: string }): ReactNode {
  const { cols, children, className = '' } = props;
  return (
    <div className={`lp-theme08-grid ${className}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {children}
    </div>
  );
}

/** 左右两列：左文右视觉，右列约束不溢出。 */
export function T08TwoCol(props: { left: ReactNode; right: ReactNode; ratio?: string; className?: string }): ReactNode {
  const { left, right, ratio = '1.05fr 0.95fr', className = '' } = props;
  return (
    <div className={`lp-theme08-two ${className}`} style={{ gridTemplateColumns: ratio }}>
      <div className="lp-theme08-two-left">{left}</div>
      <div className="lp-theme08-two-right">{right}</div>
    </div>
  );
}

/** 背景 + 装饰层包装。 */
export function T08Frame(props: { children: ReactNode; decor?: boolean; className?: string }): ReactNode {
  const { children, decor = true, className = '' } = props;
  return (
    <div className={`lp-slide lp-theme08 ${className}`}>
      <Theme08SlideBg decor={decor} />
      <div className="lp-theme08-watermark-number">08</div>
      {children}
      <Theme08MiniBars count={18} />
    </div>
  );
}

/* ============ 派生版式辅助：把 schema 数组项拍平成可编辑文本 ============ */

export function T08ItemEditor(props: {
  base: string;
  index: number;
  field: string;
  as?: 'span' | 'p' | 'h3' | 'h4' | 'div';
  className?: string;
  children: ReactNode;
  _slideIdx?: number;
  _editable?: boolean;
}): ReactNode {
  const { base, index, field, as = 'span', className = '', children, _slideIdx, _editable } = props;
  return (
    <EditableField prop={`${base}.${index}.${field}`} slideIdx={_slideIdx} editable={_editable} as={as} className={className}>{children}</EditableField>
  );
}

/* ============ 标准 meta / schema 构建器（减少样板） ============ */

export function buildMeta(opts: {
  id: string;
  role: string;
  displayName: string;
  description: string;
  needsMedia?: boolean;
  contentShape?: string;
  tags?: string[];
}): LayoutMeta {
  return {
    id: opts.id,
    theme: 'theme08',
    role: opts.role as SlideRole,
    displayName: opts.displayName,
    description: opts.description,
    needsMedia: opts.needsMedia ?? false,
    tags: opts.tags ?? ['black-gold', 'experimental'],
    contentShape: opts.contentShape ?? opts.role,
  };
}

/** 通用字段：标题/kicker/副标题/页脚。 */
export function commonFields(overrides?: { kicker?: string; title?: string; subtitle?: string; footerLeft?: string; footerRight?: string }): NonNullable<PropsSchema['fields']> {
  const o = overrides ?? {};
  return [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: o.kicker ?? 'BLACK GOLD' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: o.title ?? '标题' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: o.subtitle ?? '' },
    ...footerFields(o),
  ];
}

/** 仅页脚字段：供自带标题字段的封面/章节/金句版式复用，避免 key 重复。 */
export function footerFields(overrides?: { footerLeft?: string; footerRight?: string }): NonNullable<PropsSchema['fields']> {
  const o = overrides ?? {};
  return [
    { key: 'footerLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: o.footerLeft ?? 'lemonPPT · 2026' },
    { key: 'footerRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: o.footerRight ?? '08' },
  ];
}
