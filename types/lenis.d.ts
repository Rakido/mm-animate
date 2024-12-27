declare module '@studio-freight/lenis' {
  export interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    direction?: 'vertical' | 'horizontal';
    gestureDirection?: 'vertical' | 'horizontal';
    smooth?: boolean;
    smoothTouch?: boolean;
    touchMultiplier?: number;
    infinite?: boolean;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);
    destroy(): void;
    raf(time: number): void;
    start(): void;
    stop(): void;
  }
} 