import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch can be safely assigned if a polyfill or library attempts to wrap it
if (typeof window !== 'undefined') {
  try {
    let _fetch = window.fetch;
    const descriptor = {
      get() {
        return _fetch;
      },
      set(val: typeof fetch) {
        _fetch = val;
      },
      configurable: true,
      enumerable: true,
    };

    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', descriptor);
      } catch {
        // ignore
      }
    }

    try {
      Object.defineProperty(window, 'fetch', descriptor);
    } catch {
      // ignore
    }
  } catch {
    // Ignore error
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

