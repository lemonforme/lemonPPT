// lemonPPT - theme08 幻灯片背景基（背景由 styles.css 控制，组件仅承载装饰层）

import type { ReactNode } from 'react';
import { Theme08DecoNodes } from './decorations.js';

export interface Theme08SlideBgProps {
  appearance?: 'primary' | 'muted';
  decor?: boolean;
  className?: string;
}

export function Theme08SlideBg(props: Theme08SlideBgProps): ReactNode {
  const { decor = true, className = '' } = props;
  return <>{decor ? <Theme08DecoNodes className={className} /> : null}</>;
}
