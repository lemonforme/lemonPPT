// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ReactNode } from 'react';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme07SlideBgProps {
  imageUrl?: string;
  slideIdx?: number;
  editable?: boolean;
}

/**
 * theme07 通用背景图占位层。
 * 仅在有图片时渲染，避免默认占位区污染内容页。
 * 冷白调研风默认使用低不透明度的浅色遮罩，确保文字可读性。
 */
export function Theme07SlideBg(props: Theme07SlideBgProps): ReactNode {
  const { imageUrl, slideIdx, editable } = props;
  if (!imageUrl) return null;

  return (
    <div className="lp-theme07-slide-bg">
      <LpEditableImage
        prop="imageUrl"
        src={imageUrl}
        slideIdx={slideIdx}
        editable={editable}
        className="lp-theme07-slide-bg-img"
        placeholderClassName="lp-theme07-slide-bg-img"
      />
      <div className="lp-theme07-slide-bg-overlay" aria-hidden="true" />
    </div>
  );
}
