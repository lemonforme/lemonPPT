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
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'li' | 'blockquote' | 'ol' | 'cite' | 'em' | 'strong';
  /** 字段类型，影响保存时的值转换 */
  fieldType?: 'text' | 'number';
  /** CSS 类名 */
  className?: string;
  /** 标记为图表数据字段，修改后需要刷新图表 */
  chartData?: boolean;
  children: ReactNode;
}

export function EditableField(props: EditableFieldProps): ReactElement {
  const { slideIdx, editable, prop, as: Tag = 'span', fieldType, className, chartData, children } = props;
  const attrs: Record<string, string | undefined> = {};

  if (editable && slideIdx !== undefined) {
    attrs['data-lp-editable'] = 'true';
    attrs['contentEditable'] = 'true';
    attrs['data-lp-slide-idx'] = String(slideIdx);
    attrs['data-lp-prop'] = prop;
    if (fieldType) {
      attrs['data-lp-editable-type'] = fieldType;
    }
    if (chartData) {
      attrs['data-lp-chart-data'] = 'true';
    }
  }

  return (
    <Tag className={className} {...attrs} suppressContentEditableWarning>
      {children}
    </Tag>
  );
}
