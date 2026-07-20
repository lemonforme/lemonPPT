// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ReactElement, ReactNode } from 'react';

export interface EditableFieldProps {
  /** 当前 slide 索引 */
  slideIdx?: number;
  /** 是否开启编辑 */
  editable?: boolean;
  /** props 字段路径，如 title 或 points.0 */
  prop: string;
  /** 渲染的标签 */
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'li' | 'blockquote' | 'ol';
  /** CSS 类名 */
  className?: string;
  children: ReactNode;
}

export function EditableField(props: EditableFieldProps): ReactElement {
  const { slideIdx, editable, prop, as: Tag = 'span', className, children } = props;
  const attrs: Record<string, string | undefined> = {};

  if (editable && slideIdx !== undefined) {
    attrs['data-lp-editable'] = 'true';
    attrs['data-lp-slide-idx'] = String(slideIdx);
    attrs['data-lp-prop'] = prop;
  }

  return (
    <Tag className={className} {...attrs}>
      {children}
    </Tag>
  );
}
