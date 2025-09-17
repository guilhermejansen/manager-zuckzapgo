// React 19 type shims
declare global {
  namespace React {
    interface CSSProperties {
      [key: `--${string}`]: string | number;
    }
  }
}

export {};