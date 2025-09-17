/// <reference types="react" />
/// <reference types="react-dom" />

import 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
    suppressHydrationWarning?: boolean;
  }
}