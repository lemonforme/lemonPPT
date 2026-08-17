// lemonPPT - theme08 图标芯片与区块头（原创实现）

import type { ReactElement } from 'react';

export interface Theme08IconChipProps {
  name: string;
  size?: number;
  className?: string;
}

const ICON_PATHS: Record<string, string> = {
  globe: 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  spark: 'M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z',
  target: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 7a5 5 0 100 10 5 5 0 000-10zM12 11a1 1 0 100 2 1 1 0 000-2z',
  chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  flame: 'M12 2c2 4 6 6 6 12a6 6 0 01-12 0c0-3 2-5 3-7 2 2 3 3 3 5z',
};

export function Theme08IconChip({ name, size = 44, className = '' }: Theme08IconChipProps): ReactElement {
  const d = ICON_PATHS[name] ?? ICON_PATHS.bolt;
  return (
    <span
      className={`lp-theme08-icon-chip ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 12,
        background: 'color-mix(in srgb, var(--lp-accent) 16%, transparent)',
        border: '1px solid color-mix(in srgb, var(--lp-accent) 50%, transparent)',
        color: 'var(--lp-accent)',
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </svg>
    </span>
  );
}

export interface Theme08SectionHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  iconName?: string;
  slideIdx?: number;
  editable?: boolean;
}

export function Theme08SectionHeader(props: Theme08SectionHeaderProps): ReactElement {
  const { kicker, title, subtitle, iconName = 'bolt' } = props;
  return (
    <div className="lp-theme08-section-header lp-rise">
      <Theme08IconChip name={iconName} size={40} />
      {kicker && <div className="lp-theme08-kicker">{kicker}</div>}
      <h2 className="lp-theme08-title">{title}</h2>
      {subtitle && <p className="lp-theme08-subtitle">{subtitle}</p>}
    </div>
  );
}
