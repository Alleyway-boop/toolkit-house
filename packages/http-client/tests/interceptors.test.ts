import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createAuthInterceptor,
  createBearerAuthInterceptor,
  createBasicAuthInterceptor,
  createRetryInterceptor,
  createCacheInterceptor,
  createLoggingInterceptor,
  HttpClient
} from '../src/index';

// Mock console methods
const consoleSpy = {
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
  warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
  info: vi.spyOn(console, 'info').mockImplementation(() => {}),
  debug: vi.spyOn(console, 'debug').mockImplementation(() => {})
};

describe('Interceptors', () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient();
    vi.clearAllMocks();
    Object.values(consoleSpy).forEach(spy => spy.mockClear());
  });

  describe('Auth Interceptor', () => {
    it('should add Bearer token to requests', async () => {
      const tokenProvider = () => 'test-token-123';
      const authInterceptor = createBearerAuthInterceptor(tokenProvider);

      httpClient.addRequestInterceptor(authInterceptor.onFulfilled);

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      global.fetch = vi.fn().mockResolvedValueOnce(mockResponse);

      await httpClient.get('/api/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: { 'authorization': 'Bearer test-token-123' },
        signal: undefined,
        body: null
      });
    });

    it('should add Basic auth to requests', async () => {
      const authInterceptor = createBasicAuthInterceptor('user', 'pass');

      httpClient.addRequestInterceptor(authInterceptor.onFulfilled);

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      global.fetch = vi.fn().mockResolvedValueOnce(mockResponse);

      await httpClient.get('/api/test');

      const expectedCredentials = Buffer.from('user:pass').toString('base64');
      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: { 'authorization': `Basic ${expectedCredentials}` },
        signal: undefined,
        body: null
      });
    });

    it('should add API key to requests', async () => {
      const authInterceptor = createApiKeyAuthInterceptor('api-key-123', 'X-API-Key');

      httpClient.addRequestInterceptor(authInterceptor.onFulfilled);

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      global.fetch = vi.fn().mockResolvedValueOnce(mockResponse);

      await httpClient.get('/api/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: { 'x-api-key': 'api-key-123' },
        signal: undefined,
        body: null
      });
    });

    it('should not add auth to excluded URLs', async () => {
      const authInterceptor = createBearerAuthInterceptor(
        () => 'test-token',
        {
          urlPatterns: [/^\/api\//],
          excludeUrlPatterns: [/\/api\/public\//]
        }
      );

      httpClient.addRequestInterceptor(authInterceptor.onFulfilled);

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      // Should add auth
      await httpClient.get('/api/users');
      expect(global.fetch).toHaveBeenCalledWith('/api/users', {
        method: 'GET',
        headers: { 'authorization': 'Bearer test-token' },
        signal: undefined,
        body: null
      });

      // Should not add auth
      await httpClient.get('/api/public/data');
      expect(global.fetch).toHaveBeenCalledWith('/api/public/data', {
        method: 'GET',
        headers: {},
        signal: undefined,
        body: null
      });
    });
  });

  describe('Retry Interceptor', () => {
    it('should retry network errors', async () => {
      const retryInterceptor = createRetryInterceptor({
        maxRetries: 2,
        retryDelay: 10
      });

      httpClient.addResponseInterceptor(retryInterceptor.onRejected);

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'success' })
      };

      global.fetch = vi.fn()
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockResolvedValueOnce(mockResponse);

      const response = await httpClient.get('/api/test');

      expect(response.data).toEqual({ data: 'success' });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should retry on specific status codes', async () => {
      const retryInterceptor = createRetryInterceptor({
        maxRetries: 1,
        retryStatusCodes: [429, 503]
      });

      httpClient.addResponseInterceptor(retryInterceptor.onRejected);

      const errorResponse = {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ error: 'Rate limit exceeded' })
      };

      const successResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'success' })
      };

      global.fetch = vi.fn()
        .mockResolvedValueOnce(errorResponse)
        .mockResolvedValueOnce(successResponse);

      const response = await httpClient.get('/api/test');

      expect(response.data).toEqual({ data: 'success' });
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should not retry non-retryable errors', async () => {
      const retryInterceptor = createRetryInterceptor({
        maxRetries: 2,
        retryDelay: 10
      });

      httpClient.addResponseInterceptor(retryInterceptor.onRejected);

      const errorResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ error: 'Invalid input' })
      };

      global.fetch = vi.fn().mockResolvedValueOnce(errorResponse);

      try {
        await httpClient.get('/api/test');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.status).toBe(400);
        expect(global.fetch).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Cache Interceptor', () => {
    it('should cache GET requests', async () => {
      const cache = new Map();
      const cacheInterceptor = createCacheInterceptor({
        type: 'memory',
        defaultTTL: 1000,
        storage: {
          get: (key: string) => cache.get(key) || null,
          set: (key: string, value: any) => cache.set(key, value),
          remove: (key: string) => cache.delete(key),
          clear: () => cache.clear(),
          keys: () => Array.from(cache.keys())
        }
      });

      httpClient.addRequestInterceptor(cacheInterceptor.onFulfilled);
      httpClient.addResponseInterceptor(cacheInterceptor.onFulfilled);

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test', timestamp: 1 })
      };

      global.fetch = vi.fn().mockResolvedValueOnce(mockResponse);

      // First request
      const response1 = await httpClient.get('/api/test', { cache: true });
      expect(response1.data).toEqual({ data: 'test', timestamp: 1 });
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Verify cache is populated
      expect(cache.size).toBe(1);

      // Second request should use cache
      const response2 = await httpClient.get('/api/test', { cache: true });
      expect(response2.data).toEqual({ data: 'test', timestamp: 1 });
      expect(global.fetch).toHaveBeenCalledTimes(1); // Should not increase
    });

    it('should not cache requests when disabled', async () => {
      const cache = new Map();
      const cacheInterceptor = createCacheInterceptor({
        storage: {
          get: (key: string) => cache.get(key) || null,
          set: (key: string, value: any) => cache.set(key, value),
          remove: (key: string) => cache.delete(key),
          clear: () => cache.clear(),
          keys: () => Array.from(cache.keys())
        }
      });

      httpClient.addRequestInterceptor(cacheInterceptor.onFulfilled);
      httpClient.addResponseInterceptor(cacheInterceptor.onFulfilled);

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      await httpClient.get('/api/test', { cache: false });

      expect(cache.size).toBe(0);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Logging Interceptor', () => {
    it('should log requests and responses', async () => {
      const loggingInterceptor = createLoggingInterceptor({
        level: 'info',
        logHeaders: false,
        logBody: false
      });

      httpClient.addRequestInterceptor(loggingInterceptor.onFulfilled);
      httpClient.addResponseInterceptor(loggingInterceptor.onFulfilled);

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      global.fetch = vi.fn().mockResolvedValueOnce(mockResponse);

      await httpClient.get('/api/test');

      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('🚀 HTTP GET /api/test'),
        expect.any(Object)
      );

      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringContaining('✅ HTTP GET /api/test 200'),
        expect.any(Object)
      );
    });

    it('should log errors', async () => {
      const loggingInterceptor = createLoggingInterceptor({
        level: 'error'
      });

      httpClient.addRequestInterceptor(loggingInterceptor.onFulfilled);
      httpClient.addResponseInterceptor(loggingInterceptor.onRejected);

      const errorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ error: 'Server error' })
      };

      global.fetch = vi.fn().mockResolvedValueOnce(errorResponse);

      try {
        await httpClient.get('/api/test');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(consoleSpy.error).toHaveBeenCalledWith(
          expect.stringContaining('❌ HTTP GET /api/test 500'),
          expect.any(Object)
        );
      }
    });

    it('should respect URL patterns', async () => {
      const loggingInterceptor = createLoggingInterceptor({
        urlPatterns: [/^\/api\//],
        excludeUrlPatterns: [/\/api\/health/]
      });

      httpClient.addRequestInterceptor(loggingInterceptor.onFulfilled);

      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: vi.fn().mockResolvedValue({ data: 'test' })
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      // Should log
      await httpClient.get('/api/users');
      expect(consoleSpy.info).toHaveBeenCalledTimes(1);

      // Should not log
      await httpClient.get('/api/health');
      expect(consoleSpy.info).toHaveBeenCalledTimes(1); // Should not increase

      // Should not log
      await httpClient.get('/public/data');
      expect(consoleSpy.info).toHaveBeenCalledTimes(1); // Should not increase
    });
  });

  describe('Interceptor Management', () => {
    it('should add and remove request interceptors', () => {
      const interceptor1 = vi.fn((config) => config);
      const interceptor2 = vi.fn((config) => config);

      const id1 = httpClient.addRequestInterceptor(interceptor1);
      const id2 = httpClient.addRequestInterceptor(interceptor2);

      expect(id1).toBe(0);
      expect(id2).toBe(1);

      httpClient.removeRequestInterceptor(id1);

      // The second interceptor should still work
      expect(httpClient.removeRequestInterceptor).not.toThrow();
    });

    it('should add and remove response interceptors', () => {
      const interceptor1 = vi.fn((response) => response);
      const interceptor2 = vi.fn((response) => response);

      const id1 = httpClient.addResponseInterceptor(interceptor1);
      const id2 = httpClient.addResponseInterceptor(interceptor2);

      expect(id1).toBe(0);
      expect(id2).toBe(1);

      httpClient.removeResponseInterceptor(id1);

      // The second interceptor should still work
      expect(httpClient.removeResponseInterceptor).not.toThrow();
    });
  });
});