import { vi } from 'vitest';

// jsdom and Node provide real Headers, URLSearchParams, AbortController,
// FormData, Blob and ReadableStream. Mocking them globally breaks once
// vi.restoreAllMocks() clears the mock implementations after the first test.
global.fetch = vi.fn();
