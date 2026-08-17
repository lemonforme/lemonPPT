// lemonPPT - theme08 装饰层（手绘箭头 / 火花 / 批注 / 条码）
// 原创实现，不复制 Dashi 装饰资源

import type { ReactElement } from 'react';

export interface Theme08DecoNodesProps {
  className?: string;
}

/** 装饰层：默认在右上区域放置手绘箭头 + 火花 + 批注文案。可由各版式通过 showDecor 控制显隐。 */
export function Theme08DecoNodes({ className = '' }: Theme08DecoNodesProps): ReactElement {
  return (
    <div className={`lp-theme08-deco lp-theme08-deco-nodes ${className}`} aria-hidden="true">
      <svg className="lp-theme08-deco-arrow" width="120" height="80" viewBox="0 0 120 80">
        <path d="M8 64 C 36 12, 78 18, 106 36" />
        <path d="M106 36 L 92 30 M106 36 L 98 50" />
      </svg>
      <svg className="lp-theme08-deco-spark" width="18" height="18" viewBox="0 0 18 18" style={{ position: 'absolute', left: 96, top: 8 }}>
        <path d="M9 0 L11 7 L18 9 L11 11 L9 18 L7 11 L0 9 L7 7 Z" />
      </svg>
      <span className="lp-theme08-deco-note" style={{ position: 'absolute', right: 0, top: 56 }}>EXPERIMENTAL</span>
    </div>
  );
}

export interface Theme08MiniBarsProps {
  count?: number;
}
export function Theme08MiniBars({ count = 22 }: Theme08MiniBarsProps): ReactElement {
  const bars = Array.from({ length: count });
  return (
    <div className="lp-theme08-mini-bars" aria-hidden="true" style={{ position: 'absolute', left: 56, bottom: 40, display: 'flex', alignItems: 'flex-end', gap: 4, height: 36 }}>
      {bars.map((_, i) => (
        <span
          key={i}
          style={{
            width: 4,
            height: `${20 + ((i * 37) % 70)}%`,
            background: 'color-mix(in srgb, var(--lp-accent) 70%, transparent)',
            borderRadius: 2,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}
