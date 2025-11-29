import { describe, it, expect } from 'vitest';
import {
  deepMerge,
  buildURL,
  paramsSerializer,
  mergeHeaders,
  normalizeHeaders,
  createHttpError,
  isStatusSuccess,
  generateRequestId,
  delay,
  getRetryDelay,
  shouldRetry,
  formatFileSize,
  isBrowser,
  isNode,
  getDefaultUserAgent
} from '../src/utils/helpers';
import type { HttpRequestConfig } from '../src/types';

describe('Utils', () => {
  describe('deepMerge', () => {
    it('should merge objects recursively', () => {
      const target = { a: 1, b: { c: 2, d: 3 } };
      const source = { b: { c: 4 }, e: 5 };

      const result = deepMerge(target, source);

      expect(result).toEqual({
        a: 1,
        b: { c: 4, d: 3 },
        e: 5
      });
    });

    it('should handle multiple sources', () => {
      const target = { a: 1 };
      const source1 = { b: 2 };
      const source2 = { c: 3 };

      const result = deepMerge(target, source1, source2);

      expect(result).toEqual({
        a: 1,
        b: 2,
        c: 3
      });
    });

    it('should not modify original objects', () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 } };

      const result = deepMerge(target, source);

      expect(target).toEqual({ a: 1, b: { c: 2 } });
      expect(result).not.toBe(target);
    });
  });

  describe('buildURL', () => {
    it('should build URL with query parameters', () => {
      const url = buildURL('https://api.example.com/users', undefined, {
        page: 1,
        limit: 10,
        search: 'test'
      });

      expect(url).toBe('https://api.example.com/users?page=1&limit=10&search=test');
    });

    it('should handle absolute URL', () => {
      const url = buildURL('https://api.example.com/users', 'https://other.api.com/data', {
        id: 123
      });

      expect(url).toBe('https://other.api.com/data?id=123');
    });

    it('should handle relative URL with base', () => {
      const url = buildURL('https://api.example.com/v1/', '/users', {
        active: true
      });

      expect(url).toBe('https://api.example.com/v1/users?active=true');
    });

    it('should handle empty parameters', () => {
      const url = buildURL('https://api.example.com/users', undefined, {
        page: 1,
        search: null,
        filter: undefined,
        sort: ''
      });

      expect(url).toBe('https://api.example.com/users?page=1');
    });

    it('should handle array parameters', () => {
      const url = buildURL('https://api.example.com/users', undefined, {
        tags: ['javascript', 'nodejs', 'typescript']
      });

      expect(url).toBe('https://api.example.com/users?tags=javascript&tags=nodejs&tags=typescript');
    });

    it('should use custom params serializer', () => {
      const customSerializer = (params: Record<string, any>) => {
        return Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
      };

      const url = buildURL('https://api.example.com/users', undefined, {
        q: 'search term'
      }, customSerializer);

      expect(url).toBe('https://api.example.com/users?q=search term');
    });
  });

  describe('paramsSerializer', () => {
    it('should serialize simple parameters', () => {
      const serialized = paramsSerializer({
        page: 1,
        limit: 10,
        search: 'test'
      });

      expect(serialized).toBe('page=1&limit=10&search=test');
    });

    it('should handle special characters', () => {
      const serialized = paramsSerializer({
        query: 'hello world',
        special: 'a+b=c&d=e'
      });

      expect(serialized).toBe('query=hello+world&special=a%2Bb%3Dc%26d%3De');
    });

    it('should handle arrays', () => {
      const serialized = paramsSerializer({
        tags: ['tag1', 'tag2', 'tag3']
      });

      expect(serialized).toBe('tags=tag1&tags=tag2&tags=tag3');
    });

    it('should handle nested objects', () => {
      const serialized = paramsSerializer({
        filter: {
          status: 'active',
          role: 'admin'
        }
      });

      expect(serialized).toBe('filter=%5Bobject+Object%5D');
    });
  });

  describe('mergeHeaders', () => {
    it('should merge headers with case-insensitive keys', () => {
      const defaultHeaders = { 'Content-Type': 'application/json' };
      const customHeaders = { 'Authorization': 'Bearer token', 'content-type': 'text/plain' };

      const merged = mergeHeaders(defaultHeaders, customHeaders);

      expect(merged).toEqual({
        'content-type': 'text/plain',
        'authorization': 'Bearer token'
      });
    });

    it('should handle undefined custom headers', () => {
      const defaultHeaders = { 'Content-Type': 'application/json' };
      const merged = mergeHeaders(defaultHeaders);

      expect(merged).toEqual(defaultHeaders);
    });
  });

  describe('normalizeHeaders', () => {
    it('should convert header keys to lowercase', () => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token',
        'X-Custom-Header': 'value'
      };

      const normalized = normalizeHeaders(headers);

      expect(normalized).toEqual({
        'content-type': 'application/json',
        'authorization': 'Bearer token',
        'x-custom-header': 'value'
      });
    });

    it('should filter out null and undefined values', () => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': null,
        'X-Custom': undefined,
        'X-Valid': 'value'
      };

      const normalized = normalizeHeaders(headers);

      expect(normalized).toEqual({
        'content-type': 'application/json',
        'x-valid': 'value'
      });
    });
  });

  describe('createHttpError', () => {
    const mockConfig: HttpRequestConfig = {
      url: '/api/test',
      method: 'GET'
    };

    it('should create HttpError with basic properties', () => {
      const error = createHttpError('Test error', mockConfig);

      expect(error.message).toBe('Test error');
      expect(error.config).toBe(mockConfig);
      expect(error.isAxiosError).toBe(true);
    });

    it('should create HttpError with all properties', () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        data: null,
        headers: {},
        config: mockConfig
      };

      const error = createHttpError('Server error', mockConfig, 'ERR_CODE', 'request', mockResponse);

      expect(error.code).toBe('ERR_CODE');
      expect(error.request).toBe('request');
      expect(error.response).toBe(mockResponse);
      expect(error.status).toBe(500);
      expect(error.statusText).toBe('Internal Server Error');
    });
  });

  describe('isStatusSuccess', () => {
    it('should return true for success status codes', () => {
      expect(isStatusSuccess(200)).toBe(true);
      expect(isStatusSuccess(201)).toBe(true);
      expect(isStatusSuccess(204)).toBe(true);
      expect(isStatusSuccess(299)).toBe(true);
    });

    it('should return false for error status codes', () => {
      expect(isStatusSuccess(199)).toBe(false);
      expect(isStatusSuccess(400)).toBe(false);
      expect(isStatusSuccess(500)).toBe(false);
    });

    it('should use custom validateStatus function', () => {
      const customValidator = (status: number) => status >= 200 && status < 400;
      expect(isStatusSuccess(399, customValidator)).toBe(true);
      expect(isStatusSuccess(400, customValidator)).toBe(false);
    });
  });

  describe('generateRequestId', () => {
    it('should generate unique request IDs', () => {
      const id1 = generateRequestId();
      const id2 = generateRequestId();

      expect(id1).toMatch(/^req_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^req_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('delay', () => {
    it('should delay execution', async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();

      expect(end - start).toBeGreaterThanOrEqual(90); // Allow some tolerance
    });
  });

  describe('getRetryDelay', () => {
    it('should calculate exponential backoff with jitter', () => {
      const delay1 = getRetryDelay(0, 1000);
      const delay2 = getRetryDelay(1, 1000);
      const delay3 = getRetryDelay(2, 1000);

      expect(delay1).toBeGreaterThanOrEqual(1000);
      expect(delay1).toBeLessThan(1500); // 1000 + jitter

      expect(delay2).toBeGreaterThanOrEqual(1500); // 1000 * 2^1
      expect(delay2).toBeLessThan(2500); // 2000 + jitter

      expect(delay3).toBeGreaterThanOrEqual(2500); // 1000 * 2^2
      expect(delay3).toBeLessThan(3500); // 4000 + jitter

      expect(delay1).toBeLessThan(30000); // Max delay
      expect(delay2).toBeLessThan(30000);
      expect(delay3).toBeLessThan(30000);
    });
  });

  describe('shouldRetry', () => {
    const mockConfig: HttpRequestConfig = {
      url: '/api/test',
      method: 'GET'
    };

    it('should retry network errors', () => {
      const networkError = {
        config: mockConfig,
        code: 'ENOTFOUND'
      };

      expect(shouldRetry(networkError, 0, 3)).toBe(true);
    });

    it('should retry 5xx errors', () => {
      const serverError = {
        config: mockConfig,
        response: { status: 500 }
      };

      expect(shouldRetry(serverError, 0, 3)).toBe(true);
    });

    it('should retry specific 4xx errors', () => {
      const timeoutError = {
        config: mockConfig,
        response: { status: 408 }
      };

      const rateLimitError = {
        config: mockConfig,
        response: { status: 429 }
      };

      expect(shouldRetry(timeoutError, 0, 3)).toBe(true);
      expect(shouldRetry(rateLimitError, 0, 3)).toBe(true);
    });

    it('should not retry other 4xx errors', () => {
      const badRequestError = {
        config: mockConfig,
        response: { status: 400 }
      };

      const forbiddenError = {
        config: mockConfig,
        response: { status: 403 }
      };

      expect(shouldRetry(badRequestError, 0, 3)).toBe(false);
      expect(shouldRetry(forbiddenError, 0, 3)).toBe(false);
    });

    it('should not retry when max attempts reached', () => {
      const networkError = {
        config: mockConfig,
        code: 'ENOTFOUND'
      };

      expect(shouldRetry(networkError, 3, 3)).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
      expect(formatFileSize(1099511627776)).toBe('1 TB');
    });

    it('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(2621440)).toBe('2.5 MB');
    });

    it('should format large numbers', () => {
      expect(formatFileSize(1234567890)).toBe('1.15 GB');
    });
  });

  describe('Environment Detection', () => {
    it('should detect browser environment', () => {
      // These tests depend on the test environment
      expect(typeof isBrowser).toBe('boolean');
    });

    it('should detect Node.js environment', () => {
      expect(typeof isNode).toBe('boolean');
    });
  });

  describe('getDefaultUserAgent', () => {
    it('should return a user agent string', () => {
      const userAgent = getDefaultUserAgent();
      expect(typeof userAgent).toBe('string');
      expect(userAgent.length).toBeGreaterThan(0);
    });
  });
});