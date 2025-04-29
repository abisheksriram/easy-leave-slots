
/// <reference types="vite/client" />

interface Window {
  microFrontendMounted?: boolean;
}

// Custom event for navigation
interface CustomEventMap {
  "navigate": CustomEvent<{ path: string }>;
}

declare global {
  interface Window { 
    microFrontendMounted?: boolean;
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, ev: CustomEventMap[K]) => any,
      options?: boolean | EventListenerOptions
    ): void;
  }
}

