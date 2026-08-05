// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ReactElement, ReactNode } from 'react';

export interface LpEditableImageProps {
  /** 当前 slide 索引 */
  slideIdx?: number;
  /** 是否开启编辑 */
  editable?: boolean;
  /** props 字段路径，如 imageUrl 或 members.0.imageUrl */
  prop: string;
  /** 图片地址 */
  src?: string;
  /** 图片 alt */
  alt?: string;
  /** 图片 img 元素的 CSS 类名 */
  className?: string;
  /** 占位容器的额外 CSS 类名 */
  placeholderClassName?: string;
  /** 占位提示文字 */
  placeholderText?: string;
  /** 是否显示默认 + 图标 */
  showIcon?: boolean;
  /** 自定义占位内容（优先级高于默认图标+文字） */
  placeholderChildren?: ReactNode;
}

/**
 * 可编辑图片组件。
 *
 * 有图片时渲染 <img />，无图片时渲染固定占位区域，始终带 data-lp-editable-image
 * 标记，供 editor-script 实现点击直接上传。
 */
export function LpEditableImage(props: LpEditableImageProps): ReactElement {
  const {
    slideIdx,
    editable,
    prop,
    src,
    alt = '',
    className = '',
    placeholderClassName = '',
    placeholderText = '点击上传图片',
    showIcon = true,
    placeholderChildren,
  } = props;

  const attrs: Record<string, string | undefined> = {};
  if (editable && slideIdx !== undefined) {
    attrs['data-lp-editable-image'] = 'true';
    attrs['data-lp-slide-idx'] = String(slideIdx);
    attrs['data-lp-prop'] = prop;
  }

  if (src) {
    return <img className={className} src={src} alt={alt} {...attrs} />;
  }

  return (
    <div
      className={`lp-editable-image-placeholder ${placeholderClassName}`.trim()}
      {...attrs}
      role="button"
      tabIndex={editable ? 0 : -1}
    >
      {placeholderChildren ?? (
        <>
          {showIcon && <span className="lp-editable-image-placeholder-icon">+</span>}
          <span className="lp-editable-image-placeholder-text">{placeholderText}</span>
        </>
      )}
    </div>
  );
}
