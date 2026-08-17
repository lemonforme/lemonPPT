// lemonPPT - theme07 共享装饰组件
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { ReactElement, ReactNode } from 'react';

export interface Theme07BarcodeProps {
  count?: number;
}

export function Theme07Barcode({ count = 24 }: Theme07BarcodeProps): ReactElement {
  const bars: ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const h = 30 + Math.round(Math.random() * 70);
    bars.push(<span key={i} style={{ height: `${h}%` }} />);
  }
  return <div className="lp-theme07-barcode" aria-hidden="true">{bars}</div>;
}

export interface Theme07WatermarkNumberProps {
  number: string;
}

export function Theme07WatermarkNumber({ number }: Theme07WatermarkNumberProps): ReactElement {
  return <div className="lp-theme07-watermark-number" aria-hidden="true">{number}</div>;
}

export interface Theme07MiniBarsProps {
  count?: number;
}

export function Theme07MiniBars({ count = 18 }: Theme07MiniBarsProps): ReactElement {
  const bars: ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const h = 25 + Math.round(Math.random() * 75);
    bars.push(<span key={i} style={{ height: `${h}%` }} />);
  }
  return <div className="lp-theme07-mini-bars" aria-hidden="true">{bars}</div>;
}

export interface Theme07ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'accent2' | 'cool';
}

export function Theme07ProgressBar({ value, max = 100, variant = 'default' }: Theme07ProgressBarProps): ReactElement {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="lp-theme07-progress" aria-hidden="true">
      <div className={`lp-theme07-progress-bar ${variant}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
