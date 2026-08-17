// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Masthead } from './shared.js';

export interface T9ChartHeaderProps {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  slideIdx?: number;
  editable?: boolean;
  /** 标题是否用明朝体大标题（默认是，杂志感更强） */
  serif?: boolean;
}

export function T9ChartHeader(props: T9ChartHeaderProps): ReactNode {
  const { section, sectionEn, mark, kicker, title, subtitle, slideIdx, editable, serif = true } = props;
  return (
    <div className="lp-theme09-chart-head">
      <Masthead
        section={section}
        sectionEn={sectionEn}
        mark={mark}
        slideIdx={slideIdx}
        editable={editable}
        variant="rule"
      />
      {kicker && (
        <div className="lp-theme09-chart-kicker">
          <EditableField prop="kicker" slideIdx={slideIdx} editable={editable} as="span">
            {kicker}
          </EditableField>
        </div>
      )}
      {title && (
        <EditableField
          prop="title"
          slideIdx={slideIdx}
          editable={editable}
          as="h2"
          className={serif ? 'lp-theme09-chart-title lp-t9-serif' : 'lp-theme09-chart-title'}
        >
          {title}
        </EditableField>
      )}
      {subtitle && (
        <EditableField prop="subtitle" slideIdx={slideIdx} editable={editable} as="p" className="lp-theme09-chart-subtitle">
          {subtitle}
        </EditableField>
      )}
    </div>
  );
}

export interface T9ChartShellProps {
  head?: ReactNode;
  body: ReactNode;
  footnoteLeft?: string;
  footnoteRight?: string;
  slideIdx?: number;
  editable?: boolean;
  className?: string;
}

export function T9ChartShell(props: T9ChartShellProps): ReactNode {
  const { head, body, footnoteLeft, footnoteRight, slideIdx, editable, className = '' } = props;
  return (
    <div className={`lp-theme09-chart ${className}`}>
      {head}
      <div className="lp-theme09-chart-body">{body}</div>
      {(footnoteLeft || footnoteRight) && (
        <div className="lp-theme09-chart-foot">
          {footnoteLeft && (
            <EditableField prop="footnoteLeft" slideIdx={slideIdx} editable={editable} as="span" className="lp-theme09-chart-foot-l">
              {footnoteLeft}
            </EditableField>
          )}
          {footnoteRight && (
            <EditableField prop="footnoteRight" slideIdx={slideIdx} editable={editable} as="span" className="lp-theme09-chart-foot-r">
              {footnoteRight}
            </EditableField>
          )}
        </div>
      )}
    </div>
  );
}

/** 把数字轴标签/图例等通用项包进 chart 容器的 className 辅助。 */
export function t9ChartBodyClass(extra = ''): string {
  return `lp-theme09-chart-body-inner ${extra}`.trim();
}
