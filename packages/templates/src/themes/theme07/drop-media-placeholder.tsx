// lemonPPT - theme07 DROP MEDIA 图片占位组件
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ReactNode } from 'react';

export interface Theme07DropMediaProps {
  /** 占位区域标签（显示在左上角 pill 中） */
  tag?: string;
  /** 底部实体名称标签 */
  label?: string;
  /** 自定义宽高比，默认 4/3 */
  aspectRatio?: number;
  /**
   * 图片比例控件（对齐大师 imageRatio）。
   * portrait=3/4，landscape=4/3，square=1，auto=由容器决定。
   * 优先于 aspectRatio 数值。
   */
  imageRatio?: 'portrait' | 'landscape' | 'square' | 'auto';
  /** 额外 CSS 类名 */
  className?: string;
  /** 是否使用更紧凑的变体（用于卡片内） */
  compact?: boolean;
}

const IMAGE_RATIO_MAP: Record<string, number> = {
  portrait: 3 / 4,
  landscape: 4 / 3,
  square: 1,
};

/**
 * theme07 "DROP MEDIA" 图片占位组件。
 *
 * 匹配大师 PPT 参考设计的签名视觉：
 * - 鼠尾草绿斜纹背景
 * - 左上角标签 pill
 * - 居中 "DROP MEDIA" 文字
 * - 底部实体名称
 *
 * 用于 company / case / sector / closing 等需要图片模块的版式。
 */
export function Theme07DropMedia(props: Theme07DropMediaProps): ReactNode {
  const { tag, label, aspectRatio = 4 / 3, imageRatio, className = '', compact = false } = props;

  const resolvedRatio = imageRatio ? IMAGE_RATIO_MAP[imageRatio] : aspectRatio;
  const ratioStyle = imageRatio === 'auto' || resolvedRatio == null
    ? undefined
    : { aspectRatio: String(resolvedRatio) };
  const ratioClass = imageRatio ? `lp-theme07-drop-media--${imageRatio}` : '';

  return (
    <div
      className={`lp-theme07-drop-media ${compact ? 'compact' : ''} ${ratioClass} ${className}`}
      style={ratioStyle}
    >
      {tag && <div className="lp-theme07-drop-media-tag">{tag}</div>}
      <div className="lp-theme07-drop-media-body">
        <span className="lp-theme07-drop-media-text">DROP MEDIA</span>
      </div>
      {label && <div className="lp-theme07-drop-media-label">{label}</div>}
    </div>
  );
}
