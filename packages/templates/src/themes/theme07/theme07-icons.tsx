// lemonPPT - theme07 研究风装饰图标库与共享页眉
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export type Theme07IconName =
  | 'search'
  | 'doc'
  | 'chart'
  | 'globe'
  | 'network'
  | 'shield'
  | 'bulb'
  | 'target'
  | 'layers'
  | 'compass'
  | 'quote'
  | 'trend'
  | 'book'
  | 'pie'
  | 'scale'
  | 'flag';

const ICON_PATHS: Record<Theme07IconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V12M9 20V5M14 20v-7M19 20v-13" />
      <path d="M3 20h18" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" />
    </>
  ),
  network: (
    <>
      <circle cx="6" cy="6" r="2.3" />
      <circle cx="18" cy="6" r="2.3" />
      <circle cx="12" cy="18" r="2.3" />
      <path d="M7.6 7.6 11 16M16.4 7.6 13 16M8 6h8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10c-4-2-7-5.5-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  bulb: (
    <>
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
      <path d="M9 20h6M10 23h4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  quote: (
    <>
      <path d="M8 6c-1.6 0-2.6 1.3-2.6 2.8C5.4 10.4 6.4 11 8 11v3l-2-1" />
      <path d="M17 6c-1.6 0-2.6 1.3-2.6 2.8C14.4 10.4 15.4 11 17 11v3l-2-1" />
    </>
  ),
  trend: (
    <>
      <path d="M4 16l5-5 4 4 7-7" />
      <path d="M15 8h5v5" />
    </>
  ),
  book: (
    <>
      <path d="M4 5a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2z" />
      <path d="M20 5a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2z" />
    </>
  ),
  pie: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v9h9" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18M7 21h10" />
      <path d="M5 7h14" />
      <path d="M5 7l-2.2 5a3 3 0 0 0 6.4 0z" />
      <path d="M19 7l-2.2 5a3 3 0 0 0 6.4 0z" />
    </>
  ),
  flag: (
    <>
      <path d="M6 21V4" />
      <path d="M6 4h11l-2 4 2 4H6" />
    </>
  ),
};

export interface Theme07IconProps {
  name: Theme07IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Theme07Icon({ name, size = 22, className = '', strokeWidth = 1.6 }: Theme07IconProps): ReactElement {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

/**
 * 装饰性图标芯片（非可编辑）。用于版式页眉或卡片角标，强化研究/调研语义。
 */
export interface Theme07IconChipProps {
  name: Theme07IconName;
  size?: number;
  className?: string;
}

export function Theme07IconChip({ name, size = 44, className = '' }: Theme07IconChipProps): ReactElement {
  return (
    <div className={`lp-theme07-icon-chip ${className}`} aria-hidden="true">
      <Theme07Icon name={name} size={Math.round(size * 0.5)} />
    </div>
  );
}

/**
 * 装饰性「研究网络」节点母题：三个强调色节点 + 连接线，用于页眉右上角，强化调研/网络语义。
 * 纯装饰，非可编辑。
 */
export function Theme07DecoNodes({ className = '' }: { className?: string }): ReactElement {
  return (
    <div className={`lp-theme07-deco-nodes ${className}`} aria-hidden="true">
      <svg width="60" height="56" viewBox="0 0 60 56" fill="none" strokeLinecap="round">
        <path d="M10 12 40 30M40 30 20 48M10 12 20 48" stroke="var(--lp-accent)" strokeWidth="1.2" opacity="0.35" style={{ stroke: 'var(--lp-accent)' }} />
        <circle cx="10" cy="12" r="5" style={{ fill: 'var(--lp-accent)' }} />
        <circle cx="40" cy="30" r="6.5" style={{ fill: 'var(--lp-accent-2)' }} />
        <circle cx="20" cy="48" r="4.5" style={{ fill: 'var(--lp-accent-cool)' }} />
      </svg>
    </div>
  );
}

export interface Theme07SectionHeaderProps {
  icon?: Theme07IconName;
  kicker?: string;
  kickerProp?: string;
  title?: string;
  titleProp?: string;
  titleClassName?: string;
  subtitle?: string;
  subtitleProp?: string;
  align?: 'left' | 'center';
  className?: string;
  _slideIdx?: number;
  _editable?: boolean;
}

/**
 * theme07 共享页眉：可选研究风图标芯片 + 英文标签(kicker) + 标题 + 副标题。
 * 所有文本字段均通过 EditableField 保持可编辑。
 * 用于统一强化「重点」与版式节奏。
 */
export function Theme07SectionHeader(props: Theme07SectionHeaderProps): ReactElement {
  const {
    icon,
    kicker,
    kickerProp = 'kicker',
    title,
    titleProp = 'title',
    titleClassName = 'lp-theme07-title',
    subtitle,
    subtitleProp = 'subtitle',
    align = 'left',
    className = '',
    _slideIdx,
    _editable,
  } = props;

  return (
    <div className={`lp-theme07-section-header lp-theme07-section-header--${align} ${className}`}>
      {icon && (
        <div className="lp-theme07-section-header-icon" aria-hidden="true">
          <Theme07Icon name={icon} size={22} />
        </div>
      )}
      <div className="lp-theme07-section-header-text">
        {kicker && (
          <div className="lp-theme07-kicker">
            <EditableField prop={kickerProp} slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
          </div>
        )}
        {title && (
          <EditableField prop={titleProp} slideIdx={_slideIdx} editable={_editable} as="h2" className={titleClassName}>{title}</EditableField>
        )}
        {subtitle && (
          <EditableField prop={subtitleProp} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>
        )}
      </div>
    </div>
  );
}
