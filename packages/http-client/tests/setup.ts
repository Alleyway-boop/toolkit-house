// Test setup file
import { vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Mock FormData
global.FormData = vi.fn().mockImplementation(() => {
  const data: Record<string, any> = {};
  return {
    append: vi.fn((key: string, value: any) => {
      data[key] = value;
    }),
    data
  };
});

// Mock URLSearchParams
global.URLSearchParams = vi.fn().mockImplementation((init?: any) => {
  const params: Record<string, string> = {};
  if (init) {
    if (typeof init === 'string') {
      // Parse query string
      init.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) {
          params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
      });
    } else if (typeof init === 'object') {
      Object.assign(params, init);
    }
  }

  return {
    toString: () => {
      return Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    }
  };
});

// Mock Headers
global.Headers = vi.fn().mockImplementation((init?: any) => {
  const headers: Record<string, string> = {};

  if (init) {
    if (typeof init === 'object' && !(init instanceof Array)) {
      Object.entries(init).forEach(([key, value]) => {
        headers[key.toLowerCase()] = String(value);
      });
    }
  }

  return {
    get: (name: string) => headers[name.toLowerCase()],
    set: (name: string, value: string) => {
      headers[name.toLowerCase()] = String(value);
    },
    has: (name: string) => name.toLowerCase() in headers,
    delete: (name: string) => {
      delete headers[name.toLowerCase()];
    },
    forEach: (callback: (value: string, name: string) => void) => {
      Object.entries(headers).forEach(([name, value]) => {
        callback(value, name);
      });
    }
  };
});

// Mock AbortController
global.AbortController = vi.fn().mockImplementation(() => {
  const signal = {
    aborted: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  };

  return {
    signal,
    abort: vi.fn().mockImplementation(() => {
      signal.aborted = true;
    })
  };
});

// Mock Blob
global.Blob = vi.fn().mockImplementation((parts, options) => ({
  parts,
  type: options?.type || '',
  size: parts ? parts.join('').length : 0,
  arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
  text: vi.fn().mockResolvedValue(''),
  stream: vi.fn()
}));

// Mock ArrayBuffer
global.ArrayBuffer = vi.fn().mockImplementation((byteLength) => ({
  byteLength,
  slice: vi.fn()
}));

// Mock ReadableStream
global.ReadableStream = vi.fn().mockImplementation(() => ({
  getReader: vi.fn(),
  pipeThrough: vi.fn(),
  pipeTo: vi.fn(),
  tee: vi.fn()
}));

// Mock btoa and atob
global.btoa = vi.fn().mockImplementation((str) => {
  return Buffer.from(str, 'binary').toString('base64');
});

global.atob = vi.fn().mockImplementation((str) => {
  return Buffer.from(str, 'base64').toString('binary');
});

// Mock performance.now if not available
if (typeof performance === 'undefined') {
  global.performance = {
    now: vi.fn().mockReturnValue(Date.now())
  } as any;
}