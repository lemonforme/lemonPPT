// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ReactNode } from 'react';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme06SlideBgProps {
  imageUrl?: string;
  slideIdx?: number;
  editable?: boolean;
}

/**
 * theme06 通用背景图占位层。
 * 仅在有图片时渲染，避免默认占位区污染内容页。
 */
export function Theme06SlideBg(props: Theme06SlideBgProps): ReactNode {
  const { imageUrl, slideIdx, editable } = props;
  if (!imageUrl) return null;

  return (
    <div className="lp-theme06-slide-bg">
      <LpEditableImage
        prop="imageUrl"
        src={imageUrl}
        slideIdx={slideIdx}
        editable={editable}
        className="lp-theme06-slide-bg-img"
        placeholderClassName="lp-theme06-slide-bg-img"
      />
      <div className="lp-theme06-slide-bg-overlay" aria-hidden="true" />
    </div>
  );
}
